CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`email` text,
	`avatar` text,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
ALTER TABLE `todo` ADD `userId` text NOT NULL REFERENCES user(id);--> statement-breakpoint
CREATE INDEX `todo_userId_idx` ON `todo` (`userId`);