'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const savedAuth = localStorage.getItem('isAuthenticated')
    if (savedAuth === 'true') {
      router.replace('/datacollector/dashboard')
      return
    }

    router.replace('/datacollector/auth/login')
  }, [router])

  return <main className="min-h-screen bg-background" />
}
