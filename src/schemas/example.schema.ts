import { z } from "zod";

/**
 * ZOD SCHEMA TEMPLATE
 * Use Zod for runtime validation, form schemas, and API request bodies.
 */

export const ExampleSchema = z.object({
  id: z.string().cuid().optional(),
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().max(500, "Description is too long").optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  isActive: z.boolean().default(true),
  count: z.number().int().nonnegative().optional(),
});

// Infer TypeScript types from the schema
export type ExampleInput = z.infer<typeof ExampleSchema>;

// Form-specific schemas can extend the base
export const CreateExampleFormSchema = ExampleSchema.omit({ 
  id: true, 
  isActive: true 
});
