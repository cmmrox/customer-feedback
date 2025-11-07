-- CreateIndex
CREATE INDEX `dissatisfaction_reasons_active_categoryId_idx` ON `dissatisfaction_reasons`(`active`, `categoryId`);

-- CreateIndex
CREATE INDEX `feedback_overallRating_timestamp_idx` ON `feedback`(`overallRating`, `timestamp`);

-- CreateIndex
CREATE INDEX `feedback_timestamp_idx` ON `feedback`(`timestamp`);

-- CreateIndex
CREATE INDEX `staff_status_idx` ON `staff`(`status`);

-- CreateIndex
CREATE INDEX `staff_name_idx` ON `staff`(`name`);

-- CreateIndex
CREATE INDEX `users_isActive_idx` ON `users`(`isActive`);

-- RenameIndex
ALTER TABLE `dissatisfaction_reasons` RENAME INDEX `dissatisfaction_reasons_categoryId_fkey` TO `dissatisfaction_reasons_categoryId_idx`;

-- RenameIndex
ALTER TABLE `feedback_reasons` RENAME INDEX `feedback_reasons_reasonId_fkey` TO `feedback_reasons_reasonId_idx`;

-- RenameIndex
ALTER TABLE `feedback_staff` RENAME INDEX `feedback_staff_staffId_fkey` TO `feedback_staff_staffId_idx`;
