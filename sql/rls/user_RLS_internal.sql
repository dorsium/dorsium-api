-- ============================================
-- RLS for Internal API Access (User Schema)
-- Only service_role (trusted API) can access data
-- ============================================

ALTER TABLE dorsium_user.user ENABLE ROW LEVEL SECURITY;
ALTER TABLE dorsium_user.user FORCE ROW LEVEL SECURITY;

ALTER TABLE dorsium_user.user_role ENABLE ROW LEVEL SECURITY;
ALTER TABLE dorsium_user.user_role FORCE ROW LEVEL SECURITY;

ALTER TABLE dorsium_user.payment ENABLE ROW LEVEL SECURITY;
ALTER TABLE dorsium_user.payment FORCE ROW LEVEL SECURITY;

ALTER TABLE dorsium_user.preference ENABLE ROW LEVEL SECURITY;
ALTER TABLE dorsium_user.preference FORCE ROW LEVEL SECURITY;

ALTER TABLE dorsium_user.referral ENABLE ROW LEVEL SECURITY;
ALTER TABLE dorsium_user.referral FORCE ROW LEVEL SECURITY;

ALTER TABLE dorsium_user.social ENABLE ROW LEVEL SECURITY;
ALTER TABLE dorsium_user.social FORCE ROW LEVEL SECURITY;

-- user
CREATE POLICY "Service can access user"
ON dorsium_user.user
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- user_role
CREATE POLICY "Service can access user_role"
ON dorsium_user.user_role
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- payment
CREATE POLICY "Service can access payment"
ON dorsium_user.payment
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- preference
CREATE POLICY "Service can access preference"
ON dorsium_user.preference
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- referral
CREATE POLICY "Service can access referral"
ON dorsium_user.referral
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- social
CREATE POLICY "Service can access social"
ON dorsium_user.social
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
