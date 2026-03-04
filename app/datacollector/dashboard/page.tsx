'use client'

import Dashboard from '@/app/datacollector/components/Dashboard'
import { useRouter } from 'next/navigation'

export default function DataCollectorDashboardPage() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    router.push('/datacollector/auth/login')
  }

  return (
    <main className="min-h-screen bg-background">
      <Dashboard onLogout={handleLogout} />
    </main>
  )
}