'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  location: string;
  shift: string;
  lastLogin: string | null;
}

export default function Users() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<User>>({});
  // Quick Actions: Add Employee modal state
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [empName, setEmpName] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empRole, setEmpRole] = useState('Security');
  const [empLocation, setEmpLocation] = useState('HQ Office');
  const [empShift, setEmpShift] = useState('Day (9AM-5PM)');
  const [empStatus, setEmpStatus] = useState('active');

  // Fetch users from API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmitAddEmployee = async () => {
    const name = empName.trim();
    const email = empEmail.trim();
    
    if (!name) {
      alert('Please enter a name');
      return;
    }
    
    if (!email) {
      alert('Please enter an email');
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          role: empRole.trim() || 'Staff',
          location: empLocation.trim() || 'HQ Office',
          shift: empShift.trim() || 'Day (9AM-5PM)',
          status: empStatus || 'active'
        })
      });

      if (response.ok) {
        const newUser = await response.json();
        setUsers(prev => [...prev, newUser]);
        setShowAddEmployee(false);
        setEmpName('');
        setEmpEmail('');
        setEmpRole('Security');
        setEmpLocation('HQ Office');
        setEmpShift('Day (9AM-5PM)');
        setEmpStatus('active');
        alert('Employee added successfully!');
      } else {
        const error = await response.json();
        alert('Failed to add employee: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Error adding employee. Please try again.');
    }
  };

  const handleExportAttendance = () => {
    const headers = ['Name','Email','Role','Status','Location','Shift','Last Login'];
    const rows = filteredUsers.map(u => [u.name, u.email, u.role, u.status, u.location, u.shift, u.lastLogin || 'Never']);
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
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'on_leave': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleRemoveUser = async (id: number) => {
    if (!confirm('Are you sure you want to remove this user?')) {
      return;
    }

    try {
      const response = await fetch(`/api/users?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(prev => prev.filter(u => u.id !== id));
        alert('User removed successfully!');
      } else {
        const error = await response.json();
        alert('Failed to remove user: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error removing user:', error);
      alert('Error removing user. Please try again.');
    }
  };

  const handleStartEdit = (user: User) => {
    setEditingId(user.id);
    setEditData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      location: user.location,
      shift: user.shift,
    });
  };

  const handleSaveEdit = async (id: number) => {
    try {
      const response = await fetch(`/api/users?id=${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
        setEditingId(null);
        setEditData({});
        alert('User updated successfully!');
      } else {
        const error = await response.json();
        alert('Failed to update user: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const uniqueRoles = ['All', ...Array.from(new Set(users.map(user => user.role)))];
  const uniqueStatuses = ['All', 'active', 'inactive', 'on_leave'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

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
              <p className="text-sm font-medium text-gray-500">Active Users</p>
              <p className="text-lg font-semibold text-gray-900">
                {users.filter(u => u.status === 'active').length}
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
              <p className="text-sm font-medium text-gray-500">On Leave</p>
              <p className="text-lg font-semibold text-gray-900">
                {users.filter(u => u.status === 'on_leave').length}
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
              <p className="text-sm font-medium text-gray-500">Inactive</p>
              <p className="text-lg font-semibold text-gray-900">
                {users.filter(u => u.status === 'inactive').length}
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
                    Last Login
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
                          value={editData.role || ''}
                          onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="Security">Security</option>
                          <option value="Site Manager">Site Manager</option>
                          <option value="Supervisor">Supervisor</option>
                          <option value="Engineer">Engineer</option>
                          <option value="Foreman">Foreman</option>
                          <option value="Worker">Worker</option>
                          <option value="Staff">Staff</option>
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
                          value={editData.status || ''}
                          onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="on_leave">On Leave</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {user.status === 'on_leave' ? 'On Leave' : user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingId === user.id ? (
                        <input
                          type="text"
                          value={editData.location || ''}
                          onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                          className="px-2 py-1 border border-gray-300 rounded text-sm w-full"
                        />
                      ) : (
                        user.location
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingId === user.id ? (
                        <input
                          type="text"
                          value={editData.shift || ''}
                          onChange={(e) => setEditData({ ...editData, shift: e.target.value })}
                          className="px-2 py-1 border border-gray-300 rounded text-sm w-full"
                        />
                      ) : (
                        user.shift
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => alert(`${user.name}\n${user.email}\nRole: ${user.role}\nStatus: ${user.status}\nLocation: ${user.location}\nShift: ${user.shift}`)}
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
                            onClick={() => handleStartEdit(user)}
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
                  <select value={empStatus} onChange={(e) => setEmpStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on_leave">On Leave</option>
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