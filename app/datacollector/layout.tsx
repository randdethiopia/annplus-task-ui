"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/datacollector/components/sidebar";
import useAuthStore from "@/store/authStore";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && !isAuthenticated) {
            router.push("/auth");
        }
    }, [isMounted, isAuthenticated, router]);

    if (!isMounted || !isAuthenticated) {
        return null;
    }

    return (
        <div className="flex h-screen w-full bg-slate-50">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}