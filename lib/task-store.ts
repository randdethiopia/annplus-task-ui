export interface Task {
  id: number
  task: string
  imagesCount: number
  videosCount: number
  status: 'pending' | 'completed'
  imageUploaded: number
  videoUploaded: number
}

const TASKS_STORAGE_KEY = 'tasks'

export const defaultTasks: Task[] = [
  {
    id: 1,
    task: 'Product Photography',
    imagesCount: 5,
    videosCount: 2,
    status: 'pending',
    imageUploaded: 0,
    videoUploaded: 0,
  },
  {
    id: 2,
    task: 'Promotional Video Shoot',
    imagesCount: 3,
    videosCount: 4,
    status: 'pending',
    imageUploaded: 0,
    videoUploaded: 0,
  },
  {
    id: 3,
    task: 'Marketing Materials',
    imagesCount: 8,
    videosCount: 1,
    status: 'pending',
    imageUploaded: 0,
    videoUploaded: 0,
  },
]

export const taskDetails: Record<number, string> = {
  1: 'Upload high-quality product photos for our new collection. Photos should be taken in natural lighting and include multiple angles of each product.',
  2: 'Record promotional videos showcasing our products in action. Videos should be between 30-60 seconds and include clear audio and engaging visuals.',
  3: 'Create marketing materials including banners, social media graphics, and promotional flyers. All materials should follow brand guidelines.',
}

const hasWindow = () => typeof window !== 'undefined'

export function getTasks(): Task[] {
  if (!hasWindow()) {
    return defaultTasks
  }

  const rawTasks = localStorage.getItem(TASKS_STORAGE_KEY)
  if (!rawTasks) {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(defaultTasks))
    return defaultTasks
  }

  try {
    const parsedTasks = JSON.parse(rawTasks) as Task[]
    if (!Array.isArray(parsedTasks) || parsedTasks.length === 0) {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(defaultTasks))
      return defaultTasks
    }
    return parsedTasks
  } catch {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(defaultTasks))
    return defaultTasks
  }
}

export function saveTasks(tasks: Task[]) {
  if (!hasWindow()) {
    return
  }
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
}

export function getTaskById(id: number): Task | undefined {
  return getTasks().find((task) => task.id === id)
}

export function updateTaskById(id: number, updates: Partial<Task>): Task | undefined {
  const tasks = getTasks()
  const updatedTasks = tasks.map((task) => {
    if (task.id !== id) {
      return task
    }

    const imageUploaded =
      updates.imageUploaded === undefined ? task.imageUploaded : Math.min(updates.imageUploaded, task.imagesCount)
    const videoUploaded =
      updates.videoUploaded === undefined ? task.videoUploaded : Math.min(updates.videoUploaded, task.videosCount)

    const status = updates.status ?? (imageUploaded === task.imagesCount && videoUploaded === task.videosCount ? 'completed' : 'pending')

    return {
      ...task,
      ...updates,
      imageUploaded,
      videoUploaded,
      status,
    }
  })

  saveTasks(updatedTasks)
  return updatedTasks.find((task) => task.id === id)
}

export function resetTasks() {
  saveTasks(defaultTasks)
}
