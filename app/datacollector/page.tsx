'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/authStore'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/datacollector/tasks')
      return
    }

    router.replace('/auth/datacollector')
  }, [isAuthenticated, router])

  return <main className="min-h-screen bg-background" />
}
