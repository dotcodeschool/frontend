import { ObjectId } from "mongodb";

import { Course, Repository, User } from "@/lib/db/models";
import { clientPromise } from "@/lib/db/mongodb";

const db = async () => {
  const client = await clientPromise;

  return client.db(process.env.DB_NAME);
};

const getUser = async (userId: ObjectId) => {
  const database = await db();
  const users = database.collection<User>("users");

  return users.findOne({ _id: userId });
};

const getCourseBySlug = async (slug: string) => {
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
  userId: string,
) => {
  const repositories = await getRepositories();
  const userObjectId = new ObjectId(userId);
  const course = await getCourseBySlug(courseSlug);
  const courseId = course?._id ?? null;

  if (!courseId) {
    console.error("Course not found");

    return null;
  }

  return repositories.findOne({
    relationships: {
      course: { id: courseId },
      user: { id: userObjectId },
    },
  });
};

export { findUserRepositoryByCourse, getUser };