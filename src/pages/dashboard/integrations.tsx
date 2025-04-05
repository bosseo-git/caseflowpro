import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { CheckCircleIcon, ExclamationIcon, LockClosedIcon } from '@heroicons/react/solid'
import { ExternalLinkIcon } from '@heroicons/react/outline'
import DashboardLayout from '@/components/DashboardLayout'
import { useUser } from '@/lib/hooks'

// Sample integrations data - in a real application, this would come from your backend
const availableIntegrations = [
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'Connect your widget to Salesforce to automatically create leads and contacts.',
    icon: '/images/integrations/salesforce.svg',
    category: 'crm',
    connected: false,
    popularityRank: 1,
    setupDifficulty: 'Medium',
    documentationUrl: 'https://example.com/docs/salesforce'
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Sync leads with HubSpot CRM and trigger automated workflows.',
    icon: '/images/integrations/hubspot.svg',
    category: 'crm',
    connected: true,
    lastSynced: '2023-06-07T14:30:00Z',
    popularityRank: 2,
    setupDifficulty: 'Easy',
    documentationUrl: 'https://example.com/docs/hubspot'
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Connect your widget to 3,000+ apps with no-code automations.',
    icon: '/images/integrations/zapier.svg',
    category: 'automation',
    connected: false,
    popularityRank: 3,
    setupDifficulty: 'Easy',
    documentationUrl: 'https://example.com/docs/zapier'
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    description: 'Add new leads to your email marketing lists automatically.',
    icon: '/images/integrations/mailchimp.svg',
    category: 'email',
    connected: false,
    popularityRank: 4,
    setupDifficulty: 'Easy',
    documentationUrl: 'https://example.com/docs/mailchimp'
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Get instant notifications in Slack when new leads come in.',
    icon: '/images/integrations/slack.svg',
    category: 'notifications',
    connected: true,
    lastSynced: '2023-06-06T09:15:00Z',
    popularityRank: 5,
    setupDifficulty: 'Easy',
    documentationUrl: 'https://example.com/docs/slack'
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    description: 'Track widget interactions and conversions in Google Analytics.',
    icon: '/images/integrations/google-analytics.svg',
    category: 'analytics',
    connected: false,
    popularityRank: 6,
    setupDifficulty: 'Medium',
    documentationUrl: 'https://example.com/docs/google-analytics'
  },
  {
    id: 'pipedrive',
    name: 'Pipedrive',
    description: 'Push leads to your Pipedrive sales pipeline.',
    icon: '/images/integrations/pipedrive.svg',
    category: 'crm',
    connected: false,
    popularityRank: 7,
    setupDifficulty: 'Medium',
    documentationUrl: 'https://example.com/docs/pipedrive'
  },
  {
    id: 'intercom',
    name: 'Intercom',
    description: 'Connect your widget with Intercom for live chat capabilities.',
    icon: '/images/integrations/intercom.svg',
    category: 'chat',
    connected: false,
    popularityRank: 8,
    setupDifficulty: 'Medium',
    documentationUrl: 'https://example.com/docs/intercom'
  },
  {
    id: 'calendly',
    name: 'Calendly',
    description: 'Let leads schedule meetings directly from your widget.',
    icon: '/images/integrations/calendly.svg',
    category: 'scheduling',
    connected: false,
    isPremium: true,
    popularityRank: 9,
    setupDifficulty: 'Easy',
    documentationUrl: 'https://example.com/docs/calendly'
  },
  {
    id: 'webhook',
    name: 'Custom Webhook',
    description: 'Send lead data to any custom endpoint via webhooks.',
    icon: '/images/integrations/webhook.svg',
    category: 'other',
    connected: true,
    lastSynced: '2023-06-07T10:45:00Z',
    popularityRank: 10,
    setupDifficulty: 'Advanced',
    documentationUrl: 'https://example.com/docs/webhook'
  }
];

// Define types
type IntegrationCategory = 'crm' | 'email' | 'chat' | 'analytics' | 'automation' | 'notifications' | 'scheduling' | 'other';
type SetupDifficulty = 'Easy' | 'Medium' | 'Advanced';

type Integration = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: IntegrationCategory;
  connected: boolean;
  lastSynced?: string;
  isPremium?: boolean;
  popularityRank: number;
  setupDifficulty: SetupDifficulty;
  documentationUrl: string;
};

export default function IntegrationsPage() {
  const router = useRouter();
  const { user, loading } = useUser({
    redirectTo: '/login',
  });

  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [filteredIntegrations, setFilteredIntegrations] = useState<Integration[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<IntegrationCategory | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'connected'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // In a real application, fetch integrations data here
  useEffect(() => {
    if (!user) return;
    
    const fetchIntegrations = async () => {
      setIsLoading(true);
      try {
        // This would be a real API call in production
        // const response = await fetch('/api/integrations');
        // const data = await response.json();
        // setIntegrations(data);
        
        // Using sample data
        setIntegrations(availableIntegrations);
        setFilteredIntegrations(availableIntegrations);
        
        // Simulate API delay
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching integrations:', error);
        setIsLoading(false);
      }
    };
    
    fetchIntegrations();
  }, [user]);

  // Filter and sort integrations
  useEffect(() => {
    let result = integrations;
    
    // Filter by active tab
    if (activeTab === 'connected') {
      result = result.filter(integration => integration.connected);
    }
    
    // Filter by search term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        integration => 
          integration.name.toLowerCase().includes(lowerSearchTerm) ||
          integration.description.toLowerCase().includes(lowerSearchTerm) ||
          integration.category.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    // Filter by category
    if (categoryFilter !== 'all') {
      result = result.filter(integration => integration.category === categoryFilter);
    }
    
    // Sort by popularity
    result = [...result].sort((a, b) => a.popularityRank - b.popularityRank);
    
    setFilteredIntegrations(result);
  }, [searchTerm, categoryFilter, activeTab, integrations]);

  const openIntegrationModal = (integration: Integration) => {
    setSelectedIntegration(integration);
    setIsModalOpen(true);
  };
  
  const closeIntegrationModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedIntegration(null), 300); // Wait for animation to finish
  };
  
  const toggleIntegrationConnection = (integrationId: string) => {
    // In a real app, you would call an API to connect/disconnect the integration
    // For now, we update the local state
    const updatedIntegrations = integrations.map(integration => 
      integration.id === integrationId 
        ? { 
            ...integration, 
            connected: !integration.connected,
            ...((!integration.connected) && { lastSynced: new Date().toISOString() })
          } 
        : integration
    );
    
    setIntegrations(updatedIntegrations);
    
    if (selectedIntegration && selectedIntegration.id === integrationId) {
      setSelectedIntegration({
        ...selectedIntegration,
        connected: !selectedIntegration.connected,
        ...((!selectedIntegration.connected) && { lastSynced: new Date().toISOString() })
      });
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

  // Get human-readable category name
  const getCategoryLabel = (category: IntegrationCategory): string => {
    switch (category) {
      case 'crm': return 'CRM';
      case 'email': return 'Email Marketing';
      case 'chat': return 'Chat & Support';
      case 'analytics': return 'Analytics';
      case 'automation': return 'Automation';
      case 'notifications': return 'Notifications';
      case 'scheduling': return 'Scheduling';
      case 'other': return 'Other';
      default: return category;
    }
  };

  if (loading || isLoading) {
    return <DashboardLayout>Loading integrations data...</DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Integrations</h1>
          
          <div className="flex space-x-2">
            <a
              href="https://example.com/docs/integrations"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ExternalLinkIcon className="-ml-1 mr-2 h-5 w-5" />
              Integration Docs
            </a>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('all')}
              className={`
                ${activeTab === 'all'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              `}
            >
              All Integrations
            </button>
            <button
              onClick={() => setActiveTab('connected')}
              className={`
                ${activeTab === 'connected'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              `}
            >
              Connected ({integrations.filter(i => i.connected).length})
            </button>
          </nav>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search integrations..."
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <label htmlFor="category-filter" className="text-sm font-medium text-gray-700">
                Category:
              </label>
              <select
                id="category-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as IntegrationCategory | 'all')}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="all">All Categories</option>
                <option value="crm">CRM</option>
                <option value="email">Email Marketing</option>
                <option value="chat">Chat & Support</option>
                <option value="analytics">Analytics</option>
                <option value="automation">Automation</option>
                <option value="notifications">Notifications</option>
                <option value="scheduling">Scheduling</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIntegrations.length > 0 ? (
            filteredIntegrations.map((integration) => (
              <div
                key={integration.id}
                className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-5">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-md p-2 flex items-center justify-center">
                      {/* Placeholder when icon is not available */}
                      <div className="text-2xl font-bold text-gray-400">
                        {integration.name.charAt(0)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {integration.name}
                        </p>
                        {integration.connected && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Connected
                          </span>
                        )}
                        {integration.isPremium && !integration.connected && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Premium
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {getCategoryLabel(integration.category)} • {integration.setupDifficulty} Setup
                      </p>
                    </div>
                  </div>
                  
                  <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                    {integration.description}
                  </p>
                  
                  {integration.connected && integration.lastSynced && (
                    <p className="mt-2 text-xs text-gray-500">
                      Last synced: {formatDate(integration.lastSynced)}
                    </p>
                  )}
                </div>
                
                <div className="bg-gray-50 px-5 py-3">
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => openIntegrationModal(integration)}
                      className="text-sm font-medium text-primary-600 hover:text-primary-500"
                    >
                      View Details
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => toggleIntegrationConnection(integration.id)}
                      className={`text-sm font-medium ${
                        integration.connected
                          ? 'text-red-600 hover:text-red-500'
                          : 'text-primary-600 hover:text-primary-500'
                      }`}
                    >
                      {integration.connected ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 py-12 flex flex-col items-center justify-center text-center">
              <ExclamationIcon className="h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No integrations found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          )}
        </div>
        
        {/* Integration Modal */}
        {selectedIntegration && (
          <div className={`fixed inset-0 overflow-y-auto z-50 ${isModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-300`}>
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeIntegrationModal}></div>
              </div>
              
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              
              <div 
                className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
                  isModalOpen ? 'sm:translate-y-0 opacity-100' : 'sm:translate-y-4 opacity-0'
                }`}
              >
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-md bg-gray-100 sm:mx-0 sm:h-10 sm:w-10">
                      {/* Placeholder when icon is not available */}
                      <div className="text-xl font-bold text-gray-400">
                        {selectedIntegration.name.charAt(0)}
                      </div>
                    </div>
                    
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          {selectedIntegration.name}
                        </h3>
                        {selectedIntegration.connected && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircleIcon className="h-3 w-3 mr-1" />
                            Connected
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          {selectedIntegration.description}
                        </p>
                      </div>
                      
                      <div className="mt-4 border-t border-gray-200 pt-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Category</p>
                            <p className="font-medium">{getCategoryLabel(selectedIntegration.category)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Setup Difficulty</p>
                            <p className="font-medium">{selectedIntegration.setupDifficulty}</p>
                          </div>
                          {selectedIntegration.connected && selectedIntegration.lastSynced && (
                            <div className="col-span-2">
                              <p className="text-gray-500">Last Synced</p>
                              <p className="font-medium">{formatDate(selectedIntegration.lastSynced)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4 border-t border-gray-200 pt-4">
                        <h4 className="text-sm font-medium text-gray-900">Configuration</h4>
                        {selectedIntegration.connected ? (
                          <div className="mt-2 space-y-4">
                            <div className="flex rounded-md shadow-sm">
                              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                API Key
                              </span>
                              <input
                                type="text"
                                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300"
                                placeholder="••••••••••••••••"
                                readOnly
                              />
                            </div>
                            
                            <div className="flex rounded-md shadow-sm">
                              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                Webhook URL
                              </span>
                              <input
                                type="text"
                                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300"
                                value="https://api.caseflowpro.com/webhooks/lead-capture"
                                readOnly
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              Connect this integration to configure its settings.
                            </p>
                            {selectedIntegration.isPremium && (
                              <div className="mt-2 rounded-md bg-yellow-50 p-4">
                                <div className="flex">
                                  <LockClosedIcon className="h-5 w-5 text-yellow-400" />
                                  <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">Premium Integration</h3>
                                    <div className="mt-1 text-sm text-yellow-700">
                                      <p>This integration requires a premium subscription. Upgrade your plan to access it.</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  {!selectedIntegration.isPremium || selectedIntegration.connected ? (
                    <button
                      type="button"
                      onClick={() => toggleIntegrationConnection(selectedIntegration.id)}
                      className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                        selectedIntegration.connected
                          ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                          : 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500'
                      }`}
                    >
                      {selectedIntegration.connected ? 'Disconnect' : 'Connect'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Upgrade to Premium
                    </button>
                  )}
                  
                  <button
                    type="button"
                    onClick={closeIntegrationModal}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
} 