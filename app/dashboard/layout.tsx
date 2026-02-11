import type { ReactNode } from "react";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen w-full bg-slate-50">
            <Sidebar />
            <main className="flex-1">{children}</main>
        </div>
    );
}