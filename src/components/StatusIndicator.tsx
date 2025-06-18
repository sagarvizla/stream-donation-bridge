
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDonations } from '@/hooks/useDonations';

const StatusIndicator = () => {
  const { donations, totalAmount } = useDonations();
  const isListening = true; // Always listening when authenticated

  return (
    <Card className="p-6 glass-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Bridge Status</h3>
        <Badge 
          variant="default"
          className="bg-green-500 hover:bg-green-600"
        >
          🟢 Ready for Donations
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-white/50 rounded-lg">
          <p className="text-2xl font-bold gradient-text">{donations.length}</p>
          <p className="text-sm text-gray-600">Total Donations</p>
        </div>
        <div className="text-center p-4 bg-white/50 rounded-lg">
          <p className="text-2xl font-bold gradient-text">₹{totalAmount}</p>
          <p className="text-sm text-gray-600">Amount Received</p>
        </div>
      </div>
      
      <div className="mt-4 flex items-center space-x-2 text-sm text-green-700">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span>Ready to receive UPI notifications...</span>
      </div>
    </Card>
  );
};

export default StatusIndicator;
