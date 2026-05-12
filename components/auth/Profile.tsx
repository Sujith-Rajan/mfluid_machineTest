"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface User {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    profilePicture?: string;
    createdAt: string;
}

export default function DashboardPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchUsers = async () => {
        try {
            const response = await fetch("/api/users");
            const data = await response.json();
            if (response.ok) setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEdit = (user: User) => {
        setEditingUser({ ...user });
        setIsModalOpen(true);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        setIsSaving(true);
        try {
            const response = await fetch("/api/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: editingUser._id,
                    fullName: editingUser.fullName,
                    email: editingUser.email,
                    phone: editingUser.phone,
                    profilePicture: editingUser.profilePicture,
                }),
            });

            if (response.ok) {
                setIsModalOpen(false);
                fetchUsers();
                alert("Profile updated successfully!");
            } else {
                const data = await response.json();
                alert(data.message || "Failed to update profile");
            }
        } catch (error) {
            alert("An error occurred. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && editingUser) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditingUser({ ...editingUser, profilePicture: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                            User Directory
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 mt-2">
                            Manage and view all registered user profiles
                        </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                </div>

                {/* Table Container */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-all duration-300">
                    {isLoading ? (
                        <div className="p-12 flex flex-col items-center justify-center space-y-4">
                            <div className="h-12 w-12 border-4 border-zinc-200 border-t-zinc-900 dark:border-zinc-800 dark:border-t-zinc-50 rounded-full animate-spin" />
                            <p className="text-zinc-500 font-medium">Loading profiles...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-zinc-50 dark:bg-zinc-800/50">
                                        <th className="p-5 text-sm font-semibold text-zinc-900 dark:text-zinc-50">Profile</th>
                                        <th className="p-5 text-sm font-semibold text-zinc-900 dark:text-zinc-50">Full Name</th>
                                        <th className="p-5 text-sm font-semibold text-zinc-900 dark:text-zinc-50">Email</th>
                                        <th className="p-5 text-sm font-semibold text-zinc-900 dark:text-zinc-50">Phone</th>
                                        <th className="p-5 text-sm font-semibold text-zinc-900 dark:text-zinc-50 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                    {users.map((user) => (
                                        <tr key={user._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors group">
                                            <td className="p-5">
                                                <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800">
                                                    {user.profilePicture ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img src={user.profilePicture} alt={user.fullName} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-zinc-400 font-bold">
                                                            {user.fullName.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{user.fullName}</p>
                                            </td>
                                            <td className="p-5 text-sm text-zinc-500 dark:text-zinc-400">{user.email}</td>
                                            <td className="p-5 text-sm text-zinc-500 dark:text-zinc-400">{user.phone}</td>
                                            <td className="p-5 text-right">
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="px-4 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-50 dark:hover:text-zinc-900 transition-all duration-200 active:scale-95 shadow-sm"
                                                >
                                                    Edit Profile
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {isModalOpen && editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Edit Profile</h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div className="flex flex-col items-center space-y-4 mb-6">
                                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                        <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-zinc-100 dark:border-zinc-800 shadow-md">
                                            {editingUser.profilePicture ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={editingUser.profilePicture} alt="Preview" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-400 font-bold text-2xl">
                                                    {editingUser.fullName.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <p className="text-[10px] text-white font-bold uppercase">Change</p>
                                        </div>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Full Name</label>
                                    <input
                                        type="text"
                                        value={editingUser.fullName}
                                        onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 focus:ring-2 focus:ring-zinc-900/10 outline-none transition-all"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</label>
                                    <input
                                        type="email"
                                        value={editingUser.email}
                                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 focus:ring-2 focus:ring-zinc-900/10 outline-none transition-all"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Phone</label>
                                    <input
                                        type="tel"
                                        value={editingUser.phone}
                                        onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 focus:ring-2 focus:ring-zinc-900/10 outline-none transition-all"
                                        required
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-4 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-zinc-900 dark:bg-zinc-50 dark:text-zinc-900 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all active:scale-[0.98]"
                                    >
                                        {isSaving ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
