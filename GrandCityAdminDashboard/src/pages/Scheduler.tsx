'use client'

import { useState, useEffect, useCallback } from 'react';
import { Modal } from '@/components/Modal';
import {
  Property,
  MaintenanceSchedule,
  Vendor,
  User,
  SchedulerFilter
} from '@/types';

export default function Scheduler() {
  const [activeTab, setActiveTab] = useState('maintenance');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [properties, setProperties] = useState<Property[]>([]);
  const [maintenances, setMaintenances] = useState<MaintenanceSchedule[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [personnel, setPersonnel] = useState<User[]>([]);
  const [filter, setFilter] = useState<SchedulerFilter>({ status: 'all' });
  const [selectedMaintenance, setSelectedMaintenance] = useState<MaintenanceSchedule | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: number } | null>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [formData, setFormData] = useState<Partial<MaintenanceSchedule>>({
    status: 'pending',
    priority: 'Normal',
  });

  const [propertyForm, setPropertyForm] = useState({ name: '', location: '', description: '' });
  const [vendorForm, setVendorForm] = useState({
    name: '',
    category: '',
    rating: 0,
    active_contracts: 0,
    performance: 0
  });

  const [personnelForm, setPersonnelForm] = useState({
    name: '',
    email: '',
    role: '',
    location: '',
    shift: '',
    status: 'active'
  });
  const [editingPersonnelId, setEditingPersonnelId] = useState<number | null>(null);

  const fetchProperties = useCallback(async () => {
    try {
      const res = await fetch('/api/properties');
      if (res.ok) {
        const data = await res.json();
        setProperties(data);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  }, []);

  const fetchMaintenances = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filter.status !== 'all') params.append('status', filter.status);
      if (filter.propertyId) params.append('propertyId', filter.propertyId.toString());

      const res = await fetch(`/api/maintenance-schedules?${params}`);
      if (res.ok) {
        const data = await res.json();
        setMaintenances(data);
      }
    } catch (error) {
      console.error('Error fetching maintenances:', error);
    }
  }, [filter]);

  const fetchVendors = useCallback(async () => {
    try {
      const res = await fetch('/api/vendors');
      if (res.ok) {
        const data = await res.json();
        setVendors(data.filter((v: Vendor) =>
          ['Electrical', 'Car Maintenance', 'IT Support', 'Maintenance'].includes(v.category)
        ));
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  }, []);

  const fetchPersonnel = useCallback(async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setPersonnel(data.filter((u: User) =>
          ['Electrician', 'Car Maintenance', 'IT Support', 'HR', 'Maintenance'].includes(u.role)
        ));
      }
    } catch (error) {
      console.error('Error fetching personnel:', error);
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchProperties(),
        fetchMaintenances(),
        fetchVendors(),
        fetchPersonnel()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchProperties, fetchMaintenances, fetchVendors, fetchPersonnel]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleAddMaintenance = async () => {
    if (!formData.property_id || !formData.date || !formData.type || !formData.requested_time) {
      alert('Please fill in all required fields: Property, Date, Type, and Requested Time');
      return;
    }

    try {
      const res = await fetch('/api/maintenance-schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        await fetchMaintenances();
        setFormData({ status: 'pending', priority: 'Normal' });
        alert('Maintenance scheduled successfully!');
      } else {
        const error = await res.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error adding maintenance:', error);
      alert('Failed to schedule maintenance');
    }
  };

  const handleAddProperty = async () => {
    if (!propertyForm.name || !propertyForm.location) {
      alert('Please fill in Property Name and Location');
      return;
    }

    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyForm)
      });

      if (res.ok) {
        await fetchProperties();
        setPropertyForm({ name: '', location: '', description: '' });
        alert('Property added successfully!');
      } else {
        const error = await res.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error adding property:', error);
      alert('Failed to add property');
    }
  };

  const handleAddVendor = async () => {
    if (!vendorForm.name || !vendorForm.category) {
      alert('Please fill in Vendor Name and Category');
      return;
    }

    try {
      const res = await fetch('/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendorForm)
      });

      if (res.ok) {
        await fetchVendors();
        setVendorForm({ name: '', category: '', rating: 0, active_contracts: 0, performance: 0 });
        alert('Vendor added successfully!');
      } else {
        const error = await res.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error adding vendor:', error);
      alert('Failed to add vendor');
    }
  };

  const handleSavePersonnel = async () => {
    if (!personnelForm.name || !personnelForm.email || !personnelForm.role) {
      alert('Please fill in Name, Email, and Role');
      return;
    }

    const isEdit = editingPersonnelId !== null;
    const url = isEdit ? `/api/users?id=${editingPersonnelId}` : '/api/users';
    const method = isEdit ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personnelForm)
      });

      if (res.ok) {
        await fetchPersonnel();
        setPersonnelForm({ name: '', email: '', role: '', location: '', shift: '', status: 'active' });
        setEditingPersonnelId(null);
        alert(isEdit ? 'Personnel updated successfully!' : 'Personnel added successfully!');
      } else {
        const error = await res.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving personnel:', error);
      alert('Failed to save personnel');
    }
  };

  const handleEditPersonnel = (p: User) => {
    setPersonnelForm({
      name: p.name || '',
      email: p.email || '',
      role: p.role || '',
      location: p.location || '',
      shift: p.shift || '',
      status: p.status || 'active'
    });
    setEditingPersonnelId(p.id);
    setActiveTab('personnel');
  };

  const handleDeletePersonnel = async (id: number, name: string) => {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchPersonnel();
        if (editingPersonnelId === id) {
          setEditingPersonnelId(null);
          setPersonnelForm({ name: '', email: '', role: '', location: '', shift: '', status: 'active' });
        }
        alert('Personnel deleted successfully!');
      } else {
        const error = await res.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting personnel:', error);
      alert('Failed to delete personnel');
    }
  };

  const handleUpdateStatus = async (status: 'pending' | 'ongoing' | 'completed') => {
    if (!selectedMaintenance) return;

    try {
      const res = await fetch(`/api/maintenance-schedules?id=${selectedMaintenance.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        await fetchMaintenances();
        const updated = await res.json();
        setSelectedMaintenance(updated);
        alert('Status updated successfully!');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || !adminPassword) return;

    try {
      let url = '';
      if (deleteTarget.type === 'maintenance') {
        url = `/api/maintenance-schedules?id=${deleteTarget.id}&password=${encodeURIComponent(adminPassword)}`;
      } else if (deleteTarget.type === 'property') {
        url = `/api/properties?id=${deleteTarget.id}&password=${encodeURIComponent(adminPassword)}`;
      }

      const res = await fetch(url, { method: 'DELETE' });

      if (res.ok) {
        if (deleteTarget.type === 'maintenance') {
          await fetchMaintenances();
          setIsModalOpen(false);
        } else {
          await fetchProperties();
        }
        setIsDeleteModalOpen(false);
        setAdminPassword('');
        setDeleteTarget(null);
        alert('Deleted successfully!');
      } else {
        const error = await res.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete');
    }
  };

  const handleAcknowledge = async (maintenanceId: number, personnelId: number, isHR: boolean = false) => {
    const maintenance = maintenances.find(m => m.id === maintenanceId);
    if (!maintenance) return;

    const key = isHR ? `hr_${personnelId}` : personnelId.toString();
    const person = personnel.find(p => p.id === personnelId);

    const updatedAcknowledgments = {
      ...maintenance.acknowledgments,
      [key]: {
        acknowledged: true,
        timestamp: new Date().toISOString(),
        name: person?.name || 'Unknown'
      }
    };

    try {
      const res = await fetch(`/api/maintenance-schedules?id=${maintenanceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acknowledgments: updatedAcknowledgments })
      });

      if (res.ok) {
        await fetchMaintenances();
        alert('Acknowledged successfully!');
      }
    } catch (error) {
      console.error('Error acknowledging:', error);
      alert('Failed to acknowledge');
    }
  };

  useEffect(() => {
    fetchMaintenances();
  }, [filter, fetchMaintenances]);

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    const today = new Date();

    const days: JSX.Element[] = [];

    // Previous month days
    for (let i = prevLastDay.getDate() - firstDay.getDay() + 1; i <= prevLastDay.getDate(); i++) {
      days.push(
        <div key={`prev-${i}`} className="min-h-20 p-2 border border-gray-200 bg-gray-50 text-gray-400">
          <div className="font-semibold">{i}</div>
        </div>
      );
    }

    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const dateObj = new Date(year, month, i);
      const isToday = dateObj.toDateString() === today.toDateString();

      const dayMaintenances = maintenances.filter(m => {
        const mDate = new Date(m.date);
        return mDate.getDate() === i &&
          mDate.getMonth() === month &&
          mDate.getFullYear() === year &&
          (filter.status === 'all' || m.status === filter.status) &&
          (!filter.propertyId || m.property_id === filter.propertyId);
      });

      days.push(
        <div
          key={i}
          className={`min-h-20 p-2 border border-gray-200 cursor-pointer transition-all hover:border-blue-500 hover:shadow-md ${isToday ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
          onClick={() => {
            // Format date in local timezone to avoid timezone shift issues
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');
            const localDateString = `${year}-${month}-${day}`;
            setFormData({ ...formData, date: localDateString });
            setActiveTab('maintenance');
          }}
        >
          <div className={`font-semibold ${isToday ? 'text-white' : 'text-gray-900'}`}>{i}</div>
          <div className="mt-1 flex gap-1 flex-wrap">
            {dayMaintenances.map(m => (
              <div
                key={m.id}
                className={`w-2 h-2 rounded-full ${m.status === 'pending' ? 'bg-red-500' :
                  m.status === 'ongoing' ? 'bg-orange-500' : 'bg-green-500'
                  }`}
                title={`${m.type} - ${m.status}`}
              />
            ))}
          </div>
        </div>
      );
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(
        <div key={`next-${i}`} className="min-h-20 p-2 border border-gray-200 bg-gray-50 text-gray-400">
          <div className="font-semibold">{i}</div>
        </div>
      );
    }

    return days;
  };

  const renderUpcoming = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = maintenances
      .filter(m => {
        const mDate = new Date(m.date);
        mDate.setHours(0, 0, 0, 0);
        return mDate >= today &&
          (filter.status === 'all' || m.status === filter.status) &&
          (!filter.propertyId || m.property_id === filter.propertyId);
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 10);

    if (upcoming.length === 0) {
      return <div className="text-center text-gray-500 py-8">No upcoming maintenance</div>;
    }

    return upcoming.map(m => (
      <div
        key={m.id}
        className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:shadow-md transition-all mb-2"
        onClick={() => {
          setSelectedMaintenance(m);
          setIsModalOpen(true);
        }}
      >
        <div className="font-semibold text-gray-900">{m.type}</div>
        <div className="text-sm text-gray-600">{m.property_name}</div>
        <div className="text-sm text-gray-600">
          📅 {new Date(m.date).toLocaleDateString()} at {m.requested_time}
        </div>
        <div className="text-sm text-gray-600">👤 {m.vendor_name}</div>
        <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${m.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          m.status === 'ongoing' ? 'bg-orange-100 text-orange-800' :
            'bg-green-100 text-green-800'
          }`}>
          {m.status.toUpperCase()}
        </span>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">🏢 Maintenance Scheduler</h1>
          <p className="text-gray-600 mt-1">Manage property maintenance and vendor coordination</p>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200 rounded-t-lg">
          <nav className="flex space-x-4 px-6">
            {['maintenance', 'properties', 'personnel', 'vendors', 'acknowledgments', 'reports'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-3 border-b-2 font-medium text-sm transition-colors ${activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {tab === 'maintenance' && '📅 Maintenance'}
                {tab === 'properties' && '🏢 Properties'}
                {tab === 'personnel' && '👥 Personnel'}
                {tab === 'vendors' && '🔧 Vendors'}
                {tab === 'acknowledgments' && '✅ Acknowledgments'}
                {tab === 'reports' && '📊 Reports'}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-lg shadow-sm p-6">
          {activeTab === 'maintenance' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar */}
              <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    ← Previous
                  </button>
                  <h2 className="text-xl font-semibold">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h2>
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Next →
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-bold text-blue-600 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {renderCalendar()}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Schedule Form */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-4">📋 Schedule Maintenance</h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
                      <select
                        value={formData.property_id || ''}
                        onChange={(e) => setFormData({ ...formData, property_id: Number(e.target.value) })}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      >
                        <option value="">Select Property</option>
                        {properties.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        value={formData.date || ''}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <select
                        value={formData.type || ''}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      >
                        <option value="">Select Type</option>
                        <option value="Electrical">Electrical</option>
                        <option value="Plumbing">Plumbing</option>
                        <option value="HVAC">HVAC</option>
                        <option value="Car Maintenance">Car Maintenance</option>
                        <option value="IT Support">IT Support</option>
                        <option value="Cleaning">Cleaning</option>
                        <option value="Painting">Painting</option>
                        <option value="Security">Security</option>
                        <option value="Landscaping">Landscaping</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
                      <select
                        value={formData.vendor_id || ''}
                        onChange={(e) => setFormData({ ...formData, vendor_id: Number(e.target.value) || undefined })}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      >
                        <option value="">Select Vendor</option>
                        {vendors.map(v => (
                          <option key={v.id} value={v.id}>{v.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Requested Time</label>
                      <input
                        type="time"
                        value={formData.requested_time || ''}
                        onChange={(e) => setFormData({ ...formData, requested_time: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                      <select
                        value={formData.priority || 'Normal'}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'Normal' | 'Urgent' })}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      >
                        <option value="Normal">Normal</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        rows={3}
                      />
                    </div>

                    <button
                      onClick={handleAddMaintenance}
                      className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 font-semibold"
                    >
                      + Schedule
                    </button>
                  </div>
                </div>

                {/* Filters */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-4">🔍 Filter</h3>
                  <div className="flex flex-wrap gap-2">
                    {(['all', 'pending', 'ongoing', 'completed'] as const).map(status => (
                      <button
                        key={status}
                        onClick={() => setFilter({ ...filter, status })}
                        className={`px-3 py-1 rounded text-sm ${filter.status === status
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Properties Filter */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-4">🏢 Properties</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {properties.map(p => {
                      const count = maintenances.filter(m => m.property_id === p.id && m.status !== 'completed').length;
                      return (
                        <div
                          key={p.id}
                          onClick={() => setFilter({ ...filter, propertyId: filter.propertyId === p.id ? undefined : p.id })}
                          className={`p-2 rounded cursor-pointer transition-colors ${filter.propertyId === p.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                        >
                          {p.name} <span className="opacity-70">({count})</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Upcoming */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-4">📅 Upcoming</h3>
                  <div className="max-h-96 overflow-y-auto">
                    {renderUpcoming()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'properties' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Add New Property</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
                    <input
                      type="text"
                      value={propertyForm.name}
                      onChange={(e) => setPropertyForm({ ...propertyForm, name: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={propertyForm.location}
                      onChange={(e) => setPropertyForm({ ...propertyForm, location: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={propertyForm.description}
                      onChange={(e) => setPropertyForm({ ...propertyForm, description: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      rows={3}
                    />
                  </div>
                  <button
                    onClick={handleAddProperty}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 font-semibold"
                  >
                    + Add Property
                  </button>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Property List</h2>
                <div className="space-y-3">
                  {properties.map(p => (
                    <div key={p.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold text-lg">{p.name}</div>
                          <div className="text-sm text-gray-600">📍 {p.location}</div>
                          {p.description && <div className="text-sm text-gray-600 mt-1">{p.description}</div>}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {p.maintenance_count || 0} maintenance tasks
                        </span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {p.personnel_count || 0} personnel
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setDeleteTarget({ type: 'property', id: p.id });
                          setIsDeleteModalOpen(true);
                        }}
                        className="mt-3 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'personnel' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <h2 className="text-xl font-semibold mb-4">{editingPersonnelId ? 'Edit Personnel' : 'Add Personnel'}</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={personnelForm.name}
                      onChange={(e) => setPersonnelForm({ ...personnelForm, name: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={personnelForm.email}
                      onChange={(e) => setPersonnelForm({ ...personnelForm, email: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      placeholder="name@grandcity.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      value={personnelForm.role}
                      onChange={(e) => setPersonnelForm({ ...personnelForm, role: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                      <option value="">Select Role</option>
                      <option value="Electrician">Electrician</option>
                      <option value="Car Maintenance">Car Maintenance</option>
                      <option value="IT Support">IT Support</option>
                      <option value="HR">HR</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Plumber">Plumber</option>
                      <option value="HVAC Technician">HVAC Technician</option>
                      <option value="Security Manager">Security Manager</option>
                      <option value="Facility Manager">Facility Manager</option>
                      <option value="Carpenter">Carpenter</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={personnelForm.location}
                        onChange={(e) => setPersonnelForm({ ...personnelForm, location: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        placeholder="Grand City Plaza"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
                      <input
                        type="text"
                        value={personnelForm.shift}
                        onChange={(e) => setPersonnelForm({ ...personnelForm, shift: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        placeholder="Morning / Evening / Night"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={personnelForm.status}
                      onChange={(e) => setPersonnelForm({ ...personnelForm, status: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <button
                    onClick={handleSavePersonnel}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 font-semibold"
                  >
                    {editingPersonnelId ? 'Save Changes' : '+ Add Personnel'}
                  </button>
                  {editingPersonnelId && (
                    <button
                      onClick={() => {
                        setEditingPersonnelId(null);
                        setPersonnelForm({ name: '', email: '', role: '', location: '', shift: '', status: 'active' });
                      }}
                      className="w-full bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 font-semibold"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </div>

              <div className="lg:col-span-2">
                <h2 className="text-xl font-semibold mb-4">Personnel Directory</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {personnel.map(p => (
                    <div key={p.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="font-semibold text-lg">{p.name}</div>
                      <div className="text-sm text-gray-600">Role: {p.role}</div>
                      <div className="text-sm text-gray-600">Email: {p.email}</div>
                      <div className="text-sm text-gray-600">Location: {p.location}</div>
                      <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${p.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                        {p.status}
                      </span>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => handleEditPersonnel(p)}
                          className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded border border-blue-200 hover:bg-blue-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePersonnel(p.id, p.name)}
                          className="text-xs bg-red-50 text-red-700 px-3 py-1 rounded border border-red-200 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vendors' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Add New Vendor</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name</label>
                    <input
                      type="text"
                      value={vendorForm.name}
                      onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      placeholder="Enter vendor name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={vendorForm.category}
                      onChange={(e) => setVendorForm({ ...vendorForm, category: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                      <option value="">Select Category</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Car Maintenance">Car Maintenance</option>
                      <option value="IT Support">IT Support</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Plumbing">Plumbing</option>
                      <option value="HVAC">HVAC</option>
                      <option value="Cleaning">Cleaning</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={vendorForm.rating}
                      onChange={(e) => setVendorForm({ ...vendorForm, rating: parseFloat(e.target.value) || 0 })}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Active Contracts</label>
                    <input
                      type="number"
                      min="0"
                      value={vendorForm.active_contracts}
                      onChange={(e) => setVendorForm({ ...vendorForm, active_contracts: parseInt(e.target.value) || 0 })}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Performance (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={vendorForm.performance}
                      onChange={(e) => setVendorForm({ ...vendorForm, performance: parseInt(e.target.value) || 0 })}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <button
                    onClick={handleAddVendor}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 font-semibold"
                  >
                    + Add Vendor
                  </button>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Vendor Directory</h2>
                <div className="space-y-3">
                  {vendors.map(v => (
                    <div key={v.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="font-semibold text-lg">{v.name}</div>
                      <div className="text-sm text-gray-600">Category: {v.category}</div>
                      <div className="text-sm text-gray-600">Rating: ⭐ {v.rating}</div>
                      <div className="text-sm text-gray-600">Performance: {v.performance}%</div>
                      <div className="text-sm text-gray-600">Contracts: {v.activeContracts}</div>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete vendor: ${v.name}?`)) {
                            fetch(`/api/vendors?id=${v.id}`, { method: 'DELETE' })
                              .then(res => {
                                if (res.ok) {
                                  fetchVendors();
                                  alert('Vendor deleted successfully!');
                                } else {
                                  alert('Failed to delete vendor');
                                }
                              });
                          }
                        }}
                        className="mt-3 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'acknowledgments' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">✅ Maintenance Acknowledgments</h2>
              <p className="text-gray-600 mb-6">Track acknowledgment of maintenance schedules by personnel and HR</p>

              <div className="space-y-4">
                {maintenances.filter(m => m.status !== 'completed').map(m => {
                  const hrPersonnel = personnel.filter(p => p.role === 'HR');

                  return (
                    <div key={m.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="font-semibold text-lg">{m.type}</div>
                          <div className="text-sm text-gray-600">{m.property_name}</div>
                          <div className="text-sm text-gray-600">
                            📅 {new Date(m.date).toLocaleDateString()} at {m.requested_time}
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded ${m.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          m.status === 'ongoing' ? 'bg-orange-100 text-orange-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                          {m.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                        <h4 className="font-semibold text-blue-900 mb-2">👔 HR Acknowledgment</h4>
                        {hrPersonnel.length === 0 ? (
                          <p className="text-sm text-gray-600">No HR personnel assigned</p>
                        ) : (
                          hrPersonnel.map(person => {
                            const key = `hr_${person.id}`;
                            const ack = m.acknowledgments?.[key];
                            return (
                              <div key={person.id} className={`flex justify-between items-center p-2 rounded mb-2 ${ack?.acknowledged ? 'bg-green-50 border-l-4 border-green-500' : 'bg-white border-l-4 border-gray-300'
                                }`}>
                                <span className="font-semibold">{person.name}</span>
                                {ack?.acknowledged ? (
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                    ✓ Acknowledged
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleAcknowledge(m.id, person.id, true)}
                                    className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                  >
                                    Acknowledge
                                  </button>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}

                {maintenances.filter(m => m.status !== 'completed').length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    ✅ All maintenance tasks are completed!
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">📊 Reports & Analytics</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <div className="text-2xl font-bold text-blue-600">{maintenances.length}</div>
                  <div className="text-sm text-blue-900">Total Maintenance</div>
                </div>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <div className="text-2xl font-bold text-green-600">
                    {maintenances.filter(m => m.status === 'completed').length}
                  </div>
                  <div className="text-sm text-green-900">Completed</div>
                </div>
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                  <div className="text-2xl font-bold text-yellow-600">
                    {maintenances.filter(m => m.status === 'pending').length}
                  </div>
                  <div className="text-sm text-yellow-900">Pending</div>
                </div>
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                  <div className="text-2xl font-bold text-orange-600">
                    {maintenances.filter(m => m.status === 'ongoing').length}
                  </div>
                  <div className="text-sm text-orange-900">Ongoing</div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-4">Maintenance Log</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {maintenances.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(m => (
                        <tr key={m.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{new Date(m.date).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-sm">{m.property_name}</td>
                          <td className="px-4 py-3 text-sm">{m.type}</td>
                          <td className="px-4 py-3 text-sm">{m.vendor_name}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs rounded ${m.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              m.status === 'ongoing' ? 'bg-orange-100 text-orange-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                              {m.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Maintenance Detail Modal */}
      {isModalOpen && selectedMaintenance && (
        <Modal title="Maintenance Details" onClose={() => setIsModalOpen(false)}>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Maintenance Details</h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded border-l-4 border-blue-500">
                <div className="text-sm text-gray-600">Property</div>
                <div className="font-semibold">{selectedMaintenance.property_name}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded border-l-4 border-blue-500">
                <div className="text-sm text-gray-600">Date</div>
                <div className="font-semibold">{new Date(selectedMaintenance.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded border-l-4 border-blue-500">
                <div className="text-sm text-gray-600">Type</div>
                <div className="font-semibold">{selectedMaintenance.type}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded border-l-4 border-blue-500">
                <div className="text-sm text-gray-600">Vendor</div>
                <div className="font-semibold">{selectedMaintenance.vendor_name}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded border-l-4 border-blue-500">
                <div className="text-sm text-gray-600">Priority</div>
                <div className="font-semibold">
                  <span className={`px-2 py-1 rounded text-xs ${selectedMaintenance.priority === 'Urgent' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                    {selectedMaintenance.priority}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded border-l-4 border-blue-500">
                <div className="text-sm text-gray-600">Status</div>
                <div className="font-semibold">
                  <span className={`px-2 py-1 rounded text-xs ${selectedMaintenance.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    selectedMaintenance.status === 'ongoing' ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                    {selectedMaintenance.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
              <div className="text-sm text-gray-700 mb-1">🕐 Requested Time: <span className="font-semibold">{selectedMaintenance.requested_time}</span></div>
              <div className="text-sm text-gray-700 mb-1">▶️ Start Time: <span className="font-semibold">{selectedMaintenance.start_time || 'Not started'}</span></div>
              <div className="text-sm text-gray-700">⏹️ End Time: <span className="font-semibold">{selectedMaintenance.end_time || 'Not completed'}</span></div>
            </div>

            {selectedMaintenance.description && (
              <div className="bg-gray-50 p-3 rounded border-l-4 border-blue-500 mb-4">
                <div className="text-sm text-gray-600">Description</div>
                <div className="font-semibold">{selectedMaintenance.description}</div>
              </div>
            )}

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => handleUpdateStatus('pending')}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Mark Pending
              </button>
              <button
                onClick={() => handleUpdateStatus('ongoing')}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              >
                Mark Ongoing
              </button>
              <button
                onClick={() => handleUpdateStatus('completed')}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Mark Completed
              </button>
              <button
                onClick={() => {
                  setDeleteTarget({ type: 'maintenance', id: selectedMaintenance.id });
                  setIsDeleteModalOpen(true);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <Modal title="Delete Confirmation" onClose={() => {
          setIsDeleteModalOpen(false);
          setAdminPassword('');
          setDeleteTarget(null);
        }}>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">⚠️ Delete Confirmation</h2>
            <p className="text-gray-600 mb-4">This action requires admin authentication. Please enter the admin password to proceed.</p>

            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
              <h4 className="font-semibold text-yellow-900 mb-2">🔒 Admin Password</h4>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setAdminPassword('');
                  setDeleteTarget(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
