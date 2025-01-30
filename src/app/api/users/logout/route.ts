import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest): Promise<NextResponse> {
  try {
    // Create response with a success message
    const response = NextResponse.json({
      message: "Logout successful",
      success: true,
    });

    // Clear the token cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0), // Expire immediately
      path: "/", // Ensure it affects the whole domain
    });

    return response;
  } catch (error) {
    console.error(
      "Logout error:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
