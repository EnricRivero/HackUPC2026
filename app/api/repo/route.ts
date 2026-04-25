import { NextResponse } from "next/server";
import { readRepositoryState } from "@/lib/git-backend";

export async function GET() {
  try {
    const repository = readRepositoryState();
    return NextResponse.json({ repository });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "No se pudo leer el repositorio",
      },
      { status: 500 },
    );
  }
}
