CREATE TABLE aifs_version (
 singleton TINYINT NOT NULL PRIMARY KEY CHECK (singleton=1),
 version_number INT NOT NULL CHECK (version_number IN (1,2))
) ENGINE=InnoDB;
CREATE TABLE aifs_activity (
 activity_key VARCHAR(100) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
 subject ENUM('maths','physics','chemistry','biology') NOT NULL,
 kind ENUM('basic','advanced','supplement','prototype') NOT NULL,
 title_en VARCHAR(300) NOT NULL,
 title_hi VARCHAR(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
CREATE TABLE aifs_curriculum (
 board ENUM('CBSE','Maharashtra') NOT NULL,
 grade TINYINT NOT NULL CHECK (grade BETWEEN 1 AND 12),
 subject ENUM('maths','physics','chemistry','biology') NOT NULL,
 proposals INT NOT NULL CHECK (proposals>=0),
 pending_checks INT NOT NULL CHECK (pending_checks>=0),
 mapping_ids JSON NOT NULL,
 PRIMARY KEY(board,grade,subject)
) ENGINE=InnoDB;
CREATE TABLE aifs_plan (
 singleton TINYINT NOT NULL PRIMARY KEY CHECK (singleton=1),
 language ENUM('en','hi') NOT NULL
) ENGINE=InnoDB;
CREATE TABLE aifs_plan_item (
 position TINYINT NOT NULL PRIMARY KEY CHECK (position BETWEEN 1 AND 6),
 activity_key VARCHAR(100) CHARACTER SET ascii COLLATE ascii_bin NOT NULL UNIQUE,
 FOREIGN KEY(activity_key) REFERENCES aifs_activity(activity_key)
) ENGINE=InnoDB;
INSERT INTO aifs_version VALUES(1,1);
INSERT INTO aifs_plan VALUES(1,'en');
