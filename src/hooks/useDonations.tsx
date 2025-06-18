
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Donation {
  id: string;
  user_id: string;
  upi_id: string;
  amount: number; // Changed from string to number to match database
  sender_name: string;
  message: string | null;
  app_source: string;
  timestamp: string;
  signature: string | null;
  created_at: string;
}

export const useDonations = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchDonations = async () => {
    if (!user) {
      setDonations([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching donations:', error);
      } else {
        setDonations(data || []);
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscription for new donations
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('donations-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'donations',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New donation received:', payload);
          setDonations(prev => [payload.new as Donation, ...prev.slice(0, 19)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    fetchDonations();
  }, [user]);

  const totalAmount = donations.reduce((sum, donation) => 
    sum + donation.amount, 0
  );

  return {
    donations,
    loading,
    totalAmount: totalAmount.toString(),
    refetch: fetchDonations
  };
};
