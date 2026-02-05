'use client';

import { useState } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/login', { email, password });
            if (typeof window !== 'undefined') {
                localStorage.setItem('token', response.data.access_token);
                // Store user info if needed
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            alert('Login Successful!');
            router.push('/dashboard');
        } catch (error: any) {
            console.error(error);
            alert('Login Failed: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <form onSubmit={handleLogin} className="p-8 bg-white shadow-md rounded w-96">
                <h1 className="text-2xl mb-6 text-center font-bold">SIMS Login</h1>
                
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="email" 
                        placeholder="admin@sims.com" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </div>
                
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                    <input 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="password" 
                        placeholder="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>
                
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline">
                    Sign In
                </button>
                
                <p className="mt-4 text-xs text-center text-gray-500">
                    Use <span className="font-mono">admin@sims.com</span> / <span className="font-mono">password</span>
                </p>
            </form>
        </div>
    );
}
