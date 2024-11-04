import { ObjectId } from "mongodb";
import { Session } from "next-auth";

import { auth } from "@/auth";
import { Course, Repository, User } from "@/lib/db/models";
import { clientPromise } from "@/lib/db/mongodb";

import { redis } from "../db/redis";
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
  const users = database.collection<User>("users");

  return users.findOne({ email });
};

const getUserRepo = async (courseSlug: string) => {
  const session = await auth();
  const userInfo = getUserInfo(session);

  if (userInfo instanceof Error) {
    console.error(userInfo.message);

    return null;
  }

  const user = await getUserByEmail(userInfo.email);
  const userId = user?._id ?? null;

  if (!userId) {
    return null;
  }

  return findUserRepositoryByCourse(courseSlug, userId);
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
  const database = await db();
  const courses = database.collection<Course>("courses");

  return courses.findOne({ slug });
};

const getRepositories = async () => {
  const database = await db();
  const repositories = database.collection<Repository>("repositories");

  return repositories;
};

const findUserRepositoryByCourse = async (
  courseSlug: string,
  userId: ObjectId,
) => {
  const repositories = await getRepositories();
  const course = await getCourseFromDb(courseSlug);
  const courseId = course?._id ?? null;

  if (!courseId) {
    console.error("Course not found");

    return null;
  }

  return repositories.findOne({
    "relationships.course.id": courseId,
    "relationships.user.id": userId,
  });
};

const repositoryStream = async () => {
  const database = await db();
  const repositories = database.collection<Repository>("repositories");

  return repositories.watch();
};

const processMessage = (message) => {
  console.log("Id: %s. Data: %O", message[0], message[1]);
  if (message[1][1] === "log") {
    const bytesString = message[1][3];
    const bytesArray = JSON.parse(bytesString);
    const bytes = new Uint8Array(bytesArray);
    const decoder = new TextDecoder("utf-8");
    const decoded = decoder.decode(bytes);
    console.log(JSON.stringify(JSON.parse(decoded), null, 2));
  }
};

const logstream = async (logstreamId: string, lastId = "$") => {
  const results = await redis.xread(
    "BLOCK",
    1000000,
    "STREAMS",
    logstreamId,
    lastId,
  );
  const [key, messages] = results[0];

  messages.forEach(processMessage);

  await logstream(key, messages[messages.length - 1][0]);
};

export {
  findUserRepositoryByCourse,
  getCourseFromDb,
  getProgressData,
  getRepositories,
  getUser,
  getUserByEmail,
  getUserRepo,
  logstream,
  repositoryStream,
};
export { fetchGraphQL } from "./contentful";
export { QUERY_COURSE_GRAPHQL_FIELDS } from "./queries";
