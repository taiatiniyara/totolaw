-- Migration: Add Organisation Join Requests Table
-- Description: Allows users to request to join organisations, which can be approved/rejected by admins
-- Date: 2024

-- Create organisation join requests table
CREATE TABLE IF NOT EXISTS organisation_join_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
    message TEXT,
    rejection_reason TEXT,
    reviewed_by TEXT REFERENCES user(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_join_requests_organisation ON organisation_join_requests(organisation_id);
CREATE INDEX IF NOT EXISTS idx_join_requests_user ON organisation_join_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_join_requests_status ON organisation_join_requests(status);
CREATE INDEX IF NOT EXISTS idx_join_requests_created ON organisation_join_requests(created_at DESC);

-- Create unique constraint to prevent duplicate pending requests
CREATE UNIQUE INDEX IF NOT EXISTS idx_join_requests_unique_pending 
ON organisation_join_requests(organisation_id, user_id) 
WHERE status = 'pending';

-- Add comment to table
COMMENT ON TABLE organisation_join_requests IS 'User-initiated requests to join organisations that require admin approval';
COMMENT ON COLUMN organisation_join_requests.status IS 'pending: awaiting review, approved: user added to org, rejected: request denied';
COMMENT ON COLUMN organisation_join_requests.message IS 'Optional message from user explaining why they want to join';
COMMENT ON COLUMN organisation_join_requests.rejection_reason IS 'Optional reason provided by admin when rejecting';
COMMENT ON COLUMN organisation_join_requests.reviewed_by IS 'Admin user who approved/rejected the request';
