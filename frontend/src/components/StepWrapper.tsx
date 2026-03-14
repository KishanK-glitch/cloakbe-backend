import { ArrowLeft } from "lucide-react";

interface StepWrapperProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  children: React.ReactNode;
  step?: number;
  totalSteps?: number;
}

const StepWrapper = ({ title, subtitle, onBack, children, step, totalSteps }: StepWrapperProps) => (
  <div className="step-container py-12">
    <div className="glass-card p-8">
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      )}

      {step && totalSteps && (
        <div className="flex gap-1.5 mb-6">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < step ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>
      )}

      <h2 className="text-2xl font-display font-bold text-foreground mb-1">{title}</h2>
      {subtitle && <p className="text-muted-foreground text-sm mb-6">{subtitle}</p>}
      {!subtitle && <div className="mb-6" />}

      {children}
    </div>
  </div>
);

export default StepWrapper;
