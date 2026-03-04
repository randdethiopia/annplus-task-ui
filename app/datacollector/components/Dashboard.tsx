'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LogOut, Upload as UploadIcon } from 'lucide-react'
import { getTasks, type Task } from '@/lib/task-store'

interface DashboardProps {
  onLogout: () => void
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    Promise.resolve().then(() => setTasks(getTasks()))
  }, [])

  const handleOpenTask = (taskId: number) => {
    router.push(`/datacollector/task/${taskId}`)
  }

  const getStatusColor = (status: string) => {
    return status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your tasks and uploads</p>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Tasks Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Task</TableHead>
                  <TableHead className="text-center font-semibold">Images</TableHead>
                  <TableHead className="text-center font-semibold">Videos</TableHead>
                  <TableHead className="text-center font-semibold">Status</TableHead>
                  <TableHead className="text-center font-semibold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow
                    key={task.id}
                    className="border-b hover:bg-muted/30 cursor-pointer"
                    onClick={() => handleOpenTask(task.id)}
                  >
                    <TableCell className="font-medium">{task.task}</TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {task.imageUploaded}/{task.imagesCount}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {task.videoUploaded}/{task.videosCount}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant="outline"
                        className={getStatusColor(task.status)}
                      >
                        {task.status === 'completed' ? 'Completed' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOpenTask(task.id)
                        }}
                        size="sm"
                        className="gap-2"
                      >
                        <UploadIcon className="w-4 h-4" />
                        {task.status === 'completed'
                          ? 'View'
                          : task.imageUploaded > 0 || task.videoUploaded > 0
                            ? 'Continue'
                            : 'Start'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card className="p-6">
            <p className="text-muted-foreground text-sm font-medium">Total Tasks</p>
            <p className="text-3xl font-bold text-foreground mt-2">{tasks.length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-muted-foreground text-sm font-medium">Pending</p>
            <p className="text-3xl font-bold text-foreground mt-2">
              {tasks.filter(t => t.status === 'pending').length}
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-muted-foreground text-sm font-medium">Completed</p>
            <p className="text-3xl font-bold text-foreground mt-2">
              {tasks.filter(t => t.status === 'completed').length}
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
