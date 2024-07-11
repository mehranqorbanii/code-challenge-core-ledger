CREATE SCHEMA "user";
--> statement-breakpoint
CREATE SCHEMA "account";
--> statement-breakpoint
CREATE SCHEMA "fee";
--> statement-breakpoint
CREATE SCHEMA "transaction";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user"."users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"firstName" varchar,
	"lastName" varchar,
	"updatedAt" timestamp NOT NULL,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account"."accounts" (
	"id" varchar PRIMARY KEY NOT NULL,
	"userId" varchar NOT NULL,
	"currency" varchar NOT NULL,
	"balance" numeric DEFAULT '0' NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "accounts_userId_currency_unique" UNIQUE("userId","currency")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fee"."fees" (
	"id" varchar PRIMARY KEY NOT NULL,
	"currency" varchar NOT NULL,
	"unit" varchar NOT NULL,
	"amount" numeric NOT NULL,
	"type" varchar NOT NULL,
	CONSTRAINT "fees_currency_unique" UNIQUE("currency")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transaction"."transactions" (
	"id" varchar PRIMARY KEY NOT NULL,
	"accountId" varchar NOT NULL,
	"type" varchar NOT NULL,
	"amount" numeric NOT NULL,
	"fee" numeric NOT NULL,
	"description" varchar,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "userId_idx" ON "account"."accounts" ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "currency_idx" ON "account"."accounts" ("currency");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "currency_idx" ON "fee"."fees" ("currency");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "accountId_idx" ON "transaction"."transactions" ("accountId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "createdAt_idx" ON "transaction"."transactions" ("createdAt");