import { NextRequest } from "next/server";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  console.log("Get progress data endpoint called");
  
  const session = await auth();

  if (!session?.user?.email) {
    console.log("No authenticated user found");
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    console.log(`Fetching progress for user: ${session.user.email}`);
    const { clientPromise } = await import("@/lib/db/mongodb");
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME || "dcs-test");
    
    // Get user document and project only the progress field
    const user = await db.collection("user").findOne(
      { email: session.user.email },
      { projection: { progress: 1 } }
    );
    
    if (!user) {
      console.log("User not found in database");
      return Response.json({});
    }
    
    // Format progress data in a way the client expects
    const formattedProgress: { [courseId: string]: { [sectionId: string]: { [lessonId: string]: boolean } } } = {};
    
    // If progress exists, process it
    if (user.progress) {
      Object.entries(user.progress).forEach(([courseId, courseSections]) => {
        formattedProgress[courseId] = {};
        
        // Process sections
        if (courseSections && typeof courseSections === 'object') {
          Object.entries(courseSections).forEach(([sectionId, lessons]) => {
            formattedProgress[courseId][sectionId] = {};
            
            // Process lessons
            if (lessons && typeof lessons === 'object') {
              Object.entries(lessons).forEach(([lessonId, completed]) => {
                formattedProgress[courseId][sectionId][lessonId] = !!completed;
              });
            }
          });
        }
      });
    }
    
    console.log("Sending formatted progress to client:", formattedProgress);
    
    return Response.json(formattedProgress);
    
  } catch (error) {
    console.error("MongoDB error in get-progress-data:", error);
    return Response.json(
      { error: "Failed to fetch progress data", message: String(error) },
      { status: 500 }
    );
  }
}