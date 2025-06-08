'use client';

import { useState, useEffect } from 'react';
import { Donation } from '@/lib/types';
import * as bloodDonationService from '@/lib/services/blood-donation';

export function useBloodDonation() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDonations();
  }, []);

  async function loadDonations() {
    try {
      setIsLoading(true);
      const data = await bloodDonationService.getDonations();
      setDonations(data);
      setError(null);
    } catch (err) {
      setError('Failed to load donations');
    } finally {
      setIsLoading(false);
    }
  }

  async function addDonation(donation: Omit<Donation, 'id'>) {
    try {
      setIsLoading(true);
      const newDonation = await bloodDonationService.createDonation(donation);
      setDonations((prev) => [...prev, newDonation]);
      setError(null);
      return newDonation;
    } catch (err) {
      setError('Failed to add donation');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  async function updateDonation(id: string, donation: Partial<Donation>) {
    try {
      setIsLoading(true);
      const updatedDonation = await bloodDonationService.updateDonation(id, donation);
      setDonations((prev) =>
        prev.map((d) => (d.id === id ? updatedDonation : d))
      );
      setError(null);
      return updatedDonation;
    } catch (err) {
      setError('Failed to update donation');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  async function removeDonation(id: string) {
    try {
      setIsLoading(true);
      await bloodDonationService.deleteDonation(id);
      setDonations((prev) => prev.filter((d) => d.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete donation');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    donations,
    isLoading,
    error,
    addDonation,
    updateDonation,
    removeDonation,
    refreshDonations: loadDonations,
  };
} 