import React from 'react';
import { FormData, Project } from '../types';

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  </div>
);

interface FormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onSubmit: () => void;
  projects?: Project[];
}

export const ShiftForm: React.FC<FormProps> = ({ formData, setFormData, onSubmit }) => (
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
      onClick={onSubmit}
      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
    >
      Add Shift
    </button>
  </div>
);

export const ProjectForm: React.FC<FormProps> = ({ formData, setFormData, onSubmit }) => (
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
      onClick={onSubmit}
      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
    >
      Add Project
    </button>
  </div>
);

export const CommunicationForm: React.FC<FormProps> = ({ formData, setFormData, onSubmit, projects }) => (
  <div className="space-y-4">
    <select
      className="w-full border border-gray-300 rounded px-3 py-2"
      value={formData.project || ''}
      onChange={(e) => setFormData({...formData, project: e.target.value})}
    >
      <option value="">Select Project</option>
      {projects?.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
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
      onClick={onSubmit}
      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
    >
      Send Message
    </button>
  </div>
);

export const PhotoForm: React.FC<FormProps> = ({ formData, setFormData, onSubmit, projects }) => (
  <div className="space-y-4">
    <select
      className="w-full border border-gray-300 rounded px-3 py-2"
      value={formData.project || ''}
      onChange={(e) => setFormData({...formData, project: e.target.value})}
    >
      <option value="">Select Project</option>
      {projects?.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
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
      onClick={onSubmit}
      className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
    >
      Upload Photo Log
    </button>
  </div>
);

export const TaskForm: React.FC<FormProps> = ({ formData, setFormData, onSubmit, projects }) => (
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
      {projects?.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
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
      onClick={onSubmit}
      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
    >
      Add Task
    </button>
  </div>
);

export const PaymentForm: React.FC<FormProps> = ({ formData, setFormData, onSubmit, projects }) => (
  <div className="space-y-4">
    <input
      type="text"
      placeholder="Vendor Name"
      className="w-full border border-gray-300 rounded px-3 py-2"
      value={formData.vendor || ''}
      onChange={(e) => setFormData({...formData, vendor: e.target.value})}
    />
    <input
      type="number"
      placeholder="Amount"
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
      {projects?.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
      <option value="HQ Operations">HQ Operations</option>
    </select>
    <input
      type="date"
      className="w-full border border-gray-300 rounded px-3 py-2"
      value={formData.due || ''}
      onChange={(e) => setFormData({...formData, due: e.target.value})}
    />
    <button
      onClick={onSubmit}
      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
    >
      Add Payment
    </button>
  </div>
);

export const VendorForm: React.FC<FormProps> = ({ formData, setFormData, onSubmit }) => (
  <div className="space-y-4">
    <input
      type="text"
      placeholder="Vendor Name"
      className="w-full border border-gray-300 rounded px-3 py-2"
      value={formData.vendorName || ''}
      onChange={(e) => setFormData({...formData, vendorName: e.target.value})}
    />
    <input
      type="text"
      placeholder="Category"
      className="w-full border border-gray-300 rounded px-3 py-2"
      value={formData.category || ''}
      onChange={(e) => setFormData({...formData, category: e.target.value})}
    />
    <input
      type="number"
      step="0.1"
      min="0"
      max="5"
      placeholder="Rating (0-5)"
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
      onClick={onSubmit}
      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
    >
      Add Vendor
    </button>
  </div>
);

export const ReportForm: React.FC<FormProps> = ({ formData, setFormData, onSubmit, projects }) => (
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
      <option value="Task Summary">Task Summary</option>
    </select>
    <select
      className="w-full border border-gray-300 rounded px-3 py-2"
      value={formData.project || ''}
      onChange={(e) => setFormData({...formData, project: e.target.value})}
    >
      <option value="">Select Project</option>
      <option value="All Projects">All Projects</option>
      {projects?.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
    </select>
    <button
      onClick={onSubmit}
      className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
    >
      Generate Report
    </button>
  </div>
);