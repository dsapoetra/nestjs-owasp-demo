-- migrations/002-create-credit_cards-table.sql

CREATE TABLE IF NOT EXISTS `credit_cards` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `cc_number` VARCHAR(19) NOT NULL,
  `expiry` CHAR(5) NOT NULL,
  `cvv` CHAR(3) NOT NULL,
  CONSTRAINT `fk_credit_cards_user`
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `credit_cards` (user_id, cc_number, expiry, cvv) VALUES
  (1, '4111111111111111', '12/25', '123'),
  (2, '5555555555554444', '10/24', '999');
