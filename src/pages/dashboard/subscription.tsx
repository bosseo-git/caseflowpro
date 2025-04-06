import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import DashboardLayout from '@/components/DashboardLayout'
import { useUser } from '@/lib/hooks'
import { CheckIcon } from '@heroicons/react/24/solid'

// Subscription plan types
type PlanTier = 'free' | 'website' | 'messaging' | 'complete'

type SubscriptionPlan = {
  id: string
  name: string
  tier: PlanTier
  price: string
  billing: 'monthly' | 'yearly'
  description: string
  features: string[]
  isCurrent: boolean
}

export default function SubscriptionPage() {
  const router = useRouter()
  const { user, loading } = useUser({
    redirectTo: '/login',
  })
  
  const [currentPlan, setCurrentPlan] = useState<PlanTier>('free')
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [isLoading, setIsLoading] = useState(true)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)

  // Mock subscription plans
  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'plan-free',
      name: 'Free',
      tier: 'free',
      price: '$0',
      billing: 'monthly',
      description: 'Limited features to get you started',
      features: [
        'Basic widget with 1 contact option',
        'Limited to 10 leads per month',
        'Email support',
      ],
      isCurrent: currentPlan === 'free',
    },
    {
      id: 'plan-website',
      name: 'Website',
      tier: 'website',
      price: billingCycle === 'monthly' ? '$149' : '$1490',
      billing: billingCycle,
      description: 'Intake widget for your law firm website',
      features: [
        'Website Widget with 4 Contact Options',
        'Customizable Intake Forms',
        'Client Dashboard',
        'CRM Integration',
        'Basic Analytics',
        'Unlimited Leads',
        'Email & Chat Support',
      ],
      isCurrent: currentPlan === 'website',
    },
    {
      id: 'plan-messaging',
      name: 'Website + Messaging',
      tier: 'messaging',
      price: billingCycle === 'monthly' ? '$249' : '$2490',
      billing: billingCycle,
      description: 'Advanced form customization and messaging capabilities',
      features: [
        'Website Widget with 4 Contact Options',
        'Advanced Form Customization',
        'Client Dashboard',
        'CRM Integration',
        'SMS Automation Workflows',
        'WhatsApp Integration',
        'Chat History & Analytics',
        'Priority Support',
      ],
      isCurrent: currentPlan === 'messaging',
    },
    {
      id: 'plan-complete',
      name: 'Complete Suite',
      tier: 'complete',
      price: billingCycle === 'monthly' ? '$399' : '$3990',
      billing: billingCycle,
      description: 'Full AI intake solution with voice capabilities',
      features: [
        'Everything in Website + Messaging',
        'AI Phone Answering',
        'Voice Transcription',
        'Calendar Integration',
        'Custom Branding',
        'Advanced Analytics & Reporting',
        'API Access',
        'Dedicated Account Manager',
      ],
      isCurrent: currentPlan === 'complete',
    },
  ]

  // Simulate loading user data
  useEffect(() => {
    if (user) {
      // In a real app, fetch the subscription data from an API
      setTimeout(() => {
        // Mock data - replace with actual API call in production
        setCurrentPlan('website')
        setIsLoading(false)
      }, 1000)
    }
  }, [user])

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    if (plan.tier === currentPlan) return
    setSelectedPlan(plan)
    setShowConfirmation(true)
  }

  const handleConfirmChange = () => {
    // In a real app, call API to change subscription
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      if (selectedPlan) {
        setCurrentPlan(selectedPlan.tier)
        setShowConfirmation(false)
        setSelectedPlan(null)
      }
      setIsLoading(false)
    }, 1500)
  }

  const toggleBillingCycle = () => {
    setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')
  }

  if (loading || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Subscription Management</h1>
          <div className="flex items-center">
            <span className={`mr-2 ${billingCycle === 'monthly' ? 'font-semibold' : 'text-gray-500'}`}>Monthly</span>
            <button
              onClick={toggleBillingCycle}
              className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              style={{ backgroundColor: billingCycle === 'yearly' ? '#4F46E5' : '#E5E7EB' }}
            >
              <span className="sr-only">Toggle billing cycle</span>
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  billingCycle === 'yearly' ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`ml-2 ${billingCycle === 'yearly' ? 'font-semibold' : 'text-gray-500'}`}>
              Yearly (Save 16%)
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-lg font-medium text-gray-900">Current Plan: {subscriptionPlans.find(p => p.tier === currentPlan)?.name}</h2>
            <p className="mt-2 text-sm text-gray-500">
              Manage your subscription and billing information.
            </p>
          </div>

          <div className="border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
              {subscriptionPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`border rounded-lg overflow-hidden ${
                    plan.isCurrent ? 'border-primary-500 ring-2 ring-primary-500' : 'border-gray-200'
                  }`}
                >
                  <div className="p-6">
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      {plan.price !== '$0' && (
                        <span className="text-gray-500 text-sm">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                      )}
                    </div>
                    <p className="mt-4 text-sm text-gray-600">{plan.description}</p>
                  </div>

                  <div className="px-6 pb-6">
                    <ul className="mt-4 space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6">
                      {plan.isCurrent ? (
                        <button
                          disabled
                          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-400 cursor-not-allowed"
                        >
                          Current Plan
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePlanSelect(plan)}
                          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          {plan.tier === 'free' ? 'Downgrade' : currentPlan === 'free' ? 'Upgrade' : plan.tier > currentPlan ? 'Upgrade' : 'Downgrade'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-8 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Billing Information</h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4 bg-white">
                <h4 className="font-medium">Payment Method</h4>
                <div className="mt-2 flex items-center">
                  <div className="h-8 w-12 bg-gray-200 rounded mr-3"></div>
                  <span>•••• •••• •••• 4242</span>
                </div>
                <button className="mt-3 text-sm text-primary-600 hover:text-primary-700">
                  Update payment method
                </button>
              </div>

              <div className="border rounded-lg p-4 bg-white">
                <h4 className="font-medium">Billing Address</h4>
                <p className="mt-2 text-sm text-gray-600">
                  John Doe<br />
                  123 Main St<br />
                  San Francisco, CA 94105<br />
                  United States
                </p>
                <button className="mt-3 text-sm text-primary-600 hover:text-primary-700">
                  Update address
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && selectedPlan && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Confirm Subscription Change
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to change your subscription from {' '}
                          <span className="font-medium">{subscriptionPlans.find(p => p.tier === currentPlan)?.name}</span> to {' '}
                          <span className="font-medium">{selectedPlan.name}</span>?
                        </p>
                        {selectedPlan.tier < currentPlan && (
                          <p className="mt-2 text-sm text-red-500">
                            Note: Downgrading your plan will limit access to certain features.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleConfirmChange}
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowConfirmation(false)}
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