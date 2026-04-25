import { NextResponse } from "next/server";
import { createBranchAndCheckout } from "@/lib/git-backend";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { name?: string };
    const result = createBranchAndCheckout(body.name ?? "");
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "No pude crear la rama.",
      },
      { status: 400 },
    );
  }
}
