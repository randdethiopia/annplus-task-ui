'use client'

import { useState, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Upload as UploadIcon, X, FileVideo, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'

interface Task {
  id: number
  task: string
  imagesCount: number
  videosCount: number
  status: 'pending' | 'completed'
  imageUploaded: number
  videoUploaded: number
}

interface TaskDetailModalProps {
  task: Task
  isOpen: boolean
  onClose: () => void
  onSubmit: (task: Task) => void
}

const taskDetails: Record<number, string> = {
  1: 'Upload high-quality product photos for our new collection. Photos should be taken in natural lighting and include multiple angles of each product.',
  2: 'Record promotional videos showcasing our products in action. Videos should be between 30-60 seconds and include clear audio and engaging visuals.',
  3: 'Create marketing materials including banners, social media graphics, and promotional flyers. All materials should follow brand guidelines.',
}

export default function TaskDetailModal({
  task,
  isOpen,
  onClose,
  onSubmit,
}: TaskDetailModalProps) {
  const [imageUploaded, setImageUploaded] = useState(task.imageUploaded)
  const [videoUploaded, setVideoUploaded] = useState(task.videoUploaded)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const isAllUploaded =
    imageUploaded === task.imagesCount && videoUploaded === task.videosCount

  const imageProgress = (imageUploaded / task.imagesCount) * 100
  const videoProgress = (videoUploaded / task.videosCount) * 100

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && imageUploaded < task.imagesCount) {
      const count = Math.min(files.length, task.imagesCount - imageUploaded)
      setImageUploaded(imageUploaded + count)
      toast.success(`${count} image(s) uploaded`)
    }
    // Reset input
    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && videoUploaded < task.videosCount) {
      const count = Math.min(files.length, task.videosCount - videoUploaded)
      setVideoUploaded(videoUploaded + count)
      toast.success(`${count} video(s) uploaded`)
    }
    // Reset input
    if (videoInputRef.current) {
      videoInputRef.current.value = ''
    }
  }

  const handleSubmit = async () => {
    if (!isAllUploaded) {
      toast.error('Please upload all required files before submitting')
      return
    }

    setIsSubmitting(true)
    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const updatedTask: Task = {
      ...task,
      status: 'completed',
      imageUploaded,
      videoUploaded,
    }

    onSubmit(updatedTask)
    toast.success('Task submitted successfully!')
    setIsSubmitting(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{task.task}</DialogTitle>
          <DialogDescription>
            Complete all uploads to submit this task
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Task Details */}
          <Card className="p-6 bg-muted/30">
            <h3 className="font-semibold text-foreground mb-3">Task Details</h3>
            <p className="text-foreground text-sm leading-relaxed">
              {taskDetails[task.id] || 'No additional details available'}
            </p>
          </Card>

          {/* Image Upload Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Images</h3>
                  <p className="text-sm text-muted-foreground">
                    {imageUploaded} / {task.imagesCount} uploaded
                  </p>
                </div>
              </div>
              <span className="text-sm font-medium text-foreground">
                {Math.round(imageProgress)}%
              </span>
            </div>
            <Progress value={imageProgress} className="h-2" />
            <Button
              onClick={() => imageInputRef.current?.click()}
              disabled={imageUploaded === task.imagesCount}
              variant="outline"
              className="w-full gap-2"
              size="sm"
            >
              <UploadIcon className="w-4 h-4" />
              {imageUploaded === task.imagesCount
                ? 'All Images Uploaded'
                : 'Upload Images'}
            </Button>
            <input
              ref={imageInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={imageUploaded === task.imagesCount}
            />
          </div>

          {/* Video Upload Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <FileVideo className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Videos</h3>
                  <p className="text-sm text-muted-foreground">
                    {videoUploaded} / {task.videosCount} uploaded
                  </p>
                </div>
              </div>
              <span className="text-sm font-medium text-foreground">
                {Math.round(videoProgress)}%
              </span>
            </div>
            <Progress value={videoProgress} className="h-2" />
            <Button
              onClick={() => videoInputRef.current?.click()}
              disabled={videoUploaded === task.videosCount}
              variant="outline"
              className="w-full gap-2"
              size="sm"
            >
              <UploadIcon className="w-4 h-4" />
              {videoUploaded === task.videosCount
                ? 'All Videos Uploaded'
                : 'Upload Videos'}
            </Button>
            <input
              ref={videoInputRef}
              type="file"
              multiple
              accept="video/*"
              onChange={handleVideoUpload}
              className="hidden"
              disabled={videoUploaded === task.videosCount}
            />
          </div>

          {/* Upload Summary */}
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-start gap-3">
              <div className="text-green-600 mt-0.5">
                {isAllUploaded ? '✓' : '○'}
              </div>
              <div>
                <p className="font-medium text-green-900">
                  {isAllUploaded
                    ? 'All uploads complete!'
                    : 'Upload progress'}
                </p>
                <p className="text-sm text-green-800 mt-1">
                  {imageUploaded + videoUploaded} /{' '}
                  {task.imagesCount + task.videosCount} files uploaded
                </p>
              </div>
            </div>
          </Card>
        </div>

        <DialogFooter className="gap-2">
          <Button
            onClick={onClose}
            variant="outline"
          >
            Close
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isAllUploaded || isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Task'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
