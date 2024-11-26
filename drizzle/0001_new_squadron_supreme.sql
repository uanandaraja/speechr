CREATE TABLE `generated_audio` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`generated_audio_url` text,
	`generated_audio_text` text NOT NULL,
	`voice_id` text NOT NULL,
	`status` text NOT NULL,
	`created_at` integer NOT NULL,
	`delete_at` integer,
	`num_of_characters` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`voice_id`) REFERENCES `voice`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `queue` (
	`id` text PRIMARY KEY NOT NULL,
	`generated_audio_id` text NOT NULL,
	`priority` integer NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`max_attempts` integer DEFAULT 3 NOT NULL,
	`status` text NOT NULL,
	`error_message` text,
	`started_at` integer,
	`completed_at` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`generated_audio_id`) REFERENCES `generated_audio`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `voice` (
	`id` text PRIMARY KEY NOT NULL,
	`voice_name` text NOT NULL,
	`voice_audio_url` text NOT NULL,
	`voice_reference_text` text NOT NULL
);
