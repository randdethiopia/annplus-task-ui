'use client'

import Dashboard from '@/app/datacollector/components/Dashboard'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/authStore'

export default function DataCollectorDashboardPage() {
  const router = useRouter()
  const { logOut } = useAuthStore()

  const handleLogout = () => {
    logOut()
    localStorage.removeItem('isAuthenticated')
    router.push('/auth/datacollector/login')
  }

  return (
    <main className="min-h-screen bg-background">
      <Dashboard onLogout={handleLogout} />
    </main>
  )
}
