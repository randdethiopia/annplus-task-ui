'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, use } from 'react'
import api from '@/api'
import { Task } from '@/api/task'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Upload as UploadIcon } from 'lucide-react'
import axios from 'axios'

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const taskId = id as string
 
  const [task, setTask] = useState<Task>()
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data, isError, isLoading, isSuccess } = api.task.getById.useQuery(taskId)
  const { mutate } = api.upload.getPresignedUrl.useMutation()
  

  useEffect(() => {
    if (isSuccess && data) {
      setTask(data.task)
    }
  }, [data, isSuccess])

  const overallProgress = task
    ? Math.round(
        ((task.uploaded.images + task.uploaded.videos) /
          (task.imageCount + task.videoCount)) *
          100
      )
    : 0

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0])
  }

  const uploadFileToS3 = async (uploadUrl: string, file: File, contentType: string) => {
    try {
      await axios.put(uploadUrl, file, {
        headers: {
          'Content-Type': contentType,
        },
      })
      console.log('File uploaded successfully')
      return true;
    } catch (error) {
      console.error('Error uploading file:', error)
      return false;
    }
  }

  const handleSubmit = () => {
    if (file) {
      console.log(file.name)
      mutate(file.name, {
        onSuccess: (data) => {
          console.log('Presigned URL obtained:', data)
          uploadFileToS3(data.uploadUrl, file, data.contentType).then(success => {
            if (success) {
              alert('File uploaded successfully!')
            } else {
              alert('Failed to upload file. Please try again.')
            }
          })
        }
    })
  }
  }

  if (isLoading) return <div className="min-h-screen bg-background" />
  if (isError || !task)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-slate-600">Failed to load task details.</p>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push('/datacollector/tasks')}
              variant="outline"
              size="icon"
              className="rounded-full"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{task.title}</h1>
              <p className="text-slate-600 text-sm mt-1">
                Upload all required files to complete this task
              </p>
            </div>
          </div>
        </div>

        <Card className="p-6 mb-8 border-0 shadow-sm bg-white">
          <h3 className="font-semibold text-slate-900 mb-2">Task Description</h3>
          <p className="text-slate-700 text-sm leading-relaxed">{task.description}</p>
        </Card>

        <div className="bg-white p-6 rounded shadow-sm mb-8">
          <Button onClick={() => fileInputRef.current?.click()} className="mb-4" variant="outline">
            <UploadIcon className="w-4 h-4 mr-2" />
            Select File
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
          {file && <p className="mb-4">Selected: {file.name}</p>}
          <Button onClick={handleSubmit} disabled={!file} className="w-full bg-green-600 text-white hover:bg-green-700">
            Submit
          </Button>
        </div>

        <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-lg mb-8">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Overall Progress</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">
            {task.uploaded.images + task.uploaded.videos}/{task.imageCount + task.videoCount}
          </p>
          <Progress value={overallProgress} className="h-2 mt-2" />
        </div>
      </div>
    </div>
  )
}