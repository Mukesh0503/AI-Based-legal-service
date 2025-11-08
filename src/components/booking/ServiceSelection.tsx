
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ServiceSelectionProps {
  services: string[];
  selectedService: string;
  onSelectService: (service: string) => void;
  onNext: (() => void) | undefined;
  canAdvance: boolean;
}

export function ServiceSelection({
  services,
  selectedService,
  onSelectService,
  onNext,
  canAdvance
}: ServiceSelectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-2">Select Service</h2>
        <p className="text-sm text-muted-foreground">
          Choose the type of service you need from this legal provider.
        </p>
      </div>

      <RadioGroup value={selectedService} onValueChange={onSelectService} className="space-y-3">
        {services.map((service) => (
          <div key={service} className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent cursor-pointer">
            <RadioGroupItem value={service} id={service} />
            <Label htmlFor={service} className="flex-1 cursor-pointer">{service}</Label>
          </div>
        ))}
      </RadioGroup>

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!canAdvance}>
          Continue
        </Button>
      </div>
    </div>
  );
}
