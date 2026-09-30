-- =========================================================
-- Sujhav Peti schema
-- Cleaned for import via phpMyAdmin / mysql CLI
-- =========================================================

-- -----------------------------------------------------
-- Table users
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  uid INT AUTO_INCREMENT PRIMARY KEY,
  fname VARCHAR(255) NOT NULL,
  lname VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role ENUM('admin', 'citizen') NOT NULL DEFAULT 'citizen',
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NULL DEFAULT NULL,
  updated_at TIMESTAMP NULL DEFAULT NULL,
  UNIQUE KEY email_UNIQUE (email)
) ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table news
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS news (
  nid INT AUTO_INCREMENT PRIMARY KEY,
  uid INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(255) NULL,
  author VARCHAR(255) NULL,
  excerpt VARCHAR(500) NULL,
  content LONGTEXT NOT NULL,
  status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
  published_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT NULL,
  updated_at TIMESTAMP NULL DEFAULT NULL,
  CONSTRAINT fk_news_users
    FOREIGN KEY (uid)
    REFERENCES users (uid)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table comments
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS comments (
  cid INT AUTO_INCREMENT PRIMARY KEY,
  nid INT NOT NULL,
  uid INT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP NULL DEFAULT NULL,
  CONSTRAINT fk_comments_news
    FOREIGN KEY (nid)
    REFERENCES news (nid)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_comments_users
    FOREIGN KEY (uid)
    REFERENCES users (uid)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
