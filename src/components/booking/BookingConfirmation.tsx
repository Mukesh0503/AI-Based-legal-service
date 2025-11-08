
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, Clock, FileText } from "lucide-react";

interface BookingConfirmationProps {
  bookingId: string | null;
  provider: any;
  selectedService: string;
  selectedDate: Date | undefined;
  selectedTimeSlot: { time: string } | null;
  meetingType: 'in-person' | 'video' | 'phone';
  onClose: () => void;
}

export function BookingConfirmation({
  bookingId,
  provider,
  selectedService,
  selectedDate,
  selectedTimeSlot,
  meetingType,
  onClose
}: BookingConfirmationProps) {
  const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  return (
    <div className="space-y-6 text-center">
      <div className="flex flex-col items-center justify-center">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-semibold">Booking Confirmed!</h2>
        <p className="text-muted-foreground mt-1">
          Your booking request has been submitted successfully.
        </p>
      </div>

      <div className="bg-accent/30 p-4 rounded-md space-y-4 max-w-md mx-auto">
        <div>
          <p className="font-semibold text-lg">Booking ID: {bookingId}</p>
          <p className="text-sm text-muted-foreground">Save this for your records</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col items-center p-3">
            <Calendar className="h-6 w-6 mb-2 text-primary" />
            <p className="text-sm font-medium">Date</p>
            <p className="text-sm">{formattedDate}</p>
          </div>
          <div className="flex flex-col items-center p-3">
            <Clock className="h-6 w-6 mb-2 text-primary" />
            <p className="text-sm font-medium">Time</p>
            <p className="text-sm">{selectedTimeSlot?.time}</p>
          </div>
        </div>

        <div className="text-left pt-2">
          <div className="flex items-start gap-2">
            <FileText className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Service</p>
              <p className="text-sm">{selectedService}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        <p>You will receive a confirmation email shortly.</p>
        <p>The legal provider will contact you regarding your request.</p>
      </div>

      <div>
        <Button onClick={onClose} className="w-full sm:w-auto">
          Done
        </Button>
      </div>
    </div>
  );
}
