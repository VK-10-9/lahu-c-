const API_BASE_URL = 'http://localhost:8000/api';

export interface Donor {
    id?: number;
    name: string;
    blood_type: string;
    age: number;
    contact: string;
    last_donation?: string;
    location?: string;
    email?: string;
}

export interface DonationRequest {
    id?: number;
    patient_name: string;
    blood_type: string;
    units_needed: number;
    hospital: string;
    contact: string;
    urgency: string;
    status: string;
    location?: string;
    email?: string;
}

export interface BloodCompatibility {
    blood_type: string;
    can_donate_to: string[];
    can_receive_from: string[];
}

// Donor API calls
export const donorApi = {
    create: async (donor: Donor): Promise<Donor> => {
        const response = await fetch(`${API_BASE_URL}/donors/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(donor),
        });
        if (!response.ok) throw new Error('Failed to create donor');
        return response.json();
    },

    getAll: async (): Promise<Donor[]> => {
        const response = await fetch(`${API_BASE_URL}/donors/`);
        if (!response.ok) throw new Error('Failed to fetch donors');
        return response.json();
    },

    getById: async (id: number): Promise<Donor> => {
        const response = await fetch(`${API_BASE_URL}/donors/${id}`);
        if (!response.ok) throw new Error('Failed to fetch donor');
        return response.json();
    },
};

// Donation Request API calls
export const donationApi = {
    create: async (request: DonationRequest): Promise<DonationRequest> => {
        const response = await fetch(`${API_BASE_URL}/blood-donation/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        });
        if (!response.ok) throw new Error('Failed to create donation request');
        return response.json();
    },

    getAll: async (): Promise<DonationRequest[]> => {
        const response = await fetch(`${API_BASE_URL}/blood-donation/`);
        if (!response.ok) throw new Error('Failed to fetch donation requests');
        return response.json();
    },

    getById: async (id: number): Promise<DonationRequest> => {
        const response = await fetch(`${API_BASE_URL}/blood-donation/${id}`);
        if (!response.ok) throw new Error('Failed to fetch donation request');
        return response.json();
    },

    updateStatus: async (id: number, status: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/blood-donation/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        if (!response.ok) throw new Error('Failed to update donation request status');
    },
};

// Blood Compatibility API calls
export const compatibilityApi = {
    getCompatibility: async (bloodType: string): Promise<BloodCompatibility> => {
        const response = await fetch(`${API_BASE_URL}/compatibility/${bloodType}`);
        if (!response.ok) throw new Error('Failed to fetch blood compatibility');
        return response.json();
    },
}; 