"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
    });
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required";
        }

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (!formData.phone) {
            newErrors.phone = "Phone number is required";
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = "Phone number must be exactly 10 digits";
        }

        if (!profilePicture) {
            newErrors.profilePicture = "Profile picture is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (file: File) => {
        if (file && file.type.startsWith("image/")) {
            setProfilePicture(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setErrors((prev) => ({ ...prev, profilePicture: "" }));
        } else {
            setErrors((prev) => ({ ...prev, profilePicture: "Please upload a valid image file" }));
        }
    };

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileChange(file);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);

        try {
            // Get base64 for profile picture if it exists
            let profilePictureBase64 = "";
            if (profilePicture) {
                const reader = new FileReader();
                profilePictureBase64 = await new Promise((resolve) => {
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(profilePicture);
                });
            }

            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    profilePicture: profilePictureBase64,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Registration successful", data);
                alert("Registration Successful!");
                // Redirect to login
            } else {
                setErrors({ form: data.message || "Registration failed. Please try again." });
            }
        } catch (error) {
            setErrors({ form: "An error occurred. Please try again." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl p-8 space-y-8 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-zinc-800/50 mx-auto my-8">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    Create an Account
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400">
                    Join us and start your journey today
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {errors.form && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        {errors.form}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Full Name
                        </label>
                        <input
                            name="fullName"
                            placeholder="Your Name"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className={`flex h-12 w-full rounded-xl border bg-zinc-50/50 dark:bg-zinc-800/50 px-4 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 ${errors.fullName ? "border-red-500" : "border-zinc-200 dark:border-zinc-800"
                                }`}
                        />
                        {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Email Address
                        </label>
                        <input
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`flex h-12 w-full rounded-xl border bg-zinc-50/50 dark:bg-zinc-800/50 px-4 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 ${errors.email ? "border-red-500" : "border-zinc-200 dark:border-zinc-800"
                                }`}
                        />
                        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Password
                        </label>
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`flex h-12 w-full rounded-xl border bg-zinc-50/50 dark:bg-zinc-800/50 px-4 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 ${errors.password ? "border-red-500" : "border-zinc-200 dark:border-zinc-800"
                                }`}
                        />
                        {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Confirm Password
                        </label>
                        <input
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className={`flex h-12 w-full rounded-xl border bg-zinc-50/50 dark:bg-zinc-800/50 px-4 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 ${errors.confirmPassword ? "border-red-500" : "border-zinc-200 dark:border-zinc-800"
                                }`}
                        />
                        {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Phone Number
                        </label>
                        <input
                            name="phone"
                            type="tel"
                            placeholder="+91 9xxxxxxxx"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={`flex h-12 w-full rounded-xl border bg-zinc-50/50 dark:bg-zinc-800/50 px-4 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 ${errors.phone ? "border-red-500" : "border-zinc-200 dark:border-zinc-800"
                                }`}
                        />
                        {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                    </div>
                </div>

                {/* Profile Picture (Drag & Drop) */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Profile Picture
                    </label>
                    <div
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`relative group cursor-pointer flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl transition-all duration-200 ${isDragging
                            ? "border-zinc-900 bg-zinc-100 dark:border-zinc-50 dark:bg-zinc-800"
                            : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/30"
                            } ${errors.profilePicture ? "border-red-500" : "hover:border-zinc-400 dark:hover:border-zinc-600"}`}
                    >
                        {previewUrl ? (
                            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-zinc-800 shadow-lg">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="text-[10px] text-white font-bold uppercase tracking-wider">Change</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center space-y-2">
                                <div className="mx-auto w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-2">
                                    <svg
                                        className="w-5 h-5 text-zinc-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                        />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                    Drag and drop or click to upload
                                </p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    PNG, JPG or GIF (max. 2MB)
                                </p>
                            </div>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileChange(file);
                            }}
                            className="hidden"
                        />
                    </div>
                    {errors.profilePicture && (
                        <p className="text-xs text-red-500">{errors.profilePicture}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="relative flex h-12 w-full items-center justify-center rounded-xl bg-zinc-900 dark:bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-50 dark:text-zinc-900 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 overflow-hidden"
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-500 border-t-zinc-50 dark:border-zinc-400 dark:border-t-zinc-900" />
                            <span>Creating account...</span>
                        </div>
                    ) : (
                        "Sign up"
                    )}
                </button>
            </form>

            <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="font-semibold text-zinc-900 dark:text-zinc-50 hover:underline underline-offset-4"
                >
                    Sign in
                </Link>
            </div>
        </div>
    );
}