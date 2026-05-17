ALTER TABLE `guides` ADD `prerequisites` text DEFAULT '[]';
--> statement-breakpoint
ALTER TABLE `guides` ADD `related_guide_slugs` text DEFAULT '[]';
--> statement-breakpoint
ALTER TABLE `guides` ADD `related_contact_ids` text DEFAULT '[]';
--> statement-breakpoint
ALTER TABLE `guides` ADD `last_reviewed_at` text;
