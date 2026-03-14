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
  const [orderId, setOrderId] = useState<number | null>(null);
  const [pickupAmount, setPickupAmount] = useState<number>(0);
  const [pickupLockerId, setPickupLockerId] = useState<string>("");

  // Chatbot state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{type: 'user' | 'ai', text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

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
    setOrderId(null);
    setPickupAmount(0);
    setPickupLockerId("");
  };

  // Chatbot functions
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMessage = chatInput.trim();
    setChatMessages(prev => [...prev, {type: 'user', text: userMessage}]);
    setChatInput('');
    setChatLoading(true);
    try {
      const res = await fetch('http://localhost:8001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, {type: 'ai', text: data.response}]);
    } catch (error) {
      setChatMessages(prev => [...prev, {type: 'ai', text: 'Sorry, I couldn\'t connect to the server.'}]);
    } finally {
      setChatLoading(false);
    }
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

  const handleBooking = async () => {
    if (!selectedLocker || !hours) return;
    
    setLoading(true);
    try {
      // Get box_id from identifier
      let boxId = 1;
      const layoutRes = await fetch("http://localhost:8000/terminals/1/layout");
      if (layoutRes.ok) {
        const layoutData = await layoutRes.json();
        const match = layoutData.boxes.find((b: any) => b.identifier === selectedLocker);
        if (match) boxId = match.id;
      }

      const res = await fetch("http://localhost:8000/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: 1, // Mock user
          terminal_id: 1,
          box_id: boxId,
          duration_hours: hours
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Booking failed");
      }

      const orderData = await res.json();
      setAccessCode(orderData.pickup_code);
      setScreen("store-allocated");
    } catch (err: any) {
      alert(err.message || "Booking failed");
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
              onContinue={handleBooking}
            />
          )}
          {screen === "store-allocated" && (
            <LockerAllocated lockerId={activeLockerId} accessCode={accessCode} onDone={reset} />
          )}

          {/* PICKUP FLOW */}
          {screen === "pickup-auth" && (
            <PickupAuth
              onPickup={(id, amount, lockerId) => {
                setOrderId(id);
                setPickupAmount(amount);
                setPickupLockerId(lockerId);
                setScreen("pickup-payment");
              }}
              onBack={reset}
            />
          )}
          {screen === "pickup-payment" && (
            <Payment 
              amount={pickupAmount} 
              orderId={orderId}
              onSuccess={() => setScreen("pickup-unlock")} 
              onBack={() => setScreen("pickup-auth")} 
              step={2} 
              totalSteps={3} 
            />
          )}
          {screen === "pickup-unlock" && (
            <UnlockLocker lockerId={pickupLockerId} onDone={reset} />
          )}
        </div>
      </main>

      {/* Chatbot */}
      <div className="fixed bottom-4 right-4 z-50">
        {chatOpen && (
          <div className="mb-2 bg-white border border-gray-300 rounded-lg shadow-lg w-80 h-96 flex flex-col">
            <div className="bg-purple-600 text-white p-3 rounded-t-lg font-semibold">
              Cloakbe AI Assistant
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-3 py-2 rounded-lg ${msg.type === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-800 px-3 py-2 rounded-lg">
                    Thinking...
                  </div>
                </div>
              )}
            </div>
            <div className="p-3 border-t border-gray-300 flex">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything..."
                className="flex-1 border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <button
                onClick={handleSendMessage}
                disabled={chatLoading}
                className="bg-purple-600 text-white px-4 py-2 rounded-r hover:bg-purple-700 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        )}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-purple-700"
        >
          💬
        </button>
      </div>
    </div>
  );
};

export default Index;