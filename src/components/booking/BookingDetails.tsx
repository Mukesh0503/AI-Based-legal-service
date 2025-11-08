
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Video, Phone, MapPin } from "lucide-react";
import { TimeSlot } from "@/types/booking";

interface BookingDetailsProps {
  selectedDate: Date | undefined;
  selectedTimeSlot: TimeSlot | null;
  selectedService: string;
  notes: string;
  setNotes: (notes: string) => void;
  meetingType: 'in-person' | 'video' | 'phone';
  setMeetingType: (type: 'in-person' | 'video' | 'phone') => void;
  onPrevious: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function BookingDetails({
  selectedDate,
  selectedTimeSlot,
  selectedService,
  notes,
  setNotes,
  meetingType,
  setMeetingType,
  onPrevious,
  onSubmit,
  isLoading
}: BookingDetailsProps) {
  const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-2">Additional Details</h2>
        <p className="text-sm text-muted-foreground">
          Review your booking details and add any additional information.
        </p>
      </div>

      <div className="bg-accent/30 p-4 rounded-md space-y-2">
        <div className="flex justify-between">
          <span className="font-medium">Service:</span>
          <span>{selectedService}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Date:</span>
          <span>{formattedDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Time:</span>
          <span>{selectedTimeSlot?.time}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="meeting-type" className="block mb-2">Meeting Type</Label>
          <RadioGroup
            value={meetingType}
            onValueChange={(value) => setMeetingType(value as 'in-person' | 'video' | 'phone')}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
            id="meeting-type"
          >
            <div className={`flex flex-col items-center border rounded-md p-3 cursor-pointer hover:bg-accent ${meetingType === 'in-person' ? 'border-primary' : ''}`}>
              <RadioGroupItem value="in-person" id="in-person" className="sr-only" />
              <Label htmlFor="in-person" className="cursor-pointer flex flex-col items-center gap-1">
                <MapPin className="h-5 w-5" />
                <span>In Person</span>
              </Label>
            </div>
            <div className={`flex flex-col items-center border rounded-md p-3 cursor-pointer hover:bg-accent ${meetingType === 'video' ? 'border-primary' : ''}`}>
              <RadioGroupItem value="video" id="video" className="sr-only" />
              <Label htmlFor="video" className="cursor-pointer flex flex-col items-center gap-1">
                <Video className="h-5 w-5" />
                <span>Video Call</span>
              </Label>
            </div>
            <div className={`flex flex-col items-center border rounded-md p-3 cursor-pointer hover:bg-accent ${meetingType === 'phone' ? 'border-primary' : ''}`}>
              <RadioGroupItem value="phone" id="phone" className="sr-only" />
              <Label htmlFor="phone" className="cursor-pointer flex flex-col items-center gap-1">
                <Phone className="h-5 w-5" />
                <span>Phone Call</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="notes" className="block mb-2">Notes (optional)</Label>
          <Textarea
            id="notes"
            placeholder="Add any details or questions you'd like to discuss during your appointment."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
      </div>

      <Separator />

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Back
        </Button>
        <Button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? "Submitting..." : "Confirm Booking"}
        </Button>
      </div>
    </div>
  );
}
