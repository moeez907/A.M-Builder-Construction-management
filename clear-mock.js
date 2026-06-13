import fs from 'fs';

let content = fs.readFileSync('src/data/mockData.ts', 'utf8');

// For arrays
content = content.replace(/export const initialUsers: User\[\] = \[([\s\S]*?)\];/g, "export const initialUsers: User[] = [];");
content = content.replace(/export const initialProjects: Project\[\] = \[([\s\S]*?)\];/g, "export const initialProjects: Project[] = [];");
content = content.replace(/export const initialDocuments: ProjectDocument\[\] = \[([\s\S]*?)\];/g, "export const initialDocuments: ProjectDocument[] = [];");
content = content.replace(/export const initialProjectTeam: ProjectTeamMember\[\] = \[([\s\S]*?)\];/g, "export const initialProjectTeam: ProjectTeamMember[] = [];");
content = content.replace(/export const initialMaterials: MaterialItem\[\] = \[([\s\S]*?)\];/g, "export const initialMaterials: MaterialItem[] = [];");
content = content.replace(/export const initialSuppliers: Supplier\[\] = \[([\s\S]*?)\];/g, "export const initialSuppliers: Supplier[] = [];");
content = content.replace(/export const initialSupplierPayments: SupplierPayment\[\] = \[([\s\S]*?)\];/g, "export const initialSupplierPayments: SupplierPayment[] = [];");
content = content.replace(/export const initialWorkers: Worker\[\] = \[([\s\S]*?)\];/g, "export const initialWorkers: Worker[] = [];");
content = content.replace(/export const initialAttendance: WorkerAttendance\[\] = \[([\s\S]*?)\];/g, "export const initialAttendance: WorkerAttendance[] = [];");
content = content.replace(/export const initialWorkerAdvances: WorkerAdvance\[\] = \[([\s\S]*?)\];/g, "export const initialWorkerAdvances: WorkerAdvance[] = [];");
content = content.replace(/export const initialWorkerDeductions: WorkerDeduction\[\] = \[([\s\S]*?)\];/g, "export const initialWorkerDeductions: WorkerDeduction[] = [];");
content = content.replace(/export const initialWorkerPayments: WorkerPayment\[\] = \[([\s\S]*?)\];/g, "export const initialWorkerPayments: WorkerPayment[] = [];");
content = content.replace(/export const initialPurchases: MaterialPurchase\[\] = \[([\s\S]*?)\];/g, "export const initialPurchases: MaterialPurchase[] = [];");
content = content.replace(/export const initialUsage: MaterialUsage\[\] = \[([\s\S]*?)\];/g, "export const initialUsage: MaterialUsage[] = [];");
content = content.replace(/export const initialProgress: DailyProgressReport\[\] = \[([\s\S]*?)\];/g, "export const initialProgress: DailyProgressReport[] = [];");
content = content.replace(/export const initialMedia: ProjectMedia\[\] = \[([\s\S]*?)\];/g, "export const initialMedia: ProjectMedia[] = [];");
content = content.replace(/export const initialExpenses: ProjectExpense\[\] = \[([\s\S]*?)\];/g, "export const initialExpenses: ProjectExpense[] = [];");
content = content.replace(/export const initialClientPayments: ClientPayment\[\] = \[([\s\S]*?)\];/g, "export const initialClientPayments: ClientPayment[] = [];");
content = content.replace(/export const initialMilestones: Milestone\[\] = \[([\s\S]*?)\];/g, "export const initialMilestones: Milestone[] = [];");
content = content.replace(/export const initialIssues: IssueDelay\[\] = \[([\s\S]*?)\];/g, "export const initialIssues: IssueDelay[] = [];");
content = content.replace(/export const initialActivityLogs: ActivityLog\[\] = \[([\s\S]*?)\];/g, "export const initialActivityLogs: ActivityLog[] = [];");
content = content.replace(/export const initialNotifications: Notification\[\] = \[([\s\S]*?)\];/g, "export const initialNotifications: Notification[] = [];");

fs.writeFileSync('src/data/mockData.ts', content);
console.log('Cleared all mock data files.');
