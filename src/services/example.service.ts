/**
 * SERVICE TEMPLATE
 * Use services to handle business logic, data access (Prisma), 
 * and integration with external providers (Supabase).
 */

import { prisma } from "@/lib/prisma";

export const ExampleService = {
  // Read operation
  async findAll() {
    console.log("Service: Fetching all records...");
    // return prisma.example.findMany(); // Example Prisma call
    return [{ id: 1, name: "Dummy Data" }];
  },

  // Write operation
  async create(data: any) {
    console.log("Service: Creating record with data:", data);
    return { id: 2, ...data };
  },

  // Detail operation
  async findById(id: string) {
    console.log("Service: Finding record by id:", id);
    return { id, name: "Single Dummy" };
  }
};
