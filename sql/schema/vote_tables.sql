-- ============================================
-- Election Table
-- Defines voting sessions, metadata, time windows, and visibility
-- Used by users to discover and participate in polls
-- ============================================

CREATE TABLE dorsium_vote.election (
  id BIGSERIAL PRIMARY KEY,                                              -- internal ID
  uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),                   -- public reference
  short_name VARCHAR(64) NOT NULL UNIQUE,                                -- slug-style unique name
  name VARCHAR(128) NOT NULL,                                            -- title of the election
  description TEXT,                                                      -- full optional description
  type VARCHAR(32) NOT NULL DEFAULT 'election',                          -- future extensibility (e.g., survey)
  is_private BOOLEAN NOT NULL DEFAULT FALSE,                             -- invite-only
  randomize_answers BOOLEAN NOT NULL DEFAULT FALSE,                      -- randomize answer order
  help_email VARCHAR(128),                                               -- contact for help or questions
  starts_at TIMESTAMP,                                                   -- voting window open (UTC)
  ends_at TIMESTAMP,                                                     -- voting window close (UTC)
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  modified_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Trigger to automatically update modified_at

CREATE TRIGGER set_modified_at_vote_election
  BEFORE UPDATE ON dorsium_vote.election
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_at();

-- ============================================
-- Election Question Table
-- Stores individual questions per election with possible answers
-- ============================================

CREATE TABLE dorsium_vote.question (
  id BIGSERIAL PRIMARY KEY,                                                       -- internal ID
  uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),                            -- public reference
  election_id BIGINT NOT NULL REFERENCES dorsium_vote.election(id) ON DELETE CASCADE, -- parent election
  question_text VARCHAR(256) NOT NULL,                                                    -- the actual question
  answers JSONB NOT NULL,                                                         -- array of possible answers
  randomize_order BOOLEAN NOT NULL DEFAULT FALSE,                                 -- shuffle answers for this question
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  modified_at TIMESTAMP NOT NULL DEFAULT now(),
  UNIQUE (election_id, question_text)                                             -- prevent duplicate questions per poll
);

-- Trigger to automatically update modified_at

CREATE TRIGGER set_modified_at_vote_question
  BEFORE UPDATE ON dorsium_vote.question
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_at();

-- ============================================
-- User Vote Table
-- Stores encrypted vote payloads linked to elections and users
-- Each user can vote only once per election
-- ============================================

CREATE TABLE dorsium_vote.vote (
  id BIGSERIAL PRIMARY KEY,                                                       -- internal ID
  uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),                            -- external reference
  user_id BIGINT NOT NULL REFERENCES dorsium_user.user(id) ON DELETE RESTRICT,    -- voter identity
  election_id BIGINT NOT NULL REFERENCES dorsium_vote.election(id) ON DELETE CASCADE, -- linked election
  encrypted_vote JSONB NOT NULL,                                                  -- encrypted answer payload
  proof JSONB,                                                                    -- optional ZKP / cryptographic proof
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  UNIQUE (user_id, election_id)                                                   -- only one vote per election per user
);

-- This table is append-only; no modified_at trigger is defined

-- ============================================
-- Trustee Public Key Table
-- Stores election-specific cryptographic public keys
-- Used for Helios-style encrypted ballot audits and decryption
-- ============================================

CREATE TABLE dorsium_vote.trustee_public_key (
  id BIGSERIAL PRIMARY KEY,                                                       -- internal ID
  uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),                            -- external reference
  election_id BIGINT NOT NULL REFERENCES dorsium_vote.election(id) ON DELETE CASCADE, -- linked election
  trustee_name VARCHAR(64) NOT NULL,                                              -- human-readable trustee ID
  public_key JSONB NOT NULL,                                                      -- cryptographic key payload
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  UNIQUE (election_id, trustee_name)                                              -- one key per trustee per election
);

-- This table is append-only; no modified_at trigger is defined

-- ============================================
-- Election Audit Log Table
-- Stores immutable log entries for election-related events
-- Includes optional user linkage and arbitrary JSON metadata
-- ============================================

CREATE TABLE dorsium_vote.audit_log (
  id BIGSERIAL PRIMARY KEY,                                                       -- internal ID
  uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),                            -- external reference
  election_id BIGINT NOT NULL REFERENCES dorsium_vote.election(id) ON DELETE CASCADE, -- related election
  user_id BIGINT REFERENCES dorsium_user.user(id) ON DELETE RESTRICT,             -- optional user context (e.g. admin action)
  actor TEXT,
  -- request source when user_id is null
  action VARCHAR(64) NOT NULL,                                                    -- action performed (e.g. 'vote_cast')
  metadata JSONB,                                                                 -- optional event-specific data
  previous_hash VARCHAR(128),
  -- hash of the previous audit log entry
  audit_hash VARCHAR(128) NOT NULL,
  -- cryptographic fingerprint
  created_at TIMESTAMP NOT NULL DEFAULT now()                                     -- timestamp of the event
);
CREATE TRIGGER trg_set_audit_hash
  BEFORE INSERT ON dorsium_vote.audit_log
  FOR EACH ROW EXECUTE FUNCTION dorsium_vote.compute_audit_log_hash();

CREATE TRIGGER trg_no_audit_update
  BEFORE UPDATE ON dorsium_vote.audit_log
  FOR EACH ROW EXECUTE FUNCTION dorsium_vote.prevent_audit_log_modification();

CREATE TRIGGER trg_no_audit_delete
  BEFORE DELETE ON dorsium_vote.audit_log
  FOR EACH ROW EXECUTE FUNCTION dorsium_vote.prevent_audit_log_modification();


-- This table is append-only; no modified_at trigger is defined

-- ============================================
-- Ballot Tracker Table
-- Stores a unique cryptographic tracker hash per user per election
-- Used for verifiable voting receipts and public audit verification
-- ============================================

CREATE TABLE dorsium_vote.ballot_tracker (
  id BIGSERIAL PRIMARY KEY,                                                       -- internal ID
  uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),                            -- external reference
  election_id BIGINT NOT NULL REFERENCES dorsium_vote.election(id) ON DELETE CASCADE, -- related election
  user_id BIGINT NOT NULL REFERENCES dorsium_user.user(id) ON DELETE RESTRICT,    -- associated voter
  tracker_hash VARCHAR(64) NOT NULL,                                              -- hash used for vote verification
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  UNIQUE (election_id, user_id)                                                   -- only one tracker per election/user
);

-- This table is append-only; no modified_at trigger is defined

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS vote_question_election_id_idx ON dorsium_vote.question (election_id);
CREATE INDEX IF NOT EXISTS vote_vote_user_id_idx ON dorsium_vote.vote (user_id);
CREATE INDEX IF NOT EXISTS vote_vote_election_id_idx ON dorsium_vote.vote (election_id);
CREATE INDEX IF NOT EXISTS vote_ballot_tracker_user_id_idx ON dorsium_vote.ballot_tracker (user_id);
CREATE INDEX IF NOT EXISTS vote_ballot_tracker_election_id_idx ON dorsium_vote.ballot_tracker (election_id);
CREATE INDEX IF NOT EXISTS vote_audit_log_user_id_idx ON dorsium_vote.audit_log(user_id);
CREATE INDEX IF NOT EXISTS vote_audit_log_election_id_idx ON dorsium_vote.audit_log (election_id);
CREATE INDEX IF NOT EXISTS vote_trustee_public_key_election_id_idx ON dorsium_vote.trustee_public_key(election_id);
