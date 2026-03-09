'use client'

import api from '@/api'
import { Task } from '@/api/task'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Upload as UploadIcon, FileVideo, Image as ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { use, useEffect, useRef, useState } from 'react'

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const taskId = id as string

  const { data, isError, isLoading, isSuccess } = api.task.getById.useQuery(taskId)

  const [task, setTask] = useState<Task>()

  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

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

  const imageProgress = task?.imageCount
    ? Math.round((task.uploaded.images / task.imageCount) * 100)
    : 0

  const videoProgress = task?.videoCount
    ? Math.round((task.uploaded.videos / task.videoCount) * 100)
    : 0

  if (isLoading) return <div className="min-h-screen bg-background" />
  if (isError || !task) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-slate-600">Failed to load task details.</p></div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button onClick={() => router.push('/datacollector/tasks')} variant="outline" size="icon" className="rounded-full">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{task.title}</h1>
              <p className="text-slate-600 text-sm mt-1">Upload all required files to complete this task</p>
            </div>
          </div>
        </div>

        <Card className="p-6 mb-8 border-0 shadow-sm bg-white">
          <h3 className="font-semibold text-slate-900 mb-2">Task Description</h3>
          <p className="text-slate-700 text-sm leading-relaxed">{task.description}</p>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">

            {task.imageCount > 0 &&
            <Card className="p-6 border-0 shadow-sm bg-white">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2.5 rounded-lg">
                      <ImageIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Images</h3>
                      <p className="text-xs text-slate-600">{task.uploaded.images} of {task.imageCount} uploaded</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{task.uploaded.images}/{task.imageCount}</div>
                    <p className="text-xs text-slate-600">{task.imageCount - task.uploaded.images} remaining</p>
                  </div>
                </div>
                <Progress value={imageProgress} className="h-2" />
                <Button onClick={() => imageInputRef.current?.click()} disabled className="w-full gap-2 border-blue-200 text-blue-600 hover:bg-blue-50" variant="outline">
                  <UploadIcon className="w-4 h-4" />
                  Upload Images (2 more)
                </Button>
                <input ref={imageInputRef} type="file" multiple accept="image/*" className="hidden" />
              </div>
            </Card>
            }

            { task.videoCount > 0 &&
            <Card className="p-6 border-0 shadow-sm bg-white">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-50 p-2.5 rounded-lg">
                      <FileVideo className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Videos</h3>
                      <p className="text-xs text-slate-600">{task.uploaded.videos} of {task.videoCount} uploaded</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">{task.uploaded.videos}/{task.videoCount}</div>
                    <p className="text-xs text-slate-600">{task.videoCount - task.uploaded.videos} remaining</p>
                  </div>
                </div>
                <Progress value={videoProgress} className="h-2" />
                <Button onClick={() => videoInputRef.current?.click()} disabled className="w-full gap-2 border-purple-200 text-purple-600 hover:bg-purple-50" variant="outline">
                  <UploadIcon className="w-4 h-4" />
                  Upload Videos (1 more)
                </Button>
                <input ref={videoInputRef} type="file" multiple accept="video/*" className="hidden" />
              </div>
            </Card>
            }
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 border-0 shadow-sm bg-white sticky top-6">
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Overall Progress</p>
                      <p className="text-3xl font-bold text-slate-900 mt-1">2/5</p>
                    </div>
                    <div className="text-3xl">○</div>
                  </div>
                  <Progress value={overallProgress} className="h-2" />
                </div>

                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <p className="text-xs font-semibold text-amber-900 uppercase tracking-wide">Files Needed</p>
                  <p className="text-lg font-bold text-amber-900 mt-2">3 more</p>
                  <p className="text-xs text-amber-800 mt-1">Images: 2</p>
                  <p className="text-xs text-amber-800">Videos: 1</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <Button variant="outline" className="flex-1 border-slate-300 text-slate-700">Save & Exit</Button>
          <Button disabled className="flex-1 bg-green-600 hover:bg-green-700 text-white">Submit Task</Button>
        </div>
      </div>
    </div>
  )
}