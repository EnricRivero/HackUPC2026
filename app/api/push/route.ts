import { NextResponse } from "next/server";
import { pushCurrentBranch } from "@/lib/git-backend";

export async function POST() {
  try {
    const result = pushCurrentBranch();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "No se pudo sincronizar con la nube.",
      },
      { status: 500 },
    );
  }
}
