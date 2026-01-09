import React, { useState } from 'react';
import { FormData } from './types';
import { Calendar, DollarSign, Users, Package, AlertCircle, CheckCircle, Clock, TrendingUp, Building, FileText, Bell, Camera, MessageSquare, BarChart3, UserCheck, MapPin, Upload, Download, Filter, Search, Settings, Shield, Award, Activity, X, Edit, Trash2, Plus } from 'lucide-react';

const GrandCityAdmin = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDate, setSelectedDate] = useState('2025-10-01');
  const [selectedProject, setSelectedProject] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // State management for all features
  const [stats, setStats] = useState({
    pendingTasks: 12,
    todayMeetings: 5,
    pendingPayments: 8,
    activeVendors: 23,
    monthlyBudget: 15000000,
    budgetUsed: 9500000,
    staffPresent: 47,
    totalStaff: 52,
    activeProjects: 8,
    clientSatisfaction: 94,
    dailyPhotoUploads: 145,
    shiftsToday: 18
  });

  const [projects, setProjects] = useState([
    { id: 1, name: 'Kharian Megaproject', status: 'Active', progress: 67, client: 'RUDA', manager: 'Ali Ahmed', team: 15 },
    { id: 2, name: 'Grand City Phase 2', status: 'Active', progress: 45, client: 'Direct', manager: 'Sara Khan', team: 22 },
    { id: 3, name: 'Smart Villas Complex', status: 'Planning', progress: 12, client: 'RDA Investors', manager: 'Usman Tariq', team: 8 },
  ]);

  const [shifts, setShifts] = useState([
    { id: 1, employee: 'Ahmed Ali', role: 'Security', shift: 'Night (8PM-8AM)', status: 'On Duty', location: 'Main Gate' },
    { id: 2, employee: 'Fatima Khan', role: 'Admin', shift: 'Day (9AM-5PM)', status: 'Present', location: 'HQ Office' },
    { id: 3, employee: 'Bilal Raza', role: 'Site Supervisor', shift: 'Day (8AM-6PM)', status: 'On Site', location: 'Kharian' },
    { id: 4, employee: 'Ayesha Malik', role: 'HR Coordinator', shift: 'Day (9AM-5PM)', status: 'Present', location: 'HQ Office' },
  ]);

  const [communications, setCommunications] = useState([
    { id: 1, project: 'Kharian Megaproject', user: 'Ali Ahmed', message: 'Foundation work completed for Block A', time: '2 hours ago', unread: 3 },
    { id: 2, project: 'Grand City Phase 2', user: 'Sara Khan', message: 'Client inspection scheduled for tomorrow', time: '4 hours ago', unread: 0 },
    { id: 3, project: 'Smart Villas Complex', user: 'Usman Tariq', message: 'Blueprint revisions uploaded', time: '5 hours ago', unread: 1 },
  ]);

  const [photoLogs, setPhotoLogs] = useState([
    { id: 1, project: 'Kharian Megaproject', location: 'Block A - Foundation', photos: 12, uploadedBy: 'Ali Ahmed', time: '10:30 AM', tags: ['progress', 'foundation'] },
    { id: 2, project: 'Grand City Phase 2', location: 'Main Entrance', photos: 8, uploadedBy: 'Site Engineer', time: '11:45 AM', tags: ['inspection', 'entrance'] },
    { id: 3, project: 'Smart Villas Complex', location: 'Plot 23-A', photos: 15, uploadedBy: 'Contractor', time: '2:15 PM', tags: ['excavation', 'before'] },
  ]);

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Q4 Budget Approval', assignee: 'Finance Team', project: 'HQ Operations', priority: 'High', due: '2025-10-03', status: 'Pending', completion: 0 },
    { id: 2, title: 'HVAC Maintenance', assignee: 'Ahmad Raza', project: 'HQ Operations', priority: 'Medium', due: '2025-10-02', status: 'In Progress', completion: 60 },
    { id: 3, title: 'Foundation Inspection', assignee: 'Ali Ahmed', project: 'Kharian Megaproject', priority: 'High', due: '2025-10-01', status: 'Completed', completion: 100 },
    { id: 4, title: 'Client Presentation Prep', assignee: 'Sara Khan', project: 'Grand City Phase 2', priority: 'High', due: '2025-10-02', status: 'In Progress', completion: 75 },
  ]);

  const [payments, setPayments] = useState([
    { id: 1, vendor: 'ABC Construction', amount: 2500000, type: 'Payable', due: '2025-10-05', status: 'Pending', project: 'Kharian Megaproject' },
    { id: 2, vendor: 'Client - Plot A-123', amount: 3000000, type: 'Receivable', due: '2025-10-02', status: 'Confirmed', project: 'Grand City Phase 2' },
    { id: 3, vendor: 'Tech Solutions Ltd', amount: 450000, type: 'Payable', due: '2025-10-03', status: 'Approved', project: 'HQ Operations' },
  ]);

  const [vendors, setVendors] = useState([
    { id: 1, name: 'ABC Construction', category: 'Construction', rating: 4.5, activeContracts: 3, lastPayment: '2025-09-28', projects: ['Kharian', 'Phase 2'], performance: 92 },
    { id: 2, name: 'Tech Solutions Ltd', category: 'IT Services', rating: 4.8, activeContracts: 2, lastPayment: '2025-09-25', projects: ['HQ Operations'], performance: 95 },
    { id: 3, name: 'Facility Care Pro', category: 'Maintenance', rating: 4.2, activeContracts: 1, lastPayment: '2025-09-30', projects: ['All Sites'], performance: 88 },
  ]);

  const [reports, setReports] = useState([
    { id: 1, type: 'Daily Progress', project: 'Kharian Megaproject', date: '2025-10-01', status: 'Generated', downloads: 5 },
    { id: 2, type: 'Financial Summary', project: 'All Projects', date: '2025-09-30', status: 'Generated', downloads: 12 },
    { id: 3, type: 'Client Dashboard', project: 'Grand City Phase 2', date: '2025-10-01', status: 'Pending', downloads: 0 },
  ]);

  const [clientAccess, setClientAccess] = useState([
    { id: 1, client: 'RUDA', project: 'Kharian Megaproject', lastLogin: '2 hours ago', reportsViewed: 12, comments: 5, notificationsEnabled: true, status: 'Active' },
    { id: 2, client: 'Direct', project: 'Grand City Phase 2', lastLogin: '5 hours ago', reportsViewed: 8, comments: 2, notificationsEnabled: true, status: 'Active' },
    { id: 3, client: 'RDA Investors', project: 'Smart Villas Complex', lastLogin: '1 day ago', reportsViewed: 3, comments: 0, notificationsEnabled: false, status: 'Active' },
  ]);

  // Modal details state
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsType, setDetailsType] = useState('');

  // Form state
  const [formData, setFormData] = useState<FormData>({});

  // Handler functions
  const handleAddShift = () => {
    const newShift = {
      id: shifts.length + 1,
      employee: formData.employee || 'New Employee',
      role: formData.role || 'Staff',
      shift: formData.shift || 'Day (9AM-5PM)',
      status: 'Present',
      location: formData.location || 'HQ Office'
    };
    setShifts([...shifts, newShift]);
    setShowModal(false);
    setFormData({});
    setStats({...stats, shiftsToday: stats.shiftsToday + 1});
  };

  const handleDeleteShift = (id: number) => {
    setShifts(shifts.filter(s => s.id !== id));
    setStats({...stats, shiftsToday: stats.shiftsToday - 1});
  };

  const handleUpdateShiftStatus = (id: number, newStatus: string) => {
    setShifts(shifts.map(s => s.id === id ? {...s, status: newStatus} : s));
  };

  const handleAddProject = () => {
    const newProject = {
      id: projects.length + 1,
      name: formData.projectName || 'New Project',
      status: formData.status || 'Planning',
      progress: 0,
      client: formData.client || 'TBD',
      manager: formData.manager || 'Unassigned',
      team: parseInt(String(formData.team)) || 0
    };
    setProjects([...projects, newProject]);
    setShowModal(false);
    setFormData({});
    setStats({...stats, activeProjects: stats.activeProjects + 1});
  };

  const handleUpdateProjectProgress = (id: number, increment: number) => {
    setProjects(projects.map(p => {
      if (p.id === id) {
        const newProgress = Math.min(100, Math.max(0, p.progress + increment));
        return {...p, progress: newProgress};
      }
      return p;
    }));
  };

  const handleDeleteProject = (id: number) => {
    setProjects(projects.filter(p => p.id !== id));
    setStats({...stats, activeProjects: stats.activeProjects - 1});
  };

  const handleAddCommunication = () => {
    const newComm = {
      id: communications.length + 1,
      project: formData.project || 'General',
      user: formData.user || 'Admin',
      message: formData.message || 'New message',
      time: 'Just now',
      unread: 0
    };
    setCommunications([newComm, ...communications]);
    setShowModal(false);
    setFormData({});
  };

  const handleMarkAsRead = (id: number) => {
    setCommunications(communications.map(c => c.id === id ? {...c, unread: 0} : c));
  };

  const handleAddPhotoLog = () => {
    const newLog = {
      id: photoLogs.length + 1,
      project: formData.project || 'General',
      location: formData.location || 'Unknown',
      photos: parseInt(String(formData.photos)) || 1,
      uploadedBy: formData.uploadedBy || 'Admin',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : ['general']
    };
    setPhotoLogs([newLog, ...photoLogs]);
    setShowModal(false);
    setFormData({});
    setStats({...stats, dailyPhotoUploads: stats.dailyPhotoUploads + Number(formData.photos ?? 1)});
  };

  const handleAddTask = () => {
    const newTask = {
      id: tasks.length + 1,
      title: formData.title || 'New Task',
      assignee: formData.assignee || 'Unassigned',
      project: formData.project || 'General',
      priority: formData.priority || 'Medium',
      due: formData.due || '2025-10-10',
      status: 'Pending',
      completion: 0
    };
    setTasks([...tasks, newTask]);
    setShowModal(false);
    setFormData({});
    setStats({...stats, pendingTasks: stats.pendingTasks + 1});
  };

  const handleUpdateTaskCompletion = (id: number, newCompletion: number) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        let newStatus = 'Pending';
        if (newCompletion === 100) newStatus = 'Completed';
        else if (newCompletion > 0) newStatus = 'In Progress';
        return {...t, completion: newCompletion, status: newStatus};
      }
      return t;
    }));
  };

  const handleDeleteTask = (id: number) => {
    const task = tasks.find(t => t.id === id);
    setTasks(tasks.filter(t => t.id !== id));
    if (task && task.status !== 'Completed') {
      setStats({...stats, pendingTasks: stats.pendingTasks - 1});
    }
  };

  const handleAddPayment = () => {
    const newPayment = {
      id: payments.length + 1,
      vendor: formData.vendor || 'New Vendor',
      amount: Number(formData.amount) || 0,
      type: formData.type || 'Payable',
      due: formData.due || '2025-10-10',
      status: 'Pending',
      project: formData.project || 'General'
    };
    setPayments([...payments, newPayment]);
    setShowModal(false);
    setFormData({});
    setStats({...stats, pendingPayments: stats.pendingPayments + 1});
  };

  const handleProcessPayment = (id: number) => {
    setPayments(payments.map(p => p.id === id ? {...p, status: 'Processed'} : p));
    setStats({...stats, pendingPayments: stats.pendingPayments - 1});
  };

  const handleApprovePayment = (id: number) => {
    setPayments(payments.map(p => p.id === id ? {...p, status: 'Approved'} : p));
  };

  const handleAddVendor = () => {
    const newVendor = {
      id: vendors.length + 1,
      name: formData.vendorName || 'New Vendor',
      category: formData.category || 'General',
      rating: parseFloat(String(formData.rating)) || 4.0,
      activeContracts: parseInt(String(formData.contracts)) || 0,
      lastPayment: new Date().toISOString().split('T')[0],
      projects: formData.projects ? formData.projects.split(',').map(p => p.trim()) : [],
      performance: Math.round((parseFloat(String(formData.rating)) || 4.0) * 20)
    };
    setVendors([...vendors, newVendor]);
    setShowModal(false);
    setFormData({});
    setStats({...stats, activeVendors: stats.activeVendors + 1});
  };

  const handleDeleteVendor = (id: number) => {
    setVendors(vendors.filter(v => v.id !== id));
    setStats({...stats, activeVendors: stats.activeVendors - 1});
  };

  const handleGenerateReport = () => {
    const newReport = {
      id: reports.length + 1,
      type: formData.reportType || 'Custom Report',
      project: formData.project || 'All Projects',
      date: new Date().toISOString().split('T')[0],
      status: 'Generated',
      downloads: 0
    };
    setReports([newReport, ...reports]);
    setShowModal(false);
    setFormData({});
  };

  const handleDownloadReport = (id: number, format: string) => {
    setReports(reports.map(r => r.id === id ? {...r, downloads: r.downloads + 1} : r));
    alert(`Downloading report in ${format} format...`);
  };

  // Modal Component
  const Modal = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={() => {setShowModal(false); setFormData({});}} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );

  // Form Components
  const renderShiftForm = () => (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Employee Name"
        className="w-full border border-gray-300 rounded px-3 py-2"
        value={formData.employee || ''}
        onChange={(e) => setFormData({...formData, employee: e.target.value})}
      />
      <input
        type="text"
        placeholder="Role"
        className="w-full border border-gray-300 rounded px-3 py-2"
        value={formData.role || ''}
        onChange={(e) => setFormData({...formData, role: e.target.value})}
      />
      <select
        className="w-full border border-gray-300 rounded px-3 py-2"
        value={formData.shift || ''}
        onChange={(e) => setFormData({...formData, shift: e.target.value})}
      >
        <option value="">Select Shift</option>
        <option value="Day (9AM-5PM)">Day (9AM-5PM)</option>
        <option value="Day (8AM-6PM)">Day (8AM-6PM)</option>
        <option value="Night (8PM-8AM)">Night (8PM-8AM)</option>
        <option value="Flexible">Flexible</option>
      </select>
      <input
        type="text"
        placeholder="Location"
        className="w-full border border-gray-300 rounded px-3 py-2"
        value={formData.location || ''}
        onChange={(e) => setFormData({...formData, location: e.target.value})}
      />
      <button
        onClick={handleAddShift}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Add Shift
      </button>
    </div>
  );

  const renderProjectForm = () => (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Project Name"
        className="w-full border border-gray-300 rounded px-3 py-2"
        value={formData.projectName || ''}
        onChange={(e) => setFormData({...formData, projectName: e.target.value})}
      />
      <input
        type="text"
        placeholder="Client"
        className="w-full border border-gray-300 rounded px-3 py-2"
        value={formData.client || ''}
        onChange={(e) => setFormData({...formData, client: e.target.value})}
      />
      <input
        type="text"
        placeholder="Manager"
        className="w-full border border-gray-300 rounded px-3 py-2"
        value={formData.manager || ''}
        onChange={(e) => setFormData({...formData, manager: e.target.value})}
      />
      <input
        type="number"
        placeholder="Team Size"
        className="w-full border border-gray-300 rounded px-3 py-2"
        value={formData.team || ''}
        onChange={(e) => setFormData({...formData, team: e.target.value})}
      />
      <select
        className="w-full border border-gray-300 rounded px-3 py-2"
        value={formData.status || ''}
        onChange={(e) => setFormData({...formData, status: e.target.value})}
      >
        <option value="">Select Status</option>
        <option value="Planning">Planning</option>
        <option value="Active">Active</option>
        <option value="On Hold">On Hold</option>
        <option value="Completed">Completed</option>
      </select>
      <button
        onClick={handleAddProject}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Add Project
      </button>
    </div>
  );

  const renderCommunicationForm = () => (
    <div className="space-y-4">
      <select
        className="w-full border border-gray-300 rounded px-3 py-2"
        value={formData.project || ''}
        onChange={(e) => setFormData({...formData, project: e.target.value})}
      >
        <option value="">Select Project</option>
        {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
      </select>
      <input
        type="text"
        placeholder="Your Name"
        className="w-full border border-gray-300 rounded px-3 py-2"
        value={formData.user || ''}
        onChange={(e) => setFormData({...formData, user: e.target.value})}
      />
      <textarea
        placeholder="Message"
        className="w-full border border-gray-300 rounded px-3 py-2 h-24"
        value={formData.message || ''}
        onChange={(e) => setFormData({...formData, message: e.target.value})}
      />
      <button
        onClick={handleAddCommunication}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Send Message
      </button>
    </div>
  );

  const renderPhotoForm = () => (
    <div className="space-y-4">
      <select
        className="w-full border border-gray-300 rounded px-3 py-2"
        value={formData.project || ''}
        onChange={(e) => setFormData({...formData, project: e.target.value})}
      >
        <option value="">Select Project</option>
        {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
      </select>
      <input
        type="text"
        placeholder="Location"
        className="w-full border border-gray-300 rounded px-3 py-2"
        value={formData.location || ''}
        onChange={(e) => setFormData({...formData, location: e.target.value})}
      />
      <input
        type="number"
        placeholder="Number of Photos"
        className="w-full border border-gray-300 rounded px-3 py-2"
        value={formData.photos || ''}
        onChange={(e) => setFormData({...formData, photos: e.target.value})}
      />
      <input
        type="text"
        placeholder="Uploaded By"
        className="w-full border border-gray-300 rounded px-3 py-2"
        value={formData.uploadedBy || ''}
        onChange={(e) => setFormData({...formData, uploadedBy: e.target.value})}
      />
      <input
        type="text"
        placeholder="Tags (comma separated)"
        className="w-full border border-gray-300 rounded px-3 py-2"
        value={formData.tags || ''}
        onChange={(e) => setFormData({...formData, tags: e.target.value})}
      />
      <button
        onClick={handleAddPhotoLog}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Upload Photo Log
      </button>
    </div>
  );

  const renderTaskForm = () => (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Task Title"
        className="w-full border border-gray-300 rounded px-3 py-2"
        value={formData.title || ''}
        onChange={(e) => setFormData({...formData, title: e.target.value})}
      />
      <input
        type="text"
        placeholder="Assignee"
        className="w-full border border-gray-300 rounded px-3 py-2"
        value={formData.assignee || ''}
        onChange={(e) => setFormData({...formData, assignee: e.target.value})}
      />
      <select
        className="w-full border border-gray-300 rounded px-3 py-2"
        value={formData.project || ''}
        onChange={(e) => setFormData({...formData, project: e.target.value})}
      >
        <option value="">Select Project</option>
        {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
        <option value="HQ Operations">HQ Operations</option>
      </select>
      <select
        className="w-full border border-gray-300 rounded px-3 py-2"
        value={formData.priority || ''}
        onChange={(e) => setFormData({...formData, priority: e.target.value})}
      >
        <option value="">Select Priority</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <input
        type="date"
        className="w-full border border-gray-300 rounded px-3 py-2"
        value={formData.due || ''}
        onChange={(e) => setFormData({...formData, due: e.target.value})}
      />
      <button
        onClick={handleAddTask}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Create Task
      </button>
    </div>
  );

  const renderPaymentForm = () => (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Vendor/Client Name"
        className="w-full border border-gray-300 rounded px-3 py-2"
        value={formData.vendor || ''}
        onChange={(e) => setFormData({...formData, vendor: e.target.value})}
      />
      <input
        type="number"
        placeholder="Amount (PKR)"
        className="w-full border border-gray-300 rounded px-3 py-2"
        value={formData.amount || ''}
        onChange={(e) => setFormData({...formData, amount: e.target.value})}
      />
      <select
        className="w-full border border-gray-300 rounded px-3 py-2"
        value={formData.type || ''}
        onChange={(e) => setFormData({...formData, type: e.target.value})}
      >
        <option value="">Select Type</option>
        <option value="Payable">Payable</option>
        <option value="Receivable">Receivable</option>
      </select>
      <select
        className="w-full border border-gray-300 rounded px-3 py-2"
        value={formData.project || ''}
        onChange={(e) => setFormData({...formData, project: e.target.value})}
      >
        <option value="">Select Project</option>
        {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
        <option value="HQ Operations">HQ Operations</option>
      </select>
      <input
        type="date"
        className="w-full border border-gray-300 rounded px-3 py-2"
        value={formData.due || ''}
        onChange={(e) => setFormData({...formData, due: e.target.value})}
      />
      <button
        onClick={handleAddPayment}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Add Payment
      </button>
    </div>
  );

  const renderVendorForm = () => (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Vendor Name"
        className="w-full border border-gray-300 rounded px-3 py-2"
        value={formData.vendorName || ''}
        onChange={(e) => setFormData({...formData, vendorName: e.target.value})}
      />
      <select
        className="w-full border border-gray-300 rounded px-3 py-2"
        value={formData.category || ''}
        onChange={(e) => setFormData({...formData, category: e.target.value})}
      >
        <option value="">Select Category</option>
        <option value="Construction">Construction</option>
        <option value="IT Services">IT Services</option>
        <option value="Maintenance">Maintenance</option>
        <option value="Consultancy">Consultancy</option>
        <option value="Supplies">Supplies</option>
      </select>
      <input
        type="number"
        step="0.1"
        placeholder="Rating (1-5)"
        className="w-full border border-gray-300 rounded px-3 py-2"
        value={formData.rating || ''}
        onChange={(e) => setFormData({...formData, rating: e.target.value})}
      />
      <input
        type="number"
        placeholder="Active Contracts"
        className="w-full border border-gray-300 rounded px-3 py-2"
        value={formData.contracts || ''}
        onChange={(e) => setFormData({...formData, contracts: e.target.value})}
      />
      <input
        type="text"
        placeholder="Projects (comma separated)"
        className="w-full border border-gray-300 rounded px-3 py-2"
        value={formData.projects || ''}
        onChange={(e) => setFormData({...formData, projects: e.target.value})}
      />
      <button
        onClick={handleAddVendor}
        className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
      >
        Add Vendor
      </button>
    </div>
  );

  const renderReportForm = () => (
    <div className="space-y-4">
      <select
        className="w-full border border-gray-300 rounded px-3 py-2"
        value={formData.reportType || ''}
        onChange={(e) => setFormData({...formData, reportType: e.target.value})}
      >
        <option value="">Select Report Type</option>
        <option value="Daily Progress">Daily Progress</option>
        <option value="Financial Summary">Financial Summary</option>
        <option value="Client Dashboard">Client Dashboard</option>
        <option value="Vendor Performance">Vendor Performance</option>
        <option value="Team Productivity">Team Productivity</option>
      </select>
      <select
        className="w-full border border-gray-300 rounded px-3 py-2"
        value={formData.project || ''}
        onChange={(e) => setFormData({...formData, project: e.target.value})}
      >
        <option value="">Select Project</option>
        <option value="All Projects">All Projects</option>
        {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
      </select>
      <button
        onClick={handleGenerateReport}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Generate Report
      </button>
    </div>
  );

  // Render Functions
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('tasks')}>
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <CheckCircle className="w-6 h-6 text-blue-500" />
              <p className="text-2xl font-bold text-blue-900">{stats.pendingTasks}</p>
            </div>
            <p className="text-xs text-blue-600 font-medium">Pending Tasks</p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('projects')}>
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <Building className="w-6 h-6 text-green-500" />
              <p className="text-2xl font-bold text-green-900">{stats.activeProjects}</p>
            </div>
            <p className="text-xs text-green-600 font-medium">Active Projects</p>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('payments')}>
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <DollarSign className="w-6 h-6 text-orange-500" />
              <p className="text-2xl font-bold text-orange-900">{stats.pendingPayments}</p>
            </div>
            <p className="text-xs text-orange-600 font-medium">Pending Payments</p>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('workforce')}>
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <Users className="w-6 h-6 text-purple-500" />
              <p className="text-2xl font-bold text-purple-900">{stats.staffPresent}/{stats.totalStaff}</p>
            </div>
            <p className="text-xs text-purple-600 font-medium">Staff Present</p>
          </div>
        </div>

        <div className="bg-pink-50 border border-pink-200 rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('photos')}>
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <Camera className="w-6 h-6 text-pink-500" />
              <p className="text-2xl font-bold text-pink-900">{stats.dailyPhotoUploads}</p>
            </div>
            <p className="text-xs text-pink-600 font-medium">Photos Today</p>
          </div>
        </div>

        <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('clients')}>
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <Award className="w-6 h-6 text-teal-500" />
              <p className="text-2xl font-bold text-teal-900">{stats.clientSatisfaction}%</p>
            </div>
            <p className="text-xs text-teal-600 font-medium">Client Satisfaction</p>
          </div>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Monthly Budget Overview
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Budget:</span>
            <span className="font-semibold">PKR {stats.monthlyBudget.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 cursor-pointer" onClick={() => {
            const newUsed = Math.min(stats.monthlyBudget, stats.budgetUsed + 500000);
            setStats({...stats, budgetUsed: newUsed});
          }}>
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all" 
              style={{ width: `${(stats.budgetUsed / stats.monthlyBudget) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Used: PKR {stats.budgetUsed.toLocaleString()}</span>
            <span className="text-green-600 font-medium">Remaining: PKR {(stats.monthlyBudget - stats.budgetUsed).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Projects Overview */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Building className="w-5 h-5" />
          Active Projects
        </h3>
        <div className="space-y-3">
          {projects.map(project => (
            <div key={project.id} className="border-l-4 border-blue-500 bg-blue-50 p-3 rounded-r">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{project.name}</h4>
                  <p className="text-sm text-gray-600">Manager: {project.manager} | Team: {project.team}</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">{project.status}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2 cursor-pointer" onClick={() => handleUpdateProjectProgress(project.id, 5)}>
                <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${project.progress}%` }}></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">{project.progress}% Complete (Click to increase)</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWorkforce = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Workforce & Shift Management</h3>
        <button onClick={() => {setShowModal(true); setModalType('shift');}} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Shift
        </button>
      </div>

      {/* Shift Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">On Duty Now</p>
              <p className="text-3xl font-bold text-green-900">{shifts.filter(s => s.status === 'On Duty' || s.status === 'Present' || s.status === 'On Site').length}</p>
            </div>
            <UserCheck className="w-10 h-10 text-green-500" />
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Shifts Today</p>
              <p className="text-3xl font-bold text-blue-900">{stats.shiftsToday}</p>
            </div>
            <Clock className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Attendance Rate</p>
              <p className="text-3xl font-bold text-purple-900">{Math.round((stats.staffPresent / stats.totalStaff) * 100)}%</p>
            </div>
            <Activity className="w-10 h-10 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search employees..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Shift List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Employee</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Shift</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Location</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {shifts.filter(s => s.employee.toLowerCase().includes(searchTerm.toLowerCase()) || s.role.toLowerCase().includes(searchTerm.toLowerCase())).map(shift => (
                <tr key={shift.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{shift.employee}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{shift.role}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{shift.shift}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {shift.location}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={shift.status}
                      onChange={(e) => handleUpdateShiftStatus(shift.id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${
                        shift.status === 'On Duty' ? 'bg-green-100 text-green-700' :
                        shift.status === 'Present' ? 'bg-blue-100 text-blue-700' :
                        shift.status === 'On Site' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <option value="Present">Present</option>
                      <option value="On Duty">On Duty</option>
                      <option value="On Site">On Site</option>
                      <option value="Absent">Absent</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDeleteShift(shift.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Project Management</h3>
        <button onClick={() => {setShowModal(true); setModalType('project');}} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {projects.map(project => (
        <div key={project.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="font-semibold text-lg text-gray-900">{project.name}</h4>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  {project.status}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                <div>
                  <p className="text-gray-500">Client</p>
                  <p className="font-semibold text-gray-900">{project.client}</p>
                </div>
                <div>
                  <p className="text-gray-500">Manager</p>
                  <p className="font-semibold text-gray-900">{project.manager}</p>
                </div>
                <div>
                  <p className="text-gray-500">Team Size</p>
                  <p className="font-semibold text-gray-900">{project.team} members</p>
                </div>
                <div>
                  <p className="text-gray-500">Progress</p>
                  <p className="font-semibold text-gray-900">{project.progress}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <button onClick={() => handleUpdateProjectProgress(project.id, -5)} className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs">-5%</button>
                <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all" 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <button onClick={() => handleUpdateProjectProgress(project.id, 5)} className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs">+5%</button>
              </div>
            </div>
            <button onClick={() => handleDeleteProject(project.id)} className="ml-4 text-red-600 hover:text-red-800">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setActiveTab('communications')} className="flex-1 bg-blue-50 text-blue-600 py-2 rounded hover:bg-blue-100 text-sm font-medium flex items-center justify-center gap-1">
              <MessageSquare className="w-4 h-4" />
              Communications
            </button>
            <button onClick={() => setActiveTab('photos')} className="flex-1 bg-green-50 text-green-600 py-2 rounded hover:bg-green-100 text-sm font-medium flex items-center justify-center gap-1">
              <Camera className="w-4 h-4" />
              Photo Logs
            </button>
            <button onClick={() => setActiveTab('reports')} className="flex-1 bg-purple-50 text-purple-600 py-2 rounded hover:bg-purple-100 text-sm font-medium flex items-center justify-center gap-1">
              <FileText className="w-4 h-4" />
              Reports
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCommunications = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Project Communications Hub</h3>
        <div className="flex gap-2">
          <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm">
            <option value="all">All Projects</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button onClick={() => {setShowModal(true); setModalType('communication');}} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Message
          </button>
        </div>
      </div>

      {communications.filter(c => selectedProject === 'all' || c.project === projects.find(p => p.id === parseInt(selectedProject))?.name).map(comm => (
        <div key={comm.id} className="bg-white border-l-4 border-blue-500 border-t border-r border-b border-gray-200 rounded-r-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900">{comm.user}</span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{comm.project}</span>
              </div>
              <p className="text-gray-700">{comm.message}</p>
              <p className="text-xs text-gray-500 mt-1">{comm.time}</p>
            </div>
            {comm.unread > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium cursor-pointer hover:bg-red-600" onClick={() => handleMarkAsRead(comm.id)}>
                {comm.unread} new
              </span>
            )}
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={() => alert(`Replying to ${comm.user}...`)} className="text-sm text-blue-600 hover:text-blue-800 font-medium">Reply</button>
            <button onClick={() => alert(`Viewing thread for: ${comm.message}`)} className="text-sm text-gray-600 hover:text-gray-800 font-medium">View Thread</button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPhotoLogs = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Daily Photo Logs</h3>
        <button onClick={() => {setShowModal(true); setModalType('photo');}} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Upload Photos
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {photoLogs.map(log => (
          <div key={log.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3 mb-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Camera className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">{log.project}</h4>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {log.location}
                </p>
              </div>
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                {log.photos} photos
              </span>
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {log.tags.map(tag => (
                <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
              <span>By {log.uploadedBy}</span>
              <span>{log.time}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => alert(`Viewing ${log.photos} photos from ${log.location}`)} className="flex-1 bg-blue-50 text-blue-600 py-2 rounded hover:bg-blue-100 text-sm font-medium">
                View Photos
              </button>
              <button onClick={() => alert(`Comparing before/after for ${log.location}`)} className="flex-1 bg-green-50 text-green-600 py-2 rounded hover:bg-green-100 text-sm font-medium">
                Compare B/A
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTasks = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Task & Workflow Management</h3>
        <button onClick={() => {setShowModal(true); setModalType('task');}} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {tasks.map(task => (
        <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-gray-900">{task.title}</h4>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  task.priority === 'High' ? 'bg-red-100 text-red-700' :
                  task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {task.priority}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600 mb-2">
                <span>Assignee: {task.assignee}</span>
                <span>Project: {task.project}</span>
                <span>Due: {task.due}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleUpdateTaskCompletion(task.id, Math.max(0, task.completion - 10))} className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs">-10%</button>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${task.completion === 100 ? 'bg-green-500' : 'bg-blue-600'}`}
                    style={{ width: `${task.completion}%` }}
                  ></div>
                </div>
                <button onClick={() => handleUpdateTaskCompletion(task.id, Math.min(100, task.completion + 10))} className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs">+10%</button>
              </div>
              <p className="text-xs text-gray-600 mt-1">{task.completion}% Complete</p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                task.status === 'Completed' ? 'bg-green-100 text-green-700' :
                task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {task.status}
              </span>
              <button onClick={() => handleDeleteTask(task.id)} className="text-red-600 hover:text-red-800">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Payment Management</h3>
        <button onClick={() => {setShowModal(true); setModalType('payment');}} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Payment
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600 font-medium mb-1">Total Payables</p>
          <p className="text-2xl font-bold text-red-900">
            PKR {payments.filter(p => p.type === 'Payable').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-600 font-medium mb-1">Total Receivables</p>
          <p className="text-2xl font-bold text-green-900">
            PKR {payments.filter(p => p.type === 'Receivable').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
          </p>
        </div>
      </div>
      
      {payments.map(payment => (
        <div key={payment.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="font-semibold text-gray-900">{payment.vendor}</h4>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  payment.type === 'Payable' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                  {payment.type}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  PKR {payment.amount.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Due: {payment.due}
                </span>
                <span className="flex items-center gap-1">
                  <Building className="w-4 h-4" />
                  {payment.project}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                payment.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                payment.status === 'Approved' ? 'bg-blue-100 text-blue-700' :
                payment.status === 'Processed' ? 'bg-purple-100 text-purple-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {payment.status}
              </span>
              {payment.status === 'Pending' && (
                <button onClick={() => handleApprovePayment(payment.id)} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                  Approve
                </button>
              )}
              {payment.status === 'Approved' && payment.type === 'Payable' && (
                <button onClick={() => handleProcessPayment(payment.id)} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                  Process
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderVendors = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Vendor Management</h3>
        <button onClick={() => {setShowModal(true); setModalType('vendor');}} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Vendor
        </button>
      </div>
      
      {vendors.map(vendor => (
        <div key={vendor.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="font-semibold text-lg text-gray-900">{vendor.name}</h4>
              <p className="text-sm text-gray-600">{vendor.category}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500 text-lg">★</span>
                <span className="font-semibold">{vendor.rating}</span>
              </div>
              <button onClick={() => handleDeleteVendor(vendor.id)} className="text-red-600 hover:text-red-800">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-3">
            <div>
              <p className="text-gray-600">Active Contracts</p>
              <p className="font-semibold text-gray-900">{vendor.activeContracts}</p>
            </div>
            <div>
              <p className="text-gray-600">Last Payment</p>
              <p className="font-semibold text-gray-900">{vendor.lastPayment}</p>
            </div>
            <div>
              <p className="text-gray-600">Projects</p>
              <p className="font-semibold text-gray-900">{vendor.projects.join(', ')}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button onClick={() => alert(`Viewing details for ${vendor.name}`)} className="flex-1 bg-blue-50 text-blue-600 py-2 rounded hover:bg-blue-100 text-sm font-medium">
              View Details
            </button>
            <button onClick={() => alert(`Creating new contract for ${vendor.name}`)} className="flex-1 bg-green-50 text-green-600 py-2 rounded hover:bg-green-100 text-sm font-medium">
              New Contract
            </button>
            <button onClick={() => alert(`Viewing performance for ${vendor.name}`)} className="flex-1 bg-purple-50 text-purple-600 py-2 rounded hover:bg-purple-100 text-sm font-medium">
              Performance
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderReports = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Reports & Analytics</h3>
        <button onClick={() => {setShowModal(true); setModalType('report');}} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Generate Report
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Reports Generated</p>
              <p className="text-3xl font-bold text-blue-900">{reports.length}</p>
            </div>
            <BarChart3 className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Total Downloads</p>
              <p className="text-3xl font-bold text-green-900">{reports.reduce((sum, r) => sum + r.downloads, 0)}</p>
            </div>
            <Download className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Client Access</p>
              <p className="text-3xl font-bold text-purple-900">89%</p>
            </div>
            <Shield className="w-10 h-10 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Reports List */}
      {reports.map(report => (
        <div key={report.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-gray-900">{report.type}</h4>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  report.status === 'Generated' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {report.status}
                </span>
              </div>
              <div className="flex gap-4 text-sm text-gray-600">
                <span>Project: {report.project}</span>
                <span>Date: {report.date}</span>
                <span>Downloads: {report.downloads}</span>
              </div>
            </div>
            {report.status === 'Generated' && (
              <div className="flex gap-2">
                <button onClick={() => handleDownloadReport(report.id, 'PDF')} className="bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100 text-sm font-medium flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  PDF
                </button>
                <button onClick={() => handleDownloadReport(report.id, 'Excel')} className="bg-green-50 text-green-600 px-3 py-1 rounded hover:bg-green-100 text-sm font-medium flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  Excel
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Analytics & Insights</h3>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow">
          <p className="text-sm opacity-90 mb-1">Time Saved Daily</p>
          <p className="text-3xl font-bold">2.8 hrs</p>
          <p className="text-xs opacity-75 mt-2">Per project average</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow">
          <p className="text-sm opacity-90 mb-1">Disputes Reduced</p>
          <p className="text-3xl font-bold">73%</p>
          <p className="text-xs opacity-75 mt-2">vs. previous quarter</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow">
          <p className="text-sm opacity-90 mb-1">Client Referrals</p>
          <p className="text-3xl font-bold">+42%</p>
          <p className="text-xs opacity-75 mt-2">YoY growth</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow">
          <p className="text-sm opacity-90 mb-1">Project Velocity</p>
          <p className="text-3xl font-bold">1.4x</p>
          <p className="text-xs opacity-75 mt-2">Faster completion</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Project Progress Overview
          </h4>
          <div className="space-y-3">
            {projects.map(project => (
              <div key={project.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{project.name}</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 cursor-pointer" onClick={() => handleUpdateProjectProgress(project.id, 10)}>
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all" 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Productivity Metrics
          </h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Task Completion Rate</span>
                <span className="font-semibold text-green-600">
                  {Math.round((tasks.filter(t => t.status === 'Completed').length / tasks.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${(tasks.filter(t => t.status === 'Completed').length / tasks.length) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Payment Processing Time</span>
                <span className="font-semibold text-blue-600">
                  {Math.round((payments.filter(p => p.status === 'Processed').length / payments.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${(payments.filter(p => p.status === 'Processed').length / payments.length) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Staff Attendance</span>
                <span className="font-semibold text-purple-600">{Math.round((stats.staffPresent / stats.totalStaff) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full transition-all" style={{ width: `${(stats.staffPresent / stats.totalStaff) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderClientPortal = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Client Portal Management</h3>
        <button onClick={() => alert('Grant client access functionality')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Grant Access
        </button>
      </div>

      {/* Client Access Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-600 font-medium mb-1">Active Client Accounts</p>
          <p className="text-3xl font-bold text-blue-900">{projects.length}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-600 font-medium mb-1">Portal Views (Today)</p>
          <p className="text-3xl font-bold text-green-900">67</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-600 font-medium mb-1">Client Satisfaction</p>
          <p className="text-3xl font-bold text-purple-900">{stats.clientSatisfaction}%</p>
        </div>
      </div>

      {/* Client List */}
      {projects.map(project => (
        <div key={project.id} className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="font-semibold text-gray-900">{project.client}</h4>
              <p className="text-sm text-gray-600">{project.name}</p>
            </div>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
              Active
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
            <div>
              <p className="text-gray-500">Last Login</p>
              <p className="font-medium">2 hours ago</p>
            </div>
            <div>
              <p className="text-gray-500">Reports Viewed</p>
              <p className="font-medium">12 this month</p>
            </div>
            <div>
              <p className="text-gray-500">Comments</p>
              <p className="font-medium">5 pending</p>
            </div>
            <div>
              <p className="text-gray-500">Notifications</p>
              <p className="font-medium">Auto-enabled</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => alert(`Opening portal for ${project.client}`)} className="flex-1 bg-blue-50 text-blue-600 py-2 rounded hover:bg-blue-100 text-sm font-medium">
              View Portal
            </button>
            <button onClick={() => alert(`Sending update to ${project.client}`)} className="flex-1 bg-green-50 text-green-600 py-2 rounded hover:bg-green-100 text-sm font-medium">
              Send Update
            </button>
            <button onClick={() => alert(`Managing permissions for ${project.client}`)} className="flex-1 bg-purple-50 text-purple-600 py-2 rounded hover:bg-purple-100 text-sm font-medium">
              Permissions
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Grand City HQ</h1>
            <p className="text-gray-600 text-sm md:text-base">Complete Administrative Platform</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 hover:bg-gray-100 rounded-full" onClick={() => alert('3 new notifications')}>
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full" onClick={() => alert('Settings panel')}>
              <Settings className="w-6 h-6 text-gray-600" />
            </button>
            <div className="text-right hidden md:block">
              <p className="text-sm text-gray-600 font-medium">Admin Dashboard</p>
              <p className="text-xs text-gray-500">{new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg mb-6 overflow-x-auto">
        <div className="flex gap-1 p-2 min-w-max">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'workforce', label: 'Workforce', icon: Users },
            { id: 'projects', label: 'Projects', icon: Building },
            { id: 'communications', label: 'Comms', icon: MessageSquare },
            { id: 'photos', label: 'Photos', icon: Camera },
            { id: 'tasks', label: 'Tasks', icon: CheckCircle },
            { id: 'payments', label: 'Payments', icon: DollarSign },
            { id: 'vendors', label: 'Vendors', icon: Package },
            { id: 'reports', label: 'Reports', icon: FileText },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'clients', label: 'Client Portal', icon: Shield },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'workforce' && renderWorkforce()}
        {activeTab === 'projects' && renderProjects()}
        {activeTab === 'communications' && renderCommunications()}
        {activeTab === 'photos' && renderPhotoLogs()}
        {activeTab === 'tasks' && renderTasks()}
        {activeTab === 'payments' && renderPayments()}
        {activeTab === 'vendors' && renderVendors()}
        {activeTab === 'reports' && renderReports()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'clients' && renderClientPortal()}
      </div>

      {/* Modal */}
      {showModal && (
        <Modal title={
          modalType === 'shift' ? 'Add New Shift' :
          modalType === 'project' ? 'Create New Project' :
          modalType === 'communication' ? 'New Message' :
          modalType === 'photo' ? 'Upload Photo Log' :
          modalType === 'task' ? 'Create New Task' :
          modalType === 'payment' ? 'Add Payment' :
          modalType === 'vendor' ? 'Add New Vendor' :
          modalType === 'report' ? 'Generate Report' :
          'Form'
        }>
          {modalType === 'shift' && renderShiftForm()}
          {modalType === 'project' && renderProjectForm()}
          {modalType === 'communication' && renderCommunicationForm()}
          {modalType === 'photo' && renderPhotoForm()}
          {modalType === 'task' && renderTaskForm()}
          {modalType === 'payment' && renderPaymentForm()}
          {modalType === 'vendor' && renderVendorForm()}
          {modalType === 'report' && renderReportForm()}
        </Modal>
      )}
    </div>
  );
};

export default GrandCityAdmin;