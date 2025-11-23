import { useState } from "react";

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  availableDays: number[]; // 0 = Sunday, 1 = Monday, etc.
}

export const doctors: Doctor[] = [
  {
    id: "dr-sarah",
    name: "Dr. Sarah Chen",
    specialty: "Cardiologist",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300",
    availableDays: [1, 2, 3, 4, 5],
  },
  {
    id: "dr-michael",
    name: "Dr. Michael Ross",
    specialty: "Dermatologist",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300",
    availableDays: [1, 3, 5],
  },
  {
    id: "dr-emily",
    name: "Dr. Emily Watson",
    specialty: "Pediatrician",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300",
    availableDays: [2, 4, 6],
  },
  {
    id: "dr-james",
    name: "Dr. James Carter",
    specialty: "General Practitioner",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300",
    availableDays: [1, 2, 3, 4, 5],
  },
];

export const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "01:00 PM", "01:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM"
];

// In-memory storage for booked slots to demonstrate double-booking prevention
// Key: `${doctorId}-${dateStr}-${slot}`
export const bookedSlots = new Set<string>();

export const isSlotBooked = (doctorId: string, date: Date, slot: string) => {
  const dateStr = date.toISOString().split('T')[0];
  return bookedSlots.has(`${doctorId}-${dateStr}-${slot}`);
};

export const bookSlot = (doctorId: string, date: Date, slot: string) => {
  const dateStr = date.toISOString().split('T')[0];
  bookedSlots.add(`${doctorId}-${dateStr}-${slot}`);
};
