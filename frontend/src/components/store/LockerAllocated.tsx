import { CheckCircle, MapPin, Clock, CreditCard, Home } from "lucide-react";
import StepWrapper from "../StepWrapper";

// 1. Updated Props to accept amount, duration, and accessCode
interface LockerAllocatedProps {
  lockerId: string;
  amount?: number;
  duration?: number | null;
  accessCode?: string | null;
  onDone: () => void;
}

const LockerAllocated = ({ lockerId, amount = 0, duration = 1, accessCode, onDone }: LockerAllocatedProps) => {
  // Derive the block letter (e.g., "A" from "A-1")
  const block = lockerId.split('-')[0];

  return (
    <StepWrapper title="Booking Confirmed!" subtitle="Your locker is reserved and ready to use." step={7} totalSteps={7}>
      <div className="flex flex-col items-center gap-6 py-4">

        {/* Success Header */}
        <div className="flex flex-col items-center gap-2 animate-in zoom-in duration-500">
          <CheckCircle className="w-16 h-16 text-emerald-500" />
          <h3 className="text-3xl font-display font-bold text-foreground mt-2">Locker {lockerId}</h3>
          <p className="text-sm text-muted-foreground">Successfully Allocated</p>
        </div>

        {/* Details Summary Card */}
        <div className="w-full bg-secondary/50 rounded-2xl p-6 space-y-5 border border-border/50 shadow-sm mt-2">

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="font-medium">Position</span>
            </div>
            <span className="font-semibold text-foreground">Block {block}</span>
          </div>

          {/* TIME BOOKED DISPLAY */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Clock className="w-5 h-5 text-primary" />
              <span className="font-medium">Time Booked</span>
            </div>
            <span className="font-semibold text-foreground">
              {duration} Hour{duration && duration > 1 ? 's' : ''}
            </span>
          </div>

          {/* AMOUNT TO BE PAID DISPLAY */}
          <div className="flex justify-between items-center pt-4 border-t border-border/50">
            <div className="flex items-center gap-3 text-muted-foreground">
              <CreditCard className="w-5 h-5 text-primary" />
              <span className="font-medium">Amount to be Paid</span>
            </div>
            <span className="text-xl font-bold text-foreground">₹{amount}</span>
          </div>

          {/* ACCESS CODE DISPLAY */}
          {accessCode && (
            <div className="flex justify-between items-center pt-4 border-t border-border/50 bg-green-50/50 p-2 rounded">
              <div className="flex items-center gap-3 text-green-700">
                <span className="font-medium">Access Code</span>
              </div>
              <span className="text-2xl font-black tracking-widest text-green-700">{accessCode}</span>
            </div>
          )}

        </div>

        {/* Return Home Button */}
        <button
          onClick={onDone}
          className="w-full py-4 mt-4 rounded-xl font-bold bg-primary text-primary-foreground flex items-center justify-center gap-2 transition-all hover:bg-primary/90 shadow-md hover:shadow-lg active:scale-[0.98]"
        >
          <Home className="w-5 h-5" />
          Return Home
        </button>

      </div>
    </StepWrapper>
  );
};

export default LockerAllocated;