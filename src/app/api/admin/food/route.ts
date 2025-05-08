import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    if (!request.headers.get("content-type")?.includes("application/json")) {
      return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
    }

    const data = await request.json();

    if (!data || typeof data !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // Save data to database or file system
    console.log("Received food item:", data);

    return NextResponse.json({ message: "Food item received" }, { status: 201 });
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}