import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const SetupCard = () => {
  const { profile, updateProfile, loading } = useProfile();
  const { toast } = useToast();
  const [upiId, setUpiId] = useState('');
  const [isTestMode, setIsTestMode] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setUpiId(profile.upi_id || '');
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await updateProfile({ upi_id: upiId });
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to update settings",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Settings updated successfully"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTestDonation = async () => {
    // Create a test donation
    const testDonation = {
      user_id: profile?.id,
      upi_id: upiId || 'test@upi',
      amount: 50.00, // Changed from string to number
      sender_name: 'Test User',
      message: 'Test donation alert! 🎮',
      app_source: 'Test Mode',
      timestamp: new Date().toISOString(),
      signature: 'test_signature'
    };

    try {
      const { error } = await supabase.from('donations').insert([testDonation]);
      
      if (error) {
        toast({
          title: "Test Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Test Alert Sent!",
          description: "Check your recent donations"
        });
      }
    } catch (error) {
      console.error('Test donation error:', error);
    }
  };

  if (loading) {
    return (
      <Card className="p-6 glass-card">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 glass-card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Streamer Settings
      </h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="api-token">Your API Token</Label>
          <Input
            id="api-token"
            type="text"
            value={profile?.api_token || ''}
            readOnly
            className="mt-1 bg-gray-50 font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Use this token in your Android app for authentication
          </p>
        </div>
        
        <div>
          <Label htmlFor="upi-id">Your UPI ID</Label>
          <Input
            id="upi-id"
            placeholder="streamer@upi"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Public UPI ID for donations
          </p>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
          <div>
            <Label htmlFor="test-mode">Test Mode</Label>
            <p className="text-xs text-gray-500">Enable for testing alerts</p>
          </div>
          <Switch
            id="test-mode"
            checked={isTestMode}
            onCheckedChange={setIsTestMode}
          />
        </div>
        
        <div className="flex space-x-3">
          <Button 
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            disabled={saving || !upiId}
          >
            {saving ? 'Saving...' : 'Update Settings'}
          </Button>
          
          {isTestMode && (
            <Button 
              onClick={handleTestDonation}
              variant="outline"
              className="border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              Test Alert
            </Button>
          )}
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700">
          🔐 <strong>Security:</strong> This app only reads notifications - no payment access required
        </p>
      </div>
    </Card>
  );
};

export default SetupCard;
