-- =============================================
-- 1. USERS (ID is UUID, specified manually)
-- =============================================
INSERT INTO USERS (CREATED_TIMESTAMP, UPDATED_TIMESTAMP, ID, USERNAME, DISPLAY_NAME, EMAIL, PROFILE_URL, ACCOUNT_STATUS) VALUES ('2025-09-18T10:00:00Z', '2025-09-18T10:00:00Z', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'alice', 'Alice', 'alice@example.com', 'https://i.pravatar.cc/150?u=alice', 'ACTIVE');
INSERT INTO USERS (CREATED_TIMESTAMP, UPDATED_TIMESTAMP, ID, USERNAME, DISPLAY_NAME, EMAIL, PROFILE_URL, ACCOUNT_STATUS) VALUES ('2025-09-18T10:05:00Z', '2025-09-18T10:05:00Z', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'bob', 'Bob', 'bob@example.com', 'https://i.pravatar.cc/150?u=bob', 'ACTIVE');
INSERT INTO USERS (CREATED_TIMESTAMP, UPDATED_TIMESTAMP, ID, USERNAME, DISPLAY_NAME, EMAIL, PROFILE_URL, ACCOUNT_STATUS) VALUES ('2025-09-18T10:10:00Z', '2025-09-18T10:10:00Z', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'charlie', 'Charlie', 'charlie@example.com', 'https://i.pravatar.cc/150?u=charlie', 'ACTIVE');

-- =============================================
-- 2. CHANNELS (ID is auto-generated Long)
-- =============================================
INSERT INTO CHANNELS (IS_PUBLIC, CREATED_AT, CREATED_BY, DESCRIPTION, NAME) VALUES (TRUE, '2025-09-18T11:00:00Z', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'General discussion for everyone.', 'general');
INSERT INTO CHANNELS (IS_PUBLIC, CREATED_AT, CREATED_BY, DESCRIPTION, NAME) VALUES (FALSE, '2025-09-18T11:05:00Z', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'Private channel for the dev team.', 'dev-team');

-- =============================================
-- 3. CHANNEL_MEMBERS (ID is UUID, specified manually. channel_id references the auto-generated Long IDs: 1, 2)
-- =============================================
INSERT INTO CHANNEL_MEMBERS (CHANNEL_ID, JOINED_AT, ID, USER_ID, ROLE) VALUES (1, '2025-09-18T11:00:00Z', '33333333-3333-3333-3333-333333333333', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'ADMIN');
INSERT INTO CHANNEL_MEMBERS (CHANNEL_ID, JOINED_AT, ID, USER_ID, ROLE) VALUES (1, '2025-09-18T11:01:00Z', '44444444-4444-4444-4444-444444444444', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'MEMBER');
INSERT INTO CHANNEL_MEMBERS (CHANNEL_ID, JOINED_AT, ID, USER_ID, ROLE) VALUES (1, '2025-09-18T11:02:00Z', '55555555-5555-5555-5555-555555555555', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'MEMBER');
INSERT INTO CHANNEL_MEMBERS (CHANNEL_ID, JOINED_AT, ID, USER_ID, ROLE) VALUES (2, '2025-09-18T11:05:00Z', '66666666-6666-6666-6666-666666666666', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'ADMIN');
INSERT INTO CHANNEL_MEMBERS (CHANNEL_ID, JOINED_AT, ID, USER_ID, ROLE) VALUES (2, '2025-09-18T11:06:00Z', '77777777-7777-7777-7777-777777777777', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'MEMBER');

-- =============================================
-- 4. MESSAGES (ID is UUID, specified manually) - FIXED UUID FORMAT
-- =============================================
INSERT INTO MESSAGE (ID, CHANNEL_ID, CREATED_AT, DIRECT_CONVERSATION_ID, DELETED, EDITED_AT, CONTENT, CONTENT_TYPE, SENDER_USER_ID) VALUES ('11111111-1111-1111-1111-111111111111', 1, '2025-09-18T12:30:00', NULL, FALSE, NULL, 'Hello everyone!', 'TEXT', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1');
INSERT INTO MESSAGE (ID, CHANNEL_ID, CREATED_AT, DIRECT_CONVERSATION_ID, DELETED, EDITED_AT, CONTENT, CONTENT_TYPE, SENDER_USER_ID) VALUES ('22222222-2222-2222-2222-222222222222', 1, '2025-09-18T12:31:00', NULL, FALSE, NULL, 'Hey Alice!', 'TEXT', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2');

-- =============================================
-- NOTE: Temporarily removing DIRECT_CONVERSATION and DIRECT_PARTICIPANT data
-- until we fix the schema/entity mismatch issues
-- =============================================