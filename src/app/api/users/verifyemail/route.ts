import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { z } from "zod";

// Connect to the database
connect();

// Define schema validation using Zod
const verifyTokenSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse and validate request body
    const reqBody = await request.json();
    const parsedBody = verifyTokenSchema.safeParse(reqBody);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: parsedBody.error.format() },
        { status: 400 }
      );
    }

    const { token } = parsedBody.data;
    console.log("Verifying token:", token);

    // Find user with valid verification token
    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    console.log("User found:", user.email);

    // Update user verification status
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({
      message: "Email verified successfully",
      success: true,
    });
  } catch (error) {
    console.error(
      "Email verification error:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
