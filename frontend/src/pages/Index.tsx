import { useState } from "react";
import Header from "@/components/Header";
import StartScreen from "@/components/StartScreen";
import PhoneInput from "@/components/store/PhoneInput";
import OtpVerify from "@/components/store/OtpVerify";
import CreatePassword from "@/components/store/CreatePassword";
import SelectLocker from "@/components/store/SelectLocker";
import SelectTime from "@/components/store/SelectTime";
import Payment from "@/components/store/Payment";
import LockerAllocated from "@/components/store/LockerAllocated";
import PickupAuth from "@/components/pickup/PickupAuth";
import PickupDetails from "@/components/pickup/PickupDetails";
import UnlockLocker from "@/components/pickup/UnlockLocker";

const PRICES: Record<string, number[]> = {
  Small: [20, 50, 80, 120],
  Medium: [30, 70, 110, 160],
  Large: [50, 110, 170, 250],
};
const DURATION_INDEX: Record<number, number> = { 1: 0, 3: 1, 6: 2, 12: 3 };

type Screen =
  | "home"
  | "store-phone"
  | "store-otp"
  | "store-password"
  | "store-locker"
  | "store-time"
  | "store-payment"
  | "store-allocated"
  | "pickup-auth"
  | "pickup-otp"
  | "pickup-details"
  | "pickup-payment"
  | "pickup-unlock";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("home");
  const [phone, setPhone] = useState("");
  const [selectedLocker, setSelectedLocker] = useState<string | null>(null);
  const [hours, setHours] = useState<number | null>(null);
  const [loading, setLoading] = useState(false); // NEW: Track loading state
  const [accessCode, setAccessCode] = useState<string | null>(null);

  const getDerivedSize = (boxId: string | null): "Small" | "Medium" | "Large" | null => {
    if (!boxId) return null;
    const letter = boxId.split('-')[0];
    if (letter === 'C') return "Large";
    if (letter === 'B') return "Medium";
    return "Small";
  };

  const getPrice = () => {
    const size = getDerivedSize(selectedLocker);
    if (!size || !hours) return 0;
    return PRICES[size][DURATION_INDEX[hours]];
  };

  const activeLockerId = selectedLocker || "A-1";

  const reset = () => {
    setScreen("home");
    setPhone("");
    setSelectedLocker(null);
    setHours(null);
    setAccessCode(null);
  };

  // NEW: The function that actually talks to your FastAPI backend
  const handlePhoneSubmit = async (p: string) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: p }) 
      });

      if (response.ok) {
        // Success! Fast2SMS sent the OTP. Move to the next screen.
        setPhone(p);
        setScreen("store-otp");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail || "Failed to send OTP"}`);
      }
    } catch (error) {
      console.error(error);
      alert("Cannot connect to server. Is the backend running on port 8000?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-start justify-center px-4 overflow-y-auto">
        <div className="w-full max-w-2xl" key={screen}>
          {screen === "home" && (
            <StartScreen onStore={() => setScreen("store-phone")} onPickup={() => setScreen("pickup-auth")} />
          )}

          {/* STORE FLOW */}
          {screen === "store-phone" && (
             // CHANGED: Now using handlePhoneSubmit instead of instantly switching screens
            <div className={loading ? "opacity-50 pointer-events-none" : ""}>
               <PhoneInput onSubmit={handlePhoneSubmit} onBack={reset} />
            </div>
          )}
          {screen === "store-otp" && (
            <OtpVerify phone={phone} onVerify={() => setScreen("store-password")} onBack={() => setScreen("store-phone")} />
          )}
          {screen === "store-password" && (
            <CreatePassword onSubmit={() => setScreen("store-locker")} onBack={() => setScreen("store-otp")} />
          )}
          {screen === "store-locker" && (
            <SelectLocker
              selected={selectedLocker}
              onSelect={(s) => { setSelectedLocker(s); setScreen("store-time"); }}
              onBack={() => setScreen("store-password")}
            />
          )}
          {screen === "store-time" && (
            <SelectTime
              lockerSize={getDerivedSize(selectedLocker)!}
              selectedHours={hours}
              onSelect={setHours}
              onBack={() => setScreen("store-locker")}
              onContinue={() => setScreen("store-payment")}
            />
          )}
          {screen === "store-payment" && (
            <Payment 
              amount={getPrice()} 
              boxIdentifier={selectedLocker}
              hours={hours}
              phone={phone}
              onSuccess={(code) => { setAccessCode(code); setScreen("store-allocated"); }} 
              onBack={() => setScreen("store-time")} 
              onConflict={() => {
                alert("The selected box was just booked by someone else! Please choose another one.");
                setSelectedLocker(null);
                setScreen("store-locker");
              }}
            />
          )}
          {screen === "store-allocated" && (
            <LockerAllocated lockerId={activeLockerId} accessCode={accessCode} onDone={reset} />
          )}

          {/* PICKUP FLOW */}
          {screen === "pickup-auth" && (
            <PickupAuth
              onOtpLogin={(p) => { setPhone(p); setScreen("pickup-otp"); }}
              onPasswordLogin={() => setScreen("pickup-details")}
              onBack={reset}
            />
          )}
          {screen === "pickup-otp" && (
            <OtpVerify phone={phone} onVerify={() => setScreen("pickup-details")} onBack={() => setScreen("pickup-auth")} step={1} totalSteps={4} />
          )}
          {screen === "pickup-details" && (
            <PickupDetails
              lockerId={activeLockerId}
              remainingTime="1h 23m"
              location="Block B, Floor 1"
              hasExtraCharge={true}
              extraAmount={getPrice()}
              onProceed={() => setScreen("pickup-payment")}
              onBack={() => setScreen("pickup-auth")}
            />
          )}
          {screen === "pickup-payment" && (
            <Payment amount={getPrice()} onSuccess={() => setScreen("pickup-unlock")} onBack={() => setScreen("pickup-details")} step={3} totalSteps={4} />
          )}
          {screen === "pickup-unlock" && (
            <UnlockLocker lockerId={activeLockerId} onDone={reset} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;