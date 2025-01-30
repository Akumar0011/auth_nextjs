import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";
import { z } from "zod";

// Connect to the database
connect();

// Define schema validation using Zod
const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse and validate request body
    const reqBody = await request.json();
    const parsedBody = signupSchema.safeParse(reqBody);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: parsedBody.error.format() },
        { status: 400 }
      );
    }

    const { username, email, password } = parsedBody.data;
    console.log("Signup request:", email);

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create new user
    const newUser = new User({ username, email, password: hashedPassword });
    const savedUser = await newUser.save();
    console.log("User created:", savedUser.email);

    // Send verification email
    try {
      await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });
    } catch (error) {
      console.error(
        "Email sending failed:",
        error instanceof Error ? error.message : error
      );
    }

    return NextResponse.json({
      message: "User created successfully",
      success: true,
    });
  } catch (error) {
    console.error(
      "Signup error:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
