import { MapPin, Clock, Hash } from "lucide-react";
import StepWrapper from "../StepWrapper";

interface PickupDetailsProps {
  lockerId: string;
  remainingTime: string;
  location: string;
  hasExtraCharge: boolean;
  extraAmount: number;
  onProceed: () => void;
  onBack: () => void;
}

const PickupDetails = ({ lockerId, remainingTime, location, hasExtraCharge, extraAmount, onProceed, onBack }: PickupDetailsProps) => (
  <StepWrapper title="Pickup Details" subtitle="Your locker information" onBack={onBack} step={2} totalSteps={4}>
    <div className="space-y-4 mb-6">
      <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
        <Hash className="w-5 h-5 text-primary" />
        <div>
          <p className="text-xs text-muted-foreground">Locker ID</p>
          <p className="font-semibold text-foreground">{lockerId}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
        <Clock className="w-5 h-5 text-primary" />
        <div>
          <p className="text-xs text-muted-foreground">Remaining Time</p>
          <p className="font-semibold text-foreground">{remainingTime}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
        <MapPin className="w-5 h-5 text-primary" />
        <div>
          <p className="text-xs text-muted-foreground">Location</p>
          <p className="font-semibold text-foreground">{location}</p>
        </div>
      </div>
    </div>

    {hasExtraCharge && (
      <div className="bg-warning/10 border border-warning/30 rounded-xl p-3 mb-6 text-center">
        <p className="text-sm text-foreground">Additional charge: <span className="font-bold">₹{extraAmount}</span></p>
      </div>
    )}

    <button onClick={onProceed} className="w-full btn-locker bg-primary text-primary-foreground">
      {hasExtraCharge ? "Proceed to Payment" : "Unlock Locker"}
    </button>
  </StepWrapper>
);

export default PickupDetails;
