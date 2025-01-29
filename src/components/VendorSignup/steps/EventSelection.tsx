import React from 'react';
import { SignupFormData } from '../VendorSignupForm';
import { MapPin, Calendar } from 'lucide-react';

interface Props {
  formData: SignupFormData;
  updateFormData: (data: Partial<SignupFormData>) => void;
}

interface Event {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: string;
  location?: string;
}

function EventSelection({ formData, updateFormData }: Props) {
  // Use the actual UUID from the database for the Hawaii Fest event
  const hawaiiFest: Event = {
    id: "00000000-0000-0000-0000-000000000000", // This should match the UUID in your database
    name: "Hawaii Fest",
    start_date: "2025-02-15T00:00:00Z",
    end_date: "2025-02-16T00:00:00Z",
    status: "upcoming",
    location: "Moanalua Gardens"
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold gradient-text">{hawaiiFest.name}</h3>
            <div className="mt-2 space-y-2">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 mr-2" />
                <span>February 15-16, 2025</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{hawaiiFest.location}</span>
              </div>
            </div>
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            Registration Open
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => updateFormData({ eventId: hawaiiFest.id })}
            className={`w-full py-3 rounded-lg transition ${
              formData.eventId === hawaiiFest.id
                ? 'gradient-bg text-white'
                : 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
            }`}
          >
            {formData.eventId === hawaiiFest.id ? 'Selected' : 'Select Event'}
          </button>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-700">
          By selecting this event, you agree to participate for the full duration and comply with all vendor guidelines.
        </p>
      </div>
    </div>
  );
}

export default EventSelection;
