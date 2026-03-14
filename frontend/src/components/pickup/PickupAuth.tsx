import { useState } from "react";
import { Smartphone, KeyRound } from "lucide-react";
import StepWrapper from "../StepWrapper";

interface PickupAuthProps {
  onOtpLogin: (phone: string) => void;
  onPasswordLogin: (phone: string, password: string) => void;
  onBack: () => void;
}

const PickupAuth = ({ onOtpLogin, onPasswordLogin, onBack }: PickupAuthProps) => {
  const [mode, setMode] = useState<"choose" | "otp" | "password">("choose");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  if (mode === "choose") {
    return (
      <StepWrapper title="Pick Up Item" subtitle="Choose your login method" onBack={onBack} step={1} totalSteps={4}>
        <div className="space-y-3">
          <button onClick={() => setMode("otp")} className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-border hover:border-primary/30 bg-secondary/50 transition-all text-left">
            <Smartphone className="w-6 h-6 text-primary" />
            <div>
              <p className="font-semibold text-foreground">Phone + OTP</p>
              <p className="text-xs text-muted-foreground">Verify with one-time password</p>
            </div>
          </button>
          <button onClick={() => setMode("password")} className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-border hover:border-primary/30 bg-secondary/50 transition-all text-left">
            <KeyRound className="w-6 h-6 text-primary" />
            <div>
              <p className="font-semibold text-foreground">Phone + Password</p>
              <p className="text-xs text-muted-foreground">Use the password you created</p>
            </div>
          </button>
        </div>
      </StepWrapper>
    );
  }

  return (
    <StepWrapper
      title={mode === "otp" ? "Login with OTP" : "Login with Password"}
      subtitle="Enter your registered phone number"
      onBack={() => setMode("choose")}
      step={1}
      totalSteps={4}
    >
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

        {mode === "password" && (
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full bg-secondary rounded-xl px-4 py-3 outline-none text-foreground placeholder:text-muted-foreground"
          />
        )}

        <button
          disabled={phone.length !== 10 || (mode === "password" && !password)}
          onClick={() => mode === "otp" ? onOtpLogin(phone) : onPasswordLogin(phone, password)}
          className="w-full btn-locker bg-primary text-primary-foreground disabled:opacity-40 disabled:hover:shadow-none disabled:hover:translate-y-0"
        >
          {mode === "otp" ? "Send OTP" : "Login"}
        </button>
      </div>
    </StepWrapper>
  );
};

export default PickupAuth;
