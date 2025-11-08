
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { TimeSlot, ProviderAvailability } from "@/types/booking";
import { Loader2 } from "lucide-react";

interface TimeSelectionProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  selectedTimeSlot: TimeSlot | null;
  onTimeSelect: (timeSlot: TimeSlot) => void;
  availability: ProviderAvailability | null;
  isLoading: boolean;
  onNext: (() => void) | undefined;
  onPrevious: () => void;
  canAdvance: boolean;
}

export function TimeSelection({
  selectedDate,
  onDateChange,
  selectedTimeSlot,
  onTimeSelect,
  availability,
  isLoading,
  onNext,
  onPrevious,
  canAdvance
}: TimeSelectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-2">Select Date & Time</h2>
        <p className="text-sm text-muted-foreground">
          Choose a date and available time slot for your appointment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative z-50">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateChange}
            disabled={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const thirtyDaysFromNow = new Date();
              thirtyDaysFromNow.setDate(today.getDate() + 30);
              const day = date.getDay();
              return (
                date < today ||
                date > thirtyDaysFromNow ||
                day === 0 ||
                day === 6
              );
            }}
            className="border rounded-md p-3 pointer-events-auto bg-background"
            initialFocus
          />
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Available Time Slots</h3>
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="animate-spin h-6 w-6 text-primary" />
            </div>
          ) : !selectedDate ? (
            <div className="text-center p-6 text-muted-foreground">
              Please select a date to view available time slots
            </div>
          ) : availability && availability.slots.length > 0 ? (
            <ScrollArea className="h-[240px] border rounded-md bg-background">
              <div className="p-3 grid grid-cols-2 gap-2">
                {availability.slots.map((slot) => (
                  <Button
                    key={`${slot.date}-${slot.time}`}
                    variant={
                      selectedTimeSlot &&
                      selectedTimeSlot.date === slot.date &&
                      selectedTimeSlot.time === slot.time
                        ? "default"
                        : "outline"
                    }
                    disabled={!slot.available}
                    onClick={() => slot.available && onTimeSelect(slot)}
                    className={`w-full ${!slot.available ? "opacity-50" : ""}`}
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center p-6 text-muted-foreground">
              No available time slots for the selected date
            </div>
          )}
        </div>
      </div>

      <Separator />

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!canAdvance}>
          Continue
        </Button>
      </div>
    </div>
  );
}
