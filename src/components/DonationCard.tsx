
import React from 'react';
import { Card } from '@/components/ui/card';

interface DonationData {
  id: string;
  amount: number; // Changed from string to number
  sender_name: string;
  message: string | null;
  app_source: string;
  timestamp: string;
}

interface DonationCardProps {
  donation: DonationData;
  isLatest?: boolean;
}

const DonationCard = ({ donation, isLatest = false }: DonationCardProps) => {
  const getAppIcon = (app: string) => {
    const icons: { [key: string]: string } = {
      'Google Pay': '💳',
      'PhonePe': '📱',
      'Paytm': '💰',
      'BHIM': '🏦',
      'Test Mode': '🧪'
    };
    return icons[app] || '💳';
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className={`p-4 glass-card transition-all duration-300 hover:scale-102 ${
      isLatest ? 'ring-2 ring-green-500 donation-pulse' : ''
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold">
            {getAppIcon(donation.app_source)}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{donation.sender_name}</p>
            <p className="text-sm text-gray-600 flex items-center space-x-1">
              <span>{donation.app_source}</span>
              <span>•</span>
              <span>{formatTime(donation.timestamp)}</span>
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-green-600">₹{donation.amount.toFixed(2)}</p>
        </div>
      </div>
      {donation.message && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700 italic">"{donation.message}"</p>
        </div>
      )}
    </Card>
  );
};

export default DonationCard;
