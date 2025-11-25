import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, LogOut, Users, Calendar, Edit2, X } from "lucide-react";
import type { Doctor, Appointment } from "@shared/schema";

interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "receptionist" | "nurse" | "technician";
  created_at: string;
}

export default function AdminDashboard() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Staff form state
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [staffForm, setStaffForm] = useState({ name: "", email: "", phone: "", role: "receptionist" });

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
      const [doctorsRes, appointmentsRes, staffRes] = await Promise.all([
        fetch("/api/admin/doctors"),
        fetch("/api/admin/appointments"),
        fetch("/api/admin/staff"),
      ]);
      
      const doctorsData = await doctorsRes.json();
      const appointmentsData = await appointmentsRes.json();
      const staffData = await staffRes.json();

      setDoctors(Array.isArray(doctorsData) ? doctorsData : []);
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
      setStaff(Array.isArray(staffData) ? staffData : []);
    } catch (error) {
      console.error("Error loading data:", error);
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

  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [doctorForm, setDoctorForm] = useState({
    name: "",
    specialty: "",
    image: "",
    available_days: [1, 2, 3, 4, 5],
  });

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doctorForm),
      });

      if (!response.ok) throw new Error("Failed to save doctor");
      
      await loadData();
      setShowDoctorForm(false);
      setDoctorForm({ name: "", specialty: "", image: "", available_days: [1, 2, 3, 4, 5] });
      toast({ title: "Doctor added successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save doctor", variant: "destructive" });
    }
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

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingStaff ? "PUT" : "POST";
      const url = editingStaff ? `/api/admin/staff/${editingStaff.id}` : "/api/admin/staff";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(staffForm),
      });

      if (!response.ok) throw new Error("Failed to save staff");
      
      await loadData();
      setShowStaffForm(false);
      setEditingStaff(null);
      setStaffForm({ name: "", email: "", phone: "", role: "receptionist" });
      toast({ title: editingStaff ? "Staff updated successfully" : "Staff added successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save staff", variant: "destructive" });
    }
  };

  const handleEditStaff = (s: Staff) => {
    setEditingStaff(s);
    setStaffForm({ name: s.name, email: s.email, phone: s.phone, role: s.role });
    setShowStaffForm(true);
  };

  const handleDeleteStaff = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const response = await fetch(`/api/admin/staff/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete");
      setStaff(staff.filter(s => s.id !== id));
      toast({ title: "Staff deleted successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete staff", variant: "destructive" });
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
          <div className="bg-white p-6 rounded-lg border border-border">
            <div className="flex items-center gap-4">
              <Users className="h-12 w-12 text-primary" />
              <div>
                <p className="text-muted-foreground">Total Staff</p>
                <p className="text-3xl font-bold">{staff.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-lg border border-border mb-8">
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
                {appointments && appointments.length > 0 ? (
                  appointments.slice(-10).reverse().map((apt) => (
                    <tr key={apt.id} className="border-b border-border hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{apt.patientName || 'N/A'}</td>
                      <td className="px-6 py-4">{apt.phone}</td>
                      <td className="px-6 py-4">{apt.appointmentDate || 'N/A'}</td>
                      <td className="px-6 py-4">{apt.timeSlot || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{apt.reason || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-muted-foreground">No appointments yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Staff Management */}
        <div className="bg-white rounded-lg border border-border mb-8">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h2 className="text-xl font-serif font-bold">Staff Management</h2>
            <Button
              className="gap-2 btn-primary"
              onClick={() => {
                setEditingStaff(null);
                setStaffForm({ name: "", email: "", phone: "", role: "receptionist" });
                setShowStaffForm(true);
              }}
            >
              <Plus className="h-4 w-4" /> Add Staff
            </Button>
          </div>

          {showStaffForm && (
            <div className="p-6 border-b border-border bg-gray-50">
              <form onSubmit={handleAddStaff} className="space-y-4">
                <p className="text-sm text-muted-foreground">Note: Password is set to "admin123" for new staff</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Name"
                    value={staffForm.name}
                    onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                    className="px-3 py-2 border border-border rounded"
                    required
                    data-testid="input-staff-name"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={staffForm.email}
                    onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                    className="px-3 py-2 border border-border rounded"
                    required
                    data-testid="input-staff-email"
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={staffForm.phone}
                    onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                    className="px-3 py-2 border border-border rounded"
                    required
                    data-testid="input-staff-phone"
                  />
                  <select
                    value={staffForm.role}
                    onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value as any })}
                    className="px-3 py-2 border border-border rounded"
                    data-testid="select-staff-role"
                  >
                    <option value="receptionist">Receptionist</option>
                    <option value="nurse">Nurse</option>
                    <option value="technician">Technician</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="btn-primary" data-testid="button-submit-staff">
                    {editingStaff ? "Update" : "Add"} Staff
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowStaffForm(false);
                      setEditingStaff(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-border">
                  <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Role</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff && staff.length > 0 ? (
                  staff.map((s) => (
                    <tr key={s.id} className="border-b border-border hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{s.name}</td>
                      <td className="px-6 py-4">{s.email}</td>
                      <td className="px-6 py-4">{s.phone}</td>
                      <td className="px-6 py-4 text-sm capitalize">{s.role}</td>
                      <td className="px-6 py-4 text-right flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditStaff(s)}
                          className="text-primary hover:bg-primary/10"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteStaff(s.id)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-muted-foreground">No staff members yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Doctors Management */}
        <div className="bg-white rounded-lg border border-border">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h2 className="text-xl font-serif font-bold">Doctors Management</h2>
            <Button 
              className="gap-2 btn-primary"
              onClick={() => {
                setDoctorForm({ name: "", specialty: "", image: "", available_days: [1, 2, 3, 4, 5] });
                setShowDoctorForm(true);
              }}
              data-testid="button-add-doctor"
            >
              <Plus className="h-4 w-4" /> Add Doctor
            </Button>
          </div>

          {showDoctorForm && (
            <div className="p-6 border-b border-border bg-gray-50">
              <form onSubmit={handleAddDoctor} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Doctor Name"
                    value={doctorForm.name}
                    onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                    className="px-3 py-2 border border-border rounded"
                    required
                    data-testid="input-doctor-name"
                  />
                  <input
                    type="text"
                    placeholder="Specialty (e.g., Cardiologist)"
                    value={doctorForm.specialty}
                    onChange={(e) => setDoctorForm({ ...doctorForm, specialty: e.target.value })}
                    className="px-3 py-2 border border-border rounded"
                    required
                    data-testid="input-doctor-specialty"
                  />
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={doctorForm.image}
                    onChange={(e) => setDoctorForm({ ...doctorForm, image: e.target.value })}
                    className="px-3 py-2 border border-border rounded col-span-2"
                    required
                    data-testid="input-doctor-image"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="btn-primary" data-testid="button-submit-doctor">
                    Add Doctor
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowDoctorForm(false);
                      setDoctorForm({ name: "", specialty: "", image: "", available_days: [1, 2, 3, 4, 5] });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

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
                {doctors && doctors.length > 0 ? (
                  doctors.map((doctor) => (
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-muted-foreground">No doctors yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
