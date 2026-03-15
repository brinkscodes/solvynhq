-- Add today_order column to tasks table for drag-and-drop reordering in "Working on Today"
-- Run in Supabase SQL Editor

alter table tasks add column if not exists today_order int default 0;
