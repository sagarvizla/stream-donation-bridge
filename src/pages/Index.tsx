
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDonations } from '@/hooks/useDonations';
import DonationCard from '@/components/DonationCard';
import StatusIndicator from '@/components/StatusIndicator';
import SetupCard from '@/components/SetupCard';
import PermissionCard from '@/components/PermissionCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { user, signOut } = useAuth();
  const { donations } = useDonations();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen p-4 space-y-6 max-w-4xl mx-auto">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            UPI Donation Bridge
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Secure notification-based donation relay for streamers
          </p>
          <Button 
            onClick={() => navigate('/auth')}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
          >
            Get Started - Sign In
          </Button>
        </div>

        <div className="text-center py-8">
          <div className="flex justify-center items-center space-x-4 mt-4">
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <span>🔒</span>
              <span>Secure</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <span>🚫</span>
              <span>No Payment Access</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <span>📱</span>
              <span>Notification Only</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center py-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold gradient-text">
            UPI Donation Bridge
          </h1>
          <Button 
            onClick={signOut}
            variant="outline"
            size="sm"
          >
            Sign Out
          </Button>
        </div>
        <p className="text-gray-600 text-lg">
          Welcome back! Your donation bridge is ready.
        </p>
      </div>

      {/* Status and Setup Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <StatusIndicator />
        <SetupCard />
      </div>

      {/* Permissions */}
      <PermissionCard />

      {/* Recent Donations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Recent Donations</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live updates</span>
          </div>
        </div>
        
        <div className="grid gap-4">
          {donations.map((donation, index) => (
            <DonationCard 
              key={donation.id} 
              donation={donation} 
              isLatest={index === 0}
            />
          ))}
        </div>
        
        {donations.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">💳</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No donations yet</h3>
            <p className="text-gray-500">
              Set up your Android app and donations will appear here automatically
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center py-8 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Built for streamers, powered by secure notification monitoring
        </p>
        <div className="flex justify-center items-center space-x-6 mt-3 text-xs text-gray-400">
          <span>🏆 No payment app access</span>
          <span>🔐 HTTPS only communication</span>
          <span>📱 Android 5.0+ compatible</span>
        </div>
      </div>
    </div>
  );
};

export default Index;
