"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ClipboardList, KeyRound, LogOut } from "lucide-react";
import { toast } from "sonner";
import useAuthStore from "@/store/authStore";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const router = useRouter();
  const { logOut, role } = useAuthStore();

  const tasksHref = "/datacollector/tasks";
  const changePasswordHref = "/datacollector/change-password";

  const roleLabel = role ?? "collector";
  const roleInitial = roleLabel[0]?.toUpperCase() ?? "C";

  return (
    <aside className="flex h-screen w-64 flex-col overflow-y-auto overscroll-contain border-r border-slate-200 bg-white px-4 py-8 shadow-[1px_0_5px_rgba(0,0,0,0.02)]">
      <div className="mb-10 px-3">
        <div className="mb-1 flex items-center gap-2">
          <div className="h-6 w-1 rounded-full bg-blue-600" />
          <h2 className="text-xl font-black tracking-tighter text-slate-800">
            AnnPlus
          </h2>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
        <Link
          href={tasksHref}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 bg-blue-50 text-blue-700 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.1)"
        >
          <ClipboardList
            className= "h-5 w-5 text-blue-600"
          />
          Tasks
        </Link>
        <Link
          href={changePasswordHref}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800"
        >
          <KeyRound className="h-5 w-5 text-slate-400" />
          Change Password
        </Link>
      </nav>

      <div className="mt-auto border-t border-slate-50 p-2">
        <div className="flex items-center gap-3 p-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
            {roleInitial}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold capitalize text-slate-700">{roleLabel}</span>
            <span className="text-[10px] text-slate-400">Online</span>
          </div>
        </div>
        <Button
          type="button"
          onClick={() => {
            const toastId = toast.loading("Signing you out...");
            logOut();
            localStorage.removeItem("isAuthenticated");
            toast.success("Signed out", { id: toastId });
            window.setTimeout(() => {
              router.push("/auth/datacollector");
            }, 400);
          }}
          className="mt-2 h-10 w-full justify-start gap-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
