import { cn } from "@/lib/utils";
import { isSlotBooked } from "@/lib/mockData";
import { Clock } from "lucide-react";

interface TimeSlotPickerProps {
  slots: string[];
  selectedSlot: string | null;
  onSelect: (slot: string) => void;
  selectedDate: Date | undefined;
  doctorId: string | undefined;
}

export function TimeSlotPicker({ slots, selectedSlot, onSelect, selectedDate, doctorId }: TimeSlotPickerProps) {
  if (!selectedDate || !doctorId) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-muted-foreground bg-muted/30 rounded-xl border border-dashed">
        <Clock className="h-8 w-8 mb-2 opacity-50" />
        <p>Please select a doctor and date first</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3" data-testid="slot-grid">
      {slots.map((slot) => {
        const booked = isSlotBooked(doctorId, selectedDate, slot);
        return (
          <button
            key={slot}
            type="button"
            disabled={booked}
            onClick={() => onSelect(slot)}
            data-testid={`slot-${slot}`}
            className={cn(
              "py-2.5 px-2 text-sm font-medium rounded-lg border transition-all duration-200",
              booked
                ? "bg-muted text-muted-foreground cursor-not-allowed opacity-60 decoration-slice line-through"
                : selectedSlot === slot
                ? "bg-primary text-primary-foreground border-primary shadow-sm scale-[1.02]"
                : "bg-white text-foreground border-border hover:border-primary hover:text-primary hover:bg-primary/5"
            )}
          >
            {slot}
          </button>
        );
      })}
    </div>
  );
}
