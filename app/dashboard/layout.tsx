import type { ReactNode } from "react";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-slate-50">
            <Sidebar />
            <main className="flex-1 overflow-y-auto overscroll-contain">{children}</main>
        </div>
    );
}