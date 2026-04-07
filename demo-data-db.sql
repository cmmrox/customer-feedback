-- Demo dashboard data for Customer Feedback System
-- Purpose: populate 3 months of realistic feedback data for reporting/demo use.
-- Safe usage: this script clears feedback-related tables only, then recreates demo feedback records.
-- Prerequisites: base seed data must already exist in users/staff/categories/dissatisfaction_reasons/system_config.

START TRANSACTION;

-- Resolve seeded staff IDs by name
SET @staff_hansi := (SELECT id FROM staff WHERE name = 'J.M. Hansi Sandamini Bhagya' LIMIT 1);
SET @staff_prasanna := (SELECT id FROM staff WHERE name = 'Prasanna Walukumara' LIMIT 1);
SET @staff_swetha := (SELECT id FROM staff WHERE name = 'C. Swetha Gimhani Fonseka' LIMIT 1);
SET @staff_kishan := (SELECT id FROM staff WHERE name = 'V. Kishan' LIMIT 1);
SET @staff_devika := (SELECT id FROM staff WHERE name = 'M.S. Devika' LIMIT 1);
SET @staff_rajamani := (SELECT id FROM staff WHERE name = 'Rengiah Rajamani' LIMIT 1);
SET @staff_padmini := (SELECT id FROM staff WHERE name = 'Padmini Susantha Munsinghe' LIMIT 1);
SET @staff_dhilakshika := (SELECT id FROM staff WHERE name = 'M. Dhilakshika' LIMIT 1);

-- Resolve dissatisfaction reason IDs by description
SET @reason_wait := (SELECT id FROM dissatisfaction_reasons WHERE description = 'Long waiting time' LIMIT 1);
SET @reason_unfriendly := (SELECT id FROM dissatisfaction_reasons WHERE description = 'Unfriendly staff' LIMIT 1);
SET @reason_unavailable := (SELECT id FROM dissatisfaction_reasons WHERE description = 'Product not available' LIMIT 1);
SET @reason_prices := (SELECT id FROM dissatisfaction_reasons WHERE description = 'High prices' LIMIT 1);
SET @reason_quality := (SELECT id FROM dissatisfaction_reasons WHERE description = 'Poor quality products' LIMIT 1);

-- Fail-fast visibility checks (should all return ok)
SELECT IF(@staff_hansi IS NULL, CONCAT('MISSING REQUIRED LOOKUP: staff_hansi'), 'ok') AS check_staff_hansi;
SELECT IF(@staff_prasanna IS NULL, CONCAT('MISSING REQUIRED LOOKUP: staff_prasanna'), 'ok') AS check_staff_prasanna;
SELECT IF(@staff_swetha IS NULL, CONCAT('MISSING REQUIRED LOOKUP: staff_swetha'), 'ok') AS check_staff_swetha;
SELECT IF(@staff_kishan IS NULL, CONCAT('MISSING REQUIRED LOOKUP: staff_kishan'), 'ok') AS check_staff_kishan;
SELECT IF(@staff_devika IS NULL, CONCAT('MISSING REQUIRED LOOKUP: staff_devika'), 'ok') AS check_staff_devika;
SELECT IF(@staff_rajamani IS NULL, CONCAT('MISSING REQUIRED LOOKUP: staff_rajamani'), 'ok') AS check_staff_rajamani;
SELECT IF(@staff_padmini IS NULL, CONCAT('MISSING REQUIRED LOOKUP: staff_padmini'), 'ok') AS check_staff_padmini;
SELECT IF(@staff_dhilakshika IS NULL, CONCAT('MISSING REQUIRED LOOKUP: staff_dhilakshika'), 'ok') AS check_staff_dhilakshika;
SELECT IF(@reason_wait IS NULL, CONCAT('MISSING REQUIRED LOOKUP: reason_wait'), 'ok') AS check_reason_wait;
SELECT IF(@reason_unfriendly IS NULL, CONCAT('MISSING REQUIRED LOOKUP: reason_unfriendly'), 'ok') AS check_reason_unfriendly;
SELECT IF(@reason_unavailable IS NULL, CONCAT('MISSING REQUIRED LOOKUP: reason_unavailable'), 'ok') AS check_reason_unavailable;
SELECT IF(@reason_prices IS NULL, CONCAT('MISSING REQUIRED LOOKUP: reason_prices'), 'ok') AS check_reason_prices;
SELECT IF(@reason_quality IS NULL, CONCAT('MISSING REQUIRED LOOKUP: reason_quality'), 'ok') AS check_reason_quality;

-- Clear only feedback-related dashboard data
DELETE FROM feedback_reasons;
DELETE FROM feedback_staff;
DELETE FROM feedback;

-- 2026-02 demo data
SET @feedback_1 := REPLACE(UUID(), '-', '');
SET @link_1 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_1, '2026-02-03 09:12:00', 'GOOD', NULL);
INSERT INTO feedback_staff (id, feedbackId, staffId, createdAt) VALUES (@link_1, @feedback_1, @staff_hansi, '2026-02-03 09:12:00');

SET @feedback_2 := REPLACE(UUID(), '-', '');
SET @link_2 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_2, '2026-02-04 10:05:00', 'GOOD', NULL);
INSERT INTO feedback_staff (id, feedbackId, staffId, createdAt) VALUES (@link_2, @feedback_2, @staff_prasanna, '2026-02-04 10:05:00');

SET @feedback_3 := REPLACE(UUID(), '-', '');
SET @link_3 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_3, '2026-02-05 11:18:00', 'GOOD', NULL);
INSERT INTO feedback_staff (id, feedbackId, staffId, createdAt) VALUES (@link_3, @feedback_3, @staff_swetha, '2026-02-05 11:18:00');

SET @feedback_4 := REPLACE(UUID(), '-', '');
SET @link_4 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_4, '2026-02-06 12:24:00', 'GOOD', NULL);
INSERT INTO feedback_staff (id, feedbackId, staffId, createdAt) VALUES (@link_4, @feedback_4, @staff_kishan, '2026-02-06 12:24:00');

SET @feedback_5 := REPLACE(UUID(), '-', '');
SET @link_5 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_5, '2026-02-08 13:10:00', 'GOOD', NULL);
INSERT INTO feedback_staff (id, feedbackId, staffId, createdAt) VALUES (@link_5, @feedback_5, @staff_devika, '2026-02-08 13:10:00');

SET @feedback_6 := REPLACE(UUID(), '-', '');
SET @link_6 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_6, '2026-02-09 14:42:00', 'GOOD', NULL);
INSERT INTO feedback_staff (id, feedbackId, staffId, createdAt) VALUES (@link_6, @feedback_6, @staff_rajamani, '2026-02-09 14:42:00');

SET @feedback_7 := REPLACE(UUID(), '-', '');
SET @link_7 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_7, '2026-02-10 15:06:00', 'GOOD', NULL);
INSERT INTO feedback_staff (id, feedbackId, staffId, createdAt) VALUES (@link_7, @feedback_7, @staff_padmini, '2026-02-10 15:06:00');

SET @feedback_8 := REPLACE(UUID(), '-', '');
SET @link_8 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_8, '2026-02-12 16:31:00', 'GOOD', NULL);
INSERT INTO feedback_staff (id, feedbackId, staffId, createdAt) VALUES (@link_8, @feedback_8, @staff_dhilakshika, '2026-02-12 16:31:00');

SET @feedback_9 := REPLACE(UUID(), '-', '');
SET @link_9 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_9, '2026-02-14 17:10:00', 'GOOD', NULL);
INSERT INTO feedback_staff (id, feedbackId, staffId, createdAt) VALUES (@link_9, @feedback_9, @staff_hansi, '2026-02-14 17:10:00');

SET @feedback_10 := REPLACE(UUID(), '-', '');
SET @link_10 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_10, '2026-02-16 09:50:00', 'GOOD', NULL);
INSERT INTO feedback_staff (id, feedbackId, staffId, createdAt) VALUES (@link_10, @feedback_10, @staff_prasanna, '2026-02-16 09:50:00');

SET @feedback_11 := REPLACE(UUID(), '-', '');
SET @link_11 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_11, '2026-02-18 10:37:00', 'GOOD', NULL);
INSERT INTO feedback_staff (id, feedbackId, staffId, createdAt) VALUES (@link_11, @feedback_11, @staff_swetha, '2026-02-18 10:37:00');

SET @feedback_12 := REPLACE(UUID(), '-', '');
SET @link_12 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_12, '2026-02-19 11:15:00', 'NOT_SATISFIED', NULL);
INSERT INTO feedback_reasons (id, feedbackId, reasonId, createdAt) VALUES (@link_12, @feedback_12, @reason_wait, '2026-02-19 11:15:00');

SET @feedback_13 := REPLACE(UUID(), '-', '');
SET @link_13 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_13, '2026-02-22 12:22:00', 'NOT_SATISFIED', NULL);
INSERT INTO feedback_reasons (id, feedbackId, reasonId, createdAt) VALUES (@link_13, @feedback_13, @reason_unavailable, '2026-02-22 12:22:00');

SET @feedback_14 := REPLACE(UUID(), '-', '');
SET @link_14 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_14, '2026-02-25 15:48:00', 'NOT_SATISFIED', NULL);
INSERT INTO feedback_reasons (id, feedbackId, reasonId, createdAt) VALUES (@link_14, @feedback_14, @reason_prices, '2026-02-25 15:48:00');

-- 2026-03 demo data
SET @feedback_15 := REPLACE(UUID(), '-', '');
SET @link_15 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_15, '2026-03-02 09:05:00', 'GOOD', NULL);
INSERT INTO feedback_staff (id, feedbackId, staffId, createdAt) VALUES (@link_15, @feedback_15, @staff_hansi, '2026-03-02 09:05:00');

SET @feedback_16 := REPLACE(UUID(), '-', '');
SET @link_16 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_16, '2026-03-03 10:20:00', 'GOOD', NULL);
INSERT INTO feedback_staff (id, feedbackId, staffId, createdAt) VALUES (@link_16, @feedback_16, @staff_prasanna, '2026-03-03 10:20:00');

SET @feedback_17 := REPLACE(UUID(), '-', '');
SET @link_17 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_17, '2026-03-05 11:45:00', 'GOOD', NULL);
INSERT INTO feedback_staff (id, feedbackId, staffId, createdAt) VALUES (@link_17, @feedback_17, @staff_prasanna, '2026-03-05 11:45:00');

SET @feedback_18 := REPLACE(UUID(), '-', '');
SET @link_18 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_18, '2026-03-07 12:10:00', 'GOOD', NULL);
INSERT INTO feedback_staff (id, feedbackId, staffId, createdAt) VALUES (@link_18, @feedback_18, @staff_swetha, '2026-03-07 12:10:00');

SET @feedback_19 := REPLACE(UUID(), '-', '');
SET @link_19 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_19, '2026-03-09 13:35:00', 'GOOD', NULL);
INSERT INTO feedback_staff (id, feedbackId, staffId, createdAt) VALUES (@link_19, @feedback_19, @staff_kishan, '2026-03-09 13:35:00');

SET @feedback_20 := REPLACE(UUID(), '-', '');
SET @link_20 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_20, '2026-03-10 14:12:00', 'GOOD', NULL);
INSERT INTO feedback_staff (id, feedbackId, staffId, createdAt) VALUES (@link_20, @feedback_20, @staff_devika, '2026-03-10 14:12:00');

SET @feedback_21 := REPLACE(UUID(), '-', '');
SET @link_21 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_21, '2026-03-12 16:05:00', 'GOOD', NULL);
INSERT INTO feedback_staff (id, feedbackId, staffId, createdAt) VALUES (@link_21, @feedback_21, @staff_rajamani, '2026-03-12 16:05:00');

SET @feedback_22 := REPLACE(UUID(), '-', '');
SET @link_22 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_22, '2026-03-15 17:20:00', 'GOOD', NULL);
INSERT INTO feedback_staff (id, feedbackId, staffId, createdAt) VALUES (@link_22, @feedback_22, @staff_padmini, '2026-03-15 17:20:00');

SET @feedback_23 := REPLACE(UUID(), '-', '');
SET @link_23 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_23, '2026-03-18 09:16:00', 'GOOD', NULL);
INSERT INTO feedback_staff (id, feedbackId, staffId, createdAt) VALUES (@link_23, @feedback_23, @staff_dhilakshika, '2026-03-18 09:16:00');

SET @feedback_24 := REPLACE(UUID(), '-', '');
SET @link_24 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_24, '2026-03-20 10:42:00', 'GOOD', NULL);
INSERT INTO feedback_staff (id, feedbackId, staffId, createdAt) VALUES (@link_24, @feedback_24, @staff_hansi, '2026-03-20 10:42:00');

SET @feedback_25 := REPLACE(UUID(), '-', '');
SET @link_25 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_25, '2026-03-21 12:28:00', 'GOOD', NULL);
INSERT INTO feedback_staff (id, feedbackId, staffId, createdAt) VALUES (@link_25, @feedback_25, @staff_kishan, '2026-03-21 12:28:00');

SET @feedback_26 := REPLACE(UUID(), '-', '');
SET @link_26 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_26, '2026-03-24 15:40:00', 'GOOD', NULL);
INSERT INTO feedback_staff (id, feedbackId, staffId, createdAt) VALUES (@link_26, @feedback_26, @staff_devika, '2026-03-24 15:40:00');

SET @feedback_27 := REPLACE(UUID(), '-', '');
SET @link_27 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_27, '2026-03-11 11:08:00', 'NOT_SATISFIED', NULL);
INSERT INTO feedback_reasons (id, feedbackId, reasonId, createdAt) VALUES (@link_27, @feedback_27, @reason_wait, '2026-03-11 11:08:00');

SET @feedback_28 := REPLACE(UUID(), '-', '');
SET @link_28 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_28, '2026-03-19 14:55:00', 'NOT_SATISFIED', NULL);
INSERT INTO feedback_reasons (id, feedbackId, reasonId, createdAt) VALUES (@link_28, @feedback_28, @reason_unfriendly, '2026-03-19 14:55:00');

SET @feedback_29 := REPLACE(UUID(), '-', '');
SET @link_29 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_29, '2026-03-26 16:10:00', 'NOT_SATISFIED', NULL);
INSERT INTO feedback_reasons (id, feedbackId, reasonId, createdAt) VALUES (@link_29, @feedback_29, @reason_unavailable, '2026-03-26 16:10:00');

-- 2026-04 demo data
SET @feedback_30 := REPLACE(UUID(), '-', '');
SET @link_30 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_30, '2026-04-01 09:00:00', 'GOOD', NULL);
INSERT INTO feedback_staff (id, feedbackId, staffId, createdAt) VALUES (@link_30, @feedback_30, @staff_hansi, '2026-04-01 09:00:00');

SET @feedback_31 := REPLACE(UUID(), '-', '');
SET @link_31 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_31, '2026-04-02 10:18:00', 'GOOD', NULL);
INSERT INTO feedback_staff (id, feedbackId, staffId, createdAt) VALUES (@link_31, @feedback_31, @staff_hansi, '2026-04-02 10:18:00');

SET @feedback_32 := REPLACE(UUID(), '-', '');
SET @link_32 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_32, '2026-04-04 11:40:00', 'GOOD', NULL);
INSERT INTO feedback_staff (id, feedbackId, staffId, createdAt) VALUES (@link_32, @feedback_32, @staff_prasanna, '2026-04-04 11:40:00');

SET @feedback_33 := REPLACE(UUID(), '-', '');
SET @link_33 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_33, '2026-04-05 12:30:00', 'GOOD', NULL);
INSERT INTO feedback_staff (id, feedbackId, staffId, createdAt) VALUES (@link_33, @feedback_33, @staff_swetha, '2026-04-05 12:30:00');

SET @feedback_34 := REPLACE(UUID(), '-', '');
SET @link_34 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_34, '2026-04-06 13:15:00', 'GOOD', NULL);
INSERT INTO feedback_staff (id, feedbackId, staffId, createdAt) VALUES (@link_34, @feedback_34, @staff_swetha, '2026-04-06 13:15:00');

SET @feedback_35 := REPLACE(UUID(), '-', '');
SET @link_35 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_35, '2026-04-08 14:45:00', 'GOOD', NULL);
INSERT INTO feedback_staff (id, feedbackId, staffId, createdAt) VALUES (@link_35, @feedback_35, @staff_kishan, '2026-04-08 14:45:00');

SET @feedback_36 := REPLACE(UUID(), '-', '');
SET @link_36 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_36, '2026-04-10 15:10:00', 'GOOD', NULL);
INSERT INTO feedback_staff (id, feedbackId, staffId, createdAt) VALUES (@link_36, @feedback_36, @staff_devika, '2026-04-10 15:10:00');

SET @feedback_37 := REPLACE(UUID(), '-', '');
SET @link_37 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_37, '2026-04-12 16:35:00', 'GOOD', NULL);
INSERT INTO feedback_staff (id, feedbackId, staffId, createdAt) VALUES (@link_37, @feedback_37, @staff_rajamani, '2026-04-12 16:35:00');

SET @feedback_38 := REPLACE(UUID(), '-', '');
SET @link_38 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_38, '2026-04-14 17:22:00', 'GOOD', NULL);
INSERT INTO feedback_staff (id, feedbackId, staffId, createdAt) VALUES (@link_38, @feedback_38, @staff_padmini, '2026-04-14 17:22:00');

SET @feedback_39 := REPLACE(UUID(), '-', '');
SET @link_39 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_39, '2026-04-16 09:48:00', 'GOOD', NULL);
INSERT INTO feedback_staff (id, feedbackId, staffId, createdAt) VALUES (@link_39, @feedback_39, @staff_dhilakshika, '2026-04-16 09:48:00');

SET @feedback_40 := REPLACE(UUID(), '-', '');
SET @link_40 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_40, '2026-04-18 10:12:00', 'GOOD', NULL);
INSERT INTO feedback_staff (id, feedbackId, staffId, createdAt) VALUES (@link_40, @feedback_40, @staff_prasanna, '2026-04-18 10:12:00');

SET @feedback_41 := REPLACE(UUID(), '-', '');
SET @link_41 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_41, '2026-04-20 11:26:00', 'GOOD', NULL);
INSERT INTO feedback_staff (id, feedbackId, staffId, createdAt) VALUES (@link_41, @feedback_41, @staff_hansi, '2026-04-20 11:26:00');

SET @feedback_42 := REPLACE(UUID(), '-', '');
SET @link_42 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_42, '2026-04-22 12:49:00', 'GOOD', NULL);
INSERT INTO feedback_staff (id, feedbackId, staffId, createdAt) VALUES (@link_42, @feedback_42, @staff_kishan, '2026-04-22 12:49:00');

SET @feedback_43 := REPLACE(UUID(), '-', '');
SET @link_43 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_43, '2026-04-09 11:05:00', 'NOT_SATISFIED', NULL);
INSERT INTO feedback_reasons (id, feedbackId, reasonId, createdAt) VALUES (@link_43, @feedback_43, @reason_wait, '2026-04-09 11:05:00');

SET @feedback_44 := REPLACE(UUID(), '-', '');
SET @link_44 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_44, '2026-04-17 14:30:00', 'NOT_SATISFIED', NULL);
INSERT INTO feedback_reasons (id, feedbackId, reasonId, createdAt) VALUES (@link_44, @feedback_44, @reason_prices, '2026-04-17 14:30:00');

SET @feedback_45 := REPLACE(UUID(), '-', '');
SET @link_45 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_45, '2026-04-23 16:00:00', 'NOT_SATISFIED', NULL);
INSERT INTO feedback_reasons (id, feedbackId, reasonId, createdAt) VALUES (@link_45, @feedback_45, @reason_quality, '2026-04-23 16:00:00');

SET @feedback_46 := REPLACE(UUID(), '-', '');
SET @link_46 := REPLACE(UUID(), '-', '');
INSERT INTO feedback (id, timestamp, overallRating, comments) VALUES (@feedback_46, '2026-04-27 17:10:00', 'NOT_SATISFIED', NULL);
INSERT INTO feedback_reasons (id, feedbackId, reasonId, createdAt) VALUES (@link_46, @feedback_46, @reason_wait, '2026-04-27 17:10:00');

COMMIT;

-- Expected reporting shape after import (approximate)
-- February 2026: 11 GOOD / 3 NOT_SATISFIED
-- March 2026:    12 GOOD / 3 NOT_SATISFIED
-- April 2026:    13 GOOD / 4 NOT_SATISFIED
-- Total inserted feedback rows: 46
