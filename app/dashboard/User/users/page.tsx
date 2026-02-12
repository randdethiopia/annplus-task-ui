"use client";

import { useMemo, useState } from "react";
import AuthApi from "@/api/auth";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
};

export default function UsersPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading, isError } = AuthApi.users.useQuery();
  const {
    data: selectedUser,
    isLoading: isDetailLoading,
  } = AuthApi.users.useByIdQuery(selectedId || "");

  const users: User[] = useMemo(() => data?.users ?? [], [data]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-400">
            User Management
          </p>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 sm:text-4xl">
            Users
          </h1>
          <p className="text-sm font-medium text-slate-500 sm:text-base">
            Manage your platform users in one place.
          </p>
        </header>

        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">Created</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading && (
                  <tr>
                    <td className="px-6 py-6 text-slate-500" colSpan={5}>
                      Loading users...
                    </td>
                  </tr>
                )}

                {isError && (
                  <tr>
                    <td className="px-6 py-6 text-red-500" colSpan={5}>
                      Failed to load users.
                    </td>
                  </tr>
                )}

                {!isLoading && !isError && users.length === 0 && (
                  <tr>
                    <td className="px-6 py-6 text-slate-500" colSpan={5}>
                      No users found.
                    </td>
                  </tr>
                )}

                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedId(user.id)}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right-side sheet */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md transform bg-white shadow-2xl transition-transform duration-300 ${
          selectedId ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-400">
              User details
            </p>
            <h2 className="text-lg font-bold text-slate-800">Profile</h2>
          </div>
          <button
            onClick={() => setSelectedId(null)}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <div className="p-6">
          {isDetailLoading && (
            <p className="text-sm text-slate-500">Loading details...</p>
          )}

          {!isDetailLoading && selectedUser && (
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Name
                </p>
                <p className="font-semibold text-slate-800">{selectedUser.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Email
                </p>
                <p className="font-semibold text-slate-800">{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Role
                </p>
                <p className="font-semibold text-slate-800">{selectedUser.role}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Created
                </p>
                <p className="font-semibold text-slate-800">
                  {selectedUser.createdAt
                    ? new Date(selectedUser.createdAt).toLocaleString()
                    : "-"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedId && (
        <div
          className="fixed inset-0 z-40 bg-black/20"
          onClick={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}