"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarItems } from "@/config/sidebarItems";
import { useAuthStore } from "@/store/authStore";

export default function Sidebar() {
    const pathname = usePathname();
    const role = useAuthStore((s) => s.role);

    const visibleItems = sidebarItems.filter((item) => {
        if (item.roles === "all") return true;
        return item.roles.includes(role);
    });

    return (
        <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white px-4 py-6">
            <div className="mb-6 px-2">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-500">
                    Admin
                </p>
                <h2 className="text-lg font-bold text-slate-800">Dashboard</h2>
            </div>

            <nav className="flex flex-col gap-1">
                {visibleItems.map((item) => {
                    const active = pathname?.startsWith(item.href);
                    return (
                        <Link
                            key={item.key}
                            href={item.href}
                            className={[
                                "rounded-xl px-3 py-2 text-sm font-medium transition",
                                active
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                            ].join(" ")}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}