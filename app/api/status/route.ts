import { NextResponse } from "next/server";
import { readRepositoryStatus } from "@/lib/git-backend";

export async function GET() {
  try {
    const status = readRepositoryStatus();
    return NextResponse.json(status);
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo leer el estado del repositorio.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
