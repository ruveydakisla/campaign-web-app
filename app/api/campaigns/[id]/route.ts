import { requireUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  "https://music-campaign-backend.onrender.com/api/campaigns";

type Params = {
  params: {
    id: string;
  };
};
export async function GET(request: NextRequest, context: Params) {
  const { user, response } = await requireUser();
  if (response) return response;

  try {
    const externalResponse = await fetch(
      `${API_BASE_URL}/${context.params.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await externalResponse.json();

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ status: 500, error: error?.message });
  }
}

export async function PUT(request: NextRequest, context: Params) {
  const { user, response } = await requireUser();
  if (response) return response;
  try {
    const body = await request.json();

    const externalResponse = await fetch(`${API_BASE_URL}/${context.params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await externalResponse.json();

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ status: 500, error: error?.message });
  }
}

export async function DELETE(request: NextRequest, context: Params) {
  const { user, response } = await requireUser();
  if (response) return response;

  try {
    const externalResponse = await fetch(
      `${API_BASE_URL}/${context.params.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await externalResponse.json();

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ status: 500, error: error?.message });
  }
}
