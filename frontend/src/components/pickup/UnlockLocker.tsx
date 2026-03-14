import { useState } from "react";
import { LockOpen, Lock } from "lucide-react";
import StepWrapper from "../StepWrapper";

interface UnlockLockerProps {
  lockerId: string;
  onDone: () => void;
}

const UnlockLocker = ({ lockerId, onDone }: UnlockLockerProps) => {
  const [opened, setOpened] = useState(false);

  return (
    <StepWrapper title="Unlock Your Locker" step={4} totalSteps={4}>
      <div className="flex flex-col items-center gap-6 py-4">
        <div className="relative">
          <div className="w-32 h-40 rounded-2xl border-4 border-foreground/20 bg-secondary flex items-center justify-center">
            <span className="text-3xl font-display font-bold text-foreground">{lockerId}</span>
          </div>
          <div className={`absolute inset-0 w-32 h-40 rounded-2xl border-4 border-primary bg-primary/10 flex items-center justify-center ${opened ? "animate-door-open" : ""}`}>
            {opened ? <LockOpen className="w-10 h-10 text-primary" /> : <Lock className="w-10 h-10 text-primary" />}
          </div>
        </div>

        <p className="text-sm text-muted-foreground">{opened ? "Locker is open — collect your item" : "Tap to unlock"}</p>

        {!opened ? (
          <button onClick={() => setOpened(true)} className="btn-locker bg-primary text-primary-foreground animate-pulse-glow">
            Unlock Locker
          </button>
        ) : (
          <button onClick={onDone} className="btn-locker bg-primary text-primary-foreground">
            Done — Return Home
          </button>
        )}
      </div>
    </StepWrapper>
  );
};

export default UnlockLocker;
