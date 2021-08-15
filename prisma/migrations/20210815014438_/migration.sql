-- CreateTable
CREATE TABLE `artists` (
    `_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `vagalume_id` VARCHAR(191),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `artists.name_unique`(`name`),
    UNIQUE INDEX `artists.vagalume_id_unique`(`vagalume_id`),
    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `praises` (
    `_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `vagalume_id` VARCHAR(191),
    `tone` VARCHAR(191) NOT NULL DEFAULT '?',
    `status` ENUM('APPROVED', 'REHEARSING', 'SUGGESTION') NOT NULL,
    `transpose` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `artist_id` VARCHAR(191) NOT NULL,
    `suggested_by_id` VARCHAR(191),

    UNIQUE INDEX `praises.vagalume_id_unique`(`vagalume_id`),
    UNIQUE INDEX `praises.name_unique`(`name`, `artist_id`),
    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lyrics` (
    `_id` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `praise_id` VARCHAR(191),

    UNIQUE INDEX `lyrics_praise_id_unique`(`praise_id`),
    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tags` (
    `_id` INTEGER NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `tags.label_unique`(`label`),
    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_praises_tags` (
    `A` VARCHAR(191) NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_praises_tags_AB_unique`(`A`, `B`),
    INDEX `_praises_tags_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `praises` ADD FOREIGN KEY (`artist_id`) REFERENCES `artists`(`_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `praises` ADD FOREIGN KEY (`suggested_by_id`) REFERENCES `users`(`_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lyrics` ADD FOREIGN KEY (`praise_id`) REFERENCES `praises`(`_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_praises_tags` ADD FOREIGN KEY (`A`) REFERENCES `praises`(`_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_praises_tags` ADD FOREIGN KEY (`B`) REFERENCES `tags`(`_id`) ON DELETE CASCADE ON UPDATE CASCADE;
