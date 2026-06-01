ALTER TABLE "User" ADD COLUMN "guestToken" TEXT;
CREATE UNIQUE INDEX "User_guestToken_key" ON "User"("guestToken");
