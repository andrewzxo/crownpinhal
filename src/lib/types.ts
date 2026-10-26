export type Role = "CLIENT" | "ADMIN" | "OWNER";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
}

export interface ScheduleDTO {
  id: string;
  dayOfWeek: number; // 0 = Domingo ... 6 = Sábado
  startTime: string;
  endTime: string;
  instructor: string | null;
}

export interface ModalityDTO {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  icon: string | null;
  order: number;
  active: boolean;
  schedules: ScheduleDTO[];
}

export interface PlanDTO {
  id: string;
  name: string;
  description: string;
  features: string[];
  price: number | null;
  period: string | null;
  badge: string | null;
  highlighted: boolean;
  order: number;
  active: boolean;
}

export interface GalleryDTO {
  id: string;
  url: string;
  title: string | null;
  order: number;
  active: boolean;
}

export interface ContentResponse {
  settings: Record<string, string>;
  modalities: ModalityDTO[];
  plans: PlanDTO[];
  gallery: GalleryDTO[];
}

export interface OwnerUserDTO {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  passwordPlain: string | null;
  createdAt: string;
}

export interface SubscriptionDTO {
  id: string;
  status: "PENDING" | "ACTIVE" | "CANCELLED";
  notes: string | null;
  createdAt: string;
  plan: PlanDTO;
  user?: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
}

export interface OwnerStatsDTO {
  totalUsers: number;
  totalClients: number;
  pendingSubscriptions: number;
  activeSubscriptions: number;
  totalSubscriptions: number;
  totalModalities: number;
  totalPlans: number;
}
