-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_bookings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "staffId" TEXT,
    "bookingDate" TEXT NOT NULL,
    "bookingTime" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "amount" REAL NOT NULL,
    "numberOfPeople" INTEGER NOT NULL DEFAULT 1,
    "cancellationFee" REAL NOT NULL DEFAULT 0,
    "refundAmount" REAL,
    "cancelledAt" DATETIME,
    "cancellationReason" TEXT,
    "stripePaymentIntentId" TEXT,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "customerNotes" TEXT,
    "staffNotes" TEXT,
    "reminderSent" BOOLEAN NOT NULL DEFAULT false,
    "reminderSentAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bookings_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "bookings_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "staff" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_bookings" ("amount", "bookingDate", "bookingTime", "cancellationFee", "cancellationReason", "cancelledAt", "createdAt", "customerNotes", "deletedAt", "id", "paymentStatus", "refundAmount", "reminderSent", "reminderSentAt", "serviceId", "staffId", "staffNotes", "status", "stripePaymentIntentId", "updatedAt", "userId") SELECT "amount", "bookingDate", "bookingTime", "cancellationFee", "cancellationReason", "cancelledAt", "createdAt", "customerNotes", "deletedAt", "id", "paymentStatus", "refundAmount", "reminderSent", "reminderSentAt", "serviceId", "staffId", "staffNotes", "status", "stripePaymentIntentId", "updatedAt", "userId" FROM "bookings";
DROP TABLE "bookings";
ALTER TABLE "new_bookings" RENAME TO "bookings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
