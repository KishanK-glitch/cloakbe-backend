import { useState } from "react";
import StepWrapper from "../StepWrapper";
import PhoneInput from "../store/PhoneInput";
import OtpVerify from "../store/OtpVerify";

interface PickupAuthProps {
  onPickup: (orderId: number, amount: number, lockerId: string) => void;
  onBack: () => void;
}

const PickupAuth = ({ onPickup, onBack }: PickupAuthProps) => {
  const [authMode, setAuthMode] = useState<"code" | "otp">("code");
  const [accessCode, setAccessCode] = useState("");
  const [phone, setPhone] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleValidateCode = async () => {
    if (!accessCode.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:8000/orders/validate?pickup_code=${accessCode}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Invalid access code");
      }
      const data = await res.json();
      onPickup(data.order_id, data.price, data.locker_id);
    } catch (err: any) {
      alert(err.message || "Invalid access code");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSent = (phoneNumber: string) => {
    setPhone(phoneNumber);
    setOtpStep(true);
  };

  const handleOtpVerified = async (otp: string) => {
    try {
      const res = await fetch("http://localhost:8000/orders/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: phone, otp })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "No active booking found");
      }

      const data = await res.json();
      onPickup(data.order_id, data.price, data.locker_id);
    } catch (err: any) {
      alert(err.message || "Unable to locate active booking");
    }
  };

  return (
    <StepWrapper title="Pick Up Item" subtitle="Use access code or phone OTP" onBack={onBack} step={1} totalSteps={4}>
      {authMode === "code" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 bg-secondary rounded-xl px-4 py-3">
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="Enter access code"
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground font-medium"
            />
          </div>

          <button
            disabled={!accessCode.trim() || loading}
            onClick={handleValidateCode}
            className="w-full btn-locker bg-primary text-primary-foreground disabled:opacity-40 disabled:hover:shadow-none disabled:hover:translate-y-0"
          >
            {loading ? "Validating..." : "Continue"}
          </button>

          <button
            onClick={() => {
              setAuthMode("otp");
              setOtpStep(false);
              setPhone("");
            }}
            className="w-full text-sm text-primary underline-offset-4 hover:underline"
          >
            Forgot Access Code? Use Phone Number
          </button>
        </div>
      )}

      {authMode === "otp" && (
        <div className="space-y-4">
          {!otpStep ? (
            <PhoneInput onSubmit={handleOtpSent} onBack={() => setAuthMode("code")} />
          ) : (
            <>
              <OtpVerify
                phone={phone}
                onVerify={handleOtpVerified}
                onBack={() => {
                  setOtpStep(false);
                }}
              />
              <button
                onClick={() => {
                  setAuthMode("code");
                  setOtpStep(false);
                }}
                className="w-full text-sm text-primary underline-offset-4 hover:underline"
              >
                Back to Access Code
              </button>
            </>
          )}
        </div>
      )}
    </StepWrapper>
  );
};

export default PickupAuth;
