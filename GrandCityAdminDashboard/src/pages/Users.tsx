'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGrandCityData } from '../hooks/useGrandCityData';

export default function Users() {
  const { shifts, projects, setShifts } = useGrandCityData();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editRole, setEditRole] = useState('');
  const [editStatus, setEditStatus] = useState('');
  // Quick Actions: Add Employee modal state
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [empName, setEmpName] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empRole, setEmpRole] = useState('Security');
  const [empLocation, setEmpLocation] = useState('HQ Office');
  const [empShift, setEmpShift] = useState('Day (9AM-5PM)');
  const [empStatus, setEmpStatus] = useState<'On Duty' | 'Present' | 'On Site' | 'Off Duty'>('Present');

  // Extract unique users from shifts data
  const users = shifts.map(shift => ({
    id: shift.id,
    name: shift.employee,
    email: `${shift.employee.toLowerCase().replace(' ', '.')}@grandcity.com`,
    role: shift.role,
    status: shift.status,
    location: shift.location,
    shift: shift.shift,
    project: projects.find(p => p.name.includes(shift.location.split(' ')[0]))?.name || 'General',
    joinDate: '2024-01-15',
    lastActive: shift.status === 'Present' ? 'Active now' : '2 hours ago'
  }));

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    const matchesStatus = filterStatus === 'All' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleQuickAddEmployee = () => {
    setShowAddEmployee(true);
  };

  const handleSubmitAddEmployee = () => {
    const name = empName.trim();
    if (!name) {
      alert('Please enter a name');
      return;
    }
    const newShift = {
      id: Date.now(),
      employee: name,
      role: empRole.trim() || 'Staff',
      shift: empShift.trim() || 'Day (9AM-5PM)',
      status: empStatus,
      location: empLocation.trim() || 'HQ Office',
    };
    setShifts(prev => [...prev, newShift]);
    setShowAddEmployee(false);
    setEmpName('');
    setEmpEmail('');
    setEmpRole('Security');
    setEmpLocation('HQ Office');
    setEmpShift('Day (9AM-5PM)');
    setEmpStatus('Present');
  };

  const handleExportAttendance = () => {
    const headers = ['Name','Email','Role','Status','Location','Shift','Project','Last Active'];
    const rows = filteredUsers.map(u => [u.name, u.email, u.role, u.status, u.location, u.shift, u.project, u.lastActive]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenScheduleManagement = () => {
    try {
      localStorage.setItem('dashboardTab', 'shifts');
    } catch {}
    router.push('/');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Site Manager': return 'text-purple-600 bg-purple-100';
      case 'Supervisor': return 'text-blue-600 bg-blue-100';
      case 'Engineer': return 'text-green-600 bg-green-100';
      case 'Foreman': return 'text-orange-600 bg-orange-100';
      case 'Worker': return 'text-gray-600 bg-gray-100';
      case 'Security': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present': return 'text-green-600 bg-green-100';
      case 'On Duty': return 'text-blue-600 bg-blue-100';
      case 'On Site': return 'text-purple-600 bg-purple-100';
      case 'On Leave': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleRemoveUser = (id: number) => {
    setShifts(prev => prev.filter(s => s.id !== id));
  };

  const handleStartEdit = (id: number, role: string, status: string) => {
    setEditingId(id);
    setEditRole(role);
    setEditStatus(status);
  };

  const handleSaveEdit = (id: number) => {
    setShifts(prev => prev.map(s => s.id === id ? { ...s, role: editRole, status: editStatus as typeof s.status } : s));
    setEditingId(null);
    setEditRole('');
    setEditStatus('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditRole('');
    setEditStatus('');
  };

  const uniqueRoles = ['All', ...Array.from(new Set(users.map(user => user.role)))];
  const uniqueStatuses = ['All', ...Array.from(new Set(users.map(user => user.status)))];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage staff members, their roles, and current status across all projects.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm">👥</span>
              </div>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Total Staff</p>
              <p className="text-lg font-semibold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm">✅</span>
              </div>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Present Today</p>
              <p className="text-lg font-semibold text-gray-900">
                {users.filter(u => u.status === 'Present' || u.status === 'On Duty').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm">🏗️</span>
              </div>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">On Site</p>
              <p className="text-lg font-semibold text-gray-900">
                {users.filter(u => u.status === 'On Site').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm">⏰</span>
              </div>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Off Duty</p>
              <p className="text-lg font-semibold text-gray-900">
                {users.filter(u => u.status === 'Off Duty').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Users</label>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Role</label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {uniqueRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterRole('All');
                setFilterStatus('All');
              }}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Staff Directory ({filteredUsers.length} users)
          </h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shift
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {user.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === user.id ? (
                        <select
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          {[user.role, 'Security', 'Admin', 'Site Supervisor', 'HR Coordinator', 'Staff'].map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === user.id ? (
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          {[user.status, 'Present', 'On Duty', 'On Site', 'On Leave'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.shift}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.project}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastActive}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => alert(`${user.name} • ${user.email}\nRole: ${user.role}\nStatus: ${user.status}\nLocation: ${user.location}\nShift: ${user.shift}\nProject: ${user.project}`)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        {editingId === user.id ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(user.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleStartEdit(user.id, user.role, user.status)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoveUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">👥</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={handleQuickAddEmployee} className="flex items-center justify-center px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <span className="text-blue-600 mr-2">👤</span>
            <span className="text-sm font-medium text-blue-900">Add New Employee</span>
          </button>
          <button onClick={handleExportAttendance} className="flex items-center justify-center px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <span className="text-green-600 mr-2">📊</span>
            <span className="text-sm font-medium text-green-900">Export Attendance</span>
          </button>
          <button onClick={handleOpenScheduleManagement} className="flex items-center justify-center px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <span className="text-purple-600 mr-2">📅</span>
            <span className="text-sm font-medium text-purple-900">Schedule Management</span>
          </button>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-30" onClick={() => setShowAddEmployee(false)} />
          <div className="relative bg-white w-full max-w-md rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Employee</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input value={empName} onChange={(e) => setEmpName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" placeholder="e.g., Ahmed Ali" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
                <input value={empEmail} onChange={(e) => setEmpEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" placeholder="e.g., ahmed.ali@grandcity.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input value={empRole} onChange={(e) => setEmpRole(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" placeholder="e.g., Security" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input value={empLocation} onChange={(e) => setEmpLocation(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" placeholder="e.g., Main Gate" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
                  <select value={empShift} onChange={(e) => setEmpShift(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded">
                    <option>Day (9AM-5PM)</option>
                    <option>Night (8PM-8AM)</option>
                    <option>Day (8AM-6PM)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={empStatus} onChange={(e) => setEmpStatus(e.target.value as 'On Duty' | 'Present' | 'On Site' | 'Off Duty')} className="w-full px-3 py-2 border border-gray-300 rounded">
                    <option value="Present">Present</option>
                    <option value="On Duty">On Duty</option>
                    <option value="On Site">On Site</option>
                    <option value="Off Duty">Off Duty</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button onClick={() => setShowAddEmployee(false)} className="px-4 py-2 border border-gray-300 rounded text-gray-700">Cancel</button>
              <button onClick={handleSubmitAddEmployee} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add Employee</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}