import { useState } from "react";

const PRICING = [
  { size: "Small", icon: "📦", dims: "30×30×45 cm", prices: [20, 50, 80, 120] },
  { size: "Medium", icon: "📦", dims: "40×40×60 cm", prices: [30, 70, 110, 160] },
  { size: "Large", icon: "📦", dims: "50×50×80 cm", prices: [50, 110, 170, 250] },
];

const DURATIONS = ["1 Hour", "3 Hours", "6 Hours", "12 Hours"];

const PricingTable = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="pricing-table-content"
        className="mb-6 px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 active:scale-95"
      >
        {isOpen ? "Hide Pricing" : "View Pricing"}
      </button>

      {isOpen && (
        <div id="pricing-table-content" className="w-full animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-lg font-display font-semibold text-foreground mb-4 text-center">Pricing</h3>
          <div className="card-elevated overflow-hidden p-0 border border-border/40 rounded-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/60">
                  <th scope="col" className="text-left px-5 py-3 font-semibold text-foreground">Size</th>
                  {DURATIONS.map((d) => (
                    <th key={d} scope="col" className="px-5 py-3 font-semibold text-foreground text-center">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PRICING.map((row, i) => (
                  <tr key={row.size} className={i < PRICING.length - 1 ? "border-b border-border/40" : ""}>
                    <td className="px-5 py-4 font-medium text-foreground">
                      <span className="mr-2" aria-hidden="true">{row.icon}</span>
                      {row.size}
                      <span className="block text-xs text-muted-foreground mt-0.5">{row.dims}</span>
                    </td>
                    {row.prices.map((p, j) => (
                      <td key={j} className="px-5 py-4 text-center font-semibold text-foreground">₹{p}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingTable;