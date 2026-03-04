'use client'

import { useState, useRef, use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Upload as UploadIcon, FileVideo, Image as ImageIcon, X, Play } from 'lucide-react'
import { toast } from 'sonner'
import { getTaskById, taskDetails, updateTaskById, type Task } from '@/lib/task-store'

interface UploadedFile {
  id: string
  file: File
  preview: string
  type: 'image' | 'video'
}

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const taskId = parseInt(id)

  const [task, setTask] = useState<Task | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const foundTask = getTaskById(taskId)
    queueMicrotask(() => {
      setTask(foundTask ?? null)
      setIsLoaded(true)
    })
  }, [taskId])

  const persistTask = (updates: Partial<Task>) => {
    const updatedTask = updateTaskById(taskId, updates)
    if (updatedTask) {
      setTask(updatedTask)
    }
    return updatedTask
  }

  const createPreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.readAsDataURL(file)
    })
  }

  if (!isLoaded) {
    return <div className="min-h-screen bg-background" />
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Task not found</h1>
          <Button onClick={() => router.push('/datacollector/dashboard')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const imageFiles = uploadedFiles.filter((file) => file.type === 'image')
  const videoFiles = uploadedFiles.filter((file) => file.type === 'video')
  const imagesRemaining = Math.max(0, task.imagesCount - task.imageUploaded)
  const videosRemaining = Math.max(0, task.videosCount - task.videoUploaded)
  const totalRemaining = imagesRemaining + videosRemaining

  const imageProgress = (task.imageUploaded / task.imagesCount) * 100
  const videoProgress = (task.videoUploaded / task.videosCount) * 100

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.currentTarget.files || [])
    const availableSlots = Math.max(0, task.imagesCount - task.imageUploaded)
    const filesToAdd = files.slice(0, availableSlots)

    if (files.length > availableSlots) {
      toast.error(`Maximum ${task.imagesCount} images allowed`)
    }

    const newFiles: UploadedFile[] = []
    for (const file of filesToAdd) {
      const preview = await createPreview(file)
      newFiles.push({
        id: `${Date.now()}-${Math.random()}`,
        file,
        preview,
        type: 'image',
      })
    }

    if (newFiles.length > 0) {
      setUploadedFiles((prev) => [...prev, ...newFiles])
      persistTask({ imageUploaded: task.imageUploaded + newFiles.length })
      toast.success(`${newFiles.length} image(s) added`)
    }

    if (imageInputRef.current) imageInputRef.current.value = ''
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.currentTarget.files || [])
    const availableSlots = Math.max(0, task.videosCount - task.videoUploaded)
    const filesToAdd = files.slice(0, availableSlots)

    if (files.length > availableSlots) {
      toast.error(`Maximum ${task.videosCount} videos allowed`)
    }

    const newFiles: UploadedFile[] = []
    for (const file of filesToAdd) {
      const preview = await createPreview(file)
      newFiles.push({
        id: `${Date.now()}-${Math.random()}`,
        file,
        preview,
        type: 'video',
      })
    }

    if (newFiles.length > 0) {
      setUploadedFiles((prev) => [...prev, ...newFiles])
      persistTask({ videoUploaded: task.videoUploaded + newFiles.length })
      toast.success(`${newFiles.length} video(s) added`)
    }

    if (videoInputRef.current) videoInputRef.current.value = ''
  }

  const removeFile = (id: string) => {
    const fileToRemove = uploadedFiles.find((file) => file.id === id)
    if (!fileToRemove) {
      return
    }

    setUploadedFiles((prev) => prev.filter((file) => file.id !== id))

    if (fileToRemove.type === 'image' && task.imageUploaded > 0) {
      persistTask({ imageUploaded: task.imageUploaded - 1 })
    }

    if (fileToRemove.type === 'video' && task.videoUploaded > 0) {
      persistTask({ videoUploaded: task.videoUploaded - 1 })
    }

    toast.success('File removed')
  }

  const handleSubmit = async () => {
    if (totalRemaining > 0) {
      toast.error(`Please upload ${totalRemaining} more file(s)`)
      return
    }

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    persistTask({
      imageUploaded: task.imagesCount,
      videoUploaded: task.videosCount,
      status: 'completed',
    })

    toast.success('Task submitted successfully!')
    setIsCompleted(true)
    setIsSubmitting(false)
    setTimeout(() => router.push('/datacollector/dashboard'), 1500)
  }

  const handleSaveAndExit = () => {
    toast.success('Progress saved')
    setTimeout(() => router.push('/datacollector/dashboard'), 300)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push('/datacollector/dashboard')}
              variant="outline"
              size="icon"
              className="rounded-full"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{task.task}</h1>
              <p className="text-slate-600 text-sm mt-1">Upload all required files to complete this task</p>
            </div>
          </div>
        </div>

        <Card className="p-6 mb-8 border-0 shadow-sm bg-white">
          <h3 className="font-semibold text-slate-900 mb-2">Task Description</h3>
          <p className="text-slate-700 text-sm leading-relaxed">
            {taskDetails[task.id] || 'No additional details available'}
          </p>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2.5 rounded-lg">
                      <ImageIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Images</h3>
                      <p className="text-xs text-slate-600">
                        {task.imageUploaded} of {task.imagesCount} uploaded
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{task.imageUploaded}/{task.imagesCount}</div>
                    <p className="text-xs text-slate-600">{imagesRemaining} remaining</p>
                  </div>
                </div>
                <Progress value={imageProgress} className="h-2" />

                {imageFiles.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {imageFiles.map((file) => (
                      <div key={file.id} className="relative group">
                        <img
                          src={file.preview}
                          alt="Upload preview"
                          className="w-full h-24 object-cover rounded-lg border border-slate-200"
                        />
                        <button
                          onClick={() => removeFile(file.id)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  onClick={() => imageInputRef.current?.click()}
                  disabled={task.imageUploaded === task.imagesCount || isCompleted}
                  variant="outline"
                  className="w-full gap-2 border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <UploadIcon className="w-4 h-4" />
                  {task.imageUploaded === task.imagesCount ? 'Images Complete' : `Upload Images (${imagesRemaining} more)`}
                </Button>
                <input
                  ref={imageInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </Card>

            <Card className="p-6 border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-50 p-2.5 rounded-lg">
                      <FileVideo className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Videos</h3>
                      <p className="text-xs text-slate-600">
                        {task.videoUploaded} of {task.videosCount} uploaded
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">{task.videoUploaded}/{task.videosCount}</div>
                    <p className="text-xs text-slate-600">{videosRemaining} remaining</p>
                  </div>
                </div>
                <Progress value={videoProgress} className="h-2" />

                {videoFiles.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {videoFiles.map((file) => (
                      <div key={file.id} className="relative group">
                        <div className="w-full h-24 bg-slate-900 rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden">
                          <video src={file.preview} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                            <Play className="w-6 h-6 text-white fill-white" />
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(file.id)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  onClick={() => videoInputRef.current?.click()}
                  disabled={task.videoUploaded === task.videosCount || isCompleted}
                  variant="outline"
                  className="w-full gap-2 border-purple-200 text-purple-600 hover:bg-purple-50"
                >
                  <UploadIcon className="w-4 h-4" />
                  {task.videoUploaded === task.videosCount ? 'Videos Complete' : `Upload Videos (${videosRemaining} more)`}
                </Button>
                <input
                  ref={videoInputRef}
                  type="file"
                  multiple
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 border-0 shadow-sm bg-white sticky top-6">
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Overall Progress</p>
                      <p className="text-3xl font-bold text-slate-900 mt-1">
                        {task.imageUploaded + task.videoUploaded}/{task.imagesCount + task.videosCount}
                      </p>
                    </div>
                    <div className="text-3xl">{totalRemaining === 0 ? '✓' : '○'}</div>
                  </div>
                  <Progress value={((task.imageUploaded + task.videoUploaded) / (task.imagesCount + task.videosCount)) * 100} className="h-2" />
                </div>

                {totalRemaining > 0 && (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <p className="text-xs font-semibold text-amber-900 uppercase tracking-wide">Files Needed</p>
                    <p className="text-lg font-bold text-amber-900 mt-2">{totalRemaining} more</p>
                    {imagesRemaining > 0 && <p className="text-xs text-amber-800 mt-1">Images: {imagesRemaining}</p>}
                    {videosRemaining > 0 && <p className="text-xs text-amber-800">Videos: {videosRemaining}</p>}
                  </div>
                )}

                {isCompleted && (
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-green-900">✓ Task Completed</p>
                    <p className="text-xs text-green-800 mt-1">Redirecting to dashboard...</p>
                  </div>
                )}

                {totalRemaining === 0 && !isCompleted && (
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <p className="text-xs font-semibold text-green-900 uppercase tracking-wide">Ready to Submit</p>
                    <p className="text-sm text-green-800 mt-2">All files are uploaded. Click &quot;Submit Task&quot; to complete.</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <Button
            onClick={handleSaveAndExit}
            variant="outline"
            className="flex-1 border-slate-300 text-slate-700"
          >
            Save & Exit
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={totalRemaining > 0 || isSubmitting || isCompleted}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Task'}
          </Button>
        </div>
      </div>
    </div>
  )
}
