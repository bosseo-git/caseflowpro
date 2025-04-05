import React, { ReactNode, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession, signOut } from 'next-auth/react'
import {
  HomeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  CreditCardIcon,
  UserGroupIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  CommandLineIcon,
} from '@heroicons/react/24/outline'

type DashboardLayoutProps = {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
    { 
      name: 'Widget Designer', 
      href: '/dashboard/widget-designer', 
      icon: DocumentTextIcon,
      badge: 'New'
    },
    {
      name: 'Script Generator',
      href: '/dashboard/script-generator',
      icon: CommandLineIcon
    },
    { name: 'Clients', href: '/dashboard/clients', icon: UserGroupIcon },
    { name: 'Integration Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
    { name: 'Subscription', href: '/dashboard/billing', icon: CreditCardIcon },
  ]

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Dashboard | CaseFlowPro</title>
        <meta name="description" content="Manage your law firm's client intake" />
      </Head>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 bg-gray-600 bg-opacity-75 z-40 transition-opacity ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
        onClick={closeSidebar}
      ></div>

      <div
        className={`fixed top-0 left-0 bottom-0 flex flex-col w-64 bg-white border-r border-gray-200 z-50 transform transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:z-auto`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <Link href="/dashboard" className="flex items-center">
            <span className="text-xl font-bold text-primary-600">CaseFlowPro</span>
          </Link>
          <button
            type="button"
            className="md:hidden text-gray-500 hover:text-gray-600"
            onClick={closeSidebar}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pt-5 pb-4">
          <nav className="mt-2 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = router.pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={closeSidebar}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      isActive ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-500'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex-shrink-0 border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                className="h-8 w-8 rounded-full"
                src={session?.user?.image || 'https://ui-avatars.com/api/?name=' + (session?.user?.name || 'User')}
                alt="User avatar"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{session?.user?.name || 'User'}</p>
              <p className="text-xs font-medium text-gray-500 truncate">{session?.user?.email}</p>
            </div>
          </div>
          <button
            type="button"
            className="mt-3 w-full flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            onClick={() => signOut()}
          >
            <ArrowLeftOnRectangleIcon className="mr-3 flex-shrink-0 h-5 w-5 text-gray-500" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col">
        {/* Mobile top nav */}
        <div className="sticky top-0 z-10 md:hidden bg-white pl-1 pt-1 sm:pl-3 sm:pt-3 shadow">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900"
            onClick={toggleSidebar}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
} 