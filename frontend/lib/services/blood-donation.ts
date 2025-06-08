import { Donation } from '../types';

export async function getDonations(): Promise<Donation[]> {
  const response = await fetch('/api/blood-donation');
  if (!response.ok) {
    throw new Error('Failed to fetch donations');
  }
  return response.json();
}

export async function createDonation(donation: Omit<Donation, 'id'>): Promise<Donation> {
  const response = await fetch('/api/blood-donation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(donation),
  });
  if (!response.ok) {
    throw new Error('Failed to create donation');
  }
  return response.json();
}

export async function updateDonation(id: string, donation: Partial<Donation>): Promise<Donation> {
  const response = await fetch(`/api/blood-donation/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(donation),
  });
  if (!response.ok) {
    throw new Error('Failed to update donation');
  }
  return response.json();
}

export async function deleteDonation(id: string): Promise<void> {
  const response = await fetch(`/api/blood-donation/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete donation');
  }
} 