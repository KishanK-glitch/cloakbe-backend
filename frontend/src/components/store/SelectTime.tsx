import { Check, Clock } from "lucide-react";
import StepWrapper from "../StepWrapper";

const PRICES: Record<string, number[]> = {
  Small: [20, 50, 80, 120],
  Medium: [30, 70, 110, 160],
  Large: [50, 110, 170, 250],
};

const DURATIONS = [1, 3, 6, 12];

interface SelectTimeProps {
  lockerSize: string;
  selectedHours: number | null;
  onSelect: (hours: number) => void;
  onBack: () => void;
  onContinue: () => void;
}

const SelectTime = ({ lockerSize, selectedHours, onSelect, onBack, onContinue }: SelectTimeProps) => {
  const prices = PRICES[lockerSize] || PRICES.Small;

  return (
    <StepWrapper title="Select Duration" subtitle={`${lockerSize} locker selected`} onBack={onBack} step={5} totalSteps={7}>
      <div className="space-y-3 mb-6">
        {DURATIONS.map((h, i) => (
          <button
            key={h}
            onClick={() => onSelect(h)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
              selectedHours === h
                ? "border-primary bg-accent"
                : "border-border hover:border-primary/30 bg-secondary/50"
            }`}
          >
            <Clock className="w-5 h-5 text-muted-foreground" />
            <span className="flex-1 font-medium text-foreground">{h} {h === 1 ? "Hour" : "Hours"}</span>
            <span className="font-bold text-foreground text-lg">₹{prices[i]}</span>
            {selectedHours === h && (
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
          </button>
        ))}
      </div>
      <button
        disabled={!selectedHours}
        onClick={onContinue}
        className="w-full btn-locker bg-primary text-primary-foreground disabled:opacity-40 disabled:hover:shadow-none disabled:hover:translate-y-0"
      >
        Proceed to Payment
      </button>
    </StepWrapper>
  );
};

export default SelectTime;
