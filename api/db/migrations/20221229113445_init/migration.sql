-- CreateEnum
CREATE TYPE "user_status" AS ENUM ('ONLINE', 'OFFLINE');

-- CreateEnum
CREATE TYPE "permission" AS ENUM ('basespot:delete', 'basespot:create', 'basespot:update', 'basespot:view', 'role:create', 'role:update', 'role:delete', 'user:create', 'user:update', 'user:delete', 'tribe:create', 'tribe:update', 'tribe:delete');

-- CreateTable
CREATE TABLE "basespot" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Map" TEXT NOT NULL DEFAULT 'TheIsland',
    "estimatedForPlayers" TEXT DEFAULT '0',
    "defenseImages" TEXT[],
    "createdBy" UUID,
    "turretsetup_image" TEXT,
    "updatedAt" TIMESTAMPTZ(6),

    CONSTRAINT "basespot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tribe" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" UUID,
    "updatedBy" UUID DEFAULT auth.uid(),

    CONSTRAINT "tribe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6),
    "username" TEXT,
    "full_name" TEXT,
    "avatar_url" TEXT,
    "website" TEXT,
    "biography" TEXT,
    "status" "user_status" NOT NULL DEFAULT 'OFFLINE',
    "role_id" UUID NOT NULL DEFAULT '697b7d70-bab3-4ff9-9c3e-f30b058b621c'::uuid,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "createdBy" UUID DEFAULT auth.uid(),
    "permissions" "permission"[],

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timeline" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "createdBy" UUID,

    CONSTRAINT "timeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timeline_basespots" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "timeline_id" UUID NOT NULL,
    "startDate" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "basespotID" INTEGER,
    "tribeName" TEXT NOT NULL,
    "map" TEXT,
    "server" TEXT,
    "region" TEXT,
    "season" TEXT,
    "cluster" TEXT,
    "location" JSON,
    "players" TEXT[],
    "created_by" UUID,

    CONSTRAINT "timeline_basespots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_username_key" ON "profiles"("username");

-- CreateIndex
CREATE UNIQUE INDEX "timeline_id_key" ON "timeline"("id");

-- AddForeignKey
ALTER TABLE "basespot" ADD CONSTRAINT "basespot_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tribe" ADD CONSTRAINT "tribe_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tribe" ADD CONSTRAINT "tribe_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "timeline" ADD CONSTRAINT "timeline_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "timeline_basespots" ADD CONSTRAINT "timeline_basespots_basespotID_fkey" FOREIGN KEY ("basespotID") REFERENCES "basespot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "timeline_basespots" ADD CONSTRAINT "timeline_basespots_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "timeline_basespots" ADD CONSTRAINT "timeline_basespots_timeline_id_fkey" FOREIGN KEY ("timeline_id") REFERENCES "timeline"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
