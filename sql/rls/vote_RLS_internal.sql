-- ============================================
-- RLS for Internal API Access (Vote Schema)
-- Only service_role (trusted API) can access data
-- ============================================

ALTER TABLE dorsium_vote.election ENABLE ROW LEVEL SECURITY;
ALTER TABLE dorsium_vote.election FORCE ROW LEVEL SECURITY;

ALTER TABLE dorsium_vote.question ENABLE ROW LEVEL SECURITY;
ALTER TABLE dorsium_vote.question FORCE ROW LEVEL SECURITY;

ALTER TABLE dorsium_vote.vote ENABLE ROW LEVEL SECURITY;
ALTER TABLE dorsium_vote.vote FORCE ROW LEVEL SECURITY;

ALTER TABLE dorsium_vote.trustee_public_key ENABLE ROW LEVEL SECURITY;
ALTER TABLE dorsium_vote.trustee_public_key FORCE ROW LEVEL SECURITY;

ALTER TABLE dorsium_vote.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE dorsium_vote.audit_log FORCE ROW LEVEL SECURITY;

ALTER TABLE dorsium_vote.ballot_tracker ENABLE ROW LEVEL SECURITY;
ALTER TABLE dorsium_vote.ballot_tracker FORCE ROW LEVEL SECURITY;

-- election
CREATE POLICY "Service can access election"
ON dorsium_vote.election
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- question
CREATE POLICY "Service can access question"
ON dorsium_vote.question
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- vote
CREATE POLICY "Service can access vote"
ON dorsium_vote.vote
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- trustee_public_key
CREATE POLICY "Service can access trustee_public_key"
ON dorsium_vote.trustee_public_key
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- audit_log
DROP POLICY IF EXISTS "Service can access audit_log" ON dorsium_vote.audit_log;

CREATE POLICY "Service can select audit_log"
ON dorsium_vote.audit_log
FOR SELECT
TO service_role
USING (true);

CREATE POLICY "Service can insert audit_log"
ON dorsium_vote.audit_log
FOR INSERT
TO service_role
WITH CHECK (true);

-- ballot_tracker
CREATE POLICY "Service can access ballot_tracker"
ON dorsium_vote.ballot_tracker
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
