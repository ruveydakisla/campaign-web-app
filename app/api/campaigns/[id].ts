import type { NextApiRequest, NextApiResponse } from "next";
import { requireUser } from "@/lib/auth";

const API_BASE_URL = "https://music-campaign-backend.onrender.com/api/campaigns";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user, response } = await requireUser();
  if (response) return;

  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid or missing ID" });
  }

  try {
    let externalResponse;
    switch (req.method) {
      case "GET":
        externalResponse = await fetch(`${API_BASE_URL}/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        break;

      case "PUT":
        const body = req.body;
        externalResponse = await fetch(`${API_BASE_URL}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        break;

      case "DELETE":
        externalResponse = await fetch(`${API_BASE_URL}/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
        break;

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }

    const data = await externalResponse.json();
    return res.status(externalResponse.status).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Internal server error" });
  }
}
