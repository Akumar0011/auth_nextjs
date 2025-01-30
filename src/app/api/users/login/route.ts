import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

// Connect to the database
connect();

// Define schema validation using Zod
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse and validate request body
    const reqBody = await request.json();
    const parsedBody = loginSchema.safeParse(reqBody);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: parsedBody.error.format() },
        { status: 400 }
      );
    }

    const { email, password } = parsedBody.data;
    console.log("Login request:", email);

    // Validate required environment variables
    const TOKEN_SECRET = process.env.TOKEN_SECRET;
    const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY || "1d";

    if (!TOKEN_SECRET) {
      throw new Error("TOKEN_SECRET is missing in environment variables");
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 404 }
      );
    }
    console.log("User found:", user.email);

    // Validate password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Generate JWT token
    const tokenPayload = {
      id: user._id,
      username: user.username,
      email: user.email,
    };
    const token = jwt.sign(tokenPayload, TOKEN_SECRET, {
      expiresIn: TOKEN_EXPIRY,
    });

    // Create response and set secure cookie
    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 1 day in seconds
    });

    return response;
  } catch (error) {
    console.error(
      "Login error:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
