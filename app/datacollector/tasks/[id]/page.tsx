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
import { toast } from 'sonner'

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const taskId = id as string
 
  const [task, setTask] = useState<Task>()
  const [file, setFile] = useState<File | null>(null)
  const [isUploadingToS3, setIsUploadingToS3] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data, isError, isLoading, isSuccess, refetch } = api.task.getById.useQuery(taskId)
  const { mutateAsync: getPresignedUrl, isPending: isGettingPresignedUrl } =
    api.upload.getPresignedUrl.useMutation()
  const { mutateAsync: createSubmission, isPending: isCreatingSubmission } =
    api.submission.create.useMutation()
  

  useEffect(() => {
    if (isSuccess && data) {
      setTask(data.task)
    }
  }, [data, isSuccess])

  const totalRequiredUploads = task ? task.imageCount + task.videoCount : 0
  const totalUploadedFiles = task ? task.uploaded.images + task.uploaded.videos : 0
  const overallProgress = totalRequiredUploads
    ? Math.round((totalUploadedFiles / totalRequiredUploads) * 100)
    : 0
  const imageProgress = task?.imageCount
    ? Math.round((task.uploaded.images / task.imageCount) * 100)
    : 0
  const videoProgress = task?.videoCount
    ? Math.round((task.uploaded.videos / task.videoCount) * 100)
    : 0
  const canUploadImages = !!task && task.status === 'PENDING' && task.uploaded.images < task.imageCount
  const canUploadVideos = !!task && task.status === 'PENDING' && task.uploaded.videos < task.videoCount
  const canUpload = canUploadImages || canUploadVideos

  const getMediaType = (selectedFile: File) => {
    if (selectedFile.type.startsWith('image/')) return 'IMAGE'
    if (selectedFile.type.startsWith('video/')) return 'VIDEO'
    return null
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canUpload) {
      e.target.value = ''
      return
    }

    const selectedFile = e.target.files?.[0]

    if (!selectedFile) return

    const mediaType = getMediaType(selectedFile)

    if (!mediaType) {
      toast.error('Unsupported file type.')
      e.target.value = ''
      setFile(null)
      return
    }

    if (mediaType === 'IMAGE' && !canUploadImages) {
      toast.error('Required image uploads are already satisfied for this task.')
      e.target.value = ''
      setFile(null)
      return
    }

    if (mediaType === 'VIDEO' && !canUploadVideos) {
      toast.error('Required video uploads are already satisfied for this task.')
      e.target.value = ''
      setFile(null)
      return
    }

    setFile(selectedFile)
  }

  const uploadFileToS3 = async (uploadUrl: string, file: File, contentType: string) => {
    setIsUploadingToS3(true)
    try {
      await axios.put(uploadUrl, file, {
        headers: {
          'Content-Type': contentType,
        },
      })
      return true
    } catch (error) {
      return false
    } finally {
      setIsUploadingToS3(false)
    }
  }

  const handleSubmit = async () => {
    if (!file) return

    if (!canUpload) {
      toast.error('Uploads are only allowed while this task is pending.')
      return
    }

    const mediaType = getMediaType(file)

    if (!mediaType) {
      toast.error('Unsupported file type.')
      return
    }

    if (mediaType === 'IMAGE' && !canUploadImages) {
      toast.error('Required image uploads are already satisfied for this task.')
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    if (mediaType === 'VIDEO' && !canUploadVideos) {
      toast.error('Required video uploads are already satisfied for this task.')
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    try {
      const presigned = await getPresignedUrl(file.name)
      const isUploadSuccess = await uploadFileToS3(
        presigned.uploadUrl,
        file,
        presigned.contentType
      )

      if (!isUploadSuccess) {
        toast.error('Failed to upload file. Please try again.')
        return
      }

      await createSubmission({
        taskId,
        uploadUrl: presigned.objectUrl,
        mediaType,
      })

      setTask((prevTask) => {
        if (!prevTask) return prevTask

        const nextImages =
          mediaType === 'IMAGE' ? prevTask.uploaded.images + 1 : prevTask.uploaded.images
        const nextVideos =
          mediaType === 'VIDEO' ? prevTask.uploaded.videos + 1 : prevTask.uploaded.videos

        return {
          ...prevTask,
          uploaded: {
            images: nextImages,
            videos: nextVideos,
            total: nextImages + nextVideos,
          },
        }
      })

      toast.success('Submission created successfully.')
      void refetch()
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      toast.error('Failed to submit upload. Please try again.')
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

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div className="bg-white p-6 rounded shadow-sm">
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="mb-4"
              variant="outline"
              disabled={!canUpload}
            >
              <UploadIcon className="w-4 h-4 mr-2" />
              Select File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              disabled={!canUpload}
            />
            {file && <p className="mb-4">Selected: {file.name}</p>}
            {!canUpload && (
              <p className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                Uploads are disabled because this task status is {task.status.toLowerCase()}.
              </p>
            )}
            {canUpload && (!canUploadImages || !canUploadVideos) && (
              <p className="mb-4 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                {!canUploadImages && 'Image uploads are complete. '}
                {!canUploadVideos && 'Video uploads are complete.'}
              </p>
            )}
            <Button
              onClick={() => { void handleSubmit() }}
              disabled={
                !canUpload ||
                !file ||
                isUploadingToS3 ||
                isGettingPresignedUrl ||
                isCreatingSubmission
              }
              className="w-full bg-green-600 text-white hover:bg-green-700 disabled:bg-slate-300 disabled:text-slate-600"
            >
              {isUploadingToS3 || isGettingPresignedUrl || isCreatingSubmission
                ? 'Submitting...'
                : 'Submit'}
            </Button>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-lg">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Overall Progress</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {totalUploadedFiles}/{totalRequiredUploads}
              </p>
              <Progress value={overallProgress} className="h-2 mt-2" />
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Images</p>
                  <p className="text-xs text-slate-500">Uploaded image files</p>
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  {task.uploaded.images}/{task.imageCount}
                </p>
              </div>
              <Progress value={imageProgress} className="h-2 mt-3" />
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Videos</p>
                  <p className="text-xs text-slate-500">Uploaded video files</p>
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  {task.uploaded.videos}/{task.videoCount}
                </p>
              </div>
              <Progress value={videoProgress} className="h-2 mt-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
