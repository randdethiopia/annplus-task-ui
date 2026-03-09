"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Collector } from "@/api/data-collector";
import TaskApi from "@/api/task";



type AssignModalProps = {
  open: boolean;
  users: Collector[];
  taskId: string | null;
  onClose: () => void;
};



const AssignModal: React.FC<AssignModalProps> = ({ open, users, onClose, taskId }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

   const { mutate: assignTask, isPending } = TaskApi.assign.useMutation(taskId ?? "");

  useEffect(() => {
    if (!open) setSelectedId(null);
  }, [open]);

  const toggle = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!selectedId) return;
    console.log("Assigning task to user ID:", selectedId);

    assignTask(selectedId);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) onClose(); }}>
      <DialogContent className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Assign User</DialogTitle>
            <DialogDescription>Select a user to assign to this task.</DialogDescription>
          </DialogHeader>

          <div className="mt-4 max-h-64 overflow-auto rounded-md border border-slate-100 p-2">
            {users.length === 0 ? (
              <div className="p-4 text-sm text-slate-500">No users available.</div>
            ) : (
              Array.isArray(users) && users.map((u) => {
                const checked = selectedId === u.id;
                return (
                  <label
                    key={u.id}
                    className="flex cursor-pointer items-center justify-between gap-4 rounded-md p-2 hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggle(u.id)}
                        aria-label={`Select ${u.name}`}
                      />
                      <div>
                        <div className="text-sm font-medium text-slate-800">{u.name}</div>
                        <div className="mt-0.5 text-xs text-slate-500">
                          {u.phone ?? "—"}{u.telegramUsername ? ` • @${u.telegramUsername}` : ""}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400">{u.id}</div>
                  </label>
                );
              })
            )}
          </div>

          {/* single hidden form field with selected id — name matches backend's expected key */}
          <input type="hidden" name="collectorId" value={selectedId ?? ""} />

          <DialogFooter className="mt-4">
            <div className="flex w-full items-center justify-end gap-3">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={!selectedId || isPending}>
                Assign
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AssignModal;