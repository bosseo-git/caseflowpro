import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import DashboardLayout from '@/components/DashboardLayout'
import { useUser } from '@/lib/hooks'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#4CAF50'];

// Sample data - in a real application, this would come from your backend
const sampleData = {
  widgetImpressions: [
    { name: 'Jun 1', value: 24 },
    { name: 'Jun 2', value: 13 },
    { name: 'Jun 3', value: 98 },
    { name: 'Jun 4', value: 39 },
    { name: 'Jun 5', value: 48 },
    { name: 'Jun 6', value: 38 },
    { name: 'Jun 7', value: 43 }
  ],
  buttonClicks: [
    { name: 'Call', value: 120 },
    { name: 'SMS', value: 80 },
    { name: 'WhatsApp', value: 160 },
    { name: 'Chat', value: 40 }
  ],
  conversions: [
    { name: 'Call Form', value: 45 },
    { name: 'SMS Form', value: 32 },
    { name: 'Chat Form', value: 18 }
  ],
  conversionRate: [
    { name: 'Converted', value: 95 },
    { name: 'Not Converted', value: 405 }
  ],
  topReferrers: [
    { name: 'Google', value: 145 },
    { name: 'Direct', value: 132 },
    { name: 'Facebook', value: 78 },
    { name: 'Twitter', value: 41 },
    { name: 'LinkedIn', value: 24 }
  ]
};

type DateRangeType = '7d' | '30d' | '90d' | 'ytd' | 'all';

export default function AnalyticsDashboard() {
  const router = useRouter();
  const { user, loading } = useUser({
    redirectTo: '/login',
  });

  const [dateRange, setDateRange] = useState<DateRangeType>('7d');
  const [isLoading, setIsLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(sampleData);
  
  // In a real application, fetch analytics data here
  useEffect(() => {
    if (!user) return;
    
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        // This would be a real API call in production
        // const response = await fetch(\`/api/analytics?range=${dateRange}\`);
        // const data = await response.json();
        // setAnalyticsData(data);
        
        // Simulate API delay
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setIsLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [dateRange, user]);

  if (loading || isLoading) {
    return <DashboardLayout>Loading analytics data...</DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Widget Analytics</h1>
          
          <div className="flex space-x-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as DateRangeType)}
              className="border border-gray-300 rounded-md shadow-sm px-3 py-2 bg-white text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="ytd">Year to Date</option>
              <option value="all">All Time</option>
            </select>
            
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Export PDF
            </button>
          </div>
        </div>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Impressions</h3>
            <p className="text-3xl font-bold">1,248</p>
            <p className="text-sm text-green-600 mt-2">↑ 12% from previous period</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Button Clicks</h3>
            <p className="text-3xl font-bold">502</p>
            <p className="text-sm text-green-600 mt-2">↑ 8% from previous period</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Form Submissions</h3>
            <p className="text-3xl font-bold">95</p>
            <p className="text-sm text-red-600 mt-2">↓ 3% from previous period</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Conversion Rate</h3>
            <p className="text-3xl font-bold">19%</p>
            <p className="text-sm text-gray-500 mt-2">Same as previous period</p>
          </div>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium mb-4">Daily Impressions</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analyticsData.widgetImpressions}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Impressions" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium mb-4">Button Clicks</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.buttonClicks}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analyticsData.buttonClicks.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium mb-4">Form Submissions</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analyticsData.conversions}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Submissions" fill="#4CAF50" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium mb-4">Top Referrers</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analyticsData.topReferrers}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Visitors" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Detailed Data Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium mb-4">Recent Events</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Page
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Referrer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Widget Impression</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">/contact-us</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">google.com</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jun 7, 2023 10:23 AM</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Call Button Click</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">/services</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">facebook.com</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jun 7, 2023 9:45 AM</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Form Submission</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">/blog/post-1</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Direct</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jun 7, 2023 8:32 AM</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">WhatsApp Click</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">/pricing</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">google.com</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jun 6, 2023 4:17 PM</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-center">
            <button className="text-sm text-primary-600 hover:text-primary-500">
              View All Events
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 