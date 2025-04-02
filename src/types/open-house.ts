
import { z } from "zod";

export interface OpenHouseSession {
  id: string;
  propertyId: string;
  date: Date;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const openHouseSessionSchema = z.object({
  date: z.date({
    required_error: "Date is required",
  }),
  startTime: z.string().min(1, {
    message: "Start time is required",
  }),
  endTime: z.string().min(1, {
    message: "End time is required",
  }),
  notes: z.string().optional(),
});

export type OpenHouseSessionFormValues = z.infer<typeof openHouseSessionSchema>;
