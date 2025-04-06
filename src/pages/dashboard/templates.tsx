import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { StarIcon } from '@heroicons/react/24/solid'
import { ArrowRightCircleIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import DashboardLayout from '@/components/DashboardLayout'
import { useUser } from '@/lib/hooks'
import WidgetPreview from '@/components/WidgetPreview'

// Define types
type WidgetPosition = 'right' | 'left'
type WidgetLayout = 'classic' | 'modern' | 'circles' | 'compact' | 'minimalist'
type ModalTheme = 'default' | 'minimal' | 'bordered' | 'dark' | 'branded'

type WidgetDesignSettings = {
  theme: ModalTheme
  layout: WidgetLayout
  position: WidgetPosition
  primaryColor: string
  secondaryColor: string
  startMinimized: boolean
  fixedToBottomRight: boolean
  buttonPadding: 'sm' | 'md' | 'lg'
  borderRadius: 'sm' | 'md' | 'lg' | 'full'
  showLabels: boolean
  animation: 'fade' | 'scale' | 'slide'
  buttonLabels: {
    call: string
    sms: string
    whatsapp: string
    chat: string
  }
  buttonColors: {
    call: string
    sms: string
    whatsapp: string
    chat: string
  }
}

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
  widgetSettings: WidgetDesignSettings;
};

// Sample templates data - in a real application, this would come from your backend
const availableTemplates: Template[] = [
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
      theme: 'default',
      layout: 'modern',
      position: 'right',
      primaryColor: '#2C5282',
      secondaryColor: '#4299E1',
      startMinimized: false,
      fixedToBottomRight: true,
      buttonPadding: 'md',
      borderRadius: 'md',
      showLabels: true,
      animation: 'scale',
      buttonLabels: {
        call: 'Free Consultation',
        sms: 'Text Us',
        whatsapp: 'WhatsApp',
        chat: 'Case Evaluation'
      },
      buttonColors: {
        call: '#2C5282',
        sms: '#4299E1',
        whatsapp: '#38B2AC',
        chat: '#2C5282'
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
      theme: 'branded',
      layout: 'classic',
      position: 'right',
      primaryColor: '#5A67D8',
      secondaryColor: '#7F9CF5',
      startMinimized: false,
      fixedToBottomRight: true,
      buttonPadding: 'md',
      borderRadius: 'full',
      showLabels: true,
      animation: 'scale',
      buttonLabels: {
        call: 'Speak to an Attorney',
        sms: 'Quick Question',
        whatsapp: 'Chat Now',
        chat: 'Schedule Consultation'
      },
      buttonColors: {
        call: '#5A67D8',
        sms: '#7F9CF5',
        whatsapp: '#6B46C1',
        chat: '#5A67D8'
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
      theme: 'minimal',
      layout: 'modern',
      position: 'right',
      primaryColor: '#2C7A7B',
      secondaryColor: '#38B2AC',
      startMinimized: false,
      fixedToBottomRight: true,
      buttonPadding: 'md',
      borderRadius: 'lg',
      showLabels: true,
      animation: 'fade',
      buttonLabels: {
        call: 'Call Agent',
        sms: 'Quick Question',
        whatsapp: 'WhatsApp',
        chat: 'Schedule Viewing'
      },
      buttonColors: {
        call: '#2C7A7B',
        sms: '#38B2AC',
        whatsapp: '#319795',
        chat: '#2C7A7B'
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
      theme: 'default',
      layout: 'modern',
      position: 'right',
      primaryColor: '#3182CE',
      secondaryColor: '#63B3ED',
      startMinimized: false,
      fixedToBottomRight: true,
      buttonPadding: 'md',
      borderRadius: 'md',
      showLabels: true,
      animation: 'scale',
      buttonLabels: {
        call: 'Book Appointment',
        sms: 'Ask a Question',
        whatsapp: 'WhatsApp Us',
        chat: 'Virtual Consult'
      },
      buttonColors: {
        call: '#3182CE',
        sms: '#63B3ED',
        whatsapp: '#4299E1',
        chat: '#3182CE'
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
      theme: 'default',
      layout: 'modern',
      position: 'right',
      primaryColor: '#3182CE',
      secondaryColor: '#4FD1C5',
      startMinimized: false,
      fixedToBottomRight: true,
      buttonPadding: 'md',
      borderRadius: 'md',
      showLabels: true,
      animation: 'scale',
      buttonLabels: {
        call: 'Schedule Cleaning',
        sms: 'Quick Question',
        whatsapp: 'WhatsApp',
        chat: 'Emergency Care'
      },
      buttonColors: {
        call: '#3182CE',
        sms: '#4FD1C5',
        whatsapp: '#38B2AC',
        chat: '#3182CE'
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
      theme: 'bordered',
      layout: 'classic',
      position: 'right',
      primaryColor: '#1A365D',
      secondaryColor: '#2B6CB0',
      startMinimized: false,
      fixedToBottomRight: true,
      buttonPadding: 'md',
      borderRadius: 'sm',
      showLabels: true,
      animation: 'scale',
      buttonLabels: {
        call: 'Get a Quote',
        sms: 'Quick Question',
        whatsapp: 'WhatsApp',
        chat: 'Compare Plans'
      },
      buttonColors: {
        call: '#1A365D',
        sms: '#2B6CB0',
        whatsapp: '#2C5282',
        chat: '#1A365D'
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
      theme: 'default',
      layout: 'modern',
      position: 'right',
      primaryColor: '#C05621',
      secondaryColor: '#ED8936',
      startMinimized: false,
      fixedToBottomRight: true,
      buttonPadding: 'md',
      borderRadius: 'md',
      showLabels: true,
      animation: 'scale',
      buttonLabels: {
        call: 'Free Estimate',
        sms: 'Quick Question',
        whatsapp: 'Send Photos',
        chat: 'Emergency Service'
      },
      buttonColors: {
        call: '#C05621',
        sms: '#ED8936',
        whatsapp: '#DD6B20',
        chat: '#C05621'
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
      theme: 'dark',
      layout: 'modern',
      position: 'right',
      primaryColor: '#C53030',
      secondaryColor: '#F56565',
      startMinimized: false,
      fixedToBottomRight: true,
      buttonPadding: 'md',
      borderRadius: 'full',
      showLabels: true,
      animation: 'fade',
      buttonLabels: {
        call: 'Reservations',
        sms: 'Order Takeout',
        whatsapp: 'Special Events',
        chat: 'View Menu'
      },
      buttonColors: {
        call: '#C53030',
        sms: '#F56565',
        whatsapp: '#E53E3E',
        chat: '#C53030'
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
      theme: 'dark',
      layout: 'modern',
      position: 'right',
      primaryColor: '#D4AF37',
      secondaryColor: '#B8860B',
      startMinimized: false,
      fixedToBottomRight: true,
      buttonPadding: 'md',
      borderRadius: 'md',
      showLabels: true,
      animation: 'scale',
      buttonLabels: {
        call: 'Call Now',
        sms: 'Message Us',
        whatsapp: 'WhatsApp',
        chat: 'Live Support'
      },
      buttonColors: {
        call: '#D4AF37',
        sms: '#B8860B',
        whatsapp: '#DAA520',
        chat: '#D4AF37'
      }
    }
  }
];

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
  const [showPreview, setShowPreview] = useState(false);
  
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
    setShowPreview(false);
    setTimeout(() => setSelectedTemplate(null), 300); // Wait for animation to finish
  };
  
  const useTemplate = async (template: Template) => {
    // In a real app, you would call an API to apply the template to the user's widget
    try {
      // Simulate API call
      console.log('Applying template:', template.id);
      
      // In a real implementation, you'd save the settings to your backend:
      // await fetch('/api/widget-settings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(template.widgetSettings),
      // });
      
      // Then redirect to the widget designer with the applied template
      router.push('/dashboard/widget-designer');
    } catch (error) {
      console.error('Error applying template:', error);
    }
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

  // Function to open the preview
  const openPreview = () => {
    setShowPreview(true);
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
              <div 
                className="h-48 bg-gray-100 relative cursor-pointer overflow-hidden group"
                onClick={() => openTemplateModal(template)}
              >
                {/* Display a snapshot of the widget */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className={`h-10 px-3 flex items-center justify-center rounded-md shadow-md text-white text-sm font-medium`}
                    style={{ backgroundColor: template.widgetSettings.primaryColor }}
                  >
                    {template.widgetSettings.layout === 'classic' ? (
                      <span>Contact Us</span>
                    ) : (
                      <div className="flex space-x-2">
                        <div className="rounded-full h-6 w-6 flex items-center justify-center" 
                            style={{ backgroundColor: template.widgetSettings.buttonColors.call }}>
                          <span className="text-xs">C</span>
                        </div>
                        <div className="rounded-full h-6 w-6 flex items-center justify-center"
                            style={{ backgroundColor: template.widgetSettings.buttonColors.sms }}>
                          <span className="text-xs">S</span>
                        </div>
                        <div className="rounded-full h-6 w-6 flex items-center justify-center"
                            style={{ backgroundColor: template.widgetSettings.buttonColors.chat }}>
                          <span className="text-xs">M</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Overlay with "Preview" button */}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button 
                    className="px-4 py-2 bg-white text-gray-900 rounded-md shadow-lg font-medium"
                  >
                    Preview Template
                  </button>
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
                  <ArrowRightCircleIcon className="ml-1.5 h-4 w-4" />
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
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          {selectedTemplate.name} Template
                        </h3>
                        <button
                          type="button"
                          onClick={closeTemplateModal}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                      
                      <div className="mt-4">
                        <div className="bg-gray-100 rounded-lg overflow-hidden relative h-56">
                          <button
                            className="absolute inset-0 w-full h-full flex items-center justify-center"
                            onClick={openPreview}
                          >
                            <div 
                              className={`h-12 px-4 flex items-center justify-center rounded-md shadow-md text-white font-medium`}
                              style={{ backgroundColor: selectedTemplate.widgetSettings.primaryColor }}
                            >
                              {selectedTemplate.widgetSettings.layout === 'classic' ? (
                                <span>See Live Preview</span>
                              ) : (
                                <div className="flex space-x-3">
                                  <div className={`rounded-full h-8 w-8 flex items-center justify-center`}
                                        style={{ backgroundColor: selectedTemplate.widgetSettings.buttonColors.call }}>
                                    <span>C</span>
                                  </div>
                                  <div className={`rounded-full h-8 w-8 flex items-center justify-center`}
                                        style={{ backgroundColor: selectedTemplate.widgetSettings.buttonColors.sms }}>
                                    <span>S</span>
                                  </div>
                                  <div className={`rounded-full h-8 w-8 flex items-center justify-center`}
                                        style={{ backgroundColor: selectedTemplate.widgetSettings.buttonColors.chat }}>
                                    <span>M</span>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="absolute bottom-4 left-0 right-0 text-center text-gray-600 font-medium">
                              Click to see live preview
                            </div>
                          </button>
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
        
        {/* Live Widget Preview */}
        {selectedTemplate && (
          <WidgetPreview 
            settings={selectedTemplate.widgetSettings}
            isOpen={showPreview}
            onClose={() => setShowPreview(false)}
          />
        )}
      </div>
    </DashboardLayout>
  )
} 