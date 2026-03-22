'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from '@/lib/auth-client'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError('')

        const result = await signIn.email({
            email,
            password,
            callbackURL: '/dashboard',
        })

        if (result.error) {
            setError('Invalid email or password')
            setLoading(false)
            return
        }

        router.push('/dashboard')
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-x1 shadow-sm border p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900">Sign In</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Access your event portal
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="w-full border rounded-1g px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="you@example.com.au"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className="w-full border rounded-1g px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="********"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-600">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-amber-600 text-white py-2 rounded-1g text-sm font-medium hover:bg-amber-700 disabled:opacity-50 transition-colors">
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                </form>
            </div>
        </div>
    )
}