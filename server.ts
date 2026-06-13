import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import { db, createPool } from "./src/db/index.ts";
import * as schema from "./src/db/schema.ts";
import { eq, and, or, inArray } from "drizzle-orm";

const app = express();
const PORT = 3000;
const DATA_STORE_PATH = path.join(process.cwd(), "data-store.json");

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Seed/Load database file
const defaultPassword = "password123";

const initialUsers: any[] = [];

const initialProjects: any[] = [];

const initialWorkers: any[] = [];

const initialMaterials: any[] = [];

const initialSuppliers: any[] = [];

// PostgreSQL helper for REST API
const DEMO_EMAILS: any[] = [];

function getUserContext(req: express.Request) {
  const email = (req.headers["x-user-email"] as string || "").toLowerCase().trim();
  const role = req.headers["x-user-role"] as string || "";
  const isDemo = DEMO_EMAILS.map(e => e.toLowerCase()).includes(email);
  return { email, role, isDemo };
}

async function getMyProjectIds(email: string, role: string) {
  try {
    const allProjects = await db.select().from(schema.projects);
    if (!email || role.includes("Admin") || role.includes("CEO")) {
      return allProjects.map((p: any) => p.id);
    }
    return allProjects
      .filter((p: any) => (p.createdBy || "").toLowerCase() === email || (p.clientEmail || "").toLowerCase() === email)
      .map((p: any) => p.id);
  } catch (error) {
    console.error("[Project IDs] Failed to load projects:", error);
    return [];
  }
}

// REST API handlers

app.get("/api/health-db", async (req, res) => {
  const cloudsqlFiles: string[] = [];
  const appCloudsqlFiles: string[] = [];
  
  const resolvedUser = process.env.SQL_USER || process.env.SQL_ADMIN_USER;
  const resolvedPassword = process.env.SQL_USER ? process.env.SQL_PASSWORD : process.env.SQL_ADMIN_PASSWORD;
  const host = process.env.SQL_HOST;
  const dbName = process.env.SQL_DB_NAME;

  try {
    // Dynamically load node-postgres and fs
    const pkg = await import("pg");
    const fs = await import("fs");
    const Pool = pkg.default.Pool;

    // List directories under /cloudsql and /app/cloudsql
    try {
      if (fs.existsSync("/cloudsql")) {
        cloudsqlFiles.push(...fs.readdirSync("/cloudsql").map(f => `/cloudsql/${f}`));
      }
    } catch (e: any) {
      cloudsqlFiles.push(`Error reading /cloudsql: \${e.message}`);
    }

    try {
      if (fs.existsSync("/app/cloudsql")) {
        appCloudsqlFiles.push(...fs.readdirSync("/app/cloudsql").map(f => `/app/cloudsql/${f}`));
      }
    } catch (e: any) {
      appCloudsqlFiles.push(`Error reading /app/cloudsql: \${e.message}`);
    }

    const testPool = createPool();
    
    const start = Date.now();
    const result = await testPool.query("SELECT 1 + 1 AS sum");
    const duration = Date.now() - start;
    await testPool.end();
    
    res.json({
      success: true,
      durationMs: duration,
      result: result.rows,
      cloudsqlFiles,
      appCloudsqlFiles,
      config: {
        host,
        dbName,
        user: resolvedUser,
        hasPassword: !!resolvedPassword,
      }
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : String(err),
      rawError: err,
      errorKeys: err ? Object.getOwnPropertyNames(err) : [],
      cloudsqlFiles,
      appCloudsqlFiles,
      dbErrorDetails: {
        code: err?.code,
        detail: err?.detail,
        hint: err?.hint,
        severity: err?.severity,
        internalQuery: err?.internalQuery,
        where: err?.where,
        schema: err?.schema,
        table: err?.table,
      },
      stack: err instanceof Error ? err.stack : undefined,
      config: {
        host: process.env.SQL_HOST,
        dbName: process.env.SQL_DB_NAME,
        user: resolvedUser,
        hasPassword: !!resolvedPassword,
      }
    });
  }
});

// Auth APIs
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const targetEmail = (email || "").toLowerCase().trim();
    console.log(`[AUTH] Direct DB login attempt for: ${targetEmail}`);
    
    const users = await db.select().from(schema.users).where(eq(schema.users.email, targetEmail));
    const user = users[0];
    
    if (!user) {
      console.log(`[AUTH] User not found: ${targetEmail}`);
      return res.status(401).json({ success: false, message: "Incorrect Email or Password." });
    }

    if (user.password !== password) {
      console.log(`[AUTH] Password mismatch for: ${targetEmail}`);
      return res.status(401).json({ success: false, message: "Incorrect Email or Password." });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
  } catch (error: any) {
    console.error("[AUTH] Login error:", error);
    res.status(500).json({ success: false, message: "Internal server error.", error: error instanceof Error ? error.message + (error.stack || "") : String(error), stack: error instanceof Error ? error.stack : undefined });
  }
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role, phone, cnic } = req.body;
    const targetEmail = (email || "").toLowerCase().trim();
    
    const existing = await db.select().from(schema.users).where(eq(schema.users.email, targetEmail));
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: "Email is already registered." });
    }

    const newUser = {
      id: `U-0${Date.now().toString().slice(-4)}`,
      name,
      email: targetEmail,
      password: password || defaultPassword,
      role: role || "Employee",
      phone: phone || "",
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80`,
      cnic: cnic || ""
    };

    await db.insert(schema.users).values(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    res.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.error("[AUTH] Registration error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const targetEmail = (email || "").toLowerCase().trim();
    
    const existing = await db.select().from(schema.users).where(eq(schema.users.email, targetEmail));
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    await db.update(schema.users)
      .set({ password: newPassword })
      .where(eq(schema.users.email, targetEmail));
      
    res.json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("[AUTH] Password reset error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// Users list API
app.get("/api/users", async (req, res) => {
  try {
    const list = await db.select().from(schema.users);
    const users = list.map(({ password, ...u }) => u);
    res.json(users);
  } catch (error) {
    console.error("[API] Failed to fetch users:", error);
    res.status(500).json({ error: "Failed to fetch users", details: error instanceof Error ? error.message : String(error) });
  }
});

// Projects CRUD
app.get("/api/projects", async (req, res) => {
  try {
    const { email, role, isDemo } = getUserContext(req);
    const allProjects = await db.select().from(schema.projects);
    if (!email || isDemo || role.includes("Admin") || role.includes("CEO")) {
      return res.json(allProjects);
    }
    const filtered = allProjects.filter((p: any) => 
      (p.createdBy || "").toLowerCase() === email || (p.clientEmail || "").toLowerCase() === email
    );
    res.json(filtered);
  } catch (error) {
    console.error("[API] Failed to fetch projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

app.post("/api/projects", async (req, res) => {
  try {
    const { email } = getUserContext(req);
    let finalId = req.body.id;
    
    const allProjects = await db.select().from(schema.projects);
    if (!finalId) {
      let suffix = Date.now().toString().slice(-3);
      finalId = `AMB-2026-0${suffix}`;
      while (allProjects.some((p: any) => p.id === finalId)) {
        suffix = Math.floor(Math.random() * 1000).toString();
        finalId = `AMB-2026-0${suffix}`;
      }
    } else {
      const duplicateIndex = allProjects.findIndex((p: any) => p.id === finalId);
      if (duplicateIndex !== -1) {
        const existingProj = allProjects[duplicateIndex];
        if (existingProj.name === req.body.name) {
          const updated = {
            ...existingProj,
            ...req.body,
            createdBy: email || req.body.createdBy || existingProj.createdBy
          };
          await db.update(schema.projects).set(updated).where(eq(schema.projects.id, finalId));
          return res.json({ success: true, project: updated });
        } else {
          let counter = 1;
          let testId = `${finalId}_${counter}`;
          while (allProjects.some((p: any) => p.id === testId)) {
            counter++;
            testId = `${finalId}_${counter}`;
          }
          finalId = testId;
        }
      }
    }

    const newProject = {
      ...req.body,
      id: finalId,
      createdBy: email || req.body.createdBy
    };
    await db.insert(schema.projects).values(newProject);
    res.json({ success: true, project: newProject });
  } catch (error) {
    console.error("[API] Failed to create project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
});

app.put("/api/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await db.select().from(schema.projects).where(eq(schema.projects.id, id));
    if (existing.length > 0) {
      const updated = { ...existing[0], ...req.body };
      await db.update(schema.projects).set(updated).where(eq(schema.projects.id, id));
      res.json({ success: true, project: updated });
    } else {
      res.status(404).json({ success: false, message: "Project not found" });
    }
  } catch (error) {
    console.error("[API] Failed to update project:", error);
    res.status(500).json({ error: "Failed to update project" });
  }
});

app.delete("/api/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Cascade delete all records linked to this project id
    await db.delete(schema.projects).where(eq(schema.projects.id, id));
    await db.delete(schema.attendance).where(eq(schema.attendance.projectId, id));
    await db.delete(schema.purchases).where(eq(schema.purchases.projectId, id));
    await db.delete(schema.usages).where(eq(schema.usages.projectId, id));
    await db.delete(schema.supplierPayments).where(eq(schema.supplierPayments.projectId, id));
    await db.delete(schema.progressReports).where(eq(schema.progressReports.projectId, id));
    await db.delete(schema.media).where(eq(schema.media.projectId, id));
    await db.delete(schema.expenses).where(eq(schema.expenses.projectId, id));
    await db.delete(schema.clientPayments).where(eq(schema.clientPayments.projectId, id));
    await db.delete(schema.milestones).where(eq(schema.milestones.projectId, id));
    await db.delete(schema.issues).where(eq(schema.issues.projectId, id));
    await db.delete(schema.documents).where(eq(schema.documents.projectId, id));
    await db.delete(schema.teamMembers).where(eq(schema.teamMembers.projectId, id));
    
    // Unassign workers from this project
    await db.update(schema.workers).set({ projectId: "" }).where(eq(schema.workers.projectId, id));

    res.json({ success: true });
  } catch (error) {
    console.error("[API] Failed to delete project:", error);
    res.status(500).json({ error: "Failed to delete project" });
  }
});

// Workers CRUD
app.get("/api/workers", async (req, res) => {
  try {
    const { email, role, isDemo } = getUserContext(req);
    const allWorkers = await db.select().from(schema.workers);
    if (!email || isDemo) {
      return res.json(allWorkers);
    }
    const myIds = await getMyProjectIds(email, role);
    const filtered = allWorkers.filter((w: any) => myIds.includes(w.projectId));
    res.json(filtered);
  } catch (error) {
    console.error("[API] Failed to fetch workers:", error);
    res.status(500).json({ error: "Failed to fetch workers" });
  }
});

app.post("/api/workers", async (req, res) => {
  try {
    const { email } = getUserContext(req);
    const newWorker = {
      ...req.body,
      id: `W-${Date.now().toString().slice(-4)}`,
      createdBy: email || req.body.createdBy
    };
    await db.insert(schema.workers).values(newWorker);
    res.json({ success: true, worker: newWorker });
  } catch (error) {
    console.error("[API] Failed to create worker:", error);
    res.status(500).json({ error: "Failed to create worker" });
  }
});

app.put("/api/workers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await db.select().from(schema.workers).where(eq(schema.workers.id, id));
    if (existing.length > 0) {
      const updated = { ...existing[0], ...req.body };
      await db.update(schema.workers).set(updated).where(eq(schema.workers.id, id));
      res.json({ success: true, worker: updated });
    } else {
      res.status(404).json({ success: false, message: "Worker not found" });
    }
  } catch (error) {
    console.error("[API] Failed to update worker:", error);
    res.status(500).json({ error: "Failed to update worker" });
  }
});

app.delete("/api/workers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(schema.workers).where(eq(schema.workers.id, id));
    res.json({ success: true });
  } catch (error) {
    console.error("[API] Failed to delete worker:", error);
    res.status(500).json({ error: "Failed to delete worker" });
  }
});

// Attendance Logs
app.get("/api/attendance", async (req, res) => {
  try {
    const { email, role, isDemo } = getUserContext(req);
    const allAttendance = await db.select().from(schema.attendance);
    if (!email || isDemo) {
      return res.json(allAttendance);
    }
    const myIds = await getMyProjectIds(email, role);
    const filtered = allAttendance.filter((a: any) => myIds.includes(a.projectId));
    res.json(filtered);
  } catch (error) {
    console.error("[API] Failed to fetch attendance:", error);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

app.post("/api/attendance", async (req, res) => {
  try {
    const { email } = getUserContext(req);
    const rawRecords = req.body;
    const records = Array.isArray(rawRecords) ? rawRecords : [rawRecords];
    
    const savedItems = [];
    for (const record of records) {
      const newRecord = {
        ...record,
        id: `ATT-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 100)}`,
        createdBy: email || record.createdBy
      };
      await db.insert(schema.attendance).values(newRecord);
      savedItems.push(newRecord);
    }
    
    res.json({ success: true, attendance: savedItems });
  } catch (error) {
    console.error("[API] Failed to record attendance:", error);
    res.status(500).json({ error: "Failed to record attendance" });
  }
});

app.delete("/api/attendance/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(schema.attendance).where(eq(schema.attendance.id, id));
    res.json({ success: true });
  } catch (error) {
    console.error("[API] Failed to delete attendance:", error);
    res.status(500).json({ error: "Failed to delete attendance" });
  }
});

// Materials Inventory CRUD
app.get("/api/materials", async (req, res) => {
  try {
    const { email, role, isDemo } = getUserContext(req);
    const allMaterials = await db.select().from(schema.materials);
    
    const mapMaterial = (item: any) => ({
      ...item,
      currentStock: typeof item.currentStock === "number" ? item.currentStock : (typeof item.stockQuantity === "number" ? item.stockQuantity : 0),
      stockQuantity: typeof item.stockQuantity === "number" ? item.stockQuantity : (typeof item.currentStock === "number" ? item.currentStock : 0),
      lowStockAlert: typeof item.lowStockAlert === "number" ? item.lowStockAlert : (typeof item.alertThreshold === "number" ? item.alertThreshold : 0),
      alertThreshold: typeof item.alertThreshold === "number" ? item.alertThreshold : (typeof item.lowStockAlert === "number" ? item.lowStockAlert : 0)
    });

    if (!email || isDemo || role.includes("Admin") || role.includes("CEO") || role.includes("Supervisor")) {
      return res.json(allMaterials.map(mapMaterial));
    }
    
    const customMaterials = allMaterials.filter((m: any) => m.createdBy === email);
    if (customMaterials.length === 0) {
      const clearedDefaults = initialMaterials.map((m: any) => ({
        ...m,
        stockQuantity: 0,
        currentStock: 0,
        createdBy: email
      }));
      return res.json(clearedDefaults.map(mapMaterial));
    }
    res.json(customMaterials.map(mapMaterial));
  } catch (error) {
    console.error("[API] Failed to fetch materials:", error);
    res.status(500).json({ error: "Failed to fetch materials" });
  }
});

app.post("/api/materials", async (req, res) => {
  try {
    const { email } = getUserContext(req);
    const newMat: any = {
      ...req.body,
      id: `M-${Date.now().toString().slice(-4)}`,
      createdBy: email || req.body.createdBy
    };
    newMat.currentStock = typeof newMat.currentStock === "number" ? newMat.currentStock : (typeof newMat.stockQuantity === "number" ? newMat.stockQuantity : 0);
    newMat.stockQuantity = typeof newMat.stockQuantity === "number" ? newMat.stockQuantity : newMat.currentStock;
    newMat.lowStockAlert = typeof newMat.lowStockAlert === "number" ? newMat.lowStockAlert : (typeof newMat.alertThreshold === "number" ? newMat.alertThreshold : 0);
    newMat.alertThreshold = typeof newMat.alertThreshold === "number" ? newMat.alertThreshold : newMat.lowStockAlert;

    await db.insert(schema.materials).values(newMat);
    res.json({ success: true, material: newMat });
  } catch (error) {
    console.error("[API] Failed to add material:", error);
    res.status(500).json({ error: "Failed to add material" });
  }
});

app.put("/api/materials/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await db.select().from(schema.materials).where(eq(schema.materials.id, id));
    if (existing.length > 0) {
      const updated = { ...existing[0], ...req.body };
      await db.update(schema.materials).set(updated).where(eq(schema.materials.id, id));
      res.json({ success: true, material: updated });
    } else {
      res.status(404).json({ success: false, message: "Material not found" });
    }
  } catch (error) {
    console.error("[API] Failed to update material:", error);
    res.status(500).json({ error: "Failed to update material" });
  }
});

// Purchases
app.get("/api/purchases", async (req, res) => {
  try {
    const { email, role, isDemo } = getUserContext(req);
    const allPurchases = await db.select().from(schema.purchases);
    if (!email || isDemo) {
      return res.json(allPurchases);
    }
    const myIds = await getMyProjectIds(email, role);
    const filtered = allPurchases.filter((p: any) => myIds.includes(p.projectId));
    res.json(filtered);
  } catch (error) {
    console.error("[API] Failed to fetch purchases:", error);
    res.status(500).json({ error: "Failed to fetch purchases" });
  }
});

app.post("/api/purchases", async (req, res) => {
  try {
    const { email } = getUserContext(req);
    const purchase = {
      ...req.body,
      id: `PUR-${Date.now().toString().slice(-4)}`,
      createdBy: email || req.body.createdBy
    };
    await db.insert(schema.purchases).values(purchase);
    
    if (purchase.deliveryStatus !== "Pending") {
      const existingMat = await db.select().from(schema.materials).where(eq(schema.materials.name, purchase.materialName));
      if (existingMat.length > 0) {
        const updatedStock = (existingMat[0].currentStock || 0) + Number(purchase.quantity);
        await db.update(schema.materials)
          .set({ currentStock: updatedStock })
          .where(eq(schema.materials.id, existingMat[0].id));
      } else {
        await db.insert(schema.materials).values({
          id: `M-${Date.now().toString().slice(-4)}`,
          name: purchase.materialName,
          category: "General",
          unit: purchase.unit || "Bags",
          currentStock: Number(purchase.quantity),
          lowStockAlert: 20,
          createdBy: purchase.createdBy || email
        });
      }
    }

    res.json({ success: true, purchase });
  } catch (error) {
    console.error("[API] Failed to create purchase:", error);
    res.status(500).json({ error: "Failed to create purchase" });
  }
});

app.put("/api/purchases/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await db.select().from(schema.purchases).where(eq(schema.purchases.id, id));
    if (existing.length > 0) {
      const oldPurchase = existing[0];
      const newPurchase = { ...oldPurchase, ...req.body };
      await db.update(schema.purchases).set(newPurchase).where(eq(schema.purchases.id, id));
      
      // If it was pending and is now delivered, increment inventory
      if (oldPurchase.deliveryStatus === "Pending" && newPurchase.deliveryStatus !== "Pending") {
        const existingMat = await db.select().from(schema.materials).where(eq(schema.materials.name, newPurchase.materialName));
        if (existingMat.length > 0) {
          const updatedStock = (existingMat[0].currentStock || 0) + Number(newPurchase.quantity);
          await db.update(schema.materials)
            .set({ currentStock: updatedStock })
            .where(eq(schema.materials.id, existingMat[0].id));
        } else {
          await db.insert(schema.materials).values({
            id: `M-${Date.now().toString().slice(-4)}`,
            name: newPurchase.materialName,
            category: "General",
            unit: newPurchase.unit || "Bags",
            currentStock: Number(newPurchase.quantity),
            lowStockAlert: 20,
            createdBy: newPurchase.createdBy || oldPurchase.createdBy
          });
        }
      }
      res.json({ success: true, purchase: newPurchase });
    } else {
      res.status(404).json({ success: false, message: "Purchase not found" });
    }
  } catch (error) {
    console.error("[API] Failed to update purchase:", error);
    res.status(500).json({ error: "Failed to update purchase" });
  }
});

// Materials Usages
app.get("/api/usages", async (req, res) => {
  try {
    const { email, role, isDemo } = getUserContext(req);
    const allUsages = await db.select().from(schema.usages);
    if (!email || isDemo) {
      return res.json(allUsages);
    }
    const myIds = await getMyProjectIds(email, role);
    const filtered = allUsages.filter((u: any) => myIds.includes(u.projectId));
    res.json(filtered);
  } catch (error) {
    console.error("[API] Failed to fetch usages:", error);
    res.status(500).json({ error: "Failed to fetch usages" });
  }
});

app.post("/api/usages", async (req, res) => {
  try {
    const { email } = getUserContext(req);
    const usage = {
      ...req.body,
      id: `USG-${Date.now().toString().slice(-4)}`,
      createdBy: email || req.body.createdBy
    };
    await db.insert(schema.usages).values(usage);
    res.json({ success: true, usage });
  } catch (error) {
    console.error("[API] Failed to record usage:", error);
    res.status(500).json({ error: "Failed to record usage" });
  }
});

app.put("/api/usages/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await db.select().from(schema.usages).where(eq(schema.usages.id, id));
    if (existing.length > 0) {
      const newUsage = { ...existing[0], ...req.body };
      await db.update(schema.usages).set(newUsage).where(eq(schema.usages.id, id));
      res.json({ success: true, usage: newUsage });
    } else {
      res.status(404).json({ success: false, message: "Usage not found" });
    }
  } catch (error) {
    console.error("[API] Failed to update usage:", error);
    res.status(500).json({ error: "Failed to update usage" });
  }
});

// Suppliers
app.get("/api/suppliers", async (req, res) => {
  try {
    const allSuppliers = await db.select().from(schema.suppliers);
    res.json(allSuppliers);
  } catch (error) {
    console.error("[API] Failed to fetch suppliers:", error);
    res.status(500).json({ error: "Failed to fetch suppliers" });
  }
});

app.post("/api/suppliers", async (req, res) => {
  try {
    const { email } = getUserContext(req);
    const supplier = {
      ...req.body,
      id: `S-${Date.now().toString().slice(-4)}`,
      createdBy: email || req.body.createdBy
    };
    await db.insert(schema.suppliers).values(supplier);
    res.json({ success: true, supplier });
  } catch (error) {
    console.error("[API] Failed to create supplier:", error);
    res.status(500).json({ error: "Failed to create supplier" });
  }
});

// Supplier Payments Ledger
app.get("/api/supplier-payments", async (req, res) => {
  try {
    const allPayments = await db.select().from(schema.supplierPayments);
    res.json(allPayments);
  } catch (error) {
    console.error("[API] Failed to fetch supplier payments:", error);
    res.status(500).json({ error: "Failed to fetch supplier payments" });
  }
});

app.post("/api/supplier-payments", async (req, res) => {
  try {
    const { email } = getUserContext(req);
    const payment = {
      ...req.body,
      id: `SP-${Date.now().toString().slice(-4)}`,
      createdBy: email || req.body.createdBy
    };
    await db.insert(schema.supplierPayments).values(payment);
    res.json({ success: true, payment });
  } catch (error) {
    console.error("[API] Failed to record supplier payment:", error);
    res.status(500).json({ error: "Failed to record supplier payment" });
  }
});

// Daily progress reports
app.get("/api/progress-reports", async (req, res) => {
  try {
    const { email, role, isDemo } = getUserContext(req);
    const allReports = await db.select().from(schema.progressReports);
    if (!email || isDemo) {
      return res.json(allReports);
    }
    const myIds = await getMyProjectIds(email, role);
    const filtered = allReports.filter((r: any) => myIds.includes(r.projectId));
    res.json(filtered);
  } catch (error) {
    console.error("[API] Failed to fetch progress reports:", error);
    res.status(500).json({ error: "Failed to fetch progress reports" });
  }
});

app.post("/api/progress-reports", async (req, res) => {
  try {
    const { email } = getUserContext(req);
    const report = {
      ...req.body,
      id: `REP-${Date.now().toString().slice(-4)}`,
      createdBy: email || req.body.createdBy
    };
    await db.insert(schema.progressReports).values(report);
    res.json({ success: true, report });
  } catch (error) {
    console.error("[API] Failed to create progress report:", error);
    res.status(500).json({ error: "Failed to create progress report" });
  }
});

// Media
app.get("/api/media", async (req, res) => {
  try {
    const { email, role, isDemo } = getUserContext(req);
    const allMedia = await db.select().from(schema.media);
    if (!email || isDemo) {
      return res.json(allMedia);
    }
    const myIds = await getMyProjectIds(email, role);
    const filtered = allMedia.filter((m: any) => myIds.includes(m.projectId));
    res.json(filtered);
  } catch (error) {
    console.error("[API] Failed to fetch media:", error);
    res.status(500).json({ error: "Failed to fetch media" });
  }
});

app.post("/api/media", async (req, res) => {
  try {
    const { email } = getUserContext(req);
    const item = {
      ...req.body,
      id: `MED-${Date.now().toString().slice(-4)}`,
      createdBy: email || req.body.createdBy
    };
    await db.insert(schema.media).values(item);
    res.json({ success: true, media: item });
  } catch (error) {
    console.error("[API] Failed to upload media:", error);
    res.status(500).json({ error: "Failed to upload media" });
  }
});

// Expenses
app.get("/api/expenses", async (req, res) => {
  try {
    const { email, role, isDemo } = getUserContext(req);
    const allExpenses = await db.select().from(schema.expenses);
    if (!email || isDemo) {
      return res.json(allExpenses);
    }
    const myIds = await getMyProjectIds(email, role);
    const filtered = allExpenses.filter((e: any) => myIds.includes(e.projectId));
    res.json(filtered);
  } catch (error) {
    console.error("[API] Failed to fetch expenses:", error);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

app.post("/api/expenses", async (req, res) => {
  try {
    const { email } = getUserContext(req);
    const expense = {
      ...req.body,
      id: req.body.id || `EXP-${Date.now().toString().slice(-4)}`,
      createdBy: email || req.body.createdBy
    };
    await db.insert(schema.expenses).values(expense);
    res.json({ success: true, expense });
  } catch (error) {
    console.error("[API] Failed to create expense:", error);
    res.status(500).json({ error: "Failed to create expense" });
  }
});

app.put("/api/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.update(schema.expenses).set(req.body).where(eq(schema.expenses.id, id));
    res.json({ success: true });
  } catch (error) {
    console.error("[API] Failed to update expense:", error);
    res.status(500).json({ error: "Failed to update expense" });
  }
});

app.delete("/api/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(schema.expenses).where(eq(schema.expenses.id, id));
    res.json({ success: true });
  } catch (error) {
    console.error("[API] Failed to delete expense:", error);
    res.status(500).json({ error: "Failed to delete expense" });
  }
});

// Client Receivables
app.get("/api/client-receivables", async (req, res) => {
  try {
    const { email, role, isDemo } = getUserContext(req);
    const all = await db.select().from(schema.clientReceivables);
    if (!email || isDemo) {
      return res.json(all);
    }
    const myIds = await getMyProjectIds(email, role);
    const filtered = all.filter((e: any) => myIds.includes(e.projectId));
    res.json(filtered);
  } catch (error) {
    console.error("[API] Failed to fetch client receivables:", error);
    res.status(500).json({ error: "Failed to fetch client receivables", details: error instanceof Error ? error.message : String(error) });
  }
});

app.post("/api/client-receivables", async (req, res) => {
  try {
    const { email } = getUserContext(req);
    const item = {
      ...req.body,
      id: `CR-${Date.now().toString().slice(-4)}`,
      createdBy: email
    };
    await db.insert(schema.clientReceivables).values(item);
    res.json({ success: true, item });
  } catch (error) {
    console.error("[API] Failed to add client receivable:", error);
    res.status(500).json({ error: "Failed to add client receivable" });
  }
});

app.put("/api/client-receivables/:id/pay", async (req, res) => {
  try {
    const { id } = req.params;
    const { recoveryDate } = req.body;
    await db.update(schema.clientReceivables)
      .set({ status: "Recovered", recoveryDate })
      .where(eq(schema.clientReceivables.id, id));
    res.json({ success: true });
  } catch (error) {
    console.error("[API] Failed to update client receivable:", error);
    res.status(500).json({ error: "Failed to update client receivable" });
  }
});

// Client payments
app.get("/api/client-payments", async (req, res) => {
  try {
    const { email, role, isDemo } = getUserContext(req);
    const allPayments = await db.select().from(schema.clientPayments);
    if (!email || isDemo) {
      return res.json(allPayments);
    }
    const myIds = await getMyProjectIds(email, role);
    const filtered = allPayments.filter((p: any) => myIds.includes(p.projectId));
    res.json(filtered);
  } catch (error) {
    console.error("[API] Failed to fetch client payments:", error);
    res.status(500).json({ error: "Failed to fetch client payments" });
  }
});

app.post("/api/client-payments", async (req, res) => {
  try {
    const { email } = getUserContext(req);
    const payment = {
      ...req.body,
      id: `CP-${Date.now().toString().slice(-4)}`,
      createdBy: email || req.body.createdBy
    };
    await db.insert(schema.clientPayments).values(payment);
    res.json({ success: true, payment });
  } catch (error) {
    console.error("[API] Failed to add client payment:", error);
    res.status(500).json({ error: "Failed to add client payment" });
  }
});

app.delete("/api/client-payments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(schema.clientPayments).where(eq(schema.clientPayments.id, id));
    res.json({ success: true });
  } catch (error) {
    console.error("[API] Failed to delete client payment:", error);
    res.status(500).json({ error: "Failed to delete client payment" });
  }
});

// Milestones
app.get("/api/milestones", async (req, res) => {
  try {
    const { email, role, isDemo } = getUserContext(req);
    const allMilestones = await db.select().from(schema.milestones);
    if (!email || isDemo) {
      return res.json(allMilestones);
    }
    const myIds = await getMyProjectIds(email, role);
    const filtered = allMilestones.filter((m: any) => myIds.includes(m.projectId));
    res.json(filtered);
  } catch (error) {
    console.error("[API] Failed to fetch milestones:", error);
    res.status(500).json({ error: "Failed to fetch milestones" });
  }
});

app.post("/api/milestones", async (req, res) => {
  try {
    const { email } = getUserContext(req);
    const items = req.body;
    const list = Array.isArray(items) ? items : [items];
    
    const allMilestones = await db.select().from(schema.milestones);
    for (const item of list) {
      const existingIndex = allMilestones.findIndex((m: any) => m.projectId === item.projectId && (m.name || m.title || "") === (item.name || item.title || ""));
      if (existingIndex !== -1) {
        const old = allMilestones[existingIndex];
        const updated = { ...old, ...item, createdBy: email || old.createdBy };
        await db.update(schema.milestones).set(updated).where(eq(schema.milestones.id, old.id));
      } else {
        const newItem = {
          ...item,
          id: item.id || `MS-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 100)}`,
          createdBy: email || item.createdBy
        };
        await db.insert(schema.milestones).values(newItem);
      }
    }
    
    const updatedList = await db.select().from(schema.milestones);
    res.json({ success: true, milestones: updatedList });
  } catch (error) {
    console.error("[API] Failed to update milestones:", error);
    res.status(500).json({ error: "Failed to update milestones" });
  }
});

// Issues & Delays
app.get("/api/issues", async (req, res) => {
  try {
    const { email, role, isDemo } = getUserContext(req);
    const allIssues = await db.select().from(schema.issues);
    if (!email || isDemo) {
      return res.json(allIssues);
    }
    const myIds = await getMyProjectIds(email, role);
    const filtered = allIssues.filter((i: any) => myIds.includes(i.projectId));
    res.json(filtered);
  } catch (error) {
    console.error("[API] Failed to fetch issues:", error);
    res.status(500).json({ error: "Failed to fetch issues" });
  }
});

app.post("/api/issues", async (req, res) => {
  try {
    const { email } = getUserContext(req);
    const issue = {
      ...req.body,
      id: `ISS-${Date.now().toString().slice(-4)}`,
      createdBy: email || req.body.createdBy
    };
    await db.insert(schema.issues).values(issue);
    res.json({ success: true, issue });
  } catch (error) {
    console.error("[API] Failed to record issue:", error);
    res.status(500).json({ error: "Failed to record issue" });
  }
});

app.put("/api/issues/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await db.select().from(schema.issues).where(eq(schema.issues.id, id));
    if (existing.length > 0) {
      const updated = { ...existing[0], ...req.body };
      await db.update(schema.issues).set(updated).where(eq(schema.issues.id, id));
      res.json({ success: true, issue: updated });
    } else {
      res.status(404).json({ success: false, message: "Issue not found" });
    }
  } catch (error) {
    console.error("[API] Failed to update issue:", error);
    res.status(500).json({ error: "Failed to update issue" });
  }
});

// Documents
app.get("/api/documents", async (req, res) => {
  try {
    const { email, role, isDemo } = getUserContext(req);
    const allDocs = await db.select().from(schema.documents);
    if (!email || isDemo) {
      return res.json(allDocs);
    }
    const myIds = await getMyProjectIds(email, role);
    const filtered = allDocs.filter((d: any) => myIds.includes(d.projectId));
    res.json(filtered);
  } catch (error) {
    console.error("[API] Failed to fetch documents:", error);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

app.post("/api/documents", async (req, res) => {
  try {
    const { email } = getUserContext(req);
    const payload = req.body;
    const list = Array.isArray(payload) ? payload : [payload];
    
    const savedItems = [];
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const docItem = {
        ...item,
        id: item.id || `DOC-${Date.now().toString().slice(-4)}-${i}`,
        createdBy: email || item.createdBy
      };
      await db.insert(schema.documents).values(docItem);
      savedItems.push(docItem);
    }
    res.json({ success: true, documents: savedItems });
  } catch (error) {
    console.error("[API] Failed to save documents:", error);
    res.status(500).json({ error: "Failed to save documents" });
  }
});

app.delete("/api/documents/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(schema.documents).where(eq(schema.documents.id, id));
    res.json({ success: true });
  } catch (error) {
    console.error("[API] Failed to delete document:", error);
    res.status(500).json({ error: "Failed to delete document" });
  }
});

// Notifications
app.get("/api/notifications", async (req, res) => {
  try {
    const { email, role, isDemo } = getUserContext(req);
    const allNotifications = await db.select().from(schema.notifications);
    if (!email || isDemo) {
      return res.json(allNotifications);
    }
    const filtered = allNotifications.filter((n: any) => n.createdBy === email);
    if (filtered.length === 0) {
      return res.json([
        { id: `N-${Date.now().toString().slice(-4)}`, title: "Welcome Setup", message: "Your custom construction portal and database has been online secure.", createdAt: new Date().toISOString(), isRead: false }
      ]);
    }
    res.json(filtered);
  } catch (error) {
    console.error("[API] Failed to fetch notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

app.put("/api/notifications/:id/read", async (req, res) => {
  try {
    const { id } = req.params;
    await db.update(schema.notifications).set({ isRead: true }).where(eq(schema.notifications.id, id));
    res.json({ success: true });
  } catch (error) {
    console.error("[API] Failed to mark notification as read:", error);
    res.status(404).json({ success: false, message: "Notification not found" });
  }
});

// Activity logs
app.get("/api/activity-logs", async (req, res) => {
  try {
    const { email, role, isDemo } = getUserContext(req);
    const allLogs = await db.select().from(schema.activityLogs);
    if (!email || isDemo) {
      return res.json(allLogs);
    }
    const filtered = allLogs.filter((log: any) => log.userEmail === email);
    res.json(filtered);
  } catch (error) {
    console.error("[API] Failed to fetch activity logs:", error);
    res.status(500).json({ error: "Failed to fetch activity logs", details: error instanceof Error ? error.message : String(error) });
  }
});

app.post("/api/activity-logs", async (req, res) => {
  try {
    const { email } = getUserContext(req);
    const log = {
      ...req.body,
      id: `LOG-${Date.now().toString().slice(-4)}`,
      createdBy: email || req.body.createdBy
    };
    await db.insert(schema.activityLogs).values(log);
    res.json({ success: true, log });
  } catch (error) {
    console.error("[API] Failed to record activity log:", error);
    res.status(500).json({ error: "Failed to record activity log" });
  }
});

// Start routing config

async function startServer() {
  try {
    console.log("[PostgreSQL] Attempting to connect & verify database in Cloud SQL...");
    const resolvedUser = process.env.SQL_USER || process.env.SQL_ADMIN_USER;
    console.log(`[PostgreSQL] Connection config: host=${process.env.SQL_HOST}, user=${resolvedUser}, db=${process.env.SQL_DB_NAME}`);
    
    // Check and seed initialUsers if empty
    const existingUsers = await db.select().from(schema.users).limit(1);
    if (existingUsers.length === 0 && initialUsers.length > 0) {
      console.log("[PostgreSQL] Seeding admin users...");
      const seededUsers = initialUsers.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone || "",
        role: u.role || "CEO",
        avatarUrl: u.avatarUrl || "",
        cnic: u.cnic || "",
        password: u.password || defaultPassword
      }));
      await db.insert(schema.users).values(seededUsers).onConflictDoNothing();
      console.log("[PostgreSQL] Admin users seeded successfully.");
    }

    // Check and seed initialMaterials if empty
    const existingMaterials = await db.select().from(schema.materials).limit(1);
    if (existingMaterials.length === 0 && initialMaterials.length > 0) {
      console.log("[PostgreSQL] Seeding initial materials...");
      const mappedMaterials = initialMaterials.map(m => ({
        id: m.id,
        name: m.name,
        category: m.category || (m.name.toLowerCase().includes("cement") ? "Cement" : (m.name.toLowerCase().includes("steel") ? "Steel" : "Bricks")),
        currentStock: m.currentStock || m.stockQuantity || 0,
        unit: m.unit || "Units",
        lowStockAlert: m.lowStockAlert || m.alertThreshold || 0,
        createdBy: "system@ambuilders.com"
      }));
      await db.insert(schema.materials).values(mappedMaterials).onConflictDoNothing();
      console.log("[PostgreSQL] Materials seeded successfully.");
    }
    
    console.log("[PostgreSQL] Integration verified on server boot. Stateless server is live.");
  } catch (err) {
    console.error("[PostgreSQL] CRITICAL: Failed to seed or verify database on start.");
    console.error(`[PostgreSQL] Connection Error Details: ${err instanceof Error ? err.message : String(err)}`);
  }

  // Vite middleware for development preview
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`[A.M BUILDERS BACKEND] Running on http://localhost:${PORT}`);
  });
}

startServer();
