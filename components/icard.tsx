import { cn } from "@/lib/utils";

export const IslandCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100", className)}>
    {children}
  </div>
);