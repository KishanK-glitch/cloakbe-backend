import { useState, useEffect } from "react";
import StepWrapper from "../StepWrapper";

interface SelectLockerProps {
  selected: string | null;
  onSelect: (boxId: string) => void;
  onBack: () => void;
}

interface Box {
  id: number;
  identifier: string;
  box_type: string;
  status: 'EMPTY_CLOSED' | 'BOOKED' | string;
}

const SelectLocker = ({ selected, onSelect, onBack }: SelectLockerProps) => {
  const [boxes, setBoxes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLayout = async () => {
      try {
        const res = await fetch("http://localhost:8000/terminals/1/layout");
        if (!res.ok) throw new Error("Failed to fetch layout");
        const data = await res.json();
        
        // Define grid mappings manually since backend doesn't provide gridArea
        const gridMap: Record<string, string> = {
          'B-1': 'col-start-1 row-start-1 row-span-2',
          'A-1': 'col-start-2 row-start-1 row-span-1',
          'A-2': 'col-start-2 row-start-2 row-span-1',
          'B-2': 'col-start-1 row-start-3 row-span-2',
          'A-3': 'col-start-2 row-start-3 row-span-1',
          'A-4': 'col-start-2 row-start-4 row-span-1',
          'C-1': 'col-start-1 row-start-5 row-span-3',
          'C-2': 'col-start-2 row-start-5 row-span-3',
        };

        const mappedBoxes = data.boxes.map((box: Box) => ({
          dbId: box.id,
          id: box.identifier,
          name: box.identifier,
          type: box.box_type,
          status: box.status,
          gridArea: gridMap[box.identifier] || 'col-auto',
        }));

        setBoxes(mappedBoxes);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    // Initial fetch
    fetchLayout();

    // Polling setup: fetch every 5 seconds
    const intervalId = setInterval(fetchLayout, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <StepWrapper
      title="Select Specific Locker"
      subtitle="Choose the exact box location on the terminal"
      onBack={onBack}
      step={4}
      totalSteps={7}
    >
      <div className="flex justify-center w-full my-4">
        {/* The Purple Terminal Background */}
        <div className="bg-[#8b5cf6] p-3 rounded-xl w-full max-w-[280px] shadow-inner relative min-h-[500px]">

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl z-10">
              <div className="animate-spin w-8 h-8 rounded-full border-4 border-white border-t-transparent" />
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white p-4 text-center rounded-xl z-10">
              <p>Error: {error}</p>
            </div>
          )}

          {/* The 2-Column, 7-Row Grid System */}
          <div className="grid grid-cols-2 grid-rows-7 gap-3 h-full">
            {boxes.map((box) => {
              const isAvailable = box.status === 'EMPTY_CLOSED';
              const isSelected = selected === box.id;

              return (
                <button
                  key={box.id}
                  onClick={() => isAvailable && onSelect(box.id)}
                  disabled={!isAvailable}
                  className={`
                    relative flex flex-col items-center justify-center rounded-lg transition-all
                    ${box.gridArea} /* Injects the specific row/col span */
                    ${!isAvailable
                      ? 'bg-gray-400 opacity-60 cursor-not-allowed border-transparent'
                      : 'bg-[#e5e7eb] hover:bg-white cursor-pointer shadow-sm border-2 border-transparent hover:border-blue-400'
                    }
                    ${isSelected
                      ? '!bg-white border-blue-600 ring-2 ring-blue-500 shadow-md'
                      : ''
                    }
                  `}
                >
                  <span className={`text-lg font-medium ${!isAvailable ? 'text-gray-600' : 'text-gray-900'}`}>
                    {box.name}
                  </span>
                  <span className={`text-sm ${!isAvailable ? 'text-gray-600' : 'text-gray-700'}`}>
                    ({box.type})
                  </span>

                  {/* Red dot indicator for taken boxes */}
                  {!isAvailable && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm border border-white"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </StepWrapper>
  );
};

export default SelectLocker;