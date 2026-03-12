import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    
    // We must define isCompleted here because your database 
    // already contains documents with this field!
    isCompleted: v.boolean(), 
  }),
});