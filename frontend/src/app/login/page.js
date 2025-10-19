"use client"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import axios from "axios"
import Link from "next/link"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const { login, API_URL } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password,
            })

            const { token, user } = response.data
            login(token, user)
            // Redirect to dashboard or home page
            window.location.href = "/dashboard"
        } catch (err) {
            console.error("Login failed:", err)
            setError(err.response?.data?.message || "Login failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12">
                <div>
                    <div className="flex items-center gap-3 mb-16">
                        <div className="w-10 h-10 bg-primary-foreground rounded-lg flex items-center justify-center">
                            <span className="text-primary font-bold text-lg">H</span>
                        </div>
                        <span className="text-2xl font-bold text-primary-foreground">HealthMate</span>
                    </div>
                </div>

                <div className="space-y-8">
                    <div>
                        <h1 className="text-5xl font-bold text-primary-foreground mb-6 leading-tight">Your Health, Our Priority</h1>
                        <p className="text-lg text-primary-foreground/90">
                            Join thousands of users managing their wellness journey with HealthMate. Secure, simple, and always there
                            for you.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0 mt-1">
                                <svg className="w-4 h-4 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-primary-foreground">Secure & Private</h3>
                                <p className="text-sm text-primary-foreground/80">Your health data is encrypted and protected</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0 mt-1">
                                <svg className="w-4 h-4 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-primary-foreground">Real-time Insights</h3>
                                <p className="text-sm text-primary-foreground/80">Track your health metrics instantly</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0 mt-1">
                                <svg className="w-4 h-4 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-primary-foreground">24/7 Support</h3>
                                <p className="text-sm text-primary-foreground/80">Our team is always here to help</p>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-primary-foreground/70">© 2025 HealthMate. All rights reserved.</p>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Welcome back</h2>
                        <p className="text-muted-foreground">Sign in to your HealthMate account</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded border-border" />
                                <span className="text-sm text-muted-foreground">Remember me</span>
                            </label>
                            <Link
                                href="/forgot-password"
                                className="text-sm font-medium text-primary hover:text-accent transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {error && (
                            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
                                <svg className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <p className="text-sm text-destructive">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-4 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        Don&apos;e an account?{" "}
                        <Link href="/register" className="font-semibold text-primary hover:text-accent transition-colors">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
