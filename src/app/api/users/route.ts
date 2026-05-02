import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isValidDisplayId, generateRandomDisplayId } from "@/lib/identity";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let displayId = body.displayId;

    if (!displayId) {
      displayId = generateRandomDisplayId();
    } else if (!isValidDisplayId(displayId)) {
      return NextResponse.json(
        { error: "Invalid display ID format. Must start with @ and contain 3-29 alphanumeric characters." },
        { status: 400 }
      );
    }

    // Attempt to create the user
    // Since we don't have authentication yet, this just creates a new identity
    const user = await prisma.user.create({
      data: {
        display_id: displayId,
        id_visibility: body.visibility || "private",
      },
      select: {
        internal_uuid: true,
        display_id: true,
        id_visibility: true,
        created_at: true,
      }
    });

    return NextResponse.json({ success: true, user }, { status: 201 });

  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Display ID already exists." }, { status: 409 });
    }
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const search = searchParams.get('search');

  if (!search || search.length < 3) {
    return NextResponse.json({ error: "Search prefix must be at least 3 characters." }, { status: 400 });
  }

  // Prefix-based search, only returning public users
  try {
    const users = await prisma.user.findMany({
      where: {
        display_id: {
          startsWith: search,
          mode: 'insensitive',
        },
        id_visibility: "public",
      },
      select: {
        display_id: true,
      },
      take: 10,
    });

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
