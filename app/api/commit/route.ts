import { NextRequest, NextResponse } from "next/server";
import { commitAllChanges } from "@/lib/git-backend";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { message?: string };
    const result = commitAllChanges(body.message ?? "");
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido al guardar cambios.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
