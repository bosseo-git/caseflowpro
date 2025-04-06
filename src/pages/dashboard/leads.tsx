import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { CheckCircleIcon, XCircleIcon, PhoneIcon, ChatBubbleLeftRightIcon, EnvelopeIcon, PlusIcon } from '@heroicons/react/24/solid'
import { EllipsisVerticalIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import DashboardLayout from '@/components/DashboardLayout'
import { useUser } from '@/lib/hooks'

// Sample data - in a real application, this would come from your backend
const sampleLeads = [
  {
    id: '1',
    name: 'John Doe',
    phone: '(555) 123-4567',
    email: 'john.doe@example.com',
    source: 'Call Button',
    date: '2023-06-07T14:35:42Z',
    status: 'New',
    assignedTo: null,
    caseType: 'Personal Injury',
    notes: 'Interested in discussing a car accident case from last month'
  },
  {
    id: '2',
    name: 'Jane Smith',
    phone: '(555) 987-6543',
    email: 'jane.smith@example.com',
    source: 'WhatsApp',
    date: '2023-06-06T11:22:15Z',
    status: 'Contacted',
    assignedTo: 'Alice Johnson',
    caseType: 'Family Law',
    notes: 'Looking for information about child custody options'
  },
  {
    id: '3',
    name: 'Robert Brown',
    phone: '(555) 456-7890',
    email: 'robert.brown@example.com',
    source: 'Chat Form',
    date: '2023-06-05T09:15:30Z',
    status: 'Qualified',
    assignedTo: 'Michael Wilson',
    caseType: 'Corporate Law',
    notes: 'Needs help setting up an LLC for a new business venture'
  },
  {
    id: '4',
    name: 'Emily Wilson',
    phone: '(555) 234-5678',
    email: 'emily.wilson@example.com',
    source: 'SMS Form',
    date: '2023-06-04T16:40:22Z',
    status: 'Disqualified',
    assignedTo: 'David Miller',
    caseType: 'Criminal Defense',
    notes: 'Outside of our service area, referred to another firm'
  },
  {
    id: '5',
    name: 'Michael Garcia',
    phone: '(555) 876-5432',
    email: 'michael.garcia@example.com',
    source: 'Call Form',
    date: '2023-06-03T13:10:05Z',
    status: 'Converted',
    assignedTo: 'Sarah Martinez',
    caseType: 'Estate Planning',
    notes: 'Signed up for a will creation package after consultation'
  }
];

// Define types
type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Disqualified' | 'Converted';
type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  date: string;
  status: LeadStatus;
  assignedTo: string | null;
  caseType: string;
  notes: string;
};

export default function LeadsPage() {
  const router = useRouter();
  const { user, loading } = useUser({
    redirectTo: '/login',
  });

  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'All'>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // In a real application, fetch leads data here
  useEffect(() => {
    if (!user) return;
    
    const fetchLeads = async () => {
      setIsLoading(true);
      try {
        // This would be a real API call in production
        // const response = await fetch('/api/leads');
        // const data = await response.json();
        // setLeads(data);
        
        // Using sample data
        setLeads(sampleLeads);
        setFilteredLeads(sampleLeads);
        
        // Simulate API delay
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching leads:', error);
        setIsLoading(false);
      }
    };
    
    fetchLeads();
  }, [user]);

  // Filter leads based on search term and status
  useEffect(() => {
    let result = leads;
    
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        lead => 
          lead.name.toLowerCase().includes(lowerSearchTerm) ||
          lead.email.toLowerCase().includes(lowerSearchTerm) ||
          lead.phone.includes(searchTerm) ||
          lead.caseType.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    if (statusFilter !== 'All') {
      result = result.filter(lead => lead.status === statusFilter);
    }
    
    setFilteredLeads(result);
  }, [searchTerm, statusFilter, leads]);

  const openLeadDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDrawerOpen(true);
  };
  
  const closeLeadDetails = () => {
    setIsDrawerOpen(false);
  };
  
  const updateLeadStatus = (leadId: string, newStatus: LeadStatus) => {
    // In a real app, you would call the API to update the status
    // For now, we update the local state
    const updatedLeads = leads.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    );
    
    setLeads(updatedLeads);
    
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: LeadStatus }) => {
    let bgColor, textColor;
    
    switch (status) {
      case 'New':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        break;
      case 'Contacted':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        break;
      case 'Qualified':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        break;
      case 'Disqualified':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        break;
      case 'Converted':
        bgColor = 'bg-purple-100';
        textColor = 'text-purple-800';
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {status}
      </span>
    );
  };

  if (loading || isLoading) {
    return <DashboardLayout>Loading leads data...</DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Leads Management</h1>
          
          <div className="flex space-x-2">
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Add Lead
            </button>
          </div>
        </div>
        
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search leads by name, email, phone, or case type"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
                Status:
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'All')}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="All">All</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Disqualified">Disqualified</option>
                <option value="Converted">Converted</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Leads Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} onClick={() => openLeadDetails(lead)} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                        <div className="text-sm text-gray-500">{lead.caseType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{lead.phone}</div>
                        <div className="text-sm text-gray-500">{lead.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{lead.source}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(lead.date)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={lead.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{lead.assignedTo || 'Unassigned'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-gray-400 hover:text-gray-500">
                          <EllipsisVerticalIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      No leads found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Lead Details Drawer */}
        {selectedLead && (
          <div className={`fixed inset-0 overflow-hidden z-20 transform ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}>
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeLeadDetails}></div>
              
              <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
                <div className="w-screen max-w-md">
                  <div className="h-full flex flex-col bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <h2 className="text-lg font-medium text-gray-900">
                          Lead Details
                        </h2>
                        <button
                          type="button"
                          className="text-gray-400 hover:text-gray-500"
                          onClick={closeLeadDetails}
                        >
                          <span className="sr-only">Close panel</span>
                          <XCircleIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                      
                      <div className="mt-6">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{selectedLead.name}</h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {formatDate(selectedLead.date)}
                            </p>
                          </div>
                          
                          <div className="border-t border-gray-200 pt-4">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900">Status</p>
                              <StatusBadge status={selectedLead.status} />
                            </div>
                            
                            <div className="mt-2 grid grid-cols-4 gap-2">
                              {(['New', 'Contacted', 'Qualified', 'Disqualified', 'Converted'] as LeadStatus[]).map((status) => (
                                <button
                                  key={status}
                                  className={`text-xs px-2 py-1 rounded ${selectedLead.status === status ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                                  onClick={() => updateLeadStatus(selectedLead.id, status)}
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          <div className="border-t border-gray-200 pt-4">
                            <p className="text-sm font-medium text-gray-900">Contact Information</p>
                            <div className="mt-2 space-y-2">
                              <div className="flex items-center">
                                <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                                <a href={`tel:${selectedLead.phone}`} className="text-sm text-primary-600 hover:text-primary-500">
                                  {selectedLead.phone}
                                </a>
                              </div>
                              <div className="flex items-center">
                                <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                                <a href={`mailto:${selectedLead.email}`} className="text-sm text-primary-600 hover:text-primary-500">
                                  {selectedLead.email}
                                </a>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border-t border-gray-200 pt-4">
                            <p className="text-sm font-medium text-gray-900">Lead Details</p>
                            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
                              <div>
                                <p className="text-xs text-gray-500">Source</p>
                                <p className="text-sm">{selectedLead.source}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Case Type</p>
                                <p className="text-sm">{selectedLead.caseType}</p>
                              </div>
                              <div className="col-span-2 mt-2">
                                <p className="text-xs text-gray-500">Assigned To</p>
                                <p className="text-sm">{selectedLead.assignedTo || 'Unassigned'}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border-t border-gray-200 pt-4">
                            <p className="text-sm font-medium text-gray-900">Notes</p>
                            <div className="mt-2">
                              <p className="text-sm text-gray-600">
                                {selectedLead.notes}
                              </p>
                            </div>
                            <div className="mt-4">
                              <label htmlFor="add-note" className="text-xs text-gray-500">
                                Add a note
                              </label>
                              <textarea
                                id="add-note"
                                rows={3}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                placeholder="Add a note about this lead..."
                              ></textarea>
                              <button
                                type="button"
                                className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                              >
                                Save Note
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 py-4 px-4 sm:px-6">
                      <div className="flex justify-between space-x-3">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          onClick={closeLeadDetails}
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          <PhoneIcon className="-ml-1 mr-2 h-4 w-4" />
                          Call Lead
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
} 