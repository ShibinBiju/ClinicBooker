import { db } from "./app";
import { 
  type User, 
  type InsertUser,
  type Doctor,
  type InsertDoctor,
  type Appointment,
  type InsertAppointment,
  users,
  doctors,
  appointments,
  admins
} from "@shared/schema";
import { eq, and } from "drizzle-orm";

interface Admin {
  id: string;
  username: string;
  password: string;
  role: "admin" | "staff";
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getDoctors(): Promise<Doctor[]>;
  getDoctor(id: string): Promise<Doctor | undefined>;
  createDoctor(doctor: InsertDoctor): Promise<Doctor>;
  updateDoctor(id: string, doctor: InsertDoctor): Promise<Doctor | undefined>;
  deleteDoctor(id: string): Promise<void>;
  
  getAppointments(): Promise<Appointment[]>;
  getAppointment(id: string): Promise<Appointment | undefined>;
  getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]>;
  getAppointmentsByDoctorAndDate(doctorId: string, date: string): Promise<Appointment[]>;
  checkSlotAvailability(doctorId: string, date: string, timeSlot: string): Promise<boolean>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  
  authenticateAdmin(username: string, password: string): Promise<Admin | null>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getDoctors(): Promise<Doctor[]> {
    return await db.select().from(doctors);
  }

  async getDoctor(id: string): Promise<Doctor | undefined> {
    const result = await db.select().from(doctors).where(eq(doctors.id, id));
    return result[0];
  }

  async createDoctor(doctor: InsertDoctor): Promise<Doctor> {
    const result = await db.insert(doctors).values(doctor).returning();
    return result[0];
  }

  async updateDoctor(id: string, doctor: InsertDoctor): Promise<Doctor | undefined> {
    const result = await db
      .update(doctors)
      .set(doctor)
      .where(eq(doctors.id, id))
      .returning();
    return result[0];
  }

  async deleteDoctor(id: string): Promise<void> {
    await db.delete(doctors).where(eq(doctors.id, id));
  }

  async getAppointments(): Promise<Appointment[]> {
    return await db.select().from(appointments);
  }

  async getAppointment(id: string): Promise<Appointment | undefined> {
    const result = await db.select().from(appointments).where(eq(appointments.id, id));
    return result[0];
  }

  async getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]> {
    return await db.select().from(appointments).where(eq(appointments.doctorId, doctorId));
  }

  async getAppointmentsByDoctorAndDate(doctorId: string, date: string): Promise<Appointment[]> {
    return await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.doctorId, doctorId),
          eq(appointments.appointmentDate, date)
        )
      );
  }

  async checkSlotAvailability(doctorId: string, date: string, timeSlot: string): Promise<boolean> {
    const result = await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.doctorId, doctorId),
          eq(appointments.appointmentDate, date),
          eq(appointments.timeSlot, timeSlot)
        )
      );
    return result.length === 0;
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const result = await db.insert(appointments).values(appointment).returning();
    return result[0];
  }

  async authenticateAdmin(username: string, password: string): Promise<Admin | null> {
    try {
      const result = await db
        .select()
        .from(admins)
        .where(eq(admins.username, username));

      if (!result || result.length === 0) return null;

      const admin = result[0];
      // Simple authentication: just check if username and password match
      // In production, you'd use bcrypt to verify the password
      if (admin.username === username && admin.password === password) {
        return {
          id: admin.id,
          username: admin.username,
          password: admin.password,
          role: admin.role as "admin" | "staff"
        };
      }

      return null;
    } catch (error) {
      console.error("Error authenticating admin:", error);
      return null;
    }
  }
}

export const storage = new DatabaseStorage();
