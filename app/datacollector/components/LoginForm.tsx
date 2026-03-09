'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Lock, Phone } from 'lucide-react'
import { toast } from 'sonner'
import AuthApi from '@/api/auth'
import useAuthStore from '@/store/authStore'
import { z } from 'zod'

const dataCollectorLoginSchema = z.object({
  phone: z
    .string()
    .regex(/^09\d{8}$/, 'Please enter a valid phone number (09xxxxxxxx)'),
  password: z.string().min(1, 'Please enter your password'),
})

type DataCollectorLoginValues = z.infer<typeof dataCollectorLoginSchema>

export default function LoginForm() {
  const router = useRouter()
  const { setAccessToken } = useAuthStore()
  const { mutateAsync: login } = AuthApi.loginDataCollector.useMutation()

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DataCollectorLoginValues>({
    resolver: zodResolver(dataCollectorLoginSchema),
    defaultValues: {
      phone: '',
      password: '',
    },
  })

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10)
    setValue('phone', value, { shouldValidate: true })
  }

  const onSubmit = async (values: DataCollectorLoginValues) => {
    const toastId = toast.loading('Logging in...')
    try {
      const data = await login(values)
      setAccessToken(data.collector.id, data.token, 'collector')
      toast.success('Login successful!', { id: toastId })
      router.push('/datacollector/tasks')
    } catch {
      toast.error('Login failed. Please check your credentials and try again.', { id: toastId })
    }
  }


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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                {...register('phone')}
                onChange={handlePhoneChange}
                className="pl-10 text-base"
                disabled={isSubmitting}
                aria-invalid={!!errors.phone}
              />
            </div>
            {errors.phone && (
              <p className="text-xs font-medium text-rose-500">{errors.phone.message}</p>
            )}
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
                {...register('password')}
                className="pl-10 text-base"
                disabled={isSubmitting}
                aria-invalid={!!errors.password}
              />
            </div>
            {errors.password && (
              <p className="text-xs font-medium text-rose-500">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full mt-6 text-base h-10"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </form>

      </Card>
    </div>
  )
}
