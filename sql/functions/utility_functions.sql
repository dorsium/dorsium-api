-- ============================================
-- update_modified_at()
-- ============================================
-- Trigger function for legacy tables using 'modified_at'
-- Updates 'modified_at' field to current timestamp on row update

CREATE OR REPLACE FUNCTION update_modified_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.modified_at := (now() AT TIME ZONE 'UTC');
  RETURN NEW;
END;
$function$;

-- ============================================
-- compute_audit_log_hash()
-- ============================================
-- Calculates an HMAC SHA256 hash for audit_log rows

CREATE OR REPLACE FUNCTION dorsium_vote.compute_audit_log_hash()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  secret TEXT := current_setting('audit.secret_key', true);
BEGIN
  IF secret IS NULL THEN
    secret := 'dorsium';
  END IF;
  SELECT audit_hash INTO NEW.previous_hash
  FROM dorsium_vote.audit_log
  ORDER BY id DESC
  LIMIT 1
  FOR UPDATE;
  NEW.audit_hash := encode(
    hmac(
      NEW.uuid || '|' || NEW.election_id || '|' || coalesce(NEW.user_id::text, NEW.actor, '') || '|' || NEW.action || '|' || coalesce(NEW.previous_hash, ''),
      secret,
      'sha256'
    ),
    'hex'
  );
  RETURN NEW;
END;
$function$;

-- ============================================
-- prevent_audit_log_modification()
-- ============================================
-- Raises an exception to disallow UPDATE or DELETE

CREATE OR REPLACE FUNCTION dorsium_vote.prevent_audit_log_modification()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  RAISE EXCEPTION 'audit_log is append-only';
  RETURN NULL;
END;
$function$;

-- Compute cryptographic audit hash
CREATE OR REPLACE FUNCTION dorsium_user.compute_referral_hash()
RETURNS TRIGGER AS $$
DECLARE
  secret TEXT := current_setting('audit.secret_key', true);
BEGIN
  IF secret IS NULL THEN
    secret := 'dorsium';
  END IF;
  NEW.audit_hash := encode(
    hmac(
      NEW.uuid || '|' ||
      NEW.referrer_user_id || '|' ||
      NEW.referred_user_id || '|' ||
      NEW.multiplier_amount || '|' ||
      COALESCE(NEW.multiplier_granted::text, '') || '|' ||
      COALESCE(NEW.bonus_amount::text, '') || '|' ||
      COALESCE(NEW.bonus_granted::text, '') || '|' ||
      COALESCE(NEW.reason, '') || '|' ||
      NEW.source,
      secret,
      'sha256'
    ),
    'hex'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_referral_hash
  BEFORE INSERT OR UPDATE ON dorsium_user.referral
  FOR EACH ROW EXECUTE FUNCTION dorsium_user.compute_referral_hash();

-- Prevent unchecking legal terms
CREATE OR REPLACE FUNCTION dorsium_user.prevent_uncheck_terms()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.accept_terms = FALSE THEN
    RAISE EXCEPTION 'You cannot uncheck accepted terms';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_terms_uncheck
BEFORE UPDATE ON dorsium_user.preference
FOR EACH ROW
WHEN (OLD.accept_terms = TRUE AND NEW.accept_terms = FALSE)
EXECUTE FUNCTION dorsium_user.prevent_uncheck_terms();