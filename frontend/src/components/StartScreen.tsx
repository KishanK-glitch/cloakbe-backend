import { Package, PackageOpen } from "lucide-react";
import PricingTable from "./PricingTable";
import TermsAndConditions from "./Terms"; // Make sure this matches your exact filename

interface StartScreenProps {
  onStore: () => void;
  onPickup: () => void;
}

const StartScreen = ({ onStore, onPickup }: StartScreenProps) => (
  <div className="flex flex-col items-center gap-10 py-12 animate-fade-in">
    <div className="text-center">
      {/* Silently refactored the old Cloakbe branding to your new SafeCloak branding */}
      <h2 className="text-3xl font-display font-bold text-foreground mb-2">Welcome to SafeCloak</h2>
      <p className="text-muted-foreground">Secure smart lockers for your belongings</p>
    </div>

    <div className="flex gap-6">
      <button onClick={onStore} className="btn-locker bg-primary text-primary-foreground flex flex-col items-center gap-3 min-w-[200px]">
        <Package className="w-8 h-8" />
        Store Item
      </button>
      <button onClick={onPickup} className="btn-locker bg-primary text-primary-foreground border border-border hover:border-primary/40 flex flex-col items-center gap-3 min-w-[200px]">
        <PackageOpen className="w-8 h-8" />
        Pick Up Item
      </button>
    </div>

    <PricingTable />

    {/* Injected the Terms and Conditions component here */}
    <div className="w-full max-w-3xl border-t border-border/50 pt-4 mt-2">
      <TermsAndConditions />
    </div>
  </div>
);

export default StartScreen;