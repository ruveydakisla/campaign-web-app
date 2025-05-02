import { InsertCampaign } from "@/lib/types";
import { requireUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { user, response } = await requireUser();
  if (response) return response;

  try {
    const externalResponse = await fetch("https://music-campaign-backend.onrender.com/api/campaigns", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await externalResponse.json();

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        timestamp: new Date().toISOString(),
        error: error?.message || "Sunucu hatası",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { user, response } = await requireUser();
  if (response) return response;

  try {
    const body: InsertCampaign = await request.json();

    const externalResponse = await fetch("https://music-campaign-backend.onrender.com/api/campaigns", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await externalResponse.json();

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
    
      { status: 500 , error: error?.message}
    );
  }
}
