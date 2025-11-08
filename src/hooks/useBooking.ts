
import { useState } from 'react';
import { BookingDetails, ProviderAvailability, TimeSlot } from '@/types/booking';
import { toast } from 'sonner';

interface UseBookingProps {
  providerId: string;
  onClose: () => void;
}

export const useBooking = ({ providerId, onClose }: UseBookingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [selectedService, setSelectedService] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [availability, setAvailability] = useState<ProviderAvailability | null>(null);
  const [notes, setNotes] = useState("");
  const [meetingType, setMeetingType] = useState<'in-person' | 'video' | 'phone'>('in-person');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  // Mock services for the selected provider
  const providerServices = [
    "Initial Consultation",
    "Legal Document Review",
    "Legal Representation",
    "Mediation Services",
    "Legal Advice",
  ];

  const fetchAvailability = async (date: Date) => {
    setIsLoading(true);
    try {
      // Mock API call to fetch availability
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockTimeSlots: TimeSlot[] = [];
      const startHour = 9;
      const endHour = 17;
      
      for (let hour = startHour; hour <= endHour; hour++) {
        // Generate 30-minute slots
        for (let minutes of [0, 30]) {
          const formattedDate = date.toISOString().split('T')[0];
          const formattedTime = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          
          // Make some slots unavailable randomly
          const isAvailable = Math.random() > 0.3;
          
          mockTimeSlots.push({
            date: formattedDate,
            time: formattedTime,
            available: isAvailable
          });
        }
      }
      
      setAvailability({
        providerId,
        slots: mockTimeSlots
      });
    } catch (error) {
      console.error("Error fetching availability:", error);
      toast.error("Failed to load availability. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
    if (date) {
      fetchAvailability(date);
    }
  };

  const handleTimeSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
  };

  const goToNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const goToPreviousStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const canAdvance = () => {
    switch (currentStep) {
      case 0:
        return selectedService !== "";
      case 1:
        return selectedDate && selectedTimeSlot;
      case 2:
        return true; // Notes are optional
      default:
        return true;
    }
  };

  const handleSubmitBooking = async () => {
    if (!selectedDate || !selectedTimeSlot || !selectedService) {
      toast.error("Please fill in all required booking information.");
      return;
    }
    
    setIsLoading(true);
    try {
      // Mock API call to create booking
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newBooking: BookingDetails = {
        providerId,
        date: selectedTimeSlot.date,
        time: selectedTimeSlot.time,
        service: selectedService,
        status: 'pending',
        createdAt: new Date().toISOString(),
        notes,
        meetingType,
        documentUrls: []
      };
      
      setBookingId(`BOOK-${Math.floor(Math.random() * 10000)}`);
      setBookingConfirmed(true);
      toast.success("Booking request submitted successfully!");
      goToNextStep();
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset all state when dialog closes
    if (bookingConfirmed) {
      setTimeout(() => {
        setCurrentStep(0);
        setSelectedDate(undefined);
        setSelectedTimeSlot(null);
        setSelectedService("");
        setNotes("");
        setMeetingType('in-person');
        setBookingConfirmed(false);
        setBookingId(null);
      }, 300);
    }
    onClose();
  };

  return {
    currentStep,
    selectedDate,
    selectedTimeSlot,
    selectedService,
    isLoading,
    availability,
    notes,
    meetingType,
    bookingConfirmed,
    bookingId,
    providerServices,
    handleDateChange,
    handleTimeSelect,
    handleServiceSelect,
    goToNextStep,
    goToPreviousStep,
    canAdvance,
    handleSubmitBooking,
    handleClose,
    setNotes,
    setMeetingType,
  };
};
