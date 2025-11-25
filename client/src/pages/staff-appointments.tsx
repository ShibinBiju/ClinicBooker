import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Plus, Trash2, Calendar } from "lucide-react";
import { api } from "@/lib/api";
import type { Doctor, Appointment } from "@shared/schema";

interface PatientAppointment extends Appointment {
  doctor_name?: string;
  patient_name?: string;
}

export default function StaffAppointments() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    patient_name: "",
    patient_email: "",
    patient_phone: "",
    doctor_id: "",
    appointment_date: "",
    appointment_time: "",
  });

  useEffect(() => {
    const userData = localStorage.getItem("staff_user");
    if (!userData) {
      setLocation("/staff/login");
      return;
    }
    setUser(JSON.parse(userData));
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem("staff_token");
      if (!token) {
        setLocation("/staff/login");
        return;
      }

      const [doctorsRes, appointmentsRes] = await Promise.all([
        api.get("/doctors", { skipAuth: true }),
        api.get("/appointments", { skipAuth: true }),
      ]);

      const doctorsData = await doctorsRes.json();
      const appointmentsData = await appointmentsRes.json();

      setDoctors(Array.isArray(doctorsData) ? doctorsData : []);
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Failed to load doctors",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/staff/auth/logout", {});
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.removeItem("staff_user");
    localStorage.removeItem("staff_token");
    setLocation("/staff/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.doctor_id) {
      toast({ title: "Error", description: "Please select a doctor", variant: "destructive" });
      return;
    }

    try {
      const response = await api.post("/appointments", {
        patient_name: formData.patient_name,
        patient_email: formData.patient_email,
        patient_phone: formData.patient_phone,
        doctor_id: formData.doctor_id,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
      }, { skipAuth: true });

      if (!response.ok) {
        throw new Error("Failed to create appointment");
      }

      toast({ title: "Success", description: "Appointment created successfully" });
      setFormData({
        patient_name: "",
        patient_email: "",
        patient_phone: "",
        doctor_id: "",
        appointment_date: "",
        appointment_time: "",
      });
      setShowForm(false);
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create appointment",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;

    try {
      const response = await api.delete(`/appointments/${id}`, { skipAuth: true });

      if (!response.ok) {
        throw new Error("Failed to delete appointment");
      }

      toast({ title: "Success", description: "Appointment deleted" });
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete appointment",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10">
      {/* Header */}
      <div className="bg-white shadow border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900">Staff Portal</h1>
            <p className="text-sm text-muted-foreground">Welcome, {user?.name}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="gap-2"
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Appointments Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-serif font-bold">Appointments</h2>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="gap-2"
              data-testid="button-new-appointment"
            >
              <Plus className="h-4 w-4" />
              New Appointment
            </Button>
          </div>

          {/* New Appointment Form */}
          {showForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 border">
              <h3 className="text-lg font-semibold mb-4">Create New Appointment</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Patient Name</label>
                    <Input
                      placeholder="Patient name"
                      value={formData.patient_name}
                      onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                      required
                      data-testid="input-patient-name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Patient Email</label>
                    <Input
                      type="email"
                      placeholder="Patient email"
                      value={formData.patient_email}
                      onChange={(e) => setFormData({ ...formData, patient_email: e.target.value })}
                      required
                      data-testid="input-patient-email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Patient Phone</label>
                    <Input
                      placeholder="Patient phone"
                      value={formData.patient_phone}
                      onChange={(e) => setFormData({ ...formData, patient_phone: e.target.value })}
                      required
                      data-testid="input-patient-phone"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Doctor</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={formData.doctor_id}
                      onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
                      required
                      data-testid="select-doctor"
                    >
                      <option value="">Select a doctor</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialty}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <Input
                      type="date"
                      value={formData.appointment_date}
                      onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                      required
                      data-testid="input-appointment-date"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Time</label>
                    <Input
                      type="time"
                      value={formData.appointment_time}
                      onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                      required
                      data-testid="input-appointment-time"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" data-testid="button-submit-appointment">
                    Create Appointment
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Appointments List */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {appointments.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">No appointments yet</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Patient</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Doctor</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Date & Time</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Phone</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {appointments.map((apt) => {
                      const doctor = doctors.find((d) => d.id === apt.doctor_id);
                      return (
                        <tr key={apt.id} data-testid={`row-appointment-${apt.id}`}>
                          <td className="px-6 py-4 text-sm" data-testid={`text-patient-${apt.id}`}>
                            {apt.patient_name}
                          </td>
                          <td className="px-6 py-4 text-sm" data-testid={`text-doctor-${apt.id}`}>
                            {doctor?.name || "Unknown"}
                          </td>
                          <td className="px-6 py-4 text-sm" data-testid={`text-datetime-${apt.id}`}>
                            {new Date(apt.appointment_date).toLocaleDateString()} {apt.appointment_time}
                          </td>
                          <td className="px-6 py-4 text-sm" data-testid={`text-email-${apt.id}`}>
                            {apt.patient_email}
                          </td>
                          <td className="px-6 py-4 text-sm" data-testid={`text-phone-${apt.id}`}>
                            {apt.patient_phone}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              onClick={() => handleDelete(apt.id)}
                              size="sm"
                              variant="destructive"
                              data-testid={`button-delete-${apt.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
