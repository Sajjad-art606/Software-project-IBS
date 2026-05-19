CREATE TABLE `email_verifications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`code` text NOT NULL,
	`semester` integer NOT NULL,
	`name` text,
	`used` integer DEFAULT false,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now'))
);
