import { hashPassword } from "../utils/crypto";
import { db } from "./index";
import { users } from "./schema";
import { eq } from "drizzle-orm";
import { addYears } from "date-fns";

async function seed() {
    console.log("🌱 Starting seeding process...");

    const user = {
        username: "marian",
        email: "marian@slapshot.club",
        password: "silneheslo123",
    }

    try {
        const existingAdmin = await db.query.users.findFirst({
            where: eq(users.username, user.username)
        });

        if (existingAdmin) {
            console.log("ℹ️ Superadmin already exists. Skipping creation.");
            process.exit(0);
        }

        console.log("🔐 Hashing password...");
        const hashedPassword = await hashPassword(user.password);

        await db.transaction(async (tx) => {
            console.log("👤 Creating superadmin user...");
            await tx.insert(users).values({
                username: user.username,
                email: user.email,
                password: hashedPassword,

                lastActivity: new Date().toISOString(),

                role: "admin",

                subscriptionPlan: "pro",
                subscriptionActiveUntil: addYears(new Date(), 50).toISOString(),

                isActive: true,

                verifiedAt: new Date().toISOString(),
            }).onConflictDoNothing();
        });

        console.log("✅ Seeding completed successfully!");
    } catch (error) {
        console.error("❌ Seeding error:", error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

seed();