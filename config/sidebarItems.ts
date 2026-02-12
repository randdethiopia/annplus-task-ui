import type { RoleRule } from "@/types/role";

export type SidebarItem = {
    key: string;
    label: string;
    href: string;
    icon?: string;
    roles: RoleRule;
};

export const sidebarItems: SidebarItem[] = [
    {
        key: "data-collectors",
        label: "Data Collectors",
        href: "/dashboard/data-collector",
        roles: ["admin", "manager"],
    },
    {
        key: "tasks",
        label: "Tasks",
        href: "/dashboard/Task",
        roles: ["admin", "manager"],
    },
    {
        key: "submissions",
        label: "Submissions",
        href: "/dashboard/submission",
        roles: ["admin", "manager", "collector"],
    },
    // {
    //     key: "users",
    //     label: "Users",
    //     href: "/dashboard/users",
    //     roles: ["admin"],
    // },
];