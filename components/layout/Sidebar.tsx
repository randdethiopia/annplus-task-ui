"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarItems } from "@/config/sidebarItems";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import { 
  Users, 
  ClipboardList, 
  CheckSquare, 
  UserCog,
  LayoutDashboard 
} from "lucide-react"; // Import Icons

// Map your keys to actual Lucide components
const iconMap: Record<string, any> = {
    "data-collectors": Users,
    "tasks": ClipboardList,
    "submissions": CheckSquare,
    "users": UserCog,
};

export default function Sidebar() {
    const pathname = usePathname();
    const { role, hasHydrated } = useAuthStore();

    // 1. Senior Safety: Wait for hydration to prevent errors
    if (!hasHydrated) return null;

    const visibleItems = sidebarItems.filter((item) => {
        if (item.roles === "all") return true;
        return item.roles.includes(role);
    });

    return (
        <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white px-4 py-8 shadow-[1px_0_5px_rgba(0,0,0,0.02)]">
            <div className="mb-10 px-3">
                <div className="flex items-center gap-2 mb-1">
                    <div className="h-6 w-1 bg-blue-600 rounded-full" />
                    <h2 className="text-xl font-black tracking-tighter text-slate-800">
                        AnnPlus
                    </h2>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500/70 ml-3">
                    {role} Portal
                </p>
            </div>

            <nav className="flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
                {visibleItems.map((item) => {
                    const active = pathname?.startsWith(item.href);
                    const Icon = iconMap[item.key] || LayoutDashboard;

                    return (
                        <Link
                            key={item.key}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200",
                                active
                                    ? "bg-blue-50 text-blue-700 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.1)]"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <Icon className={cn("h-5 w-5", active ? "text-blue-600" : "text-slate-400")} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto p-2 border-t border-slate-50">
                <div className="flex items-center gap-3 p-2">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700">
                        {role[0].toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700 capitalize">{role}</span>
                        <span className="text-[10px] text-slate-400">Online</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}