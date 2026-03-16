"use client"
import { IslandCard } from "@/components/icard";
import Link from 'next/link';
import { User, ShieldCheck } from "lucide-react";

const AuthPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 p-4">
            <IslandCard className="relative overflow-hidden px-6 py-10 sm:px-10 w-full max-w-2xl">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#ffffff,transparent_60%),linear-gradient(180deg,rgba(255,255,255,0.95),rgba(255,255,255,0.7))]" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">Welcome Back</h2>
                <p className="text-slate-500 mb-8 text-center text-sm">Select your role to continue to the platform</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link href="/auth/datacollector" className="w-full group">
                        <div className="flex flex-col items-center gap-4 p-6 rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-blue-200 hover:bg-blue-50/50 h-full text-center">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                                <User className="h-7 w-7" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="font-semibold text-slate-900 group-hover:text-blue-700 text-lg">Data Collector</span>
                                <span className="text-xs text-slate-500">Access assigned tasks & submissions</span>
                            </div>
                        </div>
                    </Link>

                    <Link href="/auth/admin" className="w-full group">
                        <div className="flex flex-col items-center gap-4 p-6 rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-emerald-200 hover:bg-emerald-50/50 h-full text-center">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 transition-colors duration-300 group-hover:bg-emerald-600 group-hover:text-white">
                                <ShieldCheck className="h-7 w-7" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="font-semibold text-slate-900 group-hover:text-emerald-700 text-lg">Administrator</span>
                            </div>
                        </div>
                    </Link>
                </div>
            </IslandCard>
        </div>
    )
}

export default AuthPage;