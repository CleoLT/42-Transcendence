CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) UNIQUE,
  `email` VARCHAR(255) UNIQUE,
  `password` VARCHAR(255),
  `alias` VARCHAR(255) UNIQUE,
  `bio` TEXT,
  `avatar` TEXT,
  `online_status` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `playing_time` INT DEFAULT 0,
  PRIMARY KEY (`id`)
);
