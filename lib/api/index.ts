import { ObjectId } from "mongodb";
import { Session } from "next-auth";

import { auth } from "@/auth";
import { Course, Repository, User } from "@/lib/db/models";
import { clientPromise } from "@/lib/db/mongodb";

import { getUserInfo } from "../helpers";

const db = async () => {
  const client = await clientPromise;

  return client.db(process.env.DB_NAME);
};

const getUser = async (userId: ObjectId) => {
  const database = await db();
  const users = database.collection<User>("users");

  return users.findOne({ _id: userId });
};

const getUserByEmail = async (email: string) => {
  const database = await db();
  // console.log("[getUserByEmail] db", database.databaseName);
  const users = database.collection<User>("users");
  // console.log("[getUserByEmail] users", users);
  const user = users.findOne({ email });

  // console.log("[getUserByEmail] user", await user);

  return user;
};

const getUserRepo = async (courseSlug: string, sessionContext?: Session) => {
  try {
    console.log("[getUserRepo] Starting with courseSlug:", courseSlug);
    console.log("[getUserRepo] sessionContext exists:", !!sessionContext);

    // Get session
    const session = sessionContext ?? (await auth());
    console.log("[getUserRepo] session exists:", !!session);
    console.log(
      "[getUserRepo] session user:",
      session?.user
        ? {
            name: session.user.name,
            email: session.user.email?.substring(0, 3) + "...", // Log partial email for privacy
          }
        : "No user in session",
    );

    // Get user info
    const userInfo = getUserInfo(session);
    console.log("[getUserRepo] userInfo is error:", userInfo instanceof Error);

    if (userInfo instanceof Error) {
      console.error("[getUserRepo] Error getting user info:", userInfo.message);
      return null;
    }

    // Get user from database
    console.log(
      "[getUserRepo] Looking up user by email:",
      userInfo.email.substring(0, 3) + "...",
    );
    const user = await getUserByEmail(userInfo.email);
    console.log("[getUserRepo] user found:", !!user);

    const userId = user?._id ?? null;
    console.log("[getUserRepo] userId exists:", !!userId);

    if (!userId) {
      console.log("[getUserRepo] No userId found, returning null");
      return null;
    }

    // Find repository
    console.log(
      "[getUserRepo] Finding repository for course:",
      courseSlug,
      "and userId:",
      userId,
    );
    const repo = await findUserRepositoryByCourse(courseSlug, userId);
    console.log(
      "[getUserRepo] Repository found:",
      !!repo,
      "test_ok:",
      repo?.test_ok,
    );

    return repo;
  } catch (error) {
    console.error("[getUserRepo] Unexpected error:", error);
    return null;
  }
};

const getProgressData = async (session: Session | null) => {
  if (session && session.user?.email) {
    try {
      const user = await getUserByEmail(session.user.email);
      const data = user?.progress;

      return data;
    } catch (err) {
      console.error(err);
    }
  }

  return null;
};

const getCourseFromDb = async (slug: string) => {
  try {
    console.log(`[getCourseFromDb] Looking for course with slug: ${slug}`);

    // Get database connection
    const database = await db();
    console.log(
      "[getCourseFromDb] Database connection established:",
      database.databaseName,
    );

    // List all collections to debug
    const collections = await database.listCollections().toArray();
    console.log(
      "[getCourseFromDb] Available collections:",
      collections.map((c) => c.name),
    );

    // Check if courses collection exists
    if (!collections.some((c) => c.name === "courses")) {
      console.error(
        "[getCourseFromDb] Courses collection not found in database",
      );
      return null;
    }

    // Get courses collection
    const courses = database.collection<Course>("courses");
    console.log("[getCourseFromDb] Got courses collection");

    // Try to find the course
    console.log("[getCourseFromDb] Executing findOne with slug:", slug);
    const course = await courses.findOne({ slug });
    console.log("[getCourseFromDb] Course found:", course ? "Yes" : "No");

    if (course) {
      console.log("[getCourseFromDb] Course ID:", course._id);
    }

    return course;
  } catch (error) {
    console.error("[getCourseFromDb] Error:", error);
    return null;
  }
};

const getRepositories = async () => {
  const database = await db();
  const repositories = database.collection<Repository>("repositories");

  return repositories;
};

const findUserRepositoryByCourse = async (
  courseSlug: string,
  userId: string | ObjectId,
) => {
  try {
    console.log(
      "[findUserRepositoryByCourse] Starting with courseSlug:",
      courseSlug,
    );

    // Get repositories collection
    const repositories = await getRepositories();
    console.log("[findUserRepositoryByCourse] Got repositories collection");

    // Get course from database
    console.log(
      "[findUserRepositoryByCourse] Looking up course with slug:",
      courseSlug,
    );
    const course = await getCourseFromDb(courseSlug);
    console.log("[findUserRepositoryByCourse] Course found:", !!course);

    const courseId = course?._id ?? null;
    console.log("[findUserRepositoryByCourse] CourseId exists:", !!courseId);

    if (!courseId) {
      console.error(
        "[findUserRepositoryByCourse] Course not found for slug:",
        courseSlug,
      );
      return null;
    }

    // Convert string to ObjectId if needed
    const userIdObj =
      typeof userId === "string" ? new ObjectId(userId) : userId;
    console.log("[findUserRepositoryByCourse] UserIdObj:", userIdObj);

    // Find repository
    console.log(
      "[findUserRepositoryByCourse] Finding repository with courseId:",
      courseId,
      "and userId:",
      userIdObj,
    );
    const query = {
      "relationships.course.id": courseId,
      "relationships.user.id": userIdObj,
    };
    console.log("[findUserRepositoryByCourse] Query:", JSON.stringify(query));

    const repo = await repositories.findOne(query);
    console.log("[findUserRepositoryByCourse] Repository found:", !!repo);

    return repo;
  } catch (error) {
    console.error("[findUserRepositoryByCourse] Unexpected error:", error);
    return null;
  }
};

const repositoryStream = async () => {
  const database = await db();
  const repositories = database.collection<Repository>("repositories");

  return repositories.watch();
};

/**
 * Fetches all test logs for a repository from the backend API
 * @param repoName The name of the repository
 * @returns An array of test logs or null if an error occurs
 */
const getTestLogsForRepo = async (repoName: string) => {
  try {
    const apiUrl = `${process.env.BACKEND_URL || "http://localhost:8080"}/api/v0/test-logs/${repoName}`;
    console.log("[getTestLogsForRepo] Fetching from URL:", apiUrl);

    // Make a request to the backend API
    const response = await fetch(apiUrl);

    console.log(
      "[getTestLogsForRepo] Response status:",
      response.status,
      response.statusText,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch test logs: ${response.statusText}`);
    }

    const testLogs = await response.json();
    console.log(
      "[getTestLogsForRepo] Received logs:",
      Array.isArray(testLogs) ? `${testLogs.length} logs` : "Single log object",
    );

    const result = Array.isArray(testLogs) ? testLogs : [testLogs];

    // Log a sample of the first log if available
    if (result.length > 0) {
      console.log("[getTestLogsForRepo] Sample log structure:", {
        test_slug: result[0].test_slug,
        passed: result[0].passed,
        lesson_slug: result[0].lesson_slug,
        test_name: result[0].test_name,
        repo_name: result[0].repo_name,
      });
    }

    return result;
  } catch (error) {
    console.error("[getTestLogsForRepo] Error:", error);
    return null;
  }
};

export {
  findUserRepositoryByCourse,
  getCourseFromDb,
  getProgressData,
  getRepositories,
  getTestLogsForRepo,
  getUser,
  getUserByEmail,
  getUserRepo,
  repositoryStream,
};
export { fetchGraphQL } from "./contentful";
export { QUERY_COURSE_GRAPHQL_FIELDS } from "./queries";
