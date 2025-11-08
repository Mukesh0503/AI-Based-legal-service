
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useBooking } from '@/hooks/useBooking';
import { ServiceSelection } from '@/components/booking/ServiceSelection';
import { TimeSelection } from '@/components/booking/TimeSelection';
import { BookingDetails } from '@/components/booking/BookingDetails'; 
import { BookingConfirmation } from '@/components/booking/BookingConfirmation';
import { useLanguage } from '@/contexts/LanguageContext';

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: any;
}

const BookingDialog = ({ open, onOpenChange, provider }: BookingDialogProps) => {
  const { translate } = useLanguage();
  
  const booking = useBooking({
    providerId: provider?.id || '',
    onClose: () => onOpenChange(false)
  });

  const getStepTitle = () => {
    switch (booking.currentStep) {
      case 0: return translate("selectService") || "Select Service";
      case 1: return translate("selectDate") || "Select a Date";
      case 2: return translate("consultationDetails") || "Consultation Details";
      case 3: return translate("bookingSubmitted") || "Booking Confirmed";
      default: return "";
    }
  };

  const getStepDescription = () => {
    switch (booking.currentStep) {
      case 0: return translate("chooseService") || "Choose the service you need";
      case 1: return translate("chooseTime") || "Select an available time slot";
      case 2: return translate("provideDetails") || "Please provide additional details for your consultation";
      case 3: return translate("bookingReceived") || "Your booking has been received";
      default: return "";
    }
  };

  // Explicitly cast the return value of booking.canAdvance() to boolean
  const canAdvanceValue = !!booking.canAdvance();

  return (
    <Dialog open={open} onOpenChange={booking.handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {getStepTitle()}
          </DialogTitle>
          <DialogDescription className="text-center">
            {provider && booking.currentStep !== 3 
              ? `${getStepDescription()} ${translate("with") || "with"} ${provider.name}`
              : getStepDescription()
            }
          </DialogDescription>
        </DialogHeader>

        {booking.currentStep === 0 && (
          <ServiceSelection 
            services={booking.providerServices}
            selectedService={booking.selectedService}
            onSelectService={booking.handleServiceSelect}
            onNext={canAdvanceValue ? booking.goToNextStep : undefined}
            canAdvance={canAdvanceValue}
          />
        )}

        {booking.currentStep === 1 && (
          <TimeSelection 
            selectedDate={booking.selectedDate}
            onDateChange={booking.handleDateChange}
            availability={booking.availability}
            selectedTimeSlot={booking.selectedTimeSlot}
            onTimeSelect={booking.handleTimeSelect}
            isLoading={booking.isLoading}
            onPrevious={booking.goToPreviousStep}
            onNext={canAdvanceValue ? booking.goToNextStep : undefined}
            canAdvance={canAdvanceValue}
          />
        )}

        {booking.currentStep === 2 && (
          <BookingDetails
            selectedDate={booking.selectedDate}
            selectedTimeSlot={booking.selectedTimeSlot}
            selectedService={booking.selectedService}
            notes={booking.notes}
            setNotes={booking.setNotes}
            meetingType={booking.meetingType}
            setMeetingType={booking.setMeetingType}
            onPrevious={booking.goToPreviousStep}
            onSubmit={booking.handleSubmitBooking}
            isLoading={booking.isLoading}
          />
        )}

        {booking.currentStep === 3 && (
          <BookingConfirmation
            bookingId={booking.bookingId}
            provider={provider}
            selectedDate={booking.selectedDate}
            selectedTimeSlot={booking.selectedTimeSlot}
            selectedService={booking.selectedService}
            meetingType={booking.meetingType}
            onClose={booking.handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
