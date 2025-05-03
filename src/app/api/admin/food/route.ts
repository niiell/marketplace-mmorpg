import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // TODO: Save data to database or file system
    console.log("Received food item:", data);

    return NextResponse.json({ message: "Food item received" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
