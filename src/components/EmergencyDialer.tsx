import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Phone, PhoneOff, Mic } from 'lucide-react';

const EmergencyDialer = ({ onCall }: { onCall: (number: string) => void }) => {
  const [number, setNumber] = useState('');
  const { toast } = useToast();

  const handleNumberClick = (digit: string) => {
    if (number.length < 3) {
      setNumber(prev => prev + digit);
    }
  };

  const handleCall = () => {
    if (number === '999' || number === '911') {
      onCall(number);
    } else {
      toast({
        title: "Invalid Emergency Number",
        description: "Please dial 999 or 911 for emergency services",
        variant: "destructive"
      });
    }
  };

  const clearNumber = () => setNumber('');

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Emergency Call Simulator</h1>
        <p className="text-gray-600">Dial 999 or 911</p>
        <p className="text-sm text-red-500 mt-1">For training purposes only</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="text-3xl font-bold text-center mb-6 h-12">
          {number}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((digit) => (
            <Button
              key={digit}
              onClick={() => handleNumberClick(digit.toString())}
              className="emergency-button h-14 text-xl"
              variant="outline"
            >
              {digit}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={clearNumber}
            variant="outline"
            className="emergency-button"
          >
            Clear
          </Button>
          <Button
            onClick={handleCall}
            className="emergency-button bg-red-600 hover:bg-red-700"
          >
            <Phone className="mr-2 h-4 w-4" /> Call
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyDialer;