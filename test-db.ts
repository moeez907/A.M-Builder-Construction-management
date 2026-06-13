import { db } from './src/db/index.ts';
import * as schema from './src/db/schema.ts';

async function test() {
  try {
    const items = [
      {
        id: 'DOC-9999',
        projectId: 'AMB-2026-6-12-001',
        title: 'Huge DB test',
        type: 'Layout',
        fileName: 'map.jpg',
        fileSize: '5 MB',
        uploadDate: '2026-06-12',
        uploadedBy: 'Admin',
        description: 'Testing',
        visibility: 'Internal',
        fileUrl: 'data:image/jpeg;base64,' + 'A'.repeat(50000),
        createdBy: 'admin@ambuilders.com'
      }
    ];
    await db.insert(schema.documents).values(items);
    console.log("Success");
  } catch (err) {
    console.error("Failed:", err);
  }
}
test();
