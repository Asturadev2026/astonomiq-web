"use client"

import { useEffect, useState } from "react"
import { Typography } from "@/components/ui/typography"
import { createClient } from "@/utils/supabase/client"

const supabase = createClient()

export default function SettingsPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState<boolean | null>(null)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("finance")
  const [hospitalId, setHospitalId] = useState("")
  const [message, setMessage] = useState("")

  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [editEmail, setEditEmail] = useState("")
  const [editRole, setEditRole] = useState("finance")

  useEffect(() => {
    checkAccess()
  }, [])

  async function checkAccess() {
    try {
      const { data: authData } = await supabase.auth.getUser()

      if (!authData.user) {
        setAuthorized(false)
        setLoading(false)
        return
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .single()

      if (error || !profile) {
        setAuthorized(false)
        setLoading(false)
        return
      }

      setHospitalId(profile.hospital_id)

      if (profile.role === "admin") {
        setAuthorized(true)
        await fetchUsers()
      } else {
        setAuthorized(false)
      }

      setLoading(false)
    } catch {
      setAuthorized(false)
      setLoading(false)
    }
  }

  async function fetchUsers() {
    const res = await fetch("/api/auth/get-users")
    const result = await res.json()

    if (res.ok) {
      setUsers(result.users || [])
    }
  }

  async function createUser() {
    setMessage("")

    if (!hospitalId || !email || !password) {
      setMessage("All fields are required")
      return
    }

    try {
      const res = await fetch("/api/auth/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          role,
          hospital_id: hospitalId,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        setMessage(result.error || "Failed to create user")
        return
      }

      setEmail("")
      setPassword("")
      setRole("finance")

      await fetchUsers()

      setMessage("User added successfully ✅")
    } catch {
      setMessage("Something went wrong")
    }
  }

  async function saveUser(userId: string) {
    const res = await fetch("/api/auth/update-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        email: editEmail,
        role: editRole,
      }),
    })

    const result = await res.json()

    if (!res.ok) {
      alert(result.error || "Update failed")
      return
    }

    setEditingUserId(null)
    await fetchUsers()
  }

  async function deleteUser(userId: string) {
    if (!confirm("Delete this user?")) return

    await fetch("/api/auth/delete-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    })

    await fetchUsers()
  }

  if (loading) {
    return <div className="p-6">Checking access...</div>
  }

  if (authorized === false) {
    return (
      <div className="p-6">
        <Typography variant="body-lg" className="font-semibold">
          Access Denied
        </Typography>
        <Typography variant="body-md" className="text-gray-500">
          Only Admin users can manage roles.
        </Typography>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <Typography variant="h1" className="font-semibold text-gray-900">
        User Management
      </Typography>

      {/* Create User Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm space-y-6">
        <Typography variant="body-lg" className="font-semibold text-gray-900">
          Create New User
        </Typography>

        <div className="grid grid-cols-3 items-center gap-6">
          <label className="text-sm font-medium text-gray-700">
            Hospital ID
          </label>
          <input
            value={hospitalId}
            onChange={(e) => setHospitalId(e.target.value)}
            placeholder="HOS-2026-AB12"
            className="col-span-2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />

          <label className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            placeholder="user.random@hospital.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="col-span-2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />

          <label className="text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            placeholder="TempPass@123"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="col-span-2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />

          <label className="text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="col-span-2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          >
            <option value="admin">Admin</option>
            <option value="finance">Finance</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>

        <button
          onClick={createUser}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg py-3 transition shadow-sm"
        >
          Add User
        </button>

        {message && (
          <div className="text-sm font-medium text-emerald-600">
            {message}
          </div>
        )}
      </div>

      {/* Existing Users Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm space-y-6">
        <Typography variant="body-lg" className="font-semibold text-gray-900">
          Existing Users
        </Typography>

        <div className="divide-y divide-gray-100">
          {users.map((user) => (
            <div
              key={user.id}
              className="py-5 flex justify-between items-center hover:bg-gray-50 rounded-lg px-4 transition"
            >
              {editingUserId === user.id ? (
                <div className="flex gap-4 w-full items-center">
                  <input
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 flex-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />

                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="admin">Admin</option>
                    <option value="finance">Finance</option>
                    <option value="viewer">Viewer</option>
                  </select>

                  <button
                    onClick={() => saveUser(user.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditingUserId(null)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm transition"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {user.email}
                    </p>

                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 mt-1">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setEditingUserId(user.id)
                        setEditEmail(user.email)
                        setEditRole(user.role)
                      }}
                      className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteUser(user.id)}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm transition"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}