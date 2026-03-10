"use server";

/**
 * SERVER ACTION TEMPLATE
 * Use actions to handle form submissions and user-driven data changes.
 */

import { revalidatePath } from "next/cache";
import { ExampleService } from "@/services/example.service";

export async function createExampleAction(formData: FormData) {
  const name = formData.get("name") as string;
  
  console.log("Action: Handling form submission for:", name);

  try {
    // 1. Call a service to do the heavy lifting
    await ExampleService.create({ name });
    
    // 2. Clear cache to reflect the new state
    revalidatePath("/dashboard/example");
  } catch (error) {
    console.error("Action error:", error);
  }
}
