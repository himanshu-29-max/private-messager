import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/db";
import * as argon2 from "argon2";

export async function POST(req: NextRequest) {
  try {
    const { name, pin, creatorUuid } = await req.json();

    if (!name || !pin || !creatorUuid) {
      return NextResponse.json({ error: "Name, PIN, and Creator UUID are required." }, { status: 400 });
    }

    // Hash the PIN using Argon2id
    const pinHash = await argon2.hash(pin, {
      type: argon2.argon2id,
      memoryCost: 65536, // 64 MB
      timeCost: 3,
      parallelism: 4,
    });

    // Create the room
    const room = await prisma.room.create({
      data: {
        name,
        pin_hash: pinHash,
        members: {
          create: {
            user_uuid: creatorUuid,
            role: "admin",
          }
        }
      },
      select: {
        id: true,
        name: true,
        created_at: true,
      }
    });

    return NextResponse.json({ success: true, room }, { status: 201 });

  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
