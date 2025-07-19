-- ============================================
-- User account table (core identity and metadata)
-- Stores primary identity, authentication mapping,
-- referral and prestige information
-- ============================================

CREATE TABLE dorsium_user.user (
  id BIGSERIAL PRIMARY KEY,                                           -- internal numeric identifier
  uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),                -- external reference, never reused
  auth_user_id UUID UNIQUE REFERENCES auth.users(id),                 -- FK to auth.users.id (Supabase)
  name VARCHAR(128) NOT NULL,                                         -- full name of the user
  username VARCHAR(32) UNIQUE NOT NULL CHECK (length(username) >= 3), -- short handle
  prestige VARCHAR(64) NOT NULL,                                      -- e.g. "Genesis Validator"
  referral_code VARCHAR(64) UNIQUE NOT NULL,                          -- personal referral token
  invite_link VARCHAR(128) UNIQUE NOT NULL,                           -- unique invite URL
  country VARCHAR(2) NOT NULL,                                        -- ISO 3166-1 alpha-2 country code
  created_at TIMESTAMP NOT NULL DEFAULT now(),                        -- creation timestamp (UTC)
  modified_at TIMESTAMP NOT NULL DEFAULT now()                        -- last modified (auto updated)
);

-- Automatically update modified_at on row change

-- Helpful indexes for lookups and filtering
CREATE INDEX IF NOT EXISTS user_username_idx ON dorsium_user.user (username);
CREATE INDEX IF NOT EXISTS user_country_idx ON dorsium_user.user (country);

-- ============================================
-- User Role Assignment Table
-- Maps users to one or more assigned roles (M:N)
-- Each user can have multiple roles (e.g., validator + writer)
-- ============================================

-- ENUM definition for allowed roles
CREATE TYPE dorsium_user.role_type AS ENUM (
  'miner',
  'node',
  'validator',
  'archive',
  'admin',
  'developer',
  'writer'
);

-- Role mapping table
CREATE TABLE dorsium_user.user_role (
  id BIGSERIAL PRIMARY KEY,                                         -- internal identifier
  user_id BIGINT NOT NULL REFERENCES dorsium_user.user(id) ON DELETE CASCADE,  -- FK to user
  role dorsium_user.role_type NOT NULL,                             -- role ENUM
  created_at TIMESTAMP NOT NULL DEFAULT now(),                      -- when assigned
  modified_at TIMESTAMP NOT NULL DEFAULT now(),                     -- last updated
  UNIQUE (user_id, role)                                            -- prevent duplicate assignments
);


-- Optional index for filtering
CREATE INDEX IF NOT EXISTS user_role_user_id_idx ON dorsium_user.user_role (user_id);

-- ============================================
-- User Payment Table
-- Stores incoming payment records per user
-- Includes method, status, campaign reference, and amount
-- ============================================

-- ENUMs for payment method and status
CREATE TYPE dorsium_user.payment_method AS ENUM (
  'crypto',
  'card',
  'transfer'
);

CREATE TYPE dorsium_user.payment_status AS ENUM (
  'pending',
  'confirmed',
  'failed',
  'refunded'
);

-- Payment record table
CREATE TABLE dorsium_user.payment (
  id BIGSERIAL PRIMARY KEY,                                                   -- internal ID
  uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),                        -- external reference
  user_id BIGINT NOT NULL REFERENCES dorsium_user.user(id) ON DELETE CASCADE, -- linked user
  ref VARCHAR(128),                                                           -- invoice ref or payment token
  amount NUMERIC NOT NULL CHECK (amount > 0),                                 -- must be positive
  method dorsium_user.payment_method NOT NULL,                                -- payment method ENUM
  campaign VARCHAR(64) NOT NULL,                                              -- campaign context
  status dorsium_user.payment_status NOT NULL DEFAULT 'pending',             -- status ENUM
  created_at TIMESTAMP NOT NULL DEFAULT now(),                                -- creation timestamp (UTC)
  modified_at TIMESTAMP NOT NULL DEFAULT now()                                -- last update
);


-- Optional index for dashboard filtering
CREATE INDEX IF NOT EXISTS payment_user_id_idx ON dorsium_user.payment (user_id);
CREATE INDEX IF NOT EXISTS payment_status_idx ON dorsium_user.payment (status);

-- ============================================
-- User Preference Table
-- Stores user-specific UI, legal, and feature flags
-- One-to-one relationship with user
-- ============================================

CREATE TABLE dorsium_user.preference (
  id BIGSERIAL PRIMARY KEY,                                                       -- internal ID
  uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),                            -- external reference
  user_id BIGINT NOT NULL UNIQUE REFERENCES dorsium_user.user(id) ON DELETE CASCADE, -- one-to-one relationship
  receive_updates BOOLEAN NOT NULL DEFAULT true,                                  -- allow marketing/news updates
  accept_terms BOOLEAN NOT NULL CHECK (accept_terms = true),                      -- legal consent (cannot be false)
  accept_gdpr BOOLEAN NOT NULL DEFAULT false,                                     -- GDPR explicit consent
  dark_mode_enabled BOOLEAN NOT NULL DEFAULT false,                               -- UI toggle
  language VARCHAR(5) NOT NULL DEFAULT 'en',                                      -- language preference (IETF code)
  beta_features_enabled BOOLEAN NOT NULL DEFAULT false,                           -- opt-in for experimental features
  timezone VARCHAR(64) NOT NULL DEFAULT 'UTC',                                    -- IANA time zone (e.g. Europe/Bucharest)
  created_at TIMESTAMP NOT NULL DEFAULT now(),                                    -- creation timestamp
  modified_at TIMESTAMP NOT NULL DEFAULT now()                                    -- auto-updated
);

-- ============================================
-- User Referral Table
-- Tracks referral relationships and bonus/multiplier data
-- Ensures cryptographic auditability of each entry
-- ============================================

CREATE TABLE dorsium_user.referral (
  id BIGSERIAL PRIMARY KEY,                                                       -- internal ID
  uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),                            -- external reference
  referrer_user_id BIGINT NOT NULL REFERENCES dorsium_user.user(id) ON DELETE RESTRICT,  -- who invited
  referred_user_id BIGINT NOT NULL REFERENCES dorsium_user.user(id) ON DELETE RESTRICT,  -- who was invited
  multiplier_amount NUMERIC NOT NULL CHECK (multiplier_amount >= 0),             -- referral multiplier value
  multiplier_granted BOOLEAN NOT NULL DEFAULT false,                             -- has it been granted
  bonus_amount NUMERIC CHECK (bonus_amount IS NULL OR bonus_amount >= 0),        -- optional reward bonus
  bonus_granted BOOLEAN DEFAULT false,                                           -- has bonus been issued
  reason VARCHAR(255),                                                           -- optional free-form reason
  source VARCHAR(64) NOT NULL,                                                   -- campaign name or origin
  audit_hash VARCHAR(128) NOT NULL UNIQUE,                                       -- cryptographic fingerprint
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  modified_at TIMESTAMP NOT NULL DEFAULT now(),
  UNIQUE (referred_user_id),                                                     -- one referrer per user
  CHECK (referrer_user_id != referred_user_id)                                   -- prevent self-referral
);

-- Query optimization index
CREATE INDEX IF NOT EXISTS referral_referrer_idx ON dorsium_user.referral (referrer_user_id);

-- ============================================
-- User Social Profile Table
-- Stores user-linked social handles per platform
-- Each user may have one profile per platform
-- ============================================

-- Social platform ENUM
CREATE TYPE dorsium_user.social_platform AS ENUM (
  'x',          -- formerly Twitter
  'youtube',
  'facebook',
  'instagram',
  'discord',
  'telegram',
  'linkedin'
);

-- Social table
CREATE TABLE dorsium_user.social (
  id BIGSERIAL PRIMARY KEY,                                                       -- internal ID
  uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),                            -- external reference
  user_id BIGINT NOT NULL REFERENCES dorsium_user.user(id) ON DELETE CASCADE,     -- related user
  platform dorsium_user.social_platform NOT NULL,                                 -- ENUM platform
  handle VARCHAR(64) NOT NULL CHECK (length(handle) > 0),                         -- required username/handle
  verified BOOLEAN NOT NULL DEFAULT false,                                        -- verified flag
  url VARCHAR(256),                                                               -- optional public URL
  created_at TIMESTAMP NOT NULL DEFAULT now(),                                    -- created
  modified_at TIMESTAMP NOT NULL DEFAULT now(),                                   -- last update
  UNIQUE (user_id, platform)                                                      -- only one entry per platform per user
);



-- ============================================
-- Trigger to automatically update modified_at
-- ============================================

CREATE TRIGGER set_modified_at_user_account
  BEFORE UPDATE ON dorsium_user.user
  FOR each ROW EXECUTE FUNCTION public.update_modified_at();

CREATE TRIGGER set_modified_at_user_account_role
  BEFORE UPDATE ON dorsium_user.user_role
  FOR each ROW EXECUTE FUNCTION public.update_modified_at();

CREATE TRIGGER set_modified_at_user_payment
  BEFORE UPDATE ON dorsium_user.payment
  FOR each ROW EXECUTE FUNCTION public.update_modified_at();

CREATE TRIGGER set_modified_at_user_preference
  BEFORE UPDATE ON dorsium_user.preference
  FOR each ROW EXECUTE FUNCTION public.update_modified_at();

CREATE TRIGGER set_modified_at_user_referral
  BEFORE UPDATE ON dorsium_user.referral
  FOR each ROW EXECUTE FUNCTION public.update_modified_at();

CREATE TRIGGER set_modified_at_user_social
  BEFORE UPDATE ON dorsium_user.social
  FOR each ROW EXECUTE FUNCTION public.update_modified_at();
