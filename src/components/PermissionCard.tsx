
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const PermissionCard = () => {
  const [permissions, setPermissions] = useState({
    notifications: false,
    foreground: false
  });

  const handleRequestNotifications = () => {
    // In real app, this would request Android notification access
    setPermissions(prev => ({ ...prev, notifications: true }));
    console.log('Requesting notification access...');
  };

  const handleRequestForeground = () => {
    // In real app, this would request foreground service permission
    setPermissions(prev => ({ ...prev, foreground: true }));
    console.log('Requesting foreground service permission...');
  };

  return (
    <Card className="p-6 glass-card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Permissions</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Notification Access</h4>
            <p className="text-sm text-gray-600">
              Required to monitor UPI payment notifications
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={permissions.notifications ? "default" : "secondary"}>
              {permissions.notifications ? 'Granted' : 'Required'}
            </Badge>
            {!permissions.notifications && (
              <Button size="sm" onClick={handleRequestNotifications}>
                Grant
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Background Service</h4>
            <p className="text-sm text-gray-600">
              Keeps app active during streams (recommended)
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={permissions.foreground ? "default" : "outline"}>
              {permissions.foreground ? 'Enabled' : 'Optional'}
            </Badge>
            {!permissions.foreground && (
              <Button size="sm" variant="outline" onClick={handleRequestForeground}>
                Enable
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-green-50 rounded-lg">
        <p className="text-xs text-green-700">
          ✅ <strong>Privacy:</strong> No SMS, call, or payment app access needed
        </p>
      </div>
    </Card>
  );
};

export default PermissionCard;
