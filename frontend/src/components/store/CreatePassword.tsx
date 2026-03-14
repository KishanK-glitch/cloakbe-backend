import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import StepWrapper from "../StepWrapper";

interface CreatePasswordProps {
  onSubmit: (password: string) => void;
  onBack: () => void;
}

const CreatePassword = ({ onSubmit, onBack }: CreatePasswordProps) => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);

  const valid = password.length >= 4 && password === confirm;

  return (
    <StepWrapper title="Create Password" subtitle="This password will be used for pickup authentication" onBack={onBack} step={3} totalSteps={7}>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create password"
              className="w-full bg-secondary rounded-xl px-4 py-3 outline-none text-foreground placeholder:text-muted-foreground pr-10"
            />
            <button onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Confirm Password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm password"
            className="w-full bg-secondary rounded-xl px-4 py-3 outline-none text-foreground placeholder:text-muted-foreground"
          />
          {confirm && password !== confirm && (
            <p className="text-xs text-destructive mt-1">Passwords do not match</p>
          )}
        </div>
        <button disabled={!valid} onClick={() => onSubmit(password)} className="w-full btn-locker bg-primary text-primary-foreground disabled:opacity-40 disabled:hover:shadow-none disabled:hover:translate-y-0">
          Continue
        </button>
      </div>
    </StepWrapper>
  );
};

export default CreatePassword;
