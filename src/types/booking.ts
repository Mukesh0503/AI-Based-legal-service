export interface TimeSlot {
  date: string;
  time: string;
  available: boolean;
}

export interface BookingDetails {
  providerId: string;
  userId?: string;
  date: string;
  time: string;
  service: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  notes?: string;
  meetingType: 'in-person' | 'video' | 'phone';
  documentUrls?: string[];
}

export interface UserInteraction {
  type: 'view_provider' | 'save_provider' | 'book_provider' | 'start_booking' | 'view_availability' | 'share_provider';
  providerId: string;
  data?: Record<string, any>;
  timestamp: string;
}

export interface ProviderAvailability {
  providerId: string;
  slots: TimeSlot[];
}

export interface Review {
  id: string;
  bookingId: string;
  providerId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
  response?: {
    comment: string;
    createdAt: string;
  };
}
