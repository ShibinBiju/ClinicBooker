import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDoctorSchema, insertAppointmentSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all doctors
  app.get("/api/doctors", async (req, res) => {
    try {
      const doctors = await storage.getDoctors();
      res.json(doctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      res.status(500).json({ error: "Failed to fetch doctors" });
    }
  });

  // Get a specific doctor
  app.get("/api/doctors/:id", async (req, res) => {
    try {
      const doctor = await storage.getDoctor(req.params.id);
      if (!doctor) {
        return res.status(404).json({ error: "Doctor not found" });
      }
      res.json(doctor);
    } catch (error) {
      console.error("Error fetching doctor:", error);
      res.status(500).json({ error: "Failed to fetch doctor" });
    }
  });

  // Create a new doctor (for seeding/admin)
  app.post("/api/doctors", async (req, res) => {
    try {
      const validation = insertDoctorSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: fromZodError(validation.error).message 
        });
      }
      
      const doctor = await storage.createDoctor(validation.data);
      res.status(201).json(doctor);
    } catch (error) {
      console.error("Error creating doctor:", error);
      res.status(500).json({ error: "Failed to create doctor" });
    }
  });

  // Check slot availability
  app.get("/api/appointments/check-availability", async (req, res) => {
    try {
      const { doctorId, date, timeSlot } = req.query;
      
      if (!doctorId || !date || !timeSlot) {
        return res.status(400).json({ error: "Missing required parameters" });
      }

      const isAvailable = await storage.checkSlotAvailability(
        doctorId as string,
        date as string,
        timeSlot as string
      );
      
      res.json({ available: isAvailable });
    } catch (error) {
      console.error("Error checking availability:", error);
      res.status(500).json({ error: "Failed to check availability" });
    }
  });

  // Get all appointments
  app.get("/api/appointments", async (req, res) => {
    try {
      const appointments = await storage.getAppointments();
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ error: "Failed to fetch appointments" });
    }
  });

  // Get appointments by doctor
  app.get("/api/appointments/doctor/:doctorId", async (req, res) => {
    try {
      const appointments = await storage.getAppointmentsByDoctor(req.params.doctorId);
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ error: "Failed to fetch appointments" });
    }
  });

  // Create a new appointment
  app.post("/api/appointments", async (req, res) => {
    try {
      const validation = insertAppointmentSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: fromZodError(validation.error).message 
        });
      }

      // Check if slot is still available
      const isAvailable = await storage.checkSlotAvailability(
        validation.data.doctorId,
        validation.data.appointmentDate,
        validation.data.timeSlot
      );

      if (!isAvailable) {
        return res.status(409).json({ error: "This time slot is no longer available" });
      }

      const appointment = await storage.createAppointment(validation.data);
      res.status(201).json(appointment);
    } catch (error) {
      console.error("Error creating appointment:", error);
      res.status(500).json({ error: "Failed to create appointment" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
