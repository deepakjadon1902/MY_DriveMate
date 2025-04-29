export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          email: string
          phone_number: string
          role: 'driver' | 'passenger'
          created_at: string
        }
        Insert: {
          id: string
          full_name: string
          email: string
          phone_number: string
          role: 'driver' | 'passenger'
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone_number?: string
          role?: 'driver' | 'passenger'
          created_at?: string
        }
      }
      rides: {
        Row: {
          id: string
          driver_id: string
          pickup_location: string
          destination: string
          date_time: string
          available_seats: number
          price_per_seat: number
          car_model: string
          number_plate: string
          created_at: string
        }
        Insert: {
          id?: string
          driver_id: string
          pickup_location: string
          destination: string
          date_time: string
          available_seats: number
          price_per_seat: number
          car_model: string
          number_plate: string
          created_at?: string
        }
        Update: {
          id?: string
          driver_id?: string
          pickup_location?: string
          destination?: string
          date_time?: string
          available_seats?: number
          price_per_seat?: number
          car_model?: string
          number_plate?: string
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          ride_id: string
          passenger_id: string
          status: 'upcoming' | 'going' | 'finished' | 'cancelled'
          created_at: string
        }
        Insert: {
          id?: string
          ride_id: string
          passenger_id: string
          status: 'upcoming' | 'going' | 'finished' | 'cancelled'
          created_at?: string
        }
        Update: {
          id?: string
          ride_id?: string
          passenger_id?: string
          status?: 'upcoming' | 'going' | 'finished' | 'cancelled'
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          sender_id: string
          recipient_id: string
          type: 'booking' | 'confirmation' | 'cancellation'
          content: string
          ride_id: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          recipient_id: string
          type: 'booking' | 'confirmation' | 'cancellation'
          content: string
          ride_id: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          recipient_id?: string
          type?: 'booking' | 'confirmation' | 'cancellation'
          content?: string
          ride_id?: string
          read?: boolean
          created_at?: string
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Ride = Database['public']['Tables']['rides']['Row']
export type Booking = Database['public']['Tables']['bookings']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']