import { NextRequest } from "next/server";
import { TypeProgressUpdate } from "@/lib/types";

export async function POST(req: NextRequest) {
  console.log("Update progress endpoint called");
  
  try {
    const { clientPromise } = await import("@/lib/db/mongodb");
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME || "dcs-test");
    
    const data = await req.json();
    console.log("Received update data:", JSON.stringify(data));
    
    const updates: TypeProgressUpdate[] = data.updates;
    
    if (!updates || !Array.isArray(updates) || updates.length === 0) {
      console.error("Invalid updates format", data);
      return Response.json(
        { error: "Invalid updates format" },
        { status: 400 }
      );
    }

    // Process each update
    const results = [];
    for (const update of updates) {
      const { user, progress } = update;
      
      if (!user?.email || !progress) {
        console.error("Invalid update object:", update);
        results.push({ success: false, error: "Invalid update object" });
        continue;
      }
      
      console.log(`Processing update for user: ${user.email}`);
      
      try {
        // Process updates for each course, section, and lesson
        for (const courseId in progress) {
          for (const sectionId in progress[courseId]) {
            for (const lessonId in progress[courseId][sectionId]) {
              const path = `progress.${courseId}.${sectionId}.${lessonId}`;
              const value = progress[courseId][sectionId][lessonId];
              
              console.log(`Setting ${path} = ${value}`);
              
              // Update the specific path
              await db.collection("user").updateOne(
                { email: user.email },
                { $set: { [path]: value } },
                { upsert: true } // Create if doesn't exist
              );
            }
          }
        }
        
        // Get the updated user document to verify
        const updatedUser = await db.collection("user").findOne(
          { email: user.email },
          { projection: { progress: 1 } }
        );
        
        console.log("Updated user progress:", updatedUser?.progress);
        results.push({ success: true, email: user.email });
      } catch (error) {
        console.error(`Error updating progress for user ${user.email}:`, error);
        results.push({ success: false, email: user.email, error: String(error) });
      }
    }
    
    return Response.json({ 
      success: true,
      results
    });
  } catch (error) {
    console.error("Error updating progress:", error);
    return Response.json(
      { error: "Internal Server Error", message: String(error) },
      { status: 500 }
    );
  }
}