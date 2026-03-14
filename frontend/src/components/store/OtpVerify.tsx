import { useState, useEffect, useRef } from "react";
import StepWrapper from "../StepWrapper";

interface OtpVerifyProps {
  phone: string;
  onVerify: () => void;
  onBack: () => void;
  step?: number;
  totalSteps?: number;
}

const OtpVerify = ({ phone, onVerify, onBack, step = 2, totalSteps = 7 }: OtpVerifyProps) => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [countdown, setCountdown] = useState(30);
  const [isAgreed, setIsAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // REAL BACKEND INTEGRATION
  const handleVerify = async () => {
    setIsLoading(true);
    const fullOtp = otp.join("");

    try {
      const response = await fetch("http://localhost:8000/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: phone,
          otp: fullOtp
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Success! OTP is correct and not expired
        onVerify();
      } else {
        alert(data.detail || "Invalid or expired OTP. Please try again.");
        setOtp(Array(6).fill("")); // Reset inputs
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error("Verification failed:", error);
      alert("Cannot connect to server. Ensure backend is running on port 8000.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: phone })
      });
      if (response.ok) {
        setCountdown(30);
        setOtp(Array(6).fill(""));
        inputRefs.current[0]?.focus();
      } else {
        const data = await response.json();
        alert(data.detail || "Failed to resend OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to reach server to resend OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFilled = otp.every((d) => d !== "");

  return (
    <StepWrapper title="Verify OTP" subtitle={`Code sent to +91 ${phone}`} onBack={onBack} step={step} totalSteps={totalSteps}>
      <div className="space-y-6">
        <div className={`flex justify-center gap-3 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-12 h-14 text-center text-xl font-bold bg-secondary rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground"
            />
          ))}
        </div>

        <div className="text-center text-sm text-muted-foreground">
          {countdown > 0 ? (
            <span>Resend in {countdown}s</span>
          ) : (
            <button
              disabled={isLoading}
              onClick={handleResend}
              className="text-primary font-medium hover:underline disabled:no-underline"
            >
              Resend OTP
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 justify-center">
          <input
            type="checkbox"
            id="terms-agreement"
            checked={isAgreed}
            disabled={isLoading}
            onChange={(e) => setIsAgreed(e.target.checked)}
            className="w-4 h-4 text-primary bg-secondary border-border rounded focus:ring-primary focus:ring-2 cursor-pointer transition-all"
          />
          <label htmlFor="terms-agreement" className="text-sm text-muted-foreground cursor-pointer select-none">
            I agree to the Terms and Conditions
          </label>
        </div>

        <button
          disabled={!isFilled || !isAgreed || isLoading}
          onClick={handleVerify} // Using the new backend handler
          className="w-full btn-locker bg-primary text-primary-foreground disabled:opacity-40 disabled:hover:shadow-none disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? "Verifying..." : "Verify"}
        </button>
      </div>
    </StepWrapper>
  );
};

export default OtpVerify;