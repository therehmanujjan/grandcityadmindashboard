import React from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  location?: string;
  shift?: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

export interface DashboardStats {
  pendingTasks: number;
  todayMeetings: number;
  pendingPayments: number;
  activeVendors: number;
  monthlyBudget: number;
  budgetUsed: number;
  staffPresent: number;
  totalStaff: number;
  activeProjects: number;
  clientSatisfaction: number;
  dailyPhotoUploads: number;
  shiftsToday: number;
}

export interface Project {
  id: number;
  name: string;
  status: 'Active' | 'Planning' | 'In Progress' | 'On Hold' | 'Completed' | 'Archived';
  progress: number;
  client: string;
  manager: string;
  team: number;
}

export interface Shift {
  id: number;
  employee: string;
  role: string;
  shift: string;
  status: 'On Duty' | 'Present' | 'On Site' | 'Off Duty';
  location: string;
}

export interface Communication {
  id: number;
  project: string;
  user: string;
  message: string;
  time: string;
  unread: number;
}

export interface PhotoLog {
  id: number;
  project: string;
  location: string;
  photos: number;
  uploadedBy: string;
  time: string;
  tags: string[];
  comments?: PhotoComment[];
}

export interface PhotoComment {
  id: number;
  user: string;
  text: string;
  time: string;
}

export interface Task {
  id: number;
  title: string;
  assignee: string;
  project: string;
  priority: 'High' | 'Medium' | 'Low';
  due: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  completion: number;
  subtasks?: TaskSubtask[];
  checklist?: TaskChecklistItem[];
}

export interface Payment {
  id: number;
  vendor: string;
  amount: number;
  type: 'Payable' | 'Receivable';
  due: string;
  status: 'Pending' | 'Approved' | 'Processed' | 'Confirmed' | 'Audit Requested' | 'Amendment Requested';
  project: string;
}

export interface Vendor {
  id: number;
  name: string;
  category: string;
  rating: number;
  activeContracts: number;
  lastPayment: string;
  projects: string[];
  performance: number;
}

export interface TaskSubtask {
  id: number;
  title: string;
  done: boolean;
}

export interface TaskChecklistItem {
  id: number;
  text: string;
  done: boolean;
}

export interface Report {
  id: number;
  type: string;
  project: string;
  date: string;
  status: 'Generated' | 'Pending';
  downloads: number;
}

export interface ClientAccess {
  id: number;
  client: string;
  project: string;
  lastLogin: string;
  reportsViewed: number;
  comments: number;
  notificationsEnabled: boolean;
  status: 'Active' | 'Inactive';
}

export interface FormData {
  [key: string]: any;
  employee?: string;
  role?: string;
  shift?: string;
  location?: string;
  projectName?: string;
  status?: string;
  client?: string;
  manager?: string;
  team?: string;
  project?: string;
  user?: string;
  message?: string;
  photos?: string;
  uploadedBy?: string;
  tags?: string;
  title?: string;
  assignee?: string;
  priority?: string;
  due?: string;
  vendor?: string;
  amount?: string;
  type?: string;
  vendorName?: string;
  category?: string;
  rating?: string;
  contracts?: string;
  projects?: string;
  reportType?: string;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  current: boolean;
}

// Scheduler Types
export interface Property {
  id: number;
  name: string;
  location: string;
  description?: string;
  maintenance_count?: number;
  personnel_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface MaintenanceSchedule {
  id: number;
  property_id: number;
  property_name?: string;
  property_location?: string;
  date: string;
  type: string;
  vendor_id?: number;
  vendor_name: string;
  vendor_category?: string;
  status: 'pending' | 'ongoing' | 'completed';
  requested_time: string;
  start_time?: string;
  end_time?: string;
  description?: string;
  priority: 'Normal' | 'Urgent';
  acknowledgments: Record<string, AcknowledgmentData>;
  created_at?: string;
  updated_at?: string;
}

export interface AcknowledgmentData {
  acknowledged: boolean;
  timestamp?: string;
  name?: string;
}

export interface PersonnelProperty {
  id: number;
  user_id: number;
  property_id: number;
  user_name?: string;
  user_role?: string;
  property_name?: string;
  created_at?: string;
}

export interface SchedulerFilter {
  status: 'all' | 'pending' | 'ongoing' | 'completed';
  propertyId?: number;
  startDate?: string;
  endDate?: string;
}
