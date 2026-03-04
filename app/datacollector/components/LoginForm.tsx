'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Lock, Phone } from 'lucide-react'
import { toast } from 'sonner'

interface LoginFormProps {
  onLogin: () => void
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 10) {
      value = value.slice(0, 10)
    }
    setPhoneNumber(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate phone format
    if (phoneNumber.length !== 10 || !phoneNumber.startsWith('09')) {
      toast.error('Please enter a valid phone number (09xxxxxxxx)')
      setIsLoading(false)
      return
    }

    // Validate password
    if (password.length === 0) {
      toast.error('Please enter your password')
      setIsLoading(false)
      return
    }

    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Hardcoded credentials
    const validPhone = '0912345678'
    const validPassword = '1234'

    if (phoneNumber === validPhone && password === validPassword) {
      toast.success('Login successful!')
      onLogin()
    } else {
      toast.error('Invalid phone number or password')
    }

    setIsLoading(false)
  }

  const displayPhone = phoneNumber
    ? `09${phoneNumber.slice(2)}`
    : ''

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary p-3 rounded-lg">
              <Lock className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Login</h1>
          <p className="text-muted-foreground mt-2">Enter your credentials to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-foreground">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="09xxxxxxxx"
                value={displayPhone}
                onChange={handlePhoneChange}
                className="pl-10 text-base"
                disabled={isLoading}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Format: 09xxxxxxxx (10 digits)
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 text-base"
                disabled={isLoading}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full mt-6 text-base h-10"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            <strong>Demo Credentials:</strong>
          </p>
          <p className="text-xs text-muted-foreground text-center mt-1">
            Phone: 09<strong>12345678</strong>
          </p>
          <p className="text-xs text-muted-foreground text-center">
            Password: <strong>1234</strong>
          </p>
        </div>
      </Card>
    </div>
  )
}
