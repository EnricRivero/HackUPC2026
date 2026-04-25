import { NextResponse } from "next/server";
import { checkoutReference } from "@/lib/git-backend";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { target?: string };
    const target = body.target?.trim();

    if (!target) {
      return NextResponse.json({ error: "Debes indicar un destino para checkout." }, { status: 400 });
    }

    const result = checkoutReference(target);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo realizar el checkout.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
