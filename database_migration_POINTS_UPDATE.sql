-- Migration to Add POINTS_UPDATE to Notification Type Constraint
-- This fixes the "notifications_type_check" constraint violation

-- Step 1: Drop the old constraint
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;

-- Step 2: Add new constraint with POINTS_UPDATE included
ALTER TABLE notifications ADD CONSTRAINT notifications_type_check 
CHECK (type IN ('LEVEL_UP', 'BADGE_EARNED', 'EVENT_UPDATE', 'BLOG_APPROVAL', 'SYSTEM_ALERT', 'POINTS_UPDATE'));

-- Verify the constraint was added
SELECT con.conname, pg_get_constraintdef(con.oid) 
FROM pg_constraint con 
WHERE con.conname = 'notifications_type_check';
