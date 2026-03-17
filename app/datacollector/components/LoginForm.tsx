'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Lock, Phone } from 'lucide-react'
import { toast } from 'sonner'
import AuthApi from '@/api/auth'
import useAuthStore from '@/store/authStore'
import { z } from 'zod'
import { Spinner } from '@/components/ui/spinner'
import { useState } from 'react'

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
  const [serverError, setServerError] = useState<string | null>(null)

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
    setServerError(null)
    try {
      const data = await login(values)
      setAccessToken(data.collector.id, data.token, 'collector')
      toast.success('Login successful!', { id: toastId })
      router.push('/datacollector/tasks')
    } catch {
      setServerError('Login failed. Please check your credentials and try again.')
      toast.error('Login failed. Please check your credentials and try again.', { id: toastId })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} aria-label="login form">
      <div className="relative overflow-hidden px-6 py-6 sm:px-6">
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="phone" className="text-xs font-semibold uppercase text-slate-400">
              Phone number
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder="09xxxxxxxx"
              className="mt-2 h-11 rounded-xl"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              {...register('phone', { required: "Phone number is required" })}
              onChange={handlePhoneChange}
            />
            {errors.phone && (
              <p id="phone-error" className="mt-2 text-xs font-semibold text-rose-500">
                {errors.phone.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="text-xs font-semibold uppercase text-slate-400">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="mt-2 h-11 rounded-xl"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register('password', { required: "Password is required" })}
            />
            {errors.password && (
              <p id="password-error" className="mt-2 text-xs font-semibold text-rose-500">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>
        {serverError && (
          <p className="mt-4 text-sm font-semibold text-rose-500">{serverError}</p>
        )}
        <div className="mt-6 flex justify-between">
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            type="submit"
            className="h-11 rounded-xl bg-slate-900 px-6 text-white hover:bg-slate-800"
            disabled={isSubmitting}
          >
            {isSubmitting && <Spinner />}
            Login
          </Button>
        </div>
      </div>
    </form>
  )
}
