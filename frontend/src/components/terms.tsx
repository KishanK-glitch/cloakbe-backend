import { useState } from "react";
import { ScrollText, ChevronDown, ChevronUp } from "lucide-react";

const TermsAndConditions = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isAgreed, setIsAgreed] = useState(false);

    return (
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center my-6">
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                aria-expanded={isOpen}
                aria-controls="terms-content"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 active:scale-95 border border-border/50 w-full sm:w-auto"
            >
                <ScrollText className="w-5 h-5 text-primary" />
                {isOpen ? "Hide Terms and Conditions" : "View Terms and Conditions"}
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isOpen && (
                <article
                    id="terms-content"
                    className="mt-4 w-full bg-card rounded-2xl shadow-lg border border-border/50 p-6 sm:p-8 animate-in fade-in slide-in-from-top-4 duration-300 text-left overflow-hidden flex flex-col"
                >
                    <h2 className="text-2xl font-display font-bold text-foreground mb-4 border-b border-border/50 pb-4">
                        SafeCloak Terms of Service
                    </h2>

                    {/* Scrollable text container */}
                    <div className="space-y-6 text-sm text-muted-foreground h-[300px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent mb-6">
                        <section>
                            <h3 className="text-lg font-semibold text-foreground mb-1">1. Acceptance of Terms</h3>
                            <p className="leading-relaxed">
                                By accessing and using the SafeCloak smart locker system, you acknowledge that you have read, understood, and agree to be bound by these terms. If you do not agree, please do not use our services.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-foreground mb-1">2. Usage and Booking</h3>
                            <p className="leading-relaxed">
                                Users must provide accurate information during booking. A locker is only considered reserved upon successful payment verification. SafeCloak reserves the right to cancel bookings that are flagged as fraudulent or violate physical terminal security policies.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-foreground mb-1">3. Prohibited Items</h3>
                            <p className="leading-relaxed">
                                You are strictly prohibited from storing firearms, explosives, perishable goods, illegal narcotics, or any highly combustible materials. SafeCloak cooperates fully with law enforcement and reserves the right to inspect lockers if suspicious activity or hazardous leaks are detected.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-foreground mb-1">4. Liability and Indemnification</h3>
                            <p className="leading-relaxed">
                                While SafeCloak provides state-of-the-art physical locking mechanisms and digital security, we are not liable for the loss, theft, or damage of extremely high-value items unless directly caused by gross negligence from our hardware. Use the lockers at your own discretion.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-foreground mb-1">5. Overtime and Abandonment</h3>
                            <p className="leading-relaxed">
                                Items left beyond the booked duration will automatically accrue late fees at the terminal's standard hourly rate. Items abandoned for more than 72 hours will be removed to a secure remote facility and may be disposed of or auctioned after 30 days of non-communication.
                            </p>
                        </section>
                    </div>

                    {/* Persistent Checkbox UI pinned to the bottom of the open card */}
                    <div className="flex items-center gap-3 pt-4 border-t border-border/50 mt-auto bg-card">
                        <input
                            type="checkbox"
                            id="terms-agree-main"
                            checked={isAgreed}
                            onChange={(e) => setIsAgreed(e.target.checked)}
                            className="w-5 h-5 text-primary bg-secondary border-border rounded focus:ring-primary focus:ring-2 cursor-pointer transition-all shrink-0"
                        />
                        <label htmlFor="terms-agree-main" className="text-sm font-medium text-foreground cursor-pointer select-none">
                            I have read and agree to the SafeCloak Terms of Service
                        </label>
                    </div>
                </article>
            )}
        </div>
    );
};

export default TermsAndConditions;