import { useState, useEffect } from "react";
import { QrCode, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import StepWrapper from "../StepWrapper";

interface PaymentProps {
  amount: number;
  onSuccess: (accessCode: string) => void;
  onBack: () => void;
  onConflict?: () => void;
  step?: number;
  totalSteps?: number;
  boxIdentifier?: string | null;
  hours?: number | null;
  phone?: string;  orderId?: number | null;}

const Payment = ({ amount, onSuccess, onBack, onConflict, step = 6, totalSteps = 7, boxIdentifier, hours, phone, orderId }: PaymentProps) => {
  const [timer, setTimer] = useState(120);
  const [paid, setPaid] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayAmount = Math.max(20, Math.ceil(amount));

  useEffect(() => {
    if (timer > 0 && !paid) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timer, paid]);

  const handlePay = async () => {
    setLoading(true);
    setError(null);
    try {
      if (orderId) {
        // Complete pickup
        const res = await fetch(`http://localhost:8000/orders/${orderId}/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({})
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.detail || "Payment failed");
        }

        setPaid(true);
        setTimeout(() => onSuccess(), 1500);
      } else {
        // This should not happen in new flow
        throw new Error("No order to complete");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const mins = Math.floor(timer / 60);
  const secs = timer % 60;

  return (
    <StepWrapper title={paid ? "Payment Successful" : "Complete Payment"} subtitle={paid ? "Redirecting..." : `Pay ₹${amount} to continue`} onBack={!paid ? onBack : undefined} step={step} totalSteps={totalSteps}>
      {paid ? (
        <div className="flex flex-col items-center gap-4 py-8">
          <CheckCircle2 className="w-16 h-16 text-success animate-scale-in" />
          <p className="text-lg font-semibold text-foreground">₹{amount} Paid</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-secondary rounded-2xl p-6 flex flex-col items-center gap-4">
            <div className="w-40 h-40 bg-card rounded-xl border border-border flex items-center justify-center">
              <QrCode className="w-28 h-28 text-foreground/80" />
            </div>
            <p className="text-sm text-muted-foreground">Scan QR code to pay</p>
          </div>

          <div className="flex items-center justify-between px-2">
            <span className="text-sm text-muted-foreground">Amount</span>
            <span className="text-2xl font-bold text-foreground">₹{displayAmount}</span>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Payment valid for <span className="font-semibold text-foreground">{mins}:{secs.toString().padStart(2, "0")}</span>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <button onClick={handlePay} disabled={loading} className="w-full btn-locker bg-primary text-primary-foreground flex justify-center items-center">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Payment"}
          </button>
        </div>
      )}
    </StepWrapper>
  );
};

export default Payment;
