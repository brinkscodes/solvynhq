-- Migration: Add image support to meeting agenda items
-- Run in Supabase SQL Editor

alter table meeting_agenda_items
  add column if not exists image_url text;
