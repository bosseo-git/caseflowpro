import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { StarIcon, ArrowCircleRightIcon } from '@heroicons/react/solid'
import { CheckIcon, XIcon } from '@heroicons/react/outline'
import DashboardLayout from '@/components/DashboardLayout'
import { useUser } from '@/lib/hooks'

// Sample templates data - in a real application, this would come from your backend
const availableTemplates = [
  {
    id: 'law-1',
    name: 'Personal Injury Law',
    description: 'Designed for personal injury attorneys to generate more qualified leads.',
    previewImage: '/images/templates/personal-injury.jpg',
    category: 'legal',
    industry: 'Law',
    popularityScore: 4.9,
    reviewCount: 127,
    widgetSettings: {
      primaryColor: '#2C5282',
      secondaryColor: '#4299E1',
      theme: 'light',
      layout: 'modern',
      buttonLabels: {
        call: 'Free Consultation',
        sms: 'Text Us',
        whatsapp: 'WhatsApp',
        chat: 'Case Evaluation'
      }
    }
  },
  {
    id: 'law-2',
    name: 'Family Law Practice',
    description: 'Perfect for divorce attorneys and family law practices.',
    previewImage: '/images/templates/family-law.jpg',
    category: 'legal',
    industry: 'Law',
    popularityScore: 4.7,
    reviewCount: 89,
    widgetSettings: {
      primaryColor: '#5A67D8',
      secondaryColor: '#7F9CF5',
      theme: 'light',
      layout: 'classic',
      buttonLabels: {
        call: 'Speak to an Attorney',
        sms: 'Quick Question',
        whatsapp: 'Chat Now',
        chat: 'Schedule Consultation'
      }
    }
  },
  {
    id: 'real-estate-1',
    name: 'Real Estate Agent',
    description: 'Help potential buyers and sellers connect with you instantly.',
    previewImage: '/images/templates/real-estate.jpg',
    category: 'real-estate',
    industry: 'Real Estate',
    popularityScore: 4.8,
    reviewCount: 156,
    widgetSettings: {
      primaryColor: '#2C7A7B',
      secondaryColor: '#38B2AC',
      theme: 'light',
      layout: 'modern',
      buttonLabels: {
        call: 'Call Agent',
        sms: 'Quick Question',
        whatsapp: 'WhatsApp',
        chat: 'Schedule Viewing'
      }
    }
  },
  {
    id: 'healthcare-1',
    name: 'Medical Practice',
    description: 'Connect patients with your medical office for appointments and questions.',
    previewImage: '/images/templates/medical.jpg',
    category: 'healthcare',
    industry: 'Healthcare',
    popularityScore: 4.6,
    reviewCount: 72,
    widgetSettings: {
      primaryColor: '#3182CE',
      secondaryColor: '#63B3ED',
      theme: 'light',
      layout: 'modern',
      buttonLabels: {
        call: 'Book Appointment',
        sms: 'Ask a Question',
        whatsapp: 'WhatsApp Us',
        chat: 'Virtual Consult'
      }
    }
  },
  {
    id: 'dental-1',
    name: 'Dental Practice',
    description: 'Ideal for dentists looking to attract new patients and schedule appointments.',
    previewImage: '/images/templates/dental.jpg',
    category: 'healthcare',
    industry: 'Dental',
    popularityScore: 4.7,
    reviewCount: 68,
    widgetSettings: {
      primaryColor: '#3182CE',
      secondaryColor: '#4FD1C5',
      theme: 'light',
      layout: 'modern',
      buttonLabels: {
        call: 'Schedule Cleaning',
        sms: 'Quick Question',
        whatsapp: 'WhatsApp',
        chat: 'Emergency Care'
      }
    }
  },
  {
    id: 'insurance-1',
    name: 'Insurance Agency',
    description: 'Convert website visitors into insurance quote requests.',
    previewImage: '/images/templates/insurance.jpg',
    category: 'finance',
    industry: 'Insurance',
    popularityScore: 4.5,
    reviewCount: 94,
    widgetSettings: {
      primaryColor: '#1A365D',
      secondaryColor: '#2B6CB0',
      theme: 'light',
      layout: 'classic',
      buttonLabels: {
        call: 'Get a Quote',
        sms: 'Quick Question',
        whatsapp: 'WhatsApp',
        chat: 'Compare Plans'
      }
    }
  },
  {
    id: 'contractor-1',
    name: 'Home Services',
    description: 'Perfect for contractors, plumbers, electricians, and other home service providers.',
    previewImage: '/images/templates/contractor.jpg',
    category: 'home-services',
    industry: 'Contractors',
    popularityScore: 4.8,
    reviewCount: 113,
    widgetSettings: {
      primaryColor: '#C05621',
      secondaryColor: '#ED8936',
      theme: 'light',
      layout: 'modern',
      buttonLabels: {
        call: 'Free Estimate',
        sms: 'Quick Question',
        whatsapp: 'Send Photos',
        chat: 'Emergency Service'
      }
    }
  },
  {
    id: 'restaurant-1',
    name: 'Restaurant & Dining',
    description: 'Allow customers to make reservations or order takeout directly.',
    previewImage: '/images/templates/restaurant.jpg',
    category: 'hospitality',
    industry: 'Restaurants',
    popularityScore: 4.6,
    reviewCount: 87,
    widgetSettings: {
      primaryColor: '#C53030',
      secondaryColor: '#F56565',
      theme: 'dark',
      layout: 'modern',
      buttonLabels: {
        call: 'Reservations',
        sms: 'Order Takeout',
        whatsapp: 'Special Events',
        chat: 'View Menu'
      }
    }
  },
  {
    id: 'dark-gold-1',
    name: 'Premium Dark Gold',
    description: 'Sleek dark theme with gold accents for a premium, luxury feel.',
    previewImage: '/images/templates/dark-gold.jpg',
    category: 'luxury',
    industry: 'Various',
    popularityScore: 4.9,
    reviewCount: 142,
    widgetSettings: {
      primaryColor: '#D4AF37',
      secondaryColor: '#B8860B',
      theme: 'dark',
      layout: 'modern',
      buttonLabels: {
        call: 'Call Now',
        sms: 'Message Us',
        whatsapp: 'WhatsApp',
        chat: 'Live Support'
      }
    }
  }
];

// Define types
type Industry = 'Law' | 'Real Estate' | 'Healthcare' | 'Dental' | 'Insurance' | 'Contractors' | 'Restaurants' | 'Various';
type Category = 'legal' | 'real-estate' | 'healthcare' | 'finance' | 'home-services' | 'hospitality' | 'luxury';

type Template = {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  category: Category;
  industry: Industry;
  popularityScore: number;
  reviewCount: number;
  widgetSettings: any;
};

export default function TemplatesPage() {
  const router = useRouter();
  const { user, loading } = useUser({
    redirectTo: '/login',
  });

  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState<Industry | 'All'>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // In a real application, fetch templates data here
  useEffect(() => {
    if (!user) return;
    
    const fetchTemplates = async () => {
      setIsLoading(true);
      try {
        // This would be a real API call in production
        // const response = await fetch('/api/templates');
        // const data = await response.json();
        // setTemplates(data);
        
        // Using sample data
        setTemplates(availableTemplates);
        setFilteredTemplates(availableTemplates);
        
        // Simulate API delay
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching templates:', error);
        setIsLoading(false);
      }
    };
    
    fetchTemplates();
  }, [user]);

  // Filter templates based on search term and industry
  useEffect(() => {
    let result = templates;
    
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        template => 
          template.name.toLowerCase().includes(lowerSearchTerm) ||
          template.description.toLowerCase().includes(lowerSearchTerm) ||
          template.industry.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    if (industryFilter !== 'All') {
      result = result.filter(template => template.industry === industryFilter);
    }
    
    // Sort by popularity
    result = [...result].sort((a, b) => b.popularityScore - a.popularityScore);
    
    setFilteredTemplates(result);
  }, [searchTerm, industryFilter, templates]);

  const openTemplateModal = (template: Template) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };
  
  const closeTemplateModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedTemplate(null), 300); // Wait for animation to finish
  };
  
  const useTemplate = (template: Template) => {
    // In a real app, you would call an API to apply the template to the user's widget
    // Then redirect to the script generator with the new settings
    router.push('/dashboard/script-generator');
  };

  // Render star rating
  const StarRating = ({ score }: { score: number }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`h-4 w-4 ${
              star <= Math.round(score)
                ? 'text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{score.toFixed(1)}</span>
      </div>
    );
  };

  if (loading || isLoading) {
    return <DashboardLayout>Loading templates...</DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Widget Templates</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-medium mb-4">Find the Perfect Template</h2>
          <p className="text-gray-600 mb-6">
            Choose from our professionally designed templates to quickly set up your widget. Each template is optimized for specific industries and use cases.
          </p>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search templates..."
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <label htmlFor="industry-filter" className="text-sm font-medium text-gray-700">
                Industry:
              </label>
              <select
                id="industry-filter"
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value as Industry | 'All')}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="All">All Industries</option>
                <option value="Law">Law</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Dental">Dental</option>
                <option value="Insurance">Insurance</option>
                <option value="Contractors">Contractors</option>
                <option value="Restaurants">Restaurants</option>
                <option value="Various">Various Industries</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 flex flex-col"
            >
              <div className="h-48 bg-gray-200 relative">
                {/* Placeholder for template preview image */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  <span className="text-lg font-semibold">{template.name} Preview</span>
                </div>
              </div>
              
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-600">{template.industry}</p>
                  </div>
                  <StarRating score={template.popularityScore} />
                </div>
                
                <p className="mt-3 text-sm text-gray-600">
                  {template.description}
                </p>
                
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center text-gray-600">
                    <CheckIcon className="h-4 w-4 text-green-500 mr-1" />
                    Responsive Design
                  </div>
                  <div className="flex items-center text-gray-600">
                    <CheckIcon className="h-4 w-4 text-green-500 mr-1" />
                    Lead Capture
                  </div>
                  <div className="flex items-center text-gray-600">
                    <CheckIcon className="h-4 w-4 text-green-500 mr-1" />
                    Multiple Channels
                  </div>
                  <div className="flex items-center text-gray-600">
                    <CheckIcon className="h-4 w-4 text-green-500 mr-1" />
                    Customizable
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-5 py-3 flex justify-between items-center">
                <span className="text-xs text-gray-500">{template.reviewCount} reviews</span>
                
                <button
                  type="button"
                  onClick={() => openTemplateModal(template)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Preview & Use
                  <ArrowCircleRightIcon className="ml-1.5 h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Template Preview Modal */}
        {selectedTemplate && (
          <div className={`fixed inset-0 overflow-y-auto z-50 ${isModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-300`}>
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeTemplateModal}></div>
              </div>
              
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              
              <div 
                className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
                  isModalOpen ? 'sm:translate-y-0 opacity-100' : 'sm:translate-y-4 opacity-0'
                }`}
              >
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {selectedTemplate.name} Template
                      </h3>
                      
                      <div className="mt-4 bg-gray-100 rounded-lg overflow-hidden">
                        <div className="h-56 bg-gray-200 relative">
                          {/* Placeholder for template preview image */}
                          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                            <span className="text-lg font-semibold">Live Preview</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900">Description</h4>
                        <p className="mt-1 text-sm text-gray-600">
                          {selectedTemplate.description}
                        </p>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Industry</h4>
                          <p className="mt-1 text-sm text-gray-600">
                            {selectedTemplate.industry}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Rating</h4>
                          <div className="mt-1">
                            <StarRating score={selectedTemplate.popularityScore} />
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900">Included Features</h4>
                        <div className="mt-1 grid grid-cols-2 gap-y-1 text-sm">
                          <div className="flex items-center text-gray-600">
                            <CheckIcon className="h-4 w-4 text-green-500 mr-1" />
                            Custom Colors
                          </div>
                          <div className="flex items-center text-gray-600">
                            <CheckIcon className="h-4 w-4 text-green-500 mr-1" />
                            Optimized Button Labels
                          </div>
                          <div className="flex items-center text-gray-600">
                            <CheckIcon className="h-4 w-4 text-green-500 mr-1" />
                            Industry-Specific Copy
                          </div>
                          <div className="flex items-center text-gray-600">
                            <CheckIcon className="h-4 w-4 text-green-500 mr-1" />
                            Mobile Responsive
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 bg-yellow-50 rounded-md p-3">
                        <div className="flex">
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">Important Note</h3>
                            <div className="mt-1 text-sm text-yellow-700">
                              <p>Using this template will override your current widget settings. You can still make additional customizations after applying the template.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={() => useTemplate(selectedTemplate)}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Use This Template
                  </button>
                  <button
                    type="button"
                    onClick={closeTemplateModal}
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