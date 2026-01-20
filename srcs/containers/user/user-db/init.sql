CREATE DATABASE IF NOT EXISTS `transcendance_db`;
USE `transcendance_db`;

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

CREATE TABLE IF NOT EXISTS `friendships` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user1_id` INT NOT NULL,
  `user2_id` INT NOT NULL,

  `user1_accept` TINYINT(1) DEFAULT 0,
  `user2_accept` TINYINT(1) DEFAULT 0,
  `user1_authorization` TINYINT(1) DEFAULT 0,
  `user2_authorization` TINYINT(1) DEFAULT 0,

  PRIMARY KEY (`id`),

  UNIQUE KEY `unique_friendship` (`user1_id`, `user2_id`),

  CONSTRAINT `fk_friendships_user1`
    FOREIGN KEY (`user1_id`)
    REFERENCES `users`(`id`)
    ON DELETE CASCADE,

  CONSTRAINT `fk_friendships_user2`
    FOREIGN KEY (`user2_id`)
    REFERENCES `users`(`id`)
    ON DELETE CASCADE
)ENGINE=InnoDB;

