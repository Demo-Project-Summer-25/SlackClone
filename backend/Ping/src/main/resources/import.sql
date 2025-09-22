-- Replace the Alice user record with Jennifer
INSERT INTO users (id, username, display_name, email, profile_url, account_status, created_timestamp, updated_timestamp) VALUES ('68973614-94db-4f98-9729-0712e0c5c0fa', 'jennifer182', 'Jennifer', 'jennifer1@example.com', 'https://i.pravatar.cc/150?u=jennifer1', 'ACTIVE', '2025-09-19T10:00:00Z', '2025-09-19T10:00:00Z');
INSERT INTO users (id, username, display_name, email, profile_url, account_status, created_timestamp, updated_timestamp) VALUES ('e47beacf-c098-4286-b417-3d45c94bd968', 'anthony', 'Anthony', 'anthony@example.com', 'https://i.pravatar.cc/150?u=anthony', 'ACTIVE', '2025-09-19T10:01:00Z', '2025-09-19T10:01:00Z');
INSERT INTO users (id, username, display_name, email, profile_url, account_status, created_timestamp, updated_timestamp) VALUES ('ae2d64e5-d825-49fc-91bb-f530be88ca84', 'younis', 'Younis', 'youins@example.com', 'https://i.pravatar.cc/150?u=youins', 'ACTIVE', '2025-09-19T10:02:00Z', '2025-09-19T10:02:00Z');
INSERT INTO users (id, username, display_name, email, profile_url, account_status, created_timestamp, updated_timestamp) VALUES ('0d9d27d6-8977-46d8-b00a-2464a932aafe', 'danish', 'Danish', 'danish@example.com', 'https://i.pravatar.cc/150?u=danish', 'ACTIVE', '2025-09-19T10:03:00Z', '2025-09-19T10:03:00Z');
INSERT INTO users (id, username, display_name, email, profile_url, account_status, created_timestamp, updated_timestamp) VALUES ('cc58e483-1807-4ab2-83ce-fb2336da1cfd', 'josiah', 'Josiah', 'josiah@example.com', 'https://i.pravatar.cc/150?u=josiah', 'ACTIVE', '2025-09-19T10:04:00Z', '2025-09-19T10:04:00Z');
INSERT INTO users (id, username, display_name, email, profile_url, account_status, created_timestamp, updated_timestamp) VALUES ('0c862291-6d43-47fc-8682-ae358658a5e4', 'sai', 'Sai', 'sai@example.com', 'https://i.pravatar.cc/150?u=sai', 'ACTIVE', '2025-09-19T10:05:00Z', '2025-09-19T10:05:00Z');
INSERT INTO users (id, username, display_name, email, profile_url, account_status, created_timestamp, updated_timestamp) VALUES ('2915dd6e-8c44-4355-8f1b-f7c8c8b0f48d', 'iara', 'Iara', 'iara@example.com', 'https://i.pravatar.cc/150?u=iara', 'ACTIVE', '2025-09-19T10:06:00Z', '2025-09-19T10:06:00Z');
INSERT INTO users (id, username, display_name, email, profile_url, account_status, created_timestamp, updated_timestamp) VALUES ('927bb721-e8e5-41a7-9a4a-d04201713d45', 'andrew', 'Andrew', 'andrew@example.com', 'https://i.pravatar.cc/150?u=andrew', 'ACTIVE', '2025-09-19T10:07:00Z', '2025-09-19T10:07:00Z');
INSERT INTO users (id, username, display_name, email, profile_url, account_status, created_timestamp, updated_timestamp) VALUES ('fff673d0-c4be-49fc-8342-6554a25d19ee', 'kris', 'Kris', 'kris@example.com', 'https://i.pravatar.cc/150?u=kris', 'ACTIVE', '2025-09-19T10:08:00Z', '2025-09-19T10:08:00Z');
INSERT INTO users (id, username, display_name, email, profile_url, account_status, created_timestamp, updated_timestamp) VALUES ('3be336ff-fa43-4f51-baab-0f05457184ef', 'paul', 'Paul', 'paul@example.com', 'https://i.pravatar.cc/150?u=paul', 'ACTIVE', '2025-09-19T10:09:00Z', '2025-09-19T10:09:00Z');


INSERT INTO channels (id, name, description, is_public, created_by, created_at) VALUES ('a6d27e2f-2619-4a53-a3ec-7fc9f10a0eda', 'cohort-general', 'Announcements, daily standups, and cohort-wide chatter.', TRUE, 'fff673d0-c4be-49fc-8342-6554a25d19ee', '2025-09-19T11:00:00Z');
INSERT INTO channels (id, name, description, is_public, created_by, created_at) VALUES ('e757b5b9-e261-430f-b2d0-d178dcd6e2dc', 'agile-policies', 'Scrum/Agile norms, sprint policies, and class workflows.', TRUE, '3be336ff-fa43-4f51-baab-0f05457184ef', '2025-09-19T11:03:00Z');
INSERT INTO channels (id, name, description, is_public, created_by, created_at) VALUES ('63353300-1058-42be-a3c5-09e03f829391', 'spring-boot-lab', 'Help thread for Spring Boot labs, REST controllers, and testing.', TRUE, 'fff673d0-c4be-49fc-8342-6554a25d19ee', '2025-09-19T11:06:00Z');
INSERT INTO channels (id, name, description, is_public, created_by, created_at) VALUES ('700c1676-696d-4cae-9231-5dcc76bf0ee4', 'demo-day-planning', 'Private space to coordinate Demo Day decks, run-throughs, and logistics.', FALSE, '3be336ff-fa43-4f51-baab-0f05457184ef', '2025-09-19T11:09:00Z');
INSERT INTO channels (id, name, description, is_public, created_by, created_at) VALUES ('faecdb32-9123-480a-8a72-7d75b83857c5', 'passion-projects', 'Share updates, code reviews, and blockers on personal builds.', TRUE, 'fff673d0-c4be-49fc-8342-6554a25d19ee', '2025-09-19T11:12:00Z');
INSERT INTO channels (id, name, description, is_public, created_by, created_at) VALUES ('def4decc-edd4-4a94-9ee5-dce940ada25c', 'java-summer25', 'Core Java Q&A: OOP, collections, streams, exceptions.', TRUE, '3be336ff-fa43-4f51-baab-0f05457184ef', '2025-09-19T11:15:00Z');


-- 
-- Jennifer to all channels
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('25cba43c-a825-481f-803a-732647875a6e', 'a6d27e2f-2619-4a53-a3ec-7fc9f10a0eda', '68973614-94db-4f98-9729-0712e0c5c0fa', 'MEMBER', '2025-09-19T11:01:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('050457b3-2319-4478-a4b1-90dd2f47579e', 'e757b5b9-e261-430f-b2d0-d178dcd6e2dc', '68973614-94db-4f98-9729-0712e0c5c0fa', 'MEMBER', '2025-09-19T11:04:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('4bd509a4-5208-418c-ac96-f339a6f3dd78', '63353300-1058-42be-a3c5-09e03f829391', '68973614-94db-4f98-9729-0712e0c5c0fa', 'MEMBER', '2025-09-19T11:07:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('8f7e6d5c-4b3a-2918-e756-c493d8a7b152', '700c1676-696d-4cae-9231-5dcc76bf0ee4', '68973614-94db-4f98-9729-0712e0c5c0fa', 'MEMBER', '2025-09-19T11:10:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('1a2b3c4d-5e6f-7890-abcd-ef1234567890', 'faecdb32-9123-480a-8a72-7d75b83857c5', '68973614-94db-4f98-9729-0712e0c5c0fa', 'MEMBER', '2025-09-19T11:13:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('2b3c4d5e-6f78-9012-bcde-f23456789012', 'def4decc-edd4-4a94-9ee5-dce940ada25c', '68973614-94db-4f98-9729-0712e0c5c0fa', 'MEMBER', '2025-09-19T11:16:00Z');

-- Anthony to all channels
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('3c4d5e6f-7890-1234-cdef-456789012345', 'a6d27e2f-2619-4a53-a3ec-7fc9f10a0eda', 'e47beacf-c098-4286-b417-3d45c94bd968', 'MEMBER', '2025-09-19T11:02:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('4d5e6f78-9012-3456-def0-567890123456', 'e757b5b9-e261-430f-b2d0-d178dcd6e2dc', 'e47beacf-c098-4286-b417-3d45c94bd968', 'MEMBER', '2025-09-19T11:05:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('5e6f7890-1234-5678-ef01-678901234567', '63353300-1058-42be-a3c5-09e03f829391', 'e47beacf-c098-4286-b417-3d45c94bd968', 'MEMBER', '2025-09-19T11:08:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('6f789012-3456-7890-f012-789012345678', '700c1676-696d-4cae-9231-5dcc76bf0ee4', 'e47beacf-c098-4286-b417-3d45c94bd968', 'MEMBER', '2025-09-19T11:11:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('7890123a-4567-8901-0123-89012345678a', 'faecdb32-9123-480a-8a72-7d75b83857c5', 'e47beacf-c098-4286-b417-3d45c94bd968', 'MEMBER', '2025-09-19T11:14:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('8901234b-5678-9012-1234-90123456789b', 'def4decc-edd4-4a94-9ee5-dce940ada25c', 'e47beacf-c098-4286-b417-3d45c94bd968', 'MEMBER', '2025-09-19T11:17:00Z');

-- Youins to all channels
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('9012345c-6789-0123-2345-01234567890c', 'a6d27e2f-2619-4a53-a3ec-7fc9f10a0eda', 'ae2d64e5-d825-49fc-91bb-f530be88ca84', 'MEMBER', '2025-09-19T11:03:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('0123456d-7890-1234-3456-12345678901d', 'e757b5b9-e261-430f-b2d0-d178dcd6e2dc', 'ae2d64e5-d825-49fc-91bb-f530be88ca84', 'MEMBER', '2025-09-19T11:06:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('1234567e-8901-2345-4567-23456789012e', '63353300-1058-42be-a3c5-09e03f829391', 'ae2d64e5-d825-49fc-91bb-f530be88ca84', 'MEMBER', '2025-09-19T11:09:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('2345678f-9012-3456-5678-3456789012af', '700c1676-696d-4cae-9231-5dcc76bf0ee4', 'ae2d64e5-d825-49fc-91bb-f530be88ca84', 'MEMBER', '2025-09-19T11:12:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('3456789a-0123-4567-6789-456789012abc', 'faecdb32-9123-480a-8a72-7d75b83857c5', 'ae2d64e5-d825-49fc-91bb-f530be88ca84', 'MEMBER', '2025-09-19T11:15:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('456789ab-1234-5678-789a-56789012abcd', 'def4decc-edd4-4a94-9ee5-dce940ada25c', 'ae2d64e5-d825-49fc-91bb-f530be88ca84', 'MEMBER', '2025-09-19T11:18:00Z');

-- Danish to all channels
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('56789abc-2345-6789-89ab-6789012abcde', 'a6d27e2f-2619-4a53-a3ec-7fc9f10a0eda', '0d9d27d6-8977-46d8-b00a-2464a932aafe', 'MEMBER', '2025-09-19T11:04:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('6789abcd-3456-789a-9abc-789012abcdef', 'e757b5b9-e261-430f-b2d0-d178dcd6e2dc', '0d9d27d6-8977-46d8-b00a-2464a932aafe', 'MEMBER', '2025-09-19T11:07:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('789abcde-4567-89ab-abcd-89012abcdef0', '63353300-1058-42be-a3c5-09e03f829391', '0d9d27d6-8977-46d8-b00a-2464a932aafe', 'MEMBER', '2025-09-19T11:10:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('89abcdef-5678-9abc-bcde-9012abcdef01', '700c1676-696d-4cae-9231-5dcc76bf0ee4', '0d9d27d6-8977-46d8-b00a-2464a932aafe', 'MEMBER', '2025-09-19T11:13:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('9abcdef0-6789-abcd-cdef-012abcdef012', 'faecdb32-9123-480a-8a72-7d75b83857c5', '0d9d27d6-8977-46d8-b00a-2464a932aafe', 'MEMBER', '2025-09-19T11:16:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('abcdef01-789a-bcde-def0-12abcdef0123', 'def4decc-edd4-4a94-9ee5-dce940ada25c', '0d9d27d6-8977-46d8-b00a-2464a932aafe', 'MEMBER', '2025-09-19T11:19:00Z');

-- Josiah to all channels
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('bcdef012-89ab-cdef-ef01-2abcdef01234', 'a6d27e2f-2619-4a53-a3ec-7fc9f10a0eda', 'cc58e483-1807-4ab2-83ce-fb2336da1cfd', 'MEMBER', '2025-09-19T11:05:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('cdef0123-9abc-def0-f012-abcdef012345', 'e757b5b9-e261-430f-b2d0-d178dcd6e2dc', 'cc58e483-1807-4ab2-83ce-fb2336da1cfd', 'MEMBER', '2025-09-19T11:08:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('def01234-abcd-ef01-0123-bcdef0123456', '63353300-1058-42be-a3c5-09e03f829391', 'cc58e483-1807-4ab2-83ce-fb2336da1cfd', 'MEMBER', '2025-09-19T11:11:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('ef012345-bcde-f012-1234-cdef01234567', '700c1676-696d-4cae-9231-5dcc76bf0ee4', 'cc58e483-1807-4ab2-83ce-fb2336da1cfd', 'MEMBER', '2025-09-19T11:14:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('f0123456-cdef-0123-2345-def012345678', 'faecdb32-9123-480a-8a72-7d75b83857c5', 'cc58e483-1807-4ab2-83ce-fb2336da1cfd', 'MEMBER', '2025-09-19T11:17:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('01234567-def0-1234-3456-ef0123456789', 'def4decc-edd4-4a94-9ee5-dce940ada25c', 'cc58e483-1807-4ab2-83ce-fb2336da1cfd', 'MEMBER', '2025-09-19T11:20:00Z');

-- Sai to all channels
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('12345678-ef01-2345-4567-f01234567890', 'a6d27e2f-2619-4a53-a3ec-7fc9f10a0eda', '0c862291-6d43-47fc-8682-ae358658a5e4', 'MEMBER', '2025-09-19T11:06:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('23456789-f012-3456-5678-012345678901', 'e757b5b9-e261-430f-b2d0-d178dcd6e2dc', '0c862291-6d43-47fc-8682-ae358658a5e4', 'MEMBER', '2025-09-19T11:09:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('3456789a-0123-4567-6789-123456789012', '63353300-1058-42be-a3c5-09e03f829391', '0c862291-6d43-47fc-8682-ae358658a5e4', 'MEMBER', '2025-09-19T11:12:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('456789ab-1234-5678-789a-234567890123', '700c1676-696d-4cae-9231-5dcc76bf0ee4', '0c862291-6d43-47fc-8682-ae358658a5e4', 'MEMBER', '2025-09-19T11:15:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('56789abc-2345-6789-89ab-345678901234', 'faecdb32-9123-480a-8a72-7d75b83857c5', '0c862291-6d43-47fc-8682-ae358658a5e4', 'MEMBER', '2025-09-19T11:18:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('6789abcd-3456-789a-9abc-456789012345', 'def4decc-edd4-4a94-9ee5-dce940ada25c', '0c862291-6d43-47fc-8682-ae358658a5e4', 'MEMBER', '2025-09-19T11:21:00Z');

-- Iara to all channels
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('789abcde-4567-89ab-abcd-567890123456', 'a6d27e2f-2619-4a53-a3ec-7fc9f10a0eda', '2915dd6e-8c44-4355-8f1b-f7c8c8b0f48d', 'MEMBER', '2025-09-19T11:07:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('89abcdef-5678-9012-1234-90123456789b', 'e757b5b9-e261-430f-b2d0-d178dcd6e2dc', '2915dd6e-8c44-4355-8f1b-f7c8c8b0f48d', 'MEMBER', '2025-09-19T11:10:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('9abcdef0-6789-abcd-cdef-789012345678', '63353300-1058-42be-a3c5-09e03f829391', '2915dd6e-8c44-4355-8f1b-f7c8c8b0f48d', 'MEMBER', '2025-09-19T11:13:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('abcdef01-789a-bcde-def0-890123456789', '700c1676-696d-4cae-9231-5dcc76bf0ee4', '2915dd6e-8c44-4355-8f1b-f7c8c8b0f48d', 'MEMBER', '2025-09-19T11:16:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('bcdef012-89ab-cdef-ef01-90123456789a', 'faecdb32-9123-480a-8a72-7d75b83857c5', '2915dd6e-8c44-4355-8f1b-f7c8c8b0f48d', 'MEMBER', '2025-09-19T11:19:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('cdef0123-9abc-def0-f012-0123456789ab', 'def4decc-edd4-4a94-9ee5-dce940ada25c', '2915dd6e-8c44-4355-8f1b-f7c8c8b0f48d', 'MEMBER', '2025-09-19T11:22:00Z');

-- Andrew to all channels
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('def01234-abcd-ef01-0123-123456789abc', 'a6d27e2f-2619-4a53-a3ec-7fc9f10a0eda', '927bb721-e8e5-41a7-9a4a-d04201713d45', 'MEMBER', '2025-09-19T11:08:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('ef012345-bcde-f012-1234-23456789abcd', 'e757b5b9-e261-430f-b2d0-d178dcd6e2dc', '927bb721-e8e5-41a7-9a4a-d04201713d45', 'MEMBER', '2025-09-19T11:11:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('f0123456-cdef-0123-2345-3456789abcde', '63353300-1058-42be-a3c5-09e03f829391', '927bb721-e8e5-41a7-9a4a-d04201713d45', 'MEMBER', '2025-09-19T11:14:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('01234567-def0-1234-3456-456789abcdef', '700c1676-696d-4cae-9231-5dcc76bf0ee4', '927bb721-e8e5-41a7-9a4a-d04201713d45', 'MEMBER', '2025-09-19T11:17:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('12345678-ef01-2345-4567-56789abcdef0', 'faecdb32-9123-480a-8a72-7d75b83857c5', '927bb721-e8e5-41a7-9a4a-d04201713d45', 'MEMBER', '2025-09-19T11:20:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('23456789-f012-3456-5678-6789abcdef01', 'def4decc-edd4-4a94-9ee5-dce940ada25c', '927bb721-e8e5-41a7-9a4a-d04201713d45', 'MEMBER', '2025-09-19T11:23:00Z');

-- Kris to all channels (creator of some channels gets ADMIN role)
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('3456789a-0123-4567-6789-789abcdef012', 'a6d27e2f-2619-4a53-a3ec-7fc9f10a0eda', 'fff673d0-c4be-49fc-8342-6554a25d19ee', 'ADMIN', '2025-09-19T11:00:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('456789ab-1234-5678-789a-89abcdef0123', 'e757b5b9-e261-430f-b2d0-d178dcd6e2dc', 'fff673d0-c4be-49fc-8342-6554a25d19ee', 'MEMBER', '2025-09-19T11:12:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('56789abc-2345-6789-89ab-9abcdef01234', '63353300-1058-42be-a3c5-09e03f829391', 'fff673d0-c4be-49fc-8342-6554a25d19ee', 'ADMIN', '2025-09-19T11:06:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('6789abcd-3456-789a-9abc-abcdef012345', '700c1676-696d-4cae-9231-5dcc76bf0ee4', 'fff673d0-c4be-49fc-8342-6554a25d19ee', 'MEMBER', '2025-09-19T11:18:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('789abcde-4567-89ab-abcd-bcdef0123456', 'faecdb32-9123-480a-8a72-7d75b83857c5', 'fff673d0-c4be-49fc-8342-6554a25d19ee', 'ADMIN', '2025-09-19T11:12:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('8abcdef0-5678-9abc-bcde-cdef01234567', 'def4decc-edd4-4a94-9ee5-dce940ada25c', 'fff673d0-c4be-49fc-8342-6554a25d19ee', 'MEMBER', '2025-09-19T11:24:00Z');

-- Paul to all channels (creator of some channels gets ADMIN role)
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('9abcdef0-6789-abcd-cdef-def012345678', 'a6d27e2f-2619-4a53-a3ec-7fc9f10a0eda', '3be336ff-fa43-4f51-baab-0f05457184ef', 'MEMBER', '2025-09-19T11:09:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('abcdef01-789a-bcde-def0-ef0123456789', 'e757b5b9-e261-430f-b2d0-d178dcd6e2dc', '3be336ff-fa43-4f51-baab-0f05457184ef', 'ADMIN', '2025-09-19T11:03:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('bcdef012-89ab-cdef-ef01-f012345678ab', '63353300-1058-42be-a3c5-09e03f829391', '3be336ff-fa43-4f51-baab-0f05457184ef', 'MEMBER', '2025-09-19T11:15:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('cdef0123-9abc-def0-f012-0123456789bc', '700c1676-696d-4cae-9231-5dcc76bf0ee4', '3be336ff-fa43-4f51-baab-0f05457184ef', 'ADMIN', '2025-09-19T11:09:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('def01234-abcd-ef01-0123-123456789cde', 'faecdb32-9123-480a-8a72-7d75b83857c5', '3be336ff-fa43-4f51-baab-0f05457184ef', 'MEMBER', '2025-09-19T11:21:00Z');
INSERT INTO channel_members (id, channel_id, user_id, role, joined_at) VALUES ('ef012345-bcde-f012-1234-23456789def0', 'def4decc-edd4-4a94-9ee5-dce940ada25c', '3be336ff-fa43-4f51-baab-0f05457184ef', 'ADMIN', '2025-09-19T11:15:00Z');


-- Jennifer's demo data - Fixed with proper UUIDs and correct columns

-- Create direct conversations (removing non-existent columns)
INSERT INTO direct_conversation (id, is_group, title, created_by_user_id, created_at, updated_at) VALUES ('12345678-1234-5678-9abc-123456789abc', false, NULL, 'ae2d64e5-d825-49fc-91bb-f530be88ca84', '2025-09-19T08:10:00Z', '2025-09-19T08:30:00Z');

INSERT INTO direct_conversation (id, is_group, title, created_by_user_id, created_at, updated_at) VALUES ('23456789-2345-6789-abcd-23456789abcd', false, NULL, 'e47beacf-c098-4286-b417-3d45c94bd968', '2025-09-19T08:55:00Z', '2025-09-19T09:15:00Z');

-- Add participants (using proper column names)
INSERT INTO DIRECT_PARTICIPANT (id, direct_conversation_id, user_id, is_admin, joined_at, notify_level) VALUES ('34567890-3456-7890-bcde-3456789abcde', '12345678-1234-5678-9abc-123456789abc', '68973614-94db-4f98-9729-0712e0c5c0fa', true, '2025-09-19T08:10:00Z', 'ALL');

INSERT INTO DIRECT_PARTICIPANT (id, direct_conversation_id, user_id, is_admin, joined_at, notify_level) VALUES ('45678901-4567-8901-cdef-456789abcdef', '12345678-1234-5678-9abc-123456789abc', 'ae2d64e5-d825-49fc-91bb-f530be88ca84', false, '2025-09-19T08:10:00Z', 'ALL');

INSERT INTO DIRECT_PARTICIPANT (id, direct_conversation_id, user_id, is_admin, joined_at, notify_level) VALUES ('56789012-5678-9012-def0-56789abcdef0', '23456789-2345-6789-abcd-23456789abcd', '68973614-94db-4f98-9729-0712e0c5c0fa', true, '2025-09-19T08:55:00Z', 'ALL');

INSERT INTO DIRECT_PARTICIPANT (id, direct_conversation_id, user_id, is_admin, joined_at, notify_level) VALUES ('67890123-6789-0123-ef01-6789abcdef01', '23456789-2345-6789-abcd-23456789abcd', 'e47beacf-c098-4286-b417-3d45c94bd968', false, '2025-09-19T08:55:00Z', 'ALL');

-- Add messages (with proper UUIDs)
INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('78901234-7890-1234-f012-789abcdef012', 'Hey Jennifer! How did your Spring Boot Lab go?', 'TEXT', 'ae2d64e5-d825-49fc-91bb-f530be88ca84', NULL, '12345678-1234-5678-9abc-123456789abc', '2025-09-19T08:15:00Z', false);

INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('89012345-8901-2345-0123-89abcdef0123', 'It went great! Finally got the database connection working properly.', 'TEXT', '68973614-94db-4f98-9729-0712e0c5c0fa', NULL, '12345678-1234-5678-9abc-123456789abc', '2025-09-19T08:20:00Z', false);

INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('90123456-9012-3456-1234-9abcdef01234', 'Nice! I am still having trouble with my JPA entities. Mind if I ask you about it later?', 'TEXT', 'ae2d64e5-d825-49fc-91bb-f530be88ca84', NULL, '12345678-1234-5678-9abc-123456789abc', '2025-09-19T08:25:00Z', false);

INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('01234567-0123-4567-2345-abcdef012345', 'Jennifer, I have the wireframes ready for the casino app. Want to review them?', 'TEXT', 'e47beacf-c098-4286-b417-3d45c94bd968', NULL, '23456789-2345-6789-abcd-23456789abcd', '2025-09-19T09:00:00Z', false);

-- Add notifications (linking to proper message UUIDs)
INSERT INTO notification (id, recipient_user_id, actor_user_id, direct_conversation_id, channel_id, message_id, type, status, text, created_at, read_at) VALUES ('11111111-1111-1111-1111-111111111111', '68973614-94db-4f98-9729-0712e0c5c0fa', 'ae2d64e5-d825-49fc-91bb-f530be88ca84', '12345678-1234-5678-9abc-123456789abc', NULL, '78901234-7890-1234-f012-789abcdef012', 'MESSAGE', 'READ', 'New direct message from Younis', '2025-09-19T08:15:00Z', '2025-09-19T08:18:00Z');

INSERT INTO notification (id, recipient_user_id, actor_user_id, direct_conversation_id, channel_id, message_id, type, status, text, created_at, read_at) VALUES ('22222222-2222-2222-2222-222222222222', '68973614-94db-4f98-9729-0712e0c5c0fa', 'ae2d64e5-d825-49fc-91bb-f530be88ca84', '12345678-1234-5678-9abc-123456789abc', NULL, '90123456-9012-3456-1234-9abcdef01234', 'MESSAGE', 'UNREAD', 'New direct message from Younis', '2025-09-19T08:25:00Z', NULL);

INSERT INTO notification (id, recipient_user_id, actor_user_id, direct_conversation_id, channel_id, message_id, type, status, text, created_at, read_at) VALUES ('33333333-3333-3333-3333-333333333333', '68973614-94db-4f98-9729-0712e0c5c0fa', 'e47beacf-c098-4286-b417-3d45c94bd968', '23456789-2345-6789-abcd-23456789abcd', NULL, '01234567-0123-4567-2345-abcdef012345', 'MESSAGE', 'UNREAD', 'New direct message from Anthony', '2025-09-19T09:00:00Z', NULL);

-- Channel notifications (no message_id for mentions)
INSERT INTO notification (id, recipient_user_id, actor_user_id, direct_conversation_id, channel_id, message_id, type, status, text, created_at, read_at) VALUES ('44444444-4444-4444-4444-444444444444', '68973614-94db-4f98-9729-0712e0c5c0fa', 'fff673d0-c4be-49fc-8342-6554a25d19ee', NULL, '63353300-1058-42be-a3c5-09e03f829391', NULL, 'CHANNEL_MENTION', 'READ', 'You were mentioned in Spring Boot Lab', '2025-09-19T11:35:00Z', '2025-09-19T11:38:00Z');

INSERT INTO notification (id, recipient_user_id, actor_user_id, direct_conversation_id, channel_id, message_id, type, status, text, created_at, read_at) VALUES ('55555555-5555-5555-5555-555555555555', '68973614-94db-4f98-9729-0712e0c5c0fa', '0d9d27d6-8977-46d8-b00a-2464a932aafe', NULL, 'faecdb32-9123-480a-8a72-7d75b83857c5', NULL, 'CHANNEL_MENTION', 'UNREAD', 'You were mentioned in Passion Projects', '2025-09-19T15:35:00Z', NULL);

-- Channel Messages - Add realistic conversations to all channels

-- ======================================
-- COHORT-GENERAL CHANNEL MESSAGES
-- ======================================
INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('0f2a8b1c-3d4e-4a5b-8c6d-1e2f3a4b5c60', 'Good morning everyone! Hope you all had a great weekend. Let''s make this week count! 💪', 'TEXT', 'fff673d0-c4be-49fc-8342-6554a25d19ee', 'a6d27e2f-2619-4a53-a3ec-7fc9f10a0eda', NULL, '2025-09-22T09:00:00Z', false);

INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('1a3b5c7d-9e0f-4b1c-8d2e-3f4a5b6c7d80', 'Morning Kris! Ready to tackle some more Spring Boot today 🚀', 'TEXT', '68973614-94db-4f98-9729-0712e0c5c0fa', 'a6d27e2f-2619-4a53-a3ec-7fc9f10a0eda', NULL, '2025-09-22T09:05:00Z', false);

INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('2b4c6d8e-a0b1-4c2d-9e3f-4a5b6c7d8e90', 'Quick reminder: Daily standup at 10 AM. Please have your updates ready!', 'TEXT', '3be336ff-fa43-4f51-baab-0f05457184ef', 'a6d27e2f-2619-4a53-a3ec-7fc9f10a0eda', NULL, '2025-09-22T09:30:00Z', false);

INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('3c5d7e9f-b1c2-4d3e-a4f5-5b6c7d8e9fa1', 'Thanks Paul! Just finished debugging my REST controller. Feeling good about today''s lab', 'TEXT', 'ae2d64e5-d825-49fc-91bb-f530be88ca84', 'a6d27e2f-2619-4a53-a3ec-7fc9f10a0eda', NULL, '2025-09-22T09:45:00Z', false);

INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('4d6e8f10-c2d3-4e4f-b506-6c7d8e9fa1b2', 'Has anyone grabbed coffee yet? I''m making a run to the café downstairs ☕', 'TEXT', '2915dd6e-8c44-4355-8f1b-f7c8c8b0f48d', 'a6d27e2f-2619-4a53-a3ec-7fc9f10a0eda', NULL, '2025-09-22T10:15:00Z', false);

INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('5e7f9011-d3e4-4f50-8a17-7d8e9fa1b2c3', 'I''ll take a latte! Thanks Iara 🙏', 'TEXT', '927bb721-e8e5-41a7-9a4a-d04201713d45', 'a6d27e2f-2619-4a53-a3ec-7fc9f10a0eda', NULL, '2025-09-22T10:16:00Z', false);

-- ======================================
-- AGILE-POLICIES CHANNEL MESSAGES
-- ======================================
INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('6f809112-e4f5-4a61-9b28-8e9fa1b2c3d4', 'Team, let''s review our sprint retrospective from last week. What went well and what can we improve?', 'TEXT', '3be336ff-fa43-4f51-baab-0f05457184ef', 'e757b5b9-e261-430f-b2d0-d178dcd6e2dc', NULL, '2025-09-22T08:00:00Z', false);

INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('7081a223-f506-4b72-ac39-9fa1b2c3d4e5', 'I think our code reviews are taking too long. Maybe we can set a 24-hour turnaround time?', 'TEXT', '0d9d27d6-8977-46d8-b00a-2464a932aafe', 'e757b5b9-e261-430f-b2d0-d178dcd6e2dc', NULL, '2025-09-22T08:30:00Z', false);

INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('8192b334-0617-4c83-bd4a-afb2c3d4e5f6', 'Good point Danish. I also noticed we''re not updating our Jira tickets consistently', 'TEXT', 'cc58e483-1807-4ab2-83ce-fb2336da1cfd', 'e757b5b9-e261-430f-b2d0-d178dcd6e2dc', NULL, '2025-09-22T08:45:00Z', false);

INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('92a3c445-1728-4d94-8e5b-b2c3d4e5f607', 'Let''s implement a "Definition of Done" checklist. It should include: code review, tests passing, and documentation updated', 'TEXT', 'fff673d0-c4be-49fc-8342-6554a25d19ee', 'e757b5b9-e261-430f-b2d0-d178dcd6e2dc', NULL, '2025-09-22T09:00:00Z', false);

-- ======================================
-- SPRING-BOOT-LAB CHANNEL MESSAGES
-- ======================================
INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('a3b4d556-2839-4ea5-9f6c-c3d4e5f60718', 'Lab 5 is now available! We''re diving into JPA relationships and database migrations', 'TEXT', 'fff673d0-c4be-49fc-8342-6554a25d19ee', '63353300-1058-42be-a3c5-09e03f829391', NULL, '2025-09-22T07:00:00Z', false);

INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('b4c5e667-394a-4fb6-a07d-d4e5f6071829', 'Quick question: Is it better to use @OneToMany or @ManyToOne for my User-to-Posts relationship?', 'TEXT', '68973614-94db-4f98-9729-0712e0c5c0fa', '63353300-1058-42be-a3c5-09e03f829391', NULL, '2025-09-22T09:30:00Z', false);

INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('c5d6f778-4a5b-40c7-b18e-e5f60718293a', '@jennifer182 You''d want @OneToMany on User (one user has many posts) and @ManyToOne on Post (many posts belong to one user)', 'TEXT', 'ae2d64e5-d825-49fc-91bb-f530be88ca84', '63353300-1058-42be-a3c5-09e03f829391', NULL, '2025-09-22T09:35:00Z', false);

INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('d6e70889-5b6c-41d8-8c9f-f60718293a4b', 'Thanks @younis! That makes perfect sense. The relationship direction was confusing me', 'TEXT', '68973614-94db-4f98-9729-0712e0c5c0fa', '63353300-1058-42be-a3c5-09e03f829391', NULL, '2025-09-22T09:40:00Z', false);

INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('e7f8199a-6c7d-42e9-9dab-0718293a4b5c', 'I''m getting a "LazyInitializationException" when trying to access my nested entities. Any tips?', 'TEXT', '0c862291-6d43-47fc-8682-ae358658a5e4', '63353300-1058-42be-a3c5-09e03f829391', NULL, '2025-09-22T10:00:00Z', false);

INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('f8092aab-7d8e-43fa-a2bc-18293a4b5c6d', '@sai Try adding @Transactional to your service method or use JOIN FETCH in your query', 'TEXT', 'fff673d0-c4be-49fc-8342-6554a25d19ee', '63353300-1058-42be-a3c5-09e03f829391', NULL, '2025-09-22T10:05:00Z', false);

INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('081a3bbc-8e9f-44ab-b3cd-293a4b5c6d7e', 'Also check out @EntityGraph annotation - it''s great for solving N+1 query problems', 'TEXT', 'e47beacf-c098-4286-b417-3d45c94bd968', '63353300-1058-42be-a3c5-09e03f829391', NULL, '2025-09-22T10:10:00Z', false);

-- ======================================
-- DEMO-DAY-PLANNING CHANNEL MESSAGES
-- ======================================
INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('19ab4ccd-9f10-45bc-8cde-3a4b5c6d7e8f', 'Demo Day is in 3 weeks! Time to start preparing our presentations. Each team gets 8 minutes + 2 for Q&A', 'TEXT', '3be336ff-fa43-4f51-baab-0f05457184ef', '700c1676-696d-4cae-9231-5dcc76bf0ee4', NULL, '2025-09-22T08:00:00Z', false);

INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('2abc5dde-af21-46cd-9def-4b5c6d7e8f90', 'Should we focus more on technical implementation or business value?', 'TEXT', '927bb721-e8e5-41a7-9a4a-d04201713d45', '700c1676-696d-4cae-9231-5dcc76bf0ee4', NULL, '2025-09-22T08:30:00Z', false);

INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('3bcd6eef-b032-47de-aef0-5c6d7e8f901a', 'I''d say 60% technical, 40% business. The audience wants to see our coding skills but also understand the problem we''re solving', 'TEXT', 'fff673d0-c4be-49fc-8342-6554a25d19ee', '700c1676-696d-4cae-9231-5dcc76bf0ee4', NULL, '2025-09-22T08:45:00Z', false);

INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('4cde7ff0-c143-48ef-b001-6d7e8f901a2b', 'I''ve created a shared Google Drive folder for all presentation templates and assets: [link]', 'TEXT', '3be336ff-fa43-4f51-baab-0f05457184ef', '700c1676-696d-4cae-9231-5dcc76bf0ee4', NULL, '2025-09-22T09:00:00Z', false);

-- ======================================
-- PASSION-PROJECTS CHANNEL MESSAGES
-- ======================================
INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('5def8001-d254-4900-8a12-7e8f901a2b3c', 'Exciting news! I just deployed my recipe sharing app to AWS. Check it out: myrecipes.app 🍳', 'TEXT', '2915dd6e-8c44-4355-8f1b-f7c8c8b0f48d', 'faecdb32-9123-480a-8a72-7d75b83857c5', NULL, '2025-09-22T07:30:00Z', false);

INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('6ef08112-e365-4a11-9b23-8f901a2b3c4d', 'That''s awesome @iara! The UI looks super clean. Did you use React for the frontend?', 'TEXT', '68973614-94db-4f98-9729-0712e0c5c0fa', 'faecdb32-9123-480a-8a72-7d75b83857c5', NULL, '2025-09-22T07:45:00Z', false);

INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('70f19223-f476-4b22-ac34-901a2b3c4d5e', 'Yes! React + TypeScript + Material-UI. Backend is Spring Boot with PostgreSQL', 'TEXT', '2915dd6e-8c44-4355-8f1b-f7c8c8b0f48d', 'faecdb32-9123-480a-8a72-7d75b83857c5', NULL, '2025-09-22T07:50:00Z', false);

INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('8102a334-0577-4c33-bd45-a12b3c4d5e6f', 'Working on a mobile fitness tracker using React Native. Anyone have experience with device sensors?', 'TEXT', '0d9d27d6-8977-46d8-b00a-2464a932aafe', 'faecdb32-9123-480a-8a72-7d75b83857c5', NULL, '2025-09-22T08:15:00Z', false);

INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('9213b445-1688-4d44-8e56-b23c4d5e6f70', '@danish Check out Expo''s sensor APIs - they make accelerometer and gyroscope integration super easy', 'TEXT', 'cc58e483-1807-4ab2-83ce-fb2336da1cfd', 'faecdb32-9123-480a-8a72-7d75b83857c5', NULL, '2025-09-22T08:30:00Z', false);

INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('a324c556-2799-4e55-9f67-c34d5e6f7081', 'Update on my casino game: Just implemented poker hand evaluation algorithm. Texas Hold''em is working! 🃏', 'TEXT', 'e47beacf-c098-4286-b417-3d45c94bd968', 'faecdb32-9123-480a-8a72-7d75b83857c5', NULL, '2025-09-22T09:00:00Z', false);

INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('b435d667-38aa-4f66-a078-d45e6f708192', '@anthony That sounds complex! Are you handling all the edge cases like split pots and side pots?', 'TEXT', 'ae2d64e5-d825-49fc-91bb-f530be88ca84', 'faecdb32-9123-480a-8a72-7d75b83857c5', NULL, '2025-09-22T09:15:00Z', false);

INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('c546e778-49bb-4077-b189-e56f708192a3', 'Working on basic functionality first, but yeah - split pots are on my todo list. The math gets tricky! 😅', 'TEXT', 'e47beacf-c098-4286-b417-3d45c94bd968', 'faecdb32-9123-480a-8a72-7d75b83857c5', NULL, '2025-09-22T09:20:00Z', false);

-- ======================================
-- JAVA-SUMMER25 CHANNEL MESSAGES
-- ======================================
INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('d657f889-5acc-4188-8c9a-f6708192a3b4', 'Today''s topic: Understanding Java Streams. They''re powerful but can be confusing at first!', 'TEXT', '3be336ff-fa43-4f51-baab-0f05457184ef', 'def4decc-edd4-4a94-9ee5-dce940ada25c', NULL, '2025-09-22T08:00:00Z', false);

INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('e768099a-6bdd-4299-9dab-08192a3b4c5d', 'When should I use .map() vs .flatMap()? I always get confused between them', 'TEXT', '927bb721-e8e5-41a7-9a4a-d04201713d45', 'def4decc-edd4-4a94-9ee5-dce940ada25c', NULL, '2025-09-22T08:30:00Z', false);

INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('f8791aab-7cee-43aa-aebc-192a3b4c5d6e', '@andrew Use map() for 1:1 transformations, flatMap() when your transformation returns a Stream and you want to flatten it', 'TEXT', 'fff673d0-c4be-49fc-8342-6554a25d19ee', 'def4decc-edd4-4a94-9ee5-dce940ada25c', NULL, '2025-09-22T08:35:00Z', false);

INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('089a2bbc-8dff-44bb-bfcd-2a3b4c5d6e70', 'Example: list.stream().map(String::toUpperCase) vs list.stream().flatMap(s -> Arrays.stream(s.split(" ")))', 'TEXT', 'fff673d0-c4be-49fc-8342-6554a25d19ee', 'def4decc-edd4-4a94-9ee5-dce940ada25c', NULL, '2025-09-22T08:36:00Z', false);

INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('19ab3ccd-9010-45cc-8ade-3b4c5d6e7081', 'That example really helps! So flatMap is like map + flatten combined', 'TEXT', '927bb721-e8e5-41a7-9a4a-d04201713d45', 'def4decc-edd4-4a94-9ee5-dce940ada25c', NULL, '2025-09-22T08:40:00Z', false);

INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('2abc4dde-a121-46dd-9bef-4c5d6e708192', 'Quick question about Optional: Is it better to use .orElse() or .orElseGet()?', 'TEXT', '0c862291-6d43-47fc-8682-ae358658a5e4', 'def4decc-edd4-4a94-9ee5-dce940ada25c', NULL, '2025-09-22T09:00:00Z', false);

INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('3bcd5eef-b232-47ee-af00-5d6e708192a3', '@sai Use orElse() for simple values, orElseGet() when you need to compute the default (lazy evaluation)', 'TEXT', '3be336ff-fa43-4f51-baab-0f05457184ef', 'def4decc-edd4-4a94-9ee5-dce940ada25c', NULL, '2025-09-22T09:05:00Z', false);

INSERT INTO message (id, content, content_type, sender_user_id, channel_id, direct_conversation_id, created_at, deleted) VALUES ('4cde600f-c343-48ff-b011-6e708192a3b4', 'Performance tip: orElseGet(() -> new ArrayList<>()) won''t create the list unless needed, but orElse(new ArrayList<>()) always creates it', 'TEXT', 'ae2d64e5-d825-49fc-91bb-f530be88ca84', 'def4decc-edd4-4a94-9ee5-dce940ada25c', NULL, '2025-09-22T09:10:00Z', false);

-- Add a few more channel notifications based on these new messages
INSERT INTO notification (id, recipient_user_id, actor_user_id, direct_conversation_id, channel_id, message_id, type, status, text, created_at, read_at) VALUES ('5def7111-d454-4a10-8a22-7aa0bbccdde0', '68973614-94db-4f98-9729-0712e0c5c0fa', 'ae2d64e5-d825-49fc-91bb-f530be88ca84', NULL, '63353300-1058-42be-a3c5-09e03f829391', 'c5d6f778-4a5b-40c7-b18e-e5f60718293a', 'MENTION', 'UNREAD', 'Younis mentioned you in Spring Boot Lab', '2025-09-22T09:35:00Z', NULL);

INSERT INTO notification (id, recipient_user_id, actor_user_id, direct_conversation_id, channel_id, message_id, type, status, text, created_at, read_at) VALUES ('6ef08222-e565-4b21-9b33-8bb0ccddeeff', '68973614-94db-4f98-9729-0712e0c5c0fa', '2915dd6e-8c44-4355-8f1b-f7c8c8b0f48d', NULL, 'faecdb32-9123-480a-8a72-7d75b83857c5', '6ef08112-e365-4a11-9b23-8f901a2b3c4d', 'MENTION', 'READ', 'Iara mentioned you in Passion Projects', '2025-09-22T07:45:00Z', '2025-09-22T07:50:00Z');

// ...existing code...

-- Add calendar for Jennifer (and other users)
INSERT INTO calendars (id, owner_id, default_timezone, default_reminder_minutes) VALUES ('11111111-1111-1111-1111-111111111111', '68973614-94db-4f98-9729-0712e0c5c0fa', 'America/New_York', 15);

INSERT INTO calendars (id, owner_id, default_timezone, default_reminder_minutes) VALUES ('22222222-2222-2222-2222-222222222222', 'ae2d64e5-d825-49fc-91bb-f530be88ca84', 'America/New_York', 15);

INSERT INTO calendars (id, owner_id, default_timezone, default_reminder_minutes) VALUES ('33333333-3333-3333-3333-333333333333', 'e47beacf-c098-4286-b417-3d45c94bd968', 'America/New_York', 15);

INSERT INTO calendars (id, owner_id, default_timezone, default_reminder_minutes) VALUES ('44444444-4444-4444-4444-444444444444', '0d9d27d6-8977-46d8-b00a-2464a932aafe', 'America/New_York', 15);

INSERT INTO calendars (id, owner_id, default_timezone, default_reminder_minutes) VALUES ('55555555-5555-5555-5555-555555555555', 'cc58e483-1807-4ab2-83ce-fb2336da1cfd', 'America/New_York', 15);

INSERT INTO calendars (id, owner_id, default_timezone, default_reminder_minutes) VALUES ('66666666-6666-6666-6666-666666666666', '0c862291-6d43-47fc-8682-ae358658a5e4', 'America/New_York', 15);

INSERT INTO calendars (id, owner_id, default_timezone, default_reminder_minutes) VALUES ('77777777-7777-7777-7777-777777777777', '2915dd6e-8c44-4355-8f1b-f7c8c8b0f48d', 'America/New_York', 15);

INSERT INTO calendars (id, owner_id, default_timezone, default_reminder_minutes) VALUES ('88888888-8888-8888-8888-888888888888', '927bb721-e8e5-41a7-9a4a-d04201713d45', 'America/New_York', 15);

INSERT INTO calendars (id, owner_id, default_timezone, default_reminder_minutes) VALUES ('99999999-9999-9999-9999-999999999999', 'fff673d0-c4be-49fc-8342-6554a25d19ee', 'America/New_York', 15);

INSERT INTO calendars (id, owner_id, default_timezone, default_reminder_minutes) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '3be336ff-fa43-4f51-baab-0f05457184ef', 'America/New_York', 15);

-- Add some sample calendar events
INSERT INTO calendar_events (id, calendar_id, title, description, start_time, end_time, all_day, location, event_type, reminder_minutes) VALUES ('event001-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Daily Standup', 'Team standup meeting', '2025-09-23T14:00:00Z', '2025-09-23T14:30:00Z', false, 'Conference Room A', 'MEETING', 10);

INSERT INTO calendar_events (id, calendar_id, title, description, start_time, end_time, all_day, location, event_type, reminder_minutes) VALUES ('event002-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Spring Boot Lab', 'Lab session on JPA relationships', '2025-09-24T18:00:00Z', '2025-09-24T21:00:00Z', false, 'Classroom 101', 'CLASS', 15);

INSERT INTO calendar_events (id, calendar_id, title, description, start_time, end_time, all_day, location, event_type, reminder_minutes) VALUES ('event003-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Demo Day Prep', 'Prepare presentation for demo day', '2025-09-25T19:00:00Z', '2025-09-25T20:30:00Z', false, 'Study Room B', 'TASK', 30);