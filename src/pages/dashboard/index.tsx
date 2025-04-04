import { useState } from 'react'
import Link from 'next/link'
import { 
  HomeIcon, 
  ChatBubbleLeftRightIcon, 
  CalendarIcon, 
  UserGroupIcon, 
  CogIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import DashboardLayout from '@/components/DashboardLayout'

// Mock data
const stats = [
  { name: 'Total Visitors', value: '1,248', change: '+12%', trend: 'up' },
  { name: 'Conversations', value: '645', change: '+18%', trend: 'up' },
  { name: 'Leads Captured', value: '86', change: '+24%', trend: 'up' },
  { name: 'Avg. Response Time', value: '16s', change: '-5s', trend: 'down' },
]

const recentLeads = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    date: '2023-12-10T14:30:00',
    status: 'new',
    source: 'website',
    caseType: 'Personal Injury',
  },
  {
    id: 2,
    name: 'Maria Rodriguez',
    email: 'maria.r@example.com',
    phone: '(555) 987-6543',
    date: '2023-12-09T11:15:00',
    status: 'contacted',
    source: 'sms',
    caseType: 'Family Law',
  },
  {
    id: 3,
    name: 'David Johnson',
    email: 'david.j@example.com',
    phone: '(555) 345-6789',
    date: '2023-12-08T09:45:00',
    status: 'scheduled',
    source: 'whatsapp',
    caseType: 'Criminal Defense',
  },
  {
    id: 4,
    name: 'Sarah Williams',
    email: 'sarah.w@example.com',
    phone: '(555) 456-7890',
    date: '2023-12-07T16:00:00',
    status: 'qualified',
    source: 'voice',
    caseType: 'Bankruptcy',
  },
  {
    id: 5,
    name: 'Michael Chen',
    email: 'michael.c@example.com',
    phone: '(555) 234-5678',
    date: '2023-12-06T10:30:00',
    status: 'new',
    source: 'website',
    caseType: 'Immigration',
  },
]

const upcomingAppointments = [
  {
    id: 1,
    clientName: 'Maria Rodriguez',
    date: '2023-12-12T14:00:00',
    type: 'Initial Consultation',
    duration: '30 min',
  },
  {
    id: 2,
    clientName: 'David Johnson',
    date: '2023-12-13T10:30:00',
    type: 'Case Review',
    duration: '45 min',
  },
  {
    id: 3,
    clientName: 'Jessica Miller',
    date: '2023-12-14T15:15:00',
    type: 'Initial Consultation',
    duration: '30 min',
  },
]

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button className="flex items-center px-3 py-2 text-sm text-gray-600 bg-white border rounded-md hover:bg-gray-50">
              <ArrowPathIcon className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <Link 
              href="/dashboard/settings/script" 
              className="flex items-center px-4 py-2 text-sm text-white rounded-md bg-primary-600 hover:bg-primary-700"
            >
              Get Website Script
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.name} className="p-6 bg-white rounded-lg shadow">
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
              <div className={`mt-2 inline-flex items-center text-sm ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
                <svg 
                  className={`w-4 h-4 ml-1 ${stat.trend === 'up' ? 'rotate-0' : 'rotate-180'}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent Leads */}
          <div className="lg:col-span-2">
            <div className="p-6 bg-white rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Recent Leads</h2>
                <Link href="/dashboard/leads" className="text-sm text-primary-600 hover:text-primary-800">
                  View All
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="pb-3 pl-2 pr-6 font-medium">Name</th>
                      <th className="pb-3 px-6 font-medium">Case Type</th>
                      <th className="pb-3 px-6 font-medium">Source</th>
                      <th className="pb-3 px-6 font-medium">Status</th>
                      <th className="pb-3 px-6 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLeads.map((lead) => (
                      <tr key={lead.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 pl-2 pr-6">
                          <Link href={`/dashboard/leads/${lead.id}`} className="font-medium text-primary-600 hover:text-primary-800">
                            {lead.name}
                          </Link>
                        </td>
                        <td className="py-4 px-6 text-gray-600">{lead.caseType}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            lead.source === 'website' ? 'bg-blue-100 text-blue-800' :
                            lead.source === 'sms' ? 'bg-purple-100 text-purple-800' :
                            lead.source === 'whatsapp' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {lead.source}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                            lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                            lead.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {new Date(lead.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div>
            <div className="p-6 bg-white rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
                <Link href="/dashboard/calendar" className="text-sm text-primary-600 hover:text-primary-800">
                  View Calendar
                </Link>
              </div>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <p className="font-medium text-primary-600">
                      {appointment.clientName}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {appointment.type} • {appointment.duration}
                    </p>
                    <p className="mt-2 text-sm font-medium">
                      {new Date(appointment.date).toLocaleDateString()} at {new Date(appointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link href="/dashboard/calendar/new" className="text-sm text-primary-600 hover:text-primary-800">
                  + Schedule New Appointment
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 