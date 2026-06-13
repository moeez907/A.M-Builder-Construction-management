import { db } from "./src/db/index.ts";
import * as schema from "./src/db/schema.ts";

async function test() {
  try {
     const projects = await db.select().from(schema.projects);
     console.log(projects);
  } catch (err) {
     console.error("DB Error:", err);
  }
}
test();
