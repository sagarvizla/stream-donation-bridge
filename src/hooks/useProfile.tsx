import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Profile {
  id: string;
  email: string | null;
  upi_id: string | null;
  api_token: string | null;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        // Check if API token is missing and generate one
        if (data && !data.api_token) {
          try {
            // Generate a new API token
            const { data: tokenData, error: tokenError } = await supabase
              .rpc('generate_api_token');

            if (!tokenError && tokenData) {
              // Update the profile with the new API token
              const { data: updatedProfile, error: updateError } = await supabase
                .from('profiles')
                .update({ api_token: tokenData })
                .eq('id', user.id)
                .select()
                .single();

              if (!updateError && updatedProfile) {
                setProfile(updatedProfile);
              } else {
                setProfile(data);
              }
            } else {
              setProfile(data);
            }
          } catch (tokenGenerationError) {
            console.error('Error generating API token:', tokenGenerationError);
            setProfile(data);
          }
        } else {
          setProfile(data);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        return { error };
      } else {
        setProfile(data);
        return { data };
      }
    } catch (error) {
      return { error };
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return {
    profile,
    loading,
    updateProfile,
    refetch: fetchProfile
  };
};