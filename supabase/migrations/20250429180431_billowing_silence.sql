/*
  # Create tables for My Drivemate application

  1. New Tables
    - `profiles`
      - User profiles with personal information and role (driver/passenger)
    - `rides`
      - Ride offerings created by drivers
    - `bookings`
      - Ride bookings made by passengers
    - `notifications`
      - System notifications for ride booking/confirmation/cancellation

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone_number TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('driver', 'passenger')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create rides table
CREATE TABLE IF NOT EXISTS rides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  pickup_location TEXT NOT NULL,
  destination TEXT NOT NULL,
  date_time TIMESTAMPTZ NOT NULL,
  available_seats INTEGER NOT NULL CHECK (available_seats >= 0),
  price_per_seat INTEGER NOT NULL CHECK (price_per_seat >= 0),
  car_model TEXT NOT NULL,
  number_plate TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id UUID NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
  passenger_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('upcoming', 'going', 'finished', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('booking', 'confirmation', 'cancellation')),
  content TEXT NOT NULL,
  ride_id UUID NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can read their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read other profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Rides Policies
CREATE POLICY "Anyone can read rides"
  ON rides
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Drivers can insert rides"
  ON rides
  FOR INSERT
  TO authenticated
  WITH CHECK (driver_id = auth.uid());

CREATE POLICY "Drivers can update their own rides"
  ON rides
  FOR UPDATE
  TO authenticated
  USING (driver_id = auth.uid());

CREATE POLICY "Drivers can delete their own rides"
  ON rides
  FOR DELETE
  TO authenticated
  USING (driver_id = auth.uid());

-- Bookings Policies
CREATE POLICY "Users can read bookings they are involved in"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (
    passenger_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM rides 
      WHERE rides.id = ride_id AND rides.driver_id = auth.uid()
    )
  );

CREATE POLICY "Passengers can insert bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (passenger_id = auth.uid());

CREATE POLICY "Users can update bookings they are involved in"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (
    passenger_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM rides 
      WHERE rides.id = ride_id AND rides.driver_id = auth.uid()
    )
  );

-- Notifications Policies
CREATE POLICY "Users can read their own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (recipient_id = auth.uid());

CREATE POLICY "Users can insert notifications"
  ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Recipients can update their notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (recipient_id = auth.uid());