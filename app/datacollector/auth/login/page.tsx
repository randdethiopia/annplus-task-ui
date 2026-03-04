'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LoginForm from '@/app/datacollector/components/LoginForm'

export default function DataCollectorLoginPage() {
  const router = useRouter()

  useEffect(() => {
    const savedAuth = localStorage.getItem('isAuthenticated')
    if (savedAuth === 'true') {
      router.replace('/datacollector/dashboard')
    }
  }, [router])

  const handleLogin = () => {
    localStorage.setItem('isAuthenticated', 'true')
    router.push('/datacollector/dashboard')
  }

  return (
    <main className="min-h-screen bg-background">
      <LoginForm onLogin={handleLogin} />
    </main>
  )
}