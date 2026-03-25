"use client"

import api from "@/api"
import { Task } from "@/api/task"
import { Button } from "@/components/ui/button"
import JSZip from "jszip"
import { Download } from "lucide-react"
import { useEffect, useState } from "react"


export const ExportTask = ({ taskId }: { taskId: string }) => {

  const [task, setTask] = useState<Task | null>(null)
  const { data, isSuccess } = api.task.getById.useQuery(taskId)

  useEffect(() => {
    if (isSuccess && data) {
      setTask(data.task)
    }
  }, [data])


  if (!task) return null


  const sanitize = (name: string) =>
    name.replace(/[<>:"/\\|?*]+/g, "").replace(/\s+/g, "_")

  const handleExport = async () => {
    if (!task.submissions?.length) return

    const zip = new JSZip()
    const images = task.submissions.filter(s => s.mediaType === "IMAGE")

    await Promise.all(
      images.map(async (img, i) => {
        const res = await fetch(img.uploadUrl)
        const blob = await res.blob()
        zip.file(`image-${i + 1}.jpg`, blob)
      })
    )

    console.log("Zipping files...")

    const content = await zip.generateAsync({ type: "blob" })

    const url = URL.createObjectURL(content)
    const a = document.createElement("a")
    a.href = url
    a.download = `${sanitize(task.title)}.zip`
    a.click()
    URL.revokeObjectURL(url)
  }

  return <Button onClick={handleExport} variant="ghost" >
    <Download className="w-4 h-4" />
      Export
  </Button>
}