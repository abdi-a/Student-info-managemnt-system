'use client';

import { User, Mail, Phone, MapPin, Camera, Save, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import api from '@/lib/axios';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/profile');
            const u = response.data;
            setUser(u);
            setFormData({
                name: u.name || '',
                email: u.email || '',
                phone: u.phone || '', // Needs DB support (added in migration)
                address: u.address || '' // Needs DB support
            });
            // Update local storage to keep sync
            if (typeof window !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(u));
            }
        } catch (error) {
            console.error('Failed to fetch profile', error);
        }
    };

    const handlePhotoClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('avatar', file);

            try {
                // We use the same update endpoint, but content-type header usually required for files
                // Axios handles it automatically if we pass FormData
                 await api.post('/profile/update', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                fetchProfile(); // Refresh to see new photo
                alert('Profile photo updated!');
            } catch (error) {
                console.error(error);
                alert('Failed to upload photo');
            }
        }
    };

    const handleSave = async () => {
        try {
            await api.post('/profile/update', formData);
            await fetchProfile();
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error: any) {
            console.error(error);
            alert('Failed to update profile: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    if (!user) return <div>Loading...</div>;

    const avatarUrl = user.avatar ? (user.avatar.startsWith('http') ? user.avatar : `http://localhost:8000${user.avatar}`) : null;

    return (
        <div className="space-y-6">
             <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <User className="text-indigo-500" /> My Profile
            </h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                <div className="px-6 pb-6 mt-0 relative">
                     <div className="flex flex-col md:flex-row items-end -mt-12 md:items-center md:space-x-6">
                        <div className="relative group">
                            <div className="w-24 h-24 bg-white p-1 rounded-full overflow-hidden">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover rounded-full" />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                                        <User size={40} />
                                    </div>
                                )}
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <button 
                                onClick={handlePhotoClick}
                                className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 rounded-full hover:bg-indigo-700 border-2 border-white cursor-pointer z-10"
                                title="Change Profile Photo"
                            >
                                <Camera size={14} />
                            </button>
                        </div>
                        <div className="mt-4 md:mt-12 flex-1">
                            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                            <p className="text-gray-500 capitalize">{user.role}</p>
                        </div>
                        <div className="mt-4 md:mt-12">
                            {isEditing ? (
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setIsEditing(false)}
                                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <X size={16} /> Cancel
                                    </button>
                                    <button 
                                        onClick={handleSave}
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                                    >
                                        <Save size={16} /> Save Changes
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                     </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4 pb-2 border-b">Personal Information</h3>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 text-gray-600">
                            <User size={18} />
                            {isEditing && user.role !== 'student' ? (
                                <input 
                                    className="border rounded px-2 py-1 w-full"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    placeholder="Full Name"
                                />
                            ) : (
                                <span className={isEditing ? "text-gray-500" : ""}>{user.name}</span>
                            )}
                        </div>
                        <div className="flex items-center space-x-3 text-gray-600">
                            <Mail size={18} />
                            {isEditing && user.role !== 'student' ? (
                                <input 
                                    className="border rounded px-2 py-1 w-full"
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    placeholder="Email Address"
                                />
                            ) : (
                                <span className={isEditing ? "text-gray-500" : ""}>{user.email}</span>
                            )}
                        </div>
                        <div className="flex items-center space-x-3 text-gray-600">
                            <Phone size={18} />
                            {isEditing ? (
                                <input 
                                    className="border rounded px-2 py-1 w-full"
                                    value={formData.phone}
                                    onChange={e => setFormData({...formData, phone: e.target.value})}
                                    placeholder="Phone Number"
                                />
                            ) : (
                                <span>{user.phone || 'Not provided'}</span>
                            )}
                        </div>
                        <div className="flex items-center space-x-3 text-gray-600">
                            <MapPin size={18} />
                            {isEditing ? (
                                <input 
                                    className="border rounded px-2 py-1 w-full"
                                    value={formData.address}
                                    onChange={e => setFormData({...formData, address: e.target.value})}
                                    placeholder="Address"
                                />
                            ) : (
                                <span>{user.address || 'Not provided'}</span>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4 pb-2 border-b">Account Settings</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium">Two-Factor Authentication</span>
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Disabled</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium">Notification Preferences</span>
                            <button className="text-indigo-600 text-sm hover:underline">Manage</button>
                        </div>
                         <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium">Change Password</span>
                            <button className="text-indigo-600 text-sm hover:underline">Update</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
