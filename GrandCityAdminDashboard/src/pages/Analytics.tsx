'use client'

import { useState } from 'react';
import { useGrandCityData } from '../hooks/useGrandCityData';

export default function Analytics() {
  const { 
    stats, 
    projects, 
    tasks, 
    payments, 
    shifts, 
    communications,
    photoLogs,
    reports 
  } = useGrandCityData();
  
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [selectedProject, setSelectedProject] = useState('All');

  // Calculate analytics data
  const totalBudget = stats.monthlyBudget; // Use stats budget since Project doesn't have budget field
  const completedTasks = tasks.filter(task => task.status === 'Completed').length;
  const totalTasks = tasks.length;
  const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  // Removed unused activeProjects to satisfy noUnusedLocals
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  
  const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const pendingPayments = payments.filter(p => p.status === 'Pending').length;
  const approvedPayments = payments.filter(p => p.status === 'Approved').length;

  const presentStaff = shifts.filter(s => s.status === 'Present' || s.status === 'On Duty').length;
  const totalStaff = shifts.length;
  const attendanceRate = totalStaff > 0 ? (presentStaff / totalStaff) * 100 : 0;

  const unreadCommunications = communications.reduce((sum, comm) => sum + comm.unread, 0);
  const totalCommunications = communications.length;

  const recentPhotos = photoLogs.length;
  const generatedReports = reports.length;

  // Mock data for charts (in a real app, this would come from your data)
  const projectProgressData = projects.map(project => ({
    name: project.name,
    progress: project.progress,
    budget: Math.floor(Math.random() * 5000000) + 1000000, // Mock budget since Project doesn't have budget field
    status: project.status
  }));

  const monthlyData = [
    { month: 'Jan', budget: 2400000, spent: 2100000, tasks: 45, completed: 38 },
    { month: 'Feb', budget: 2600000, spent: 2300000, tasks: 52, completed: 47 },
    { month: 'Mar', budget: 2800000, spent: 2500000, tasks: 48, completed: 44 },
    { month: 'Apr', budget: 3000000, spent: 2700000, tasks: 55, completed: 51 },
    { month: 'May', budget: 3200000, spent: 2900000, tasks: 60, completed: 56 },
    { month: 'Jun', budget: 3400000, spent: 3100000, tasks: 58, completed: 53 }
  ];

  const departmentData = [
    { department: 'Construction', budget: 15000000, spent: 12500000, efficiency: 85 },
    { department: 'Engineering', budget: 8000000, spent: 7200000, efficiency: 92 },
    { department: 'Management', budget: 5000000, spent: 4800000, efficiency: 88 },
    { department: 'Security', budget: 2000000, spent: 1900000, efficiency: 95 },
    { department: 'Maintenance', budget: 3000000, spent: 2700000, efficiency: 90 }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Comprehensive insights into project performance, budget utilization, and team productivity.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
              <option value="365">Last year</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Filter</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Projects</option>
              {projects.map(project => (
                <option key={project.id} value={project.name}>{project.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Project Completion</p>
              <p className="text-2xl font-bold text-gray-900">
                {projects.length > 0 ? Math.round((completedProjects / projects.length) * 100) : 0}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {completedProjects} of {projects.length} projects
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl">📊</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Budget Utilization</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalBudget > 0 ? Math.round((stats.budgetUsed / stats.monthlyBudget) * 100) : 0}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PKR {(stats.budgetUsed / 1000000).toFixed(1)}M used
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Task Completion</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(taskCompletionRate)}%</p>
              <p className="text-xs text-gray-500 mt-1">
                {completedTasks} of {totalTasks} tasks
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 text-xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Staff Attendance</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(attendanceRate)}%</p>
              <p className="text-xs text-gray-500 mt-1">
                {presentStaff} of {totalStaff} present
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600 text-xl">👥</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Project Progress Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Project Progress Overview</h3>
          <div className="space-y-4">
            {projectProgressData.slice(0, 6).map((project, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-900">{project.name}</span>
                    <span className="text-gray-500">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        project.progress >= 80 ? 'bg-green-500' :
                        project.progress >= 50 ? 'bg-blue-500' :
                        project.progress >= 25 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Budget: PKR {(project.budget / 1000000).toFixed(1)}M • Status: {project.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Performance */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Performance Trends</h3>
          <div className="space-y-4">
            {monthlyData.map((month, index) => (
              <div key={index} className="border-b border-gray-200 pb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">{month.month}</span>
                  <div className="text-sm text-gray-500">
                    {Math.round((month.completed / month.tasks) * 100)}% task completion
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Budget: </span>
                    <span className="font-medium">PKR {(month.budget / 1000000).toFixed(1)}M</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Spent: </span>
                    <span className="font-medium">PKR {(month.spent / 1000000).toFixed(1)}M</span>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(month.spent / month.budget) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Performance */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Department Performance Analysis</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget Allocated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Efficiency Score
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {departmentData.map((dept, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{dept.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">PKR {(dept.budget / 1000000).toFixed(1)}M</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">PKR {(dept.spent / 1000000).toFixed(1)}M</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(dept.spent / dept.budget) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">
                        {Math.round((dept.spent / dept.budget) * 100)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      dept.efficiency >= 90 ? 'bg-green-100 text-green-800' :
                      dept.efficiency >= 80 ? 'bg-blue-100 text-blue-800' :
                      dept.efficiency >= 70 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {dept.efficiency}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Communication Activity</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Total Messages</span>
              <span className="text-sm font-medium text-gray-900">{totalCommunications}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Unread Messages</span>
              <span className="text-sm font-medium text-red-600">{unreadCommunications}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Response Rate</span>
              <span className="text-sm font-medium text-green-600">
                {totalCommunications > 0 ? Math.round(((totalCommunications - unreadCommunications) / totalCommunications) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Documentation</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Photo Logs</span>
              <span className="text-sm font-medium text-gray-900">{recentPhotos}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Generated Reports</span>
              <span className="text-sm font-medium text-gray-900">{generatedReports}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Compliance Score</span>
              <span className="text-sm font-medium text-green-600">94%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Total Payments</span>
              <span className="text-sm font-medium text-gray-900">PKR {(totalPayments / 1000000).toFixed(1)}M</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Pending Approvals</span>
              <span className="text-sm font-medium text-yellow-600">{pendingPayments}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Approved Payments</span>
              <span className="text-sm font-medium text-green-600">{approvedPayments}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}