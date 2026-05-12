CREATE TABLE "shortened_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"short_code" text NOT NULL,
	"original_url" text NOT NULL,
	"title" text,
	"description" text,
	"metadata" json,
	"qr_code" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "shortened_links" ADD CONSTRAINT "shortened_links_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "shortened_links_short_code_idx" ON "shortened_links" USING btree ("short_code");--> statement-breakpoint
CREATE INDEX "shortened_links_user_id_idx" ON "shortened_links" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");