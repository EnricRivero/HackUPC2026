import { NextRequest, NextResponse } from "next/server";
import { resetHeadSoft } from "@/lib/git-backend";

export async function POST(_request: NextRequest) {
  try {
    const result = resetHeadSoft();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "No se pudo restaurar el repositorio",
      },
      { status: 500 },
    );
  }
}
