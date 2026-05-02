import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import * as argon2 from "argon2";

export async function POST(req: NextRequest) {
  try {
    const { roomId, pin } = await req.json();

    if (!roomId || !pin) {
      return NextResponse.json({ error: "Room ID and PIN are required." }, { status: 400 });
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found." }, { status: 404 });
    }

    // Verify the PIN
    const isValid = await argon2.verify(room.pin_hash, pin);

    if (isValid) {
      // Reset failed entries on successful login
      if (room.failed_entries > 0) {
        await prisma.room.update({
          where: { id: roomId },
          data: { failed_entries: 0 },
        });
      }
      return NextResponse.json({ success: true });
    } else {
      // PIN is incorrect, increment failed attempts
      const newFailedCount = room.failed_entries + 1;

      if (newFailedCount >= 5) {
        // 5 strikes! Delete the room permanently.
        await prisma.room.delete({
          where: { id: roomId },
        });
        return NextResponse.json(
          { error: "MAX_ATTEMPTS_REACHED", message: "Room has been permanently deleted due to security protocol." },
          { status: 403 }
        );
      } else {
        // Update failed count
        await prisma.room.update({
          where: { id: roomId },
          data: { failed_entries: newFailedCount },
        });
        return NextResponse.json(
          { error: "INVALID_PIN", attemptsRemaining: 5 - newFailedCount },
          { status: 401 }
        );
      }
    }
  } catch (error) {
    console.error("Error verifying room PIN:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
