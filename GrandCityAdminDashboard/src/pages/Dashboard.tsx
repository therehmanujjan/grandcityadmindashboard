'use client'

import { useState } from 'react';
import { Project } from '../types';
import { useGrandCityData } from '../hooks/useGrandCityData';
import { 
  Modal, 
  ShiftForm, 
  ProjectForm, 
  CommunicationForm, 
  PhotoForm, 
  TaskForm, 
  PaymentForm, 
  VendorForm, 
  ReportForm 
} from '../components/Modal';

export default function Dashboard() {
  const {
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
    setShowModal,
    setModalType,
    setFormData,
    handleAddShift,
    handleDeleteShift,
    handleAddProject,
    handleUpdateProjectProgress,
    handleDeleteProject,
    handleAddCommunication,
    handleMarkAsRead,
    handleMarkAsUnread,
    handleDeleteCommunication,
    handleForwardCommunication,
    handleAddPhotoLog,
    handleAddTask,
    handleUpdateTaskCompletion,
    handleUpdateTaskPriority,
    handleDeleteTask,
    handleAddPayment,
    handleProcessPayment,
    handleApprovePayment,
    handleRequestAuditPayment,
    handleRequestAmendmentPayment,
    handleConfirmReceiptPayment,
    handleDeletePayment,
    handleAddVendor,
    handleDeleteVendor,
    handleUpdateVendorPerformance,
    handleGenerateReport,
    handleDownloadReport,
    setClientAccess,
    setCommunications,
    handleUpdateShiftStatus,
    handleUpdateProjectStatus,
    handleAddPhotoComment,
  } = useGrandCityData();

  const [activeTab, setActiveTab] = useState('overview');
  const [paymentTypeFilter, setPaymentTypeFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [vendorPerfEdits, setVendorPerfEdits] = useState<Record<number, number>>({});
  const [photoCommentInput, setPhotoCommentInput] = useState<Record<number, string>>({});
  const [openCommId, setOpenCommId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [photoTagQuery, setPhotoTagQuery] = useState<string>('');
  const [openPhotoId, setOpenPhotoId] = useState<number | null>(null);
  const [vendorSubScores, setVendorSubScores] = useState<Record<number, { quality: number; timeliness: number; compliance: number }>>({});

  const openModal = (type: string) => {
    setModalType(type);
    setShowModal(true);
    setFormData({});
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({});
  };

  const renderModalContent = () => {
    const formProps = {
      formData,
      setFormData,
      projects
    };

    switch (modalType) {
      case 'shift':
        return <ShiftForm {...formProps} onSubmit={handleAddShift} />;
      case 'project':
        return <ProjectForm {...formProps} onSubmit={handleAddProject} />;
      case 'communication':
        return <CommunicationForm {...formProps} onSubmit={handleAddCommunication} />;
      case 'photo':
        return <PhotoForm {...formProps} onSubmit={handleAddPhotoLog} />;
      case 'task':
        return <TaskForm {...formProps} onSubmit={handleAddTask} />;
      case 'payment':
        return <PaymentForm {...formProps} onSubmit={handleAddPayment} />;
      case 'vendor':
        return <VendorForm {...formProps} onSubmit={handleAddVendor} />;
      case 'report':
        return <ReportForm {...formProps} onSubmit={handleGenerateReport} />;
      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (modalType) {
      case 'shift': return 'Add New Shift';
      case 'project': return 'Add New Project';
      case 'communication': return 'Send Message';
      case 'photo': return 'Upload Photo Log';
      case 'task': return 'Add New Task';
      case 'payment': return 'Add Payment';
      case 'vendor': return 'Add Vendor';
      case 'report': return 'Generate Report';
      default: return 'Add Item';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'In Progress': return 'text-blue-600 bg-blue-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Active': return 'text-green-600 bg-green-100';
      case 'On Duty': return 'text-blue-600 bg-blue-100';
      case 'Present': return 'text-green-600 bg-green-100';
      case 'On Site': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Grand City Admin Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome to your comprehensive project management system
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 sticky top-16 z-10 bg-white border-b">
        <nav className="flex space-x-8 px-2 py-2">
          {[
            { id: 'overview', name: 'Overview' },
            { id: 'projects', name: 'Projects' },
            { id: 'shifts', name: 'Staff & Shifts' },
            { id: 'communications', name: 'Communications' },
            { id: 'photos', name: 'Photo Logs' },
            { id: 'tasks', name: 'Tasks' },
            { id: 'payments', name: 'Payments' },
            { id: 'vendors', name: 'Vendors' },
            { id: 'reports', name: 'Reports' },
            { id: 'clients', name: 'Client Access' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">📋</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending Tasks</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.pendingTasks}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">🏗️</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Projects</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.activeProjects}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">💰</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending Payments</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.pendingPayments}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">👥</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Staff Present</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.staffPresent}/{stats.totalStaff}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Budget Overview */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Budget Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Budget Used</span>
                <span>PKR {(stats.budgetUsed / 1000000).toFixed(1)}M / PKR {(stats.monthlyBudget / 1000000).toFixed(1)}M</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(stats.budgetUsed / stats.monthlyBudget) * 100}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600">
                {((stats.budgetUsed / stats.monthlyBudget) * 100).toFixed(1)}% of monthly budget used
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Communications</h3>
              <div className="space-y-3">
                {communications.slice(0, 5).map((comm) => (
                  <div key={comm.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-xs">💬</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{comm.user}</p>
                      <p className="text-sm text-gray-500 truncate">{comm.message}</p>
                      <p className="text-xs text-gray-400">{comm.time} • {comm.project}</p>
                    </div>
                    {comm.unread > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {comm.unread}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Today's Tasks</h3>
              <div className="space-y-3">
                {tasks.filter(task => task.due === '2025-10-01' || task.due === '2025-10-02').slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className={`w-3 h-3 rounded-full ${
                        task.status === 'Completed' ? 'bg-green-500' : 
                        task.status === 'In Progress' ? 'bg-blue-500' : 'bg-gray-300'
                      }`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{task.title}</p>
                      <p className="text-xs text-gray-500">{task.assignee} • {task.project}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Payments</h2>
            <button
              onClick={() => openModal('payment')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Add Payment
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-3 items-center">
            <select
              className="border border-gray-300 rounded px-3 py-2"
              value={paymentTypeFilter}
              onChange={(e) => setPaymentTypeFilter(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="Payable">Payable</option>
              <option value="Receivable">Receivable</option>
            </select>
            <select
              className="border border-gray-300 rounded px-3 py-2"
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Processed">Processed</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Audit Requested">Audit Requested</option>
              <option value="Amendment Requested">Amendment Requested</option>
            </select>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {payments
                .filter(p => (!paymentTypeFilter || p.type === paymentTypeFilter) && (!paymentStatusFilter || p.status === paymentStatusFilter))
                .map((p) => (
                <li key={p.id} className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{p.vendor}</h3>
                      <p className="text-xs text-gray-500">{p.project} • Due: {p.due}</p>
                      <p className="mt-1 text-sm text-gray-700">Amount: PKR {p.amount.toLocaleString()}</p>
                    </div>
                    <div className="ml-4 flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${p.type === 'Payable' ? 'bg-red-100 text-red-700' : 'bg-indigo-100 text-indigo-700'}`}>
                        {p.type}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        p.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        p.status === 'Approved' ? 'bg-blue-100 text-blue-700' :
                        p.status === 'Processed' ? 'bg-green-100 text-green-700' :
                        p.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' :
                        p.status === 'Audit Requested' ? 'bg-orange-100 text-orange-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {p.status}
                      </span>
                      {/* Workflow actions */}
                      {p.status === 'Pending' && (
                        <button
                          onClick={() => handleApprovePayment(p.id)}
                          className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
                        >
                          Approve
                        </button>
                      )}
                      {p.type === 'Payable' && p.status === 'Approved' && (
                        <button
                          onClick={() => handleProcessPayment(p.id)}
                          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                        >
                          Process
                        </button>
                      )}
                      {p.type === 'Receivable' && p.status === 'Approved' && (
                        <button
                          onClick={() => handleConfirmReceiptPayment(p.id)}
                          className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded"
                        >
                          Confirm Receipt
                        </button>
                      )}
                      {p.status !== 'Audit Requested' && p.status !== 'Processed' && (
                        <button
                          onClick={() => handleRequestAuditPayment(p.id)}
                          className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded"
                        >
                          Request Audit
                        </button>
                      )}
                      {p.status !== 'Amendment Requested' && p.status !== 'Processed' && (
                        <button
                          onClick={() => handleRequestAmendmentPayment(p.id)}
                          className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded"
                        >
                          Request Amendment
                        </button>
                      )}
                      {(p.status === 'Audit Requested' || p.status === 'Amendment Requested') && (
                        <button
                          onClick={() => handleApprovePayment(p.id)}
                          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                        >
                          Return to Approval
                        </button>
                      )}
                      <button
                        onClick={() => handleDeletePayment(p.id)}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Vendors Tab */}
      {activeTab === 'vendors' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Vendors</h2>
            <button
              onClick={() => openModal('vendor')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Add Vendor
            </button>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {vendors.map((v) => (
                <li key={v.id} className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{v.name}</h3>
                      <p className="text-xs text-gray-500">{v.category} • Rating {v.rating}</p>
                      <p className="mt-1 text-sm text-gray-700">Active contracts: {v.activeContracts}</p>
                      <p className="text-xs text-gray-500">Last payment: {v.lastPayment}</p>
                      {v.projects && v.projects.length > 0 && (
                        <p className="text-xs text-gray-500">Projects: {v.projects.join(', ')}</p>
                      )}
                      <p className="text-xs text-gray-500">Score: {Math.round(v.performance)}%</p>
                    </div>
                  <div className="ml-4 flex items-center space-x-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                      Performance {v.performance}%
                    </span>
                    <input
                      type="number"
                      className="w-20 border border-gray-300 rounded px-2 py-1 text-xs"
                      min={0}
                      max={100}
                      value={vendorPerfEdits[v.id] ?? v.performance}
                      onChange={(e) => setVendorPerfEdits(prev => ({ ...prev, [v.id]: parseInt(e.target.value || '0') }))}
                    />
                    <button
                      onClick={() => handleUpdateVendorPerformance(v.id, vendorPerfEdits[v.id] ?? v.performance)}
                      className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
                    >
                      Save
                    </button>
                    <div className="ml-4 flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Sub-scoring</span>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        placeholder="Quality"
                        className="w-16 border border-gray-300 rounded px-2 py-1 text-xs"
                        value={(vendorSubScores[v.id]?.quality ?? '') as any}
                        onChange={(e) => setVendorSubScores(prev => ({
                          ...prev,
                          [v.id]: { ...(prev[v.id] || { quality: 0, timeliness: 0, compliance: 0 }), quality: parseInt(e.target.value || '0') }
                        }))}
                      />
                      <input
                        type="number"
                        min={0}
                        max={100}
                        placeholder="Timeliness"
                        className="w-20 border border-gray-300 rounded px-2 py-1 text-xs"
                        value={(vendorSubScores[v.id]?.timeliness ?? '') as any}
                        onChange={(e) => setVendorSubScores(prev => ({
                          ...prev,
                          [v.id]: { ...(prev[v.id] || { quality: 0, timeliness: 0, compliance: 0 }), timeliness: parseInt(e.target.value || '0') }
                        }))}
                      />
                      <input
                        type="number"
                        min={0}
                        max={100}
                        placeholder="Compliance"
                        className="w-20 border border-gray-300 rounded px-2 py-1 text-xs"
                        value={(vendorSubScores[v.id]?.compliance ?? '') as any}
                        onChange={(e) => setVendorSubScores(prev => ({
                          ...prev,
                          [v.id]: { ...(prev[v.id] || { quality: 0, timeliness: 0, compliance: 0 }), compliance: parseInt(e.target.value || '0') }
                        }))}
                      />
                      <button
                        onClick={() => {
                          const s = vendorSubScores[v.id] || { quality: 0, timeliness: 0, compliance: 0 };
                          const perf = Math.round(((s.quality || 0) + (s.timeliness || 0) + (s.compliance || 0)) / 3);
                          handleUpdateVendorPerformance(v.id, perf);
                        }}
                        className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded"
                      >
                        Apply
                      </button>
                    </div>
                    <button
                      onClick={() => handleDeleteVendor(v.id)}
                      className="text-red-600 hover:text-red-900 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Reports</h2>
            <button
              onClick={() => openModal('report')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Generate Report
            </button>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {reports.map((r) => (
                <li key={r.id} className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{r.type}</h3>
                      <p className="text-xs text-gray-500">{r.project} • {r.date}</p>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 mt-2">
                        {r.status}
                      </span>
                    </div>
                    <div className="ml-4 flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Downloads: {r.downloads}</span>
                      {r.status === 'Generated' ? (
                        <>
                          <button
                            onClick={() => handleDownloadReport(r.id, 'PDF')}
                            className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                          >
                            Download PDF
                          </button>
                          <button
                            onClick={() => handleDownloadReport(r.id, 'Excel')}
                            className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
                          >
                            Download Excel
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400">Report pending generation</span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Client Access Tab */}
      {activeTab === 'clients' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Client Access</h2>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {clientAccess.map((c) => (
                <li key={c.id} className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{c.client}</h3>
                      <p className="text-xs text-gray-500">{c.project} • Last login: {c.lastLogin}</p>
                      <p className="mt-1 text-sm text-gray-700">Reports viewed: {c.reportsViewed} • Comments: {c.comments}</p>
                    </div>
                    <div className="ml-4 flex items-center space-x-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {c.status}
                      </span>
                      <button
                        onClick={() =>
                          setClientAccess(prev => prev.map(item => item.id === c.id ? { ...item, notificationsEnabled: !item.notificationsEnabled } : item))
                        }
                        className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded"
                      >
                        {c.notificationsEnabled ? 'Disable Notifications' : 'Enable Notifications'}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
            <button
              onClick={() => openModal('project')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Add Project
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                    <select
                      value={project.status}
                      onChange={(e) => handleUpdateProjectStatus(project.id, e.target.value as Project['status'])}
                      className="border border-gray-300 rounded px-2 py-1 text-xs"
                    >
                      <option value="Planning">Planning</option>
                      <option value="Active">Active</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Client:</strong> {project.client}</p>
                  <p><strong>Manager:</strong> {project.manager}</p>
                  <p><strong>Team Size:</strong> {project.team}</p>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleUpdateProjectProgress(project.id, 10)}
                    className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
                  >
                    +10%
                  </button>
                  <button
                    onClick={() => handleUpdateProjectProgress(project.id, -10)}
                    className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded"
                  >
                    -10%
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded ml-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shifts Tab */}
      {activeTab === 'shifts' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Staff & Shifts</h2>
            <button
              onClick={() => openModal('shift')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Add Shift
            </button>
          </div>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {shifts.map((shift) => (
                <li key={shift.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-medium">{shift.employee.charAt(0)}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{shift.employee}</div>
                        <div className="text-sm text-gray-500">{shift.role} • {shift.shift}</div>
                        <div className="text-sm text-gray-500">{shift.location}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <select
                        value={shift.status}
                        onChange={(e) => handleUpdateShiftStatus(shift.id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(shift.status)}`}
                      >
                        <option value="Present">Present</option>
                        <option value="On Duty">On Duty</option>
                        <option value="On Site">On Site</option>
                        <option value="Off Duty">Off Duty</option>
                      </select>
                      <button
                        onClick={() => handleDeleteShift(shift.id)}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Communications Tab */}
      {activeTab === 'communications' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Communications</h2>
            <button
              onClick={() => openModal('communication')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Send Message
            </button>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {communications.map((comm) => (
                <li key={comm.id} className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{comm.user}</p>
                      <p className="text-sm text-gray-500 truncate">{comm.message}</p>
                      <p className="text-xs text-gray-400">{comm.time} • {comm.project}</p>
                      {openCommId === comm.id && (
                        <div className="mt-3 space-y-2">
                          <textarea
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            placeholder="Type your reply"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                          />
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                if (!replyText.trim()) return;
                                setCommunications(prev => [
                                  ...prev,
                                  { id: prev.length + 1, project: comm.project, user: 'You', message: replyText.trim(), time: 'Just now', unread: 0 }
                                ]);
                                setReplyText('');
                                setOpenCommId(null);
                              }}
                              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                            >
                              Reply
                            </button>
                            <button
                              onClick={() => setOpenCommId(null)}
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex items-center space-x-2">
                      {comm.unread > 0 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {comm.unread}
                        </span>
                      )}
                      {comm.unread > 0 && (
                        <button
                          onClick={() => handleMarkAsRead(comm.id)}
                          className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
                        >
                          Mark as Read
                        </button>
                      )}
                      {comm.unread === 0 && (
                        <button
                          onClick={() => handleMarkAsUnread(comm.id)}
                          className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded"
                        >
                          Mark as Unread
                        </button>
                      )}
                      <button
                        onClick={() => setOpenCommId(openCommId === comm.id ? null : comm.id)}
                        className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                      >
                        View
                      </button>
                      <button
                        onClick={() => setOpenCommId(comm.id)}
                        className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded"
                      >
                        Reply
                      </button>
                      <button
                        onClick={() => handleForwardCommunication(comm.id, 'HQ Operations')}
                        className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded"
                      >
                        Forward
                      </button>
                      <button
                        onClick={() => handleDeleteCommunication(comm.id)}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Photo Logs Tab */}
      {activeTab === 'photos' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Photo Logs</h2>
            <button
              onClick={() => openModal('photo')}
              className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
            >
              Upload Photo Log
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={photoTagQuery}
              onChange={(e) => setPhotoTagQuery(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm flex-1"
              placeholder="Search tags (e.g., #foundation)"
            />
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {photoLogs
                .filter(log => {
                  if (!photoTagQuery.trim()) return true;
                  const q = photoTagQuery.replace('#','').toLowerCase();
                  return (log.tags || []).some(t => t.toLowerCase().includes(q));
                })
                .map((log) => (
                <li key={log.id} className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{log.project}</h3>
                      <p className="text-xs text-gray-500">{log.location} • {log.time}</p>
                      <p className="mt-1 text-sm text-gray-700">Photos: {log.photos} • Uploaded by: {log.uploadedBy}</p>
                      {log.tags && log.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {log.tags.map((t, i) => (
                            <span key={i} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-2">
                        <button
                          onClick={() => setOpenPhotoId(openPhotoId === log.id ? null : log.id)}
                          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                        >
                          {openPhotoId === log.id ? 'Hide Photos' : 'View Photos'}
                        </button>
                        {openPhotoId === log.id && (
                          <p className="mt-2 text-xs text-gray-500">Viewing {log.photos} photos (preview coming soon)</p>
                        )}
                      </div>
                      {log.comments && log.comments.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs text-gray-500">Comments</p>
                          {log.comments.map(c => (
                            <div key={c.id} className="text-xs text-gray-700">
                              <span className="font-medium">{c.user}:</span> {c.text} <span className="text-gray-400">• {c.time}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="mt-3 flex items-center gap-2">
                        <input
                          type="text"
                          className="flex-1 border border-gray-300 rounded px-3 py-1 text-xs"
                          placeholder="Add a comment"
                          value={photoCommentInput[log.id] || ''}
                          onChange={(e) => setPhotoCommentInput(prev => ({ ...prev, [log.id]: e.target.value }))}
                        />
                        <button
                          onClick={() => {
                            const text = photoCommentInput[log.id] || '';
                            if (!text.trim()) return;
                            handleAddPhotoComment(log.id, text.trim());
                            setPhotoCommentInput(prev => ({ ...prev, [log.id]: '' }));
                          }}
                          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                        >
                          Comment
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Other tabs would follow similar patterns... */}
      {/* For brevity, I'll include a few more key tabs */}

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
            <button
              onClick={() => openModal('task')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Add Task
            </button>
          </div>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {tasks.map((task) => (
                <li key={task.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <select
                          value={task.priority}
                          onChange={(e) => handleUpdateTaskPriority(task.id, e.target.value as any)}
                          className="ml-2 text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        {task.assignee} • {task.project} • Due: {task.due}
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{task.completion}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${task.completion}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex items-center space-x-2">
                      <button
                        onClick={() => handleUpdateTaskCompletion(task.id, Math.min(100, task.completion + 25))}
                        className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
                      >
                        +25%
                      </button>
                      <button
                        onClick={() => handleUpdateTaskCompletion(task.id, Math.max(0, task.completion - 25))}
                        className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded"
                      >
                        -25%
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <Modal title={getModalTitle()} onClose={closeModal}>
          {renderModalContent()}
        </Modal>
      )}
    </div>
  );
}