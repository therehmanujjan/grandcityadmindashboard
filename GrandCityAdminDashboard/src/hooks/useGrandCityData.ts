'use client'

import { useState, useEffect } from 'react';
import {
  DashboardStats,
  Project,
  Shift,
  Communication,
  PhotoLog,
  Task,
  Payment,
  Vendor,
  Report,
  ClientAccess,
  FormData
} from '../types';

export const useGrandCityData = () => {
  // State management for all features
  const [stats, setStats] = useState<DashboardStats>({
    pendingTasks: 0,
    todayMeetings: 0,
    pendingPayments: 0,
    activeVendors: 0,
    monthlyBudget: 0,
    budgetUsed: 0,
    staffPresent: 0,
    totalStaff: 0,
    activeProjects: 0,
    clientSatisfaction: 0,
    dailyPhotoUploads: 0,
    shiftsToday: 0
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [photoLogs, setPhotoLogs] = useState<PhotoLog[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [clientAccess, setClientAccess] = useState<ClientAccess[]>([]);

  // Load all data from database on mount
  useEffect(() => {
    const loadAllData = async () => {
      try {
        // Fetch all data in parallel
        const [
          statsRes,
          projectsRes,
          shiftsRes,
          communicationsRes,
          photoLogsRes,
          tasksRes,
          paymentsRes,
          vendorsRes,
          reportsRes,
          clientAccessRes
        ] = await Promise.all([
          fetch('/api/dashboard-stats'),
          fetch('/api/projects'),
          fetch('/api/shifts'),
          fetch('/api/communications'),
          fetch('/api/photo-logs'),
          fetch('/api/tasks'),
          fetch('/api/payments'),
          fetch('/api/vendors'),
          fetch('/api/reports'),
          fetch('/api/client-access')
        ]);

        // Parse stats
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats({
            pendingTasks: statsData.pending_tasks || 0,
            todayMeetings: statsData.today_meetings || 0,
            pendingPayments: statsData.pending_payments || 0,
            activeVendors: statsData.active_vendors || 0,
            monthlyBudget: Number(statsData.monthly_budget) || 0,
            budgetUsed: Number(statsData.budget_used) || 0,
            staffPresent: statsData.staff_present || 0,
            totalStaff: statsData.total_staff || 0,
            activeProjects: statsData.active_projects || 0,
            clientSatisfaction: statsData.client_satisfaction || 0,
            dailyPhotoUploads: statsData.daily_photo_uploads || 0,
            shiftsToday: statsData.shifts_today || 0
          });
        }

        // Parse projects
        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          setProjects(projectsData.map((p: any) => ({
            id: p.id,
            name: p.name,
            status: p.status,
            progress: p.progress || 0,
            client: p.client,
            manager: p.manager,
            team: p.team || 0
          })));
        }

        // Parse shifts
        if (shiftsRes.ok) {
          const shiftsData = await shiftsRes.json();
          setShifts(shiftsData.map((s: any) => ({
            id: s.id,
            employee: s.employee,
            role: s.role,
            shift: s.shift,
            status: s.status,
            location: s.location
          })));
        }

        // Parse communications
        if (communicationsRes.ok) {
          const commsData = await communicationsRes.json();
          setCommunications(commsData.map((c: any) => ({
            id: c.id,
            project: c.project,
            user: c.user_name,
            message: c.message,
            time: c.time,
            unread: c.unread || 0
          })));
        }

        // Parse photo logs
        if (photoLogsRes.ok) {
          const photoLogsData = await photoLogsRes.json();
          setPhotoLogs(photoLogsData.map((p: any) => ({
            id: p.id,
            project: p.project,
            location: p.location,
            photos: p.photos || 0,
            uploadedBy: p.uploaded_by,
            time: p.time,
            tags: p.tags || []
          })));
        }

        // Parse tasks
        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          setTasks(tasksData.map((t: any) => ({
            id: t.id,
            title: t.title,
            assignee: t.assignee,
            project: t.project,
            priority: t.priority,
            due: t.due,
            status: t.status,
            completion: t.completion || 0
          })));
        }

        // Parse payments
        if (paymentsRes.ok) {
          const paymentsData = await paymentsRes.json();
          setPayments(paymentsData.map((p: any) => ({
            id: p.id,
            vendor: p.vendor,
            amount: Number(p.amount) || 0,
            type: p.type,
            due: p.due,
            status: p.status,
            project: p.project
          })));
        }

        // Parse vendors
        if (vendorsRes.ok) {
          const vendorsData = await vendorsRes.json();
          setVendors(vendorsData.map((v: any) => ({
            id: v.id,
            name: v.name,
            category: v.category,
            rating: Number(v.rating) || 0,
            activeContracts: v.active_contracts || 0,
            lastPayment: v.last_payment,
            projects: v.projects || [],
            performance: v.performance || 0
          })));
        }

        // Parse reports
        if (reportsRes.ok) {
          const reportsData = await reportsRes.json();
          setReports(reportsData.map((r: any) => ({
            id: r.id,
            type: r.type,
            project: r.project,
            date: r.date,
            status: r.status,
            downloads: r.downloads || 0
          })));
        }

        // Parse client access
        if (clientAccessRes.ok) {
          const clientAccessData = await clientAccessRes.json();
          setClientAccess(clientAccessData.map((c: any) => ({
            id: c.id,
            client: c.client,
            project: c.project,
            lastLogin: c.last_login,
            reportsViewed: c.reports_viewed || 0,
            comments: c.comments || 0,
            notificationsEnabled: c.notifications_enabled,
            status: c.status
          })));
        }
      } catch (error) {
        console.error('Error loading data from database:', error);
      }
    };

    loadAllData();
  }, []);

  // Modal and form state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState<FormData>({});
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsType, setDetailsType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('2025-10-01');
  const [selectedProject, setSelectedProject] = useState('all');

  // Handler functions
  const handleAddShift = async () => {
    const shiftData = {
      employee: formData.employee || 'New Employee',
      role: formData.role || 'Staff',
      shift: formData.shift || 'Day (9AM-5PM)',
      status: 'Present',
      location: formData.location || 'HQ Office'
    };

    try {
      const res = await fetch('/api/shifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shiftData)
      });

      if (res.ok) {
        const newShift = await res.json();
        setShifts([...shifts, newShift]);
        setStats({ ...stats, shiftsToday: stats.shiftsToday + 1 });
      }
    } catch (error) {
      console.error('Failed to add shift:', error);
    }

    setShowModal(false);
    setFormData({});
  };

  const handleDeleteShift = async (id: number) => {
    try {
      const res = await fetch(`/api/shifts?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setShifts(shifts.filter(s => s.id !== id));
        setStats({ ...stats, shiftsToday: stats.shiftsToday - 1 });
      }
    } catch (error) {
      console.error('Failed to delete shift:', error);
    }
  };

  const handleUpdateShiftStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/shifts?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setShifts(shifts.map(s => s.id === id ? { ...s, status: newStatus as Shift['status'] } : s));
      }
    } catch (error) {
      console.error('Failed to update shift status:', error);
    }
  };

  const handleAddProject = async () => {
    const projectData = {
      name: formData.projectName || 'New Project',
      status: formData.status || 'Planning',
      progress: 0,
      client: formData.client || 'TBD',
      manager: formData.manager || 'Unassigned',
      team: parseInt(formData.team || '0') || 0
    };

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });

      if (res.ok) {
        const newProject = await res.json();
        setProjects([...projects, newProject]);
        setStats({ ...stats, activeProjects: stats.activeProjects + 1 });
      }
    } catch (error) {
      console.error('Failed to add project:', error);
    }

    setShowModal(false);
    setFormData({});
  };

  const handleUpdateProjectProgress = async (id: number, increment: number) => {
    const project = projects.find(p => p.id === id);
    if (!project) return;

    const newProgress = Math.min(100, Math.max(0, project.progress + increment));

    // Update locally first for immediate feedback
    setProjects(projects.map(p => p.id === id ? { ...p, progress: newProgress } : p));

    // Then sync to database (would need a PATCH endpoint in projects route)
    try {
      await fetch(`/api/projects?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress: newProgress })
      });
    } catch (error) {
      console.error('Failed to update project progress:', error);
    }
  };

  const handleDeleteProject = async (id: number) => {
    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects(projects.filter(p => p.id !== id));
        setStats({ ...stats, activeProjects: stats.activeProjects - 1 });
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const handleAddCommunication = async () => {
    const commData = {
      project: formData.project || 'General',
      user_name: formData.user || 'Admin',
      message: formData.message || 'New message',
      time: 'Just now'
    };

    try {
      const res = await fetch('/api/communications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commData)
      });

      if (res.ok) {
        const newComm = await res.json();
        setCommunications([{
          id: newComm.id,
          project: newComm.project,
          user: newComm.user_name,
          message: newComm.message,
          time: newComm.time,
          unread: newComm.unread || 0
        }, ...communications]);
      }
    } catch (error) {
      console.error('Failed to add communication:', error);
    }

    setShowModal(false);
    setFormData({});
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      const res = await fetch(`/api/communications?id=${id}`, { method: 'PATCH' });
      if (res.ok) {
        setCommunications(communications.map(c => c.id === id ? { ...c, unread: 0 } : c));
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleAddPhotoLog = async () => {
    const photoData = {
      project: formData.project || 'General',
      location: formData.location || 'Unknown',
      photos: parseInt(formData.photos || '1') || 1,
      uploaded_by: formData.uploadedBy || 'Admin',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : ['general']
    };

    try {
      const res = await fetch('/api/photo-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(photoData)
      });

      if (res.ok) {
        const newLog = await res.json();
        setPhotoLogs([{
          id: newLog.id,
          project: newLog.project,
          location: newLog.location,
          photos: newLog.photos,
          uploadedBy: newLog.uploaded_by,
          time: newLog.time,
          tags: newLog.tags || []
        }, ...photoLogs]);
        setStats({ ...stats, dailyPhotoUploads: stats.dailyPhotoUploads + photoData.photos });
      }
    } catch (error) {
      console.error('Failed to add photo log:', error);
    }

    setShowModal(false);
    setFormData({});
  };

  const handleAddTask = async () => {
    if (!formData.title || !formData.assignee || !formData.project || !formData.priority || !formData.due) {
      alert('Please fill in title, assignee, project, priority, and due date.');
      return;
    }

    const taskData = {
      title: formData.title,
      assignee: formData.assignee,
      project: formData.project,
      priority: formData.priority,
      due: formData.due,
      status: 'Pending',
      completion: 0
    };

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });

      if (res.ok) {
        const newTask = await res.json();
        setTasks([...tasks, newTask]);
        setStats({ ...stats, pendingTasks: stats.pendingTasks + 1 });
      }
    } catch (error) {
      console.error('Failed to add task:', error);
    }

    setShowModal(false);
    setFormData({});
  };

  const handleUpdateTaskCompletion = async (id: number, newCompletion: number) => {
    let newStatus: Task['status'] = 'Pending';
    if (newCompletion === 100) newStatus = 'Completed';
    else if (newCompletion > 0) newStatus = 'In Progress';

    setTasks(tasks.map(t => t.id === id ? { ...t, completion: newCompletion, status: newStatus } : t));

    try {
      await fetch(`/api/tasks?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completion: newCompletion, status: newStatus })
      });
    } catch (error) {
      console.error('Failed to update task completion:', error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!confirm('Delete this task? This action cannot be undone.')) return;

    const task = tasks.find(t => t.id === id);

    try {
      const res = await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTasks(tasks.filter(t => t.id !== id));
        if (task && task.status !== 'Completed') {
          setStats({ ...stats, pendingTasks: stats.pendingTasks - 1 });
        }
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleAddPayment = async () => {
    if (!formData.vendor || !formData.amount || !formData.type || !formData.project || !formData.due) {
      alert('Please fill in vendor, amount, type, project, and due date.');
      return;
    }

    const paymentData = {
      vendor: formData.vendor,
      amount: parseInt(formData.amount || '0') || 0,
      type: formData.type,
      due: formData.due,
      status: 'Pending',
      project: formData.project
    };

    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });

      if (res.ok) {
        const newPayment = await res.json();
        setPayments([...payments, newPayment]);
        setStats({ ...stats, pendingPayments: stats.pendingPayments + 1 });
      }
    } catch (error) {
      console.error('Failed to add payment:', error);
    }

    setShowModal(false);
    setFormData({});
  };

  const handleProcessPayment = async (id: number) => {
    try {
      const res = await fetch(`/api/payments?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Processed' })
      });

      if (res.ok) {
        setPayments(payments.map(p => p.id === id ? { ...p, status: 'Processed' } : p));
        setStats({ ...stats, pendingPayments: stats.pendingPayments - 1 });
      }
    } catch (error) {
      console.error('Failed to process payment:', error);
    }
  };

  const handleApprovePayment = async (id: number) => {
    try {
      const res = await fetch(`/api/payments?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Approved' })
      });

      if (res.ok) {
        setPayments(payments.map(p => p.id === id ? { ...p, status: 'Approved' } : p));
      }
    } catch (error) {
      console.error('Failed to approve payment:', error);
    }
  };

  const handleDeletePayment = async (id: number) => {
    if (!confirm('Remove this payment? This action cannot be undone.')) return;

    const payment = payments.find(p => p.id === id);

    try {
      const res = await fetch(`/api/payments?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPayments(payments.filter(p => p.id !== id));
        if (payment && (payment.status === 'Pending' || payment.status === 'Approved' || payment.status === 'Audit Requested' || payment.status === 'Amendment Requested')) {
          setStats({ ...stats, pendingPayments: Math.max(0, stats.pendingPayments - 1) });
        }
      }
    } catch (error) {
      console.error('Failed to delete payment:', error);
    }
  };

  const handleRequestAuditPayment = async (id: number) => {
    try {
      const res = await fetch(`/api/payments?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Audit Requested' })
      });

      if (res.ok) {
        setPayments(payments.map(p => p.id === id ? { ...p, status: 'Audit Requested' } : p));
      }
    } catch (error) {
      console.error('Failed to request audit:', error);
    }
  };

  const handleRequestAmendmentPayment = async (id: number) => {
    try {
      const res = await fetch(`/api/payments?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Amendment Requested' })
      });

      if (res.ok) {
        setPayments(payments.map(p => p.id === id ? { ...p, status: 'Amendment Requested' } : p));
      }
    } catch (error) {
      console.error('Failed to request amendment:', error);
    }
  };

  const handleAddVendor = async () => {
    if (!formData.vendorName || !formData.category) {
      alert('Please provide vendor name and category.');
      return;
    }

    const vendorData = {
      name: formData.vendorName,
      category: formData.category,
      rating: parseFloat(formData.rating || '4.0') || 4.0,
      active_contracts: parseInt(formData.contracts || '0') || 0,
      last_payment: new Date().toISOString().split('T')[0],
      projects: formData.projects ? formData.projects.split(',').map(p => p.trim()) : [],
      performance: 85
    };

    try {
      const res = await fetch('/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendorData)
      });

      if (res.ok) {
        const newVendor = await res.json();
        setVendors([...vendors, {
          id: newVendor.id,
          name: newVendor.name,
          category: newVendor.category,
          rating: newVendor.rating,
          activeContracts: newVendor.active_contracts,
          lastPayment: newVendor.last_payment,
          projects: newVendor.projects,
          performance: newVendor.performance
        }]);
        setStats({ ...stats, activeVendors: stats.activeVendors + 1 });
      }
    } catch (error) {
      console.error('Failed to add vendor:', error);
    }

    setShowModal(false);
    setFormData({});
  };

  const handleDeleteVendor = async (id: number) => {
    if (!confirm('Remove this vendor? This action cannot be undone.')) return;

    try {
      const res = await fetch(`/api/vendors?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setVendors(vendors.filter(v => v.id !== id));
        setStats({ ...stats, activeVendors: stats.activeVendors - 1 });
      }
    } catch (error) {
      console.error('Failed to delete vendor:', error);
    }
  };

  const handleUpdateVendorPerformance = async (id: number, newPerformance: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(newPerformance)));
    setVendors(prev => prev.map(v => v.id === id ? { ...v, performance: clamped } : v));

    // Note: Would need a PATCH endpoint for vendors to update performance
    try {
      await fetch(`/api/vendors?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ performance: clamped })
      });
    } catch (error) {
      console.error('Failed to update vendor performance:', error);
    }
  };

  const handleUpdateClientAccess = (id: number, updates: Partial<ClientAccess>) => {
    setClientAccess(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const handleUpdateTaskPriority = async (id: number, newPriority: Task['priority']) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, priority: newPriority } : t));

    try {
      await fetch(`/api/tasks?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority: newPriority })
      });
    } catch (error) {
      console.error('Failed to update task priority:', error);
    }
  };

  const handleAddSubtask = (taskId: number, title: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      const nextId = (t.subtasks?.length || 0) + 1;
      const newSub = { id: nextId, title, done: false };
      return { ...t, subtasks: [...(t.subtasks || []), newSub] };
    }));
  };

  const handleToggleSubtask = (taskId: number, subId: number) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      return { ...t, subtasks: (t.subtasks || []).map(s => s.id === subId ? { ...s, done: !s.done } : s) };
    }));
  };

  const handleDeleteSubtask = (taskId: number, subId: number) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      return { ...t, subtasks: (t.subtasks || []).filter(s => s.id !== subId) };
    }));
  };

  const handleMarkAsUnread = (id: number) => {
    setCommunications(prev => prev.map(c => c.id === id ? { ...c, unread: 1 } : c));
  };

  const handleDeleteCommunication = (id: number) => {
    if (!confirm('Delete this message?')) return;
    setCommunications(prev => prev.filter(c => c.id !== id));
  };

  const handleForwardCommunication = (id: number, toUser: string) => {
    const original = communications.find(c => c.id === id);
    if (!original) return;
    const forwarded: Communication = {
      id: communications.length + 1,
      project: original.project,
      user: toUser,
      message: `Forwarded: ${original.message}`,
      time: 'Just now',
      unread: 1,
    };
    setCommunications([forwarded, ...communications]);
  };

  const handleUpdateProjectStatus = (id: number, status: Project['status']) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  const handleGenerateReport = async () => {
    const reportData = {
      type: formData.reportType || 'Custom Report',
      project: formData.project || 'All Projects',
      date: new Date().toISOString().split('T')[0],
      status: 'Generated',
      downloads: 0
    };

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData)
      });

      if (res.ok) {
        const newReport = await res.json();
        setReports([newReport, ...reports]);
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
    }

    setShowModal(false);
    setFormData({});
  };

  const handleDownloadReport = async (id: number, format: string) => {
    const currentDownloads = (reports.find(r => r.id === id)?.downloads ?? 0);
    const newDownloads = currentDownloads + 1;
    setReports(reports.map(r => r.id === id ? { ...r, downloads: newDownloads } : r));
    alert(`Downloading report in ${format} format...`);

    try {
      await fetch(`/api/reports?id=${id}`, { method: 'PATCH' });
    } catch (error) {
      console.error('Failed to update report downloads:', error);
    }
  };

  const handleAddPhotoComment = (logId: number, text: string, user: string = 'Admin') => {
    if (!text.trim()) return;
    const comment = {
      id: Date.now(),
      user,
      text: text.trim(),
      time: new Date().toLocaleString()
    };
    setPhotoLogs(prev => prev.map(l => l.id === logId ? { ...l, comments: [...(l.comments || []), comment] } : l));
  };

  const handleConfirmReceiptPayment = async (id: number) => {
    try {
      const res = await fetch(`/api/payments?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Confirmed' })
      });

      if (res.ok) {
        setPayments(payments.map(p => p.id === id ? { ...p, status: 'Confirmed' } : p));
        setStats({ ...stats, pendingPayments: Math.max(0, stats.pendingPayments - 1) });
      }
    } catch (error) {
      console.error('Failed to confirm receipt:', error);
    }
  };

  return {
    // State
    stats,
    projects,
    shifts,
    communications,
    photoLogs,
    tasks,
    payments,
    vendors,
    reports,
    clientAccess,
    showModal,
    modalType,
    formData,
    selectedItem,
    showDetailsModal,
    detailsType,
    searchTerm,
    selectedDate,
    selectedProject,

    // Setters
    setStats,
    setProjects,
    setShifts,
    setCommunications,
    setPhotoLogs,
    setTasks,
    setPayments,
    setVendors,
    setReports,
    setClientAccess,
    setShowModal,
    setModalType,
    setFormData,
    setSelectedItem,
    setShowDetailsModal,
    setDetailsType,
    setSearchTerm,
    setSelectedDate,
    setSelectedProject,

    // Handlers
    handleAddShift,
    handleDeleteShift,
    handleUpdateShiftStatus,
    handleAddProject,
    handleUpdateProjectProgress,
    handleDeleteProject,
    handleAddCommunication,
    handleMarkAsRead,
    handleAddPhotoLog,
    handleAddTask,
    handleUpdateTaskCompletion,
    handleDeleteTask,
    handleAddPayment,
    handleProcessPayment,
    handleApprovePayment,
    handleRequestAuditPayment,
    handleRequestAmendmentPayment,
    handleDeletePayment,
    handleConfirmReceiptPayment,
    handleAddVendor,
    handleDeleteVendor,
    handleUpdateVendorPerformance,
    handleUpdateClientAccess,
    handleUpdateTaskPriority,
    handleAddSubtask,
    handleToggleSubtask,
    handleDeleteSubtask,
    handleGenerateReport,
    handleDownloadReport,
    handleAddPhotoComment,
    handleMarkAsUnread,
    handleDeleteCommunication,
    handleForwardCommunication,
    handleUpdateProjectStatus,
  };
};
