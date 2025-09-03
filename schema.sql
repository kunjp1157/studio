-- This script initializes the database schema for the Sports Arena application.
-- It creates all necessary tables and populates them with initial seed data.

-- NOTE: If you run this script on an existing database, it will first
-- delete all existing tables and data before recreating them.

-- DEFAULT PASSWORD for all sample users is: password123

-- Drop existing tables with cascade to remove dependent objects
DROP TABLE IF EXISTS user_favorite_facilities CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS rented_equipment_in_booking CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS facility_sports CASCADE;
DROP TABLE IF...