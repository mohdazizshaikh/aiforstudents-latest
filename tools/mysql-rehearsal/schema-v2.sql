ALTER TABLE aifs_activity ADD COLUMN review_state VARCHAR(7) CHARACTER SET ascii COLLATE ascii_bin NOT NULL DEFAULT 'PENDING' CHECK (review_state='PENDING');
