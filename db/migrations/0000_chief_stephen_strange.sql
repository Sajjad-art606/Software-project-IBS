CREATE TABLE `contacts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`department` text,
	`email` text,
	`phone` text,
	`office_location` text,
	`office_hours` text,
	`tags` text DEFAULT '[]',
	`relevant_semesters` text DEFAULT '[]'
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`file_url` text,
	`category` text NOT NULL,
	`file_type` text DEFAULT 'pdf',
	`tags` text DEFAULT '[]',
	`relevant_semesters` text DEFAULT '[]',
	`updated_at` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
CREATE TABLE `guides` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`category` text NOT NULL,
	`steps` text NOT NULL,
	`tags` text DEFAULT '[]',
	`relevant_semesters` text DEFAULT '[]',
	`estimated_time` text,
	`created_at` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `guides_slug_unique` ON `guides` (`slug`);--> statement-breakpoint
CREATE TABLE `international_info` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`category` text NOT NULL,
	`description` text NOT NULL,
	`content` text NOT NULL,
	`tags` text DEFAULT '[]',
	`sort_order` integer DEFAULT 0
);
--> statement-breakpoint
CREATE UNIQUE INDEX `international_info_slug_unique` ON `international_info` (`slug`);--> statement-breakpoint
CREATE TABLE `platform_links` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`short_name` text,
	`description` text NOT NULL,
	`url` text NOT NULL,
	`category` text NOT NULL,
	`icon_name` text,
	`tags` text DEFAULT '[]',
	`sort_order` integer DEFAULT 0
);
