# Next.js Authentication Guide

For this project, since we are using Laravel Sanctum, we can use a simple Context or a library like `axios` to handle the tokens.

## 1. Install Axios
```bash
npm install axios
```

## 2. Create an API Client (`frontend/src/lib/axios.ts`)

```typescript
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true, // Important for Sanctum CSRF cookies if used, or storing tokens
});

// Add a request interceptor to attach the token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
```

## 3. Login Page Example (`frontend/src/app/login/page.tsx`)

```tsx
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
            localStorage.setItem('token', response.data.access_token);
            alert('Login Successful!');
            router.push('/dashboard');
        } catch (error) {
            console.error(error);
            alert('Login Failed');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <form onSubmit={handleLogin} className="p-8 bg-white shadow-md rounded">
                <h1 className="text-2xl mb-4">Login</h1>
                <input 
                    className="block border p-2 mb-2 w-full"
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                />
                <input 
                    className="block border p-2 mb-4 w-full"
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <button className="bg-blue-500 text-white p-2 w-full rounded">Login</button>
            </form>
        </div>
    );
}
```
