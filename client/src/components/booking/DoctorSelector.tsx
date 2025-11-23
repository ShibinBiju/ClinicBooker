import { Doctor } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface DoctorSelectorProps {
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  onSelect: (doctor: Doctor) => void;
}

export function DoctorSelector({ doctors, selectedDoctor, onSelect }: DoctorSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="doctor-grid">
      {doctors.map((doctor) => (
        <div
          key={doctor.id}
          data-testid={`doctor-card-${doctor.id}`}
          onClick={() => onSelect(doctor)}
          className={cn(
            "relative flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md",
            selectedDoctor?.id === doctor.id
              ? "border-primary bg-primary/5 ring-1 ring-primary"
              : "border-border bg-white hover:border-primary/50"
          )}
        >
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-border">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-serif font-semibold text-foreground">{doctor.name}</h3>
            <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
          </div>
          {selectedDoctor?.id === doctor.id && (
            <div className="absolute top-3 right-3 h-5 w-5 bg-primary rounded-full flex items-center justify-center text-white">
              <Check className="h-3 w-3" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
