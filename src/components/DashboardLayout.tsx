import { useState, ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession, signOut } from 'next-auth/react'
import { 
  HomeIcon, 
  ChatBubbleLeftRightIcon, 
  CalendarIcon, 
  UserGroupIcon, 
  CogIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  CreditCardIcon,
  CommandLineIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'

// Update the type to match the actual icon component type
type NavItem = {
  name: string
  href: string
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement> & {
    title?: string | undefined;
    titleId?: string | undefined;
  } & React.RefAttributes<SVGSVGElement>>
  current: boolean
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, current: false },
  { name: 'Conversations', href: '/dashboard/conversations', icon: ChatBubbleLeftRightIcon, current: false },
  { name: 'Calendar', href: '/dashboard/calendar', icon: CalendarIcon, current: false },
  { name: 'Leads', href: '/dashboard/leads', icon: UserGroupIcon, current: false },
  { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon, current: false },
  { name: 'Knowledge Base', href: '/dashboard/knowledge-base', icon: DocumentTextIcon, current: false },
  { name: 'Settings', href: '/dashboard/settings', icon: CogIcon, current: false },
  { name: 'Widget Generator', href: '/dashboard/script-generator', icon: CommandLineIcon, current: false },
  { name: 'Subscription', href: '/dashboard/subscription', icon: CreditCardIcon, current: false },
]

type DashboardLayoutProps = {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }
  
  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return router.pathname === href
    }
    return router.pathname.startsWith(href)
  }
  
  const currentPath = router.pathname
  
  const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, current: currentPath === '/dashboard' },
    { name: 'Widget Generator', href: '/dashboard/script-generator', icon: CommandLineIcon, current: currentPath === '/dashboard/script-generator' },
    { name: 'Integration Settings', href: '/dashboard/settings', icon: CogIcon, current: currentPath === '/dashboard/settings' },
    { name: 'Subscription', href: '/dashboard/subscription', icon: CreditCardIcon, current: currentPath === '/dashboard/subscription' },
    { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon, current: currentPath === '/dashboard/analytics' },
  ]
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true" />
        
        <div className="fixed inset-0 flex">
          <div className="relative flex flex-col flex-1 w-full max-w-xs bg-white">
            <div className="absolute top-0 right-0 pt-2 -mr-12">
              <button
                type="button"
                className="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <XMarkIcon className="w-6 h-6 text-white" aria-hidden="true" />
              </button>
            </div>
            
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <Link href="/dashboard" className="text-2xl font-bold text-primary-600">
                  Case<span className="text-secondary-600">FlowPro</span>
                </Link>
              </div>
              <nav className="mt-5 space-y-1 px-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                      item.current
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon
                      className={`mr-4 h-6 w-6 flex-shrink-0 ${
                        item.current ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex flex-shrink-0 p-4 border-t border-gray-200">
              <button
                onClick={() => signOut()}
                className="flex items-center w-full px-2 py-2 text-base font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
              >
                <ArrowRightOnRectangleIcon className="w-6 h-6 mr-4 text-gray-400" aria-hidden="true" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-1 h-full border-r border-gray-200 bg-white">
          <div className="flex items-center flex-shrink-0 h-16 px-4 border-b border-gray-200">
            <Link href="/dashboard" className="text-2xl font-bold text-primary-600">
              Case<span className="text-secondary-600">FlowPro</span>
            </Link>
          </div>
          <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
            <nav className="flex-1 px-2 space-y-1 bg-white">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    item.current
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      item.current ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex flex-shrink-0 p-4 border-t border-gray-200">
            <button
              onClick={() => signOut()}
              className="flex items-center w-full px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3 text-gray-400" aria-hidden="true" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:pl-64">
        {/* Top navbar */}
        <div className="sticky top-0 z-10 flex flex-shrink-0 h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 text-gray-500 border-r border-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="w-6 h-6" aria-hidden="true" />
          </button>
          <div className="flex justify-between flex-1 px-4">
            <div className="flex flex-1">
              {/* You could add search or other controls here */}
            </div>
            <div className="flex items-center ml-4 md:ml-6">
              {/* Profile dropdown could go here */}
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                    {session?.user?.name?.charAt(0) || 'U'}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{session?.user?.name || 'User'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 pb-8">
          {children}
        </main>
      </div>
    </div>
  )
} 