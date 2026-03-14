import { useState } from "react";
import StepWrapper from "../StepWrapper";

interface PhoneInputProps {
  onSubmit: (phone: string) => void;
  onBack: () => void;
}

const PhoneInput = ({ onSubmit, onBack }: PhoneInputProps) => {
  const [phone, setPhone] = useState("");

  return (
    <StepWrapper title="Enter Phone Number" subtitle="We'll send you a verification code" onBack={onBack} step={1} totalSteps={7}>
      <div className="space-y-4">
        <div className="flex items-center gap-2 bg-secondary rounded-xl px-4 py-3">
          <span className="text-muted-foreground font-medium">+91</span>
          <input
            type="tel"
            maxLength={10}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            placeholder="Enter 10-digit number"
            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground font-medium text-lg"
          />
        </div>
        <button
          disabled={phone.length !== 10}
          onClick={() => onSubmit(phone)}
          className="w-full btn-locker bg-primary text-primary-foreground disabled:opacity-40 disabled:hover:shadow-none disabled:hover:translate-y-0"
        >
          Send OTP
        </button>
      </div>
    </StepWrapper>
  );
};

export default PhoneInput;
