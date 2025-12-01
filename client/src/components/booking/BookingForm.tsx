import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { DoctorSelector } from "./DoctorSelector";
import { TimeSlotPicker } from "./TimeSlotPicker";
import { timeSlots } from "@/lib/mockData";
import { fetchDoctors, createAppointment, getBookedSlots } from "@/lib/api";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle2, MessageCircle, Loader2, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Doctor } from "@/types";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  age: z.string().optional(),
  reason: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function BookingForm() {
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      age: "",
      reason: "",
    },
  });

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor) {
      loadBookedSlots();
    }
  }, [selectedDoctor]);

  const loadDoctors = async () => {
    try {
      const data = await fetchDoctors();
      setDoctors(data);
      if (data.length > 0) {
        setSelectedDoctor(data[0]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load doctors. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadBookedSlots = async () => {
    if (!selectedDoctor) return;
    try {
      const slots = await getBookedSlots(selectedDoctor.id);
      setBookedSlots(slots);
    } catch (error) {
      console.error("Failed to load booked slots:", error);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!selectedDate || !selectedSlot || !selectedDoctor) return;

    setIsSubmitting(true);
    
    try {
      await createAppointment({
        doctor_id: selectedDoctor.id,
        patient_name: data.name,
        phone: data.phone,
        age: data.age,
        reason: data.reason,
        appointment_date: format(selectedDate, "yyyy-MM-dd"),
        time_slot: selectedSlot,
      } as any);
      
      setIsSuccess(true);
      toast({
        title: "Appointment Confirmed!",
        description: `Booked with ${selectedDoctor.name} on ${format(selectedDate, "MMM d")} at ${selectedSlot}`,
      });
    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppBooking = () => {
    if (!selectedDoctor || !selectedDate || !selectedSlot) {
      toast({
        title: "Incomplete Selection",
        description: "Please select a doctor, date, and time first.",
        variant: "destructive",
      });
      return;
    }

    const message = `Hi, I would like to book an appointment with ${selectedDoctor.name} on ${format(selectedDate, "MMMM d, yyyy")} at ${selectedSlot}.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
  };

  const isSlotBooked = (slot: string) => {
    if (!selectedDate) return false;
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    return bookedSlots.has(`${dateStr}-${slot}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
        <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Booking Confirmed!</h2>
        <p className="text-muted-foreground max-w-md mb-8">
          Your appointment with <span className="font-semibold text-foreground">{selectedDoctor?.name}</span> is set for <span className="font-semibold text-foreground">{selectedDate ? format(selectedDate, "MMM d, yyyy") : ""}</span> at <span className="font-semibold text-foreground">{selectedSlot}</span>.
        </p>
        <Button onClick={() => window.location.reload()} className="btn-primary">
          Book Another Appointment
        </Button>
      </div>
    );
  }

  const nextStep = () => {
    if (step === 1 && selectedDoctor) setStep(2);
    else if (step === 2 && selectedDate && selectedSlot) setStep(3);
  };

  const prevStep = () => setStep(step - 1);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-subtle border border-border overflow-hidden">
      {/* Progress Header */}
      <div className="bg-slate-50 border-b border-border p-4 md:p-6">
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          {[
            { num: 1, label: "Doctor" },
            { num: 2, label: "Time" },
            { num: 3, label: "Details" },
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center z-10">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300",
                  step >= s.num ? "bg-primary text-white" : "bg-slate-200 text-slate-500"
                )}
              >
                {step > s.num ? <CheckCircle2 className="h-5 w-5" /> : s.num}
              </div>
              <span className={cn("text-xs mt-2 font-medium", step >= s.num ? "text-primary" : "text-muted-foreground")}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 md:p-8">
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
            <div>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Select a Specialist</h2>
              <p className="text-muted-foreground">Choose the right doctor for your needs.</p>
            </div>
            <DoctorSelector
              doctors={doctors}
              selectedDoctor={selectedDoctor}
              onSelect={(doc) => {
                setSelectedDoctor(doc);
              }}
            />
            <div className="flex justify-end mt-6">
              <Button onClick={nextStep} disabled={!selectedDoctor} className="btn-primary group">
                Continue <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
            <div>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Choose Date & Time</h2>
              <p className="text-muted-foreground">When would you like to come in?</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <label className="block text-sm font-medium text-foreground mb-3">Select Date</label>
                <div className="border rounded-xl p-4 bg-white inline-block w-full md:w-auto">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      // Use default weekdays (1-5, Mon-Fri) if availableDays is not available
                      const availableDays = selectedDoctor?.availableDays || [1, 2, 3, 4, 5];
                      return date < today || (selectedDoctor ? !availableDays.includes(date.getDay()) : false);
                    }}
                    initialFocus
                    className="p-0"
                  />
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-foreground mb-3">Select Time Slot</label>
                <TimeSlotPicker
                  slots={timeSlots}
                  selectedSlot={selectedSlot}
                  onSelect={setSelectedSlot}
                  selectedDate={selectedDate}
                  doctorId={selectedDoctor?.id}
                  isSlotBooked={isSlotBooked}
                />
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={prevStep}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={nextStep} disabled={!selectedDate || !selectedSlot} className="btn-primary group">
                Continue <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
             <div>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Your Information</h2>
              <p className="text-muted-foreground">Please fill in your details to confirm the booking.</p>
            </div>

            <div className="bg-accent/30 p-4 rounded-lg flex items-start gap-3 border border-accent/50">
              <div className="h-10 w-10 rounded-full bg-white border border-accent shrink-0 overflow-hidden">
                 <img src={selectedDoctor?.image} alt={selectedDoctor?.name} className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="font-medium text-foreground">Appointment with {selectedDoctor?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : ""} at {selectedSlot}
                </p>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} className="input-field" data-testid="input-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 123-4567" {...field} className="input-field" data-testid="input-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="30" {...field} className="input-field" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason for Visit (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Briefly describe your symptoms..." {...field} className="input-field min-h-[100px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-3 pt-4">
                  <Button type="submit" disabled={isSubmitting} className="w-full btn-primary h-12 text-lg" data-testid="button-submit">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Confirming...
                      </>
                    ) : (
                      "Confirm Appointment"
                    )}
                  </Button>

                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-border"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-400 text-sm uppercase">Or</span>
                    <div className="flex-grow border-t border-border"></div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleWhatsAppBooking}
                    className="w-full h-12 text-lg border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
                    data-testid="button-whatsapp"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Book via WhatsApp
                  </Button>
                </div>
              </form>
            </Form>
             <div className="flex justify-start mt-2">
              <Button variant="ghost" onClick={prevStep} className="text-muted-foreground hover:text-foreground px-0">
                <ChevronLeft className="mr-2 h-4 w-4" /> Back to Time Selection
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
