'use client';

import { useEffect, useState } from 'react';
import { getAuthState, getAuthHeader } from '../lib/auth';
import ProtectedRoute from '../components/ProtectedRoute';

interface User {
  email: string;
  name: string;
  role: string;
  blood_group: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const { user } = getAuthState();
    setUser(user);
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-4">
              <h1 className="text-2xl font-semibold text-gray-900">Welcome, {user?.name}!</h1>
              <div className="mt-4">
                <p className="text-gray-600">Email: {user?.email}</p>
                <p className="text-gray-600">Role: {user?.role}</p>
                <p className="text-gray-600">Blood Group: {user?.blood_group}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 