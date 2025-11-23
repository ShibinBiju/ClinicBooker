import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, LogOut, Users, Calendar } from "lucide-react";
import type { Doctor, Appointment } from "@shared/schema";

export default function AdminDashboard() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const userData = localStorage.getItem("admin_user");
    if (!userData) {
      setLocation("/admin/login");
      return;
    }
    setUser(JSON.parse(userData));
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [doctorsRes, appointmentsRes] = await Promise.all([
        fetch("/api/admin/doctors"),
        fetch("/api/admin/appointments"),
      ]);
      if (!doctorsRes.ok || !appointmentsRes.ok) throw new Error("Failed to load data");
      setDoctors(await doctorsRes.json());
      setAppointments(await appointmentsRes.json());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_user");
    setLocation("/admin/login");
  };

  const handleDeleteDoctor = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const response = await fetch(`/api/admin/doctors/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete");
      setDoctors(doctors.filter(d => d.id !== id));
      toast({ title: "Doctor deleted successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete doctor", variant: "destructive" });
    }
  };

  if (isLoading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-serif font-bold">CareConnect Admin</h1>
            <p className="text-sm text-muted-foreground">Welcome, {user?.username}</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg border border-border">
            <div className="flex items-center gap-4">
              <Users className="h-12 w-12 text-primary" />
              <div>
                <p className="text-muted-foreground">Total Doctors</p>
                <p className="text-3xl font-bold">{doctors.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-border">
            <div className="flex items-center gap-4">
              <Calendar className="h-12 w-12 text-primary" />
              <div>
                <p className="text-muted-foreground">Total Appointments</p>
                <p className="text-3xl font-bold">{appointments.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 mb-8">
          <div className="bg-white rounded-lg border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-serif font-bold">Recent Appointments</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-border">
                    <th className="px-6 py-3 text-left text-sm font-semibold">Patient Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Phone</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Time</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.slice(-10).reverse().map((apt) => (
                    <tr key={apt.id} className="border-b border-border hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{apt.patientName}</td>
                      <td className="px-6 py-4">{apt.phone}</td>
                      <td className="px-6 py-4">{apt.appointmentDate}</td>
                      <td className="px-6 py-4">{apt.timeSlot}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{apt.reason || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-border">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h2 className="text-xl font-serif font-bold">Doctors Management</h2>
            <Button className="gap-2 btn-primary">
              <Plus className="h-4 w-4" /> Add Doctor
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-border">
                  <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Specialty</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Available Days</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor) => (
                  <tr key={doctor.id} className="border-b border-border hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={doctor.image} alt={doctor.name} className="h-10 w-10 rounded-full" />
                        <span className="font-medium">{doctor.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{doctor.specialty}</td>
                    <td className="px-6 py-4 text-sm">{Array.isArray(doctor.availableDays) ? doctor.availableDays.join(', ') : '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDoctor(doctor.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
