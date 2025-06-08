'use client';

import { useState, useEffect } from 'react';
import { donationApi, DonationRequest } from '../lib/api';

export default function DonationsPage() {
    const [requests, setRequests] = useState<DonationRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            setLoading(true);
            const data = await donationApi.getAll();
            setRequests(data);
            setError(null);
        } catch (err) {
            setError('Failed to load donation requests');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: number, newStatus: string) => {
        try {
            await donationApi.updateStatus(id, newStatus);
            await loadRequests(); // Reload the requests after update
        } catch (err) {
            setError('Failed to update request status');
            console.error(err);
        }
    };

    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Blood Donation Requests</h1>
            <div className="grid gap-4">
                {requests.map((request) => (
                    <div key={request.id} className="border p-4 rounded-lg shadow">
                        <h2 className="text-xl font-semibold">{request.patient_name}</h2>
                        <div className="mt-2">
                            <p><strong>Blood Type:</strong> {request.blood_type}</p>
                            <p><strong>Units Needed:</strong> {request.units_needed}</p>
                            <p><strong>Hospital:</strong> {request.hospital}</p>
                            <p><strong>Contact:</strong> {request.contact}</p>
                            <p><strong>Urgency:</strong> {request.urgency}</p>
                            <p><strong>Status:</strong> {request.status}</p>
                            {request.location && <p><strong>Location:</strong> {request.location}</p>}
                        </div>
                        <div className="mt-4">
                            <select
                                value={request.status}
                                onChange={(e) => handleStatusUpdate(request.id!, e.target.value)}
                                className="border rounded p-2"
                            >
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 