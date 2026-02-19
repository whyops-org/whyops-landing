import { createClient } from "@/lib/supabase";
import { verifyEmailDeliverability } from "@/lib/validation";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Validate email deliverability
    const isValidEmail = await verifyEmailDeliverability(email);
    if (!isValidEmail) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = await createClient(cookies());

    // Check if email already exists
    const { data: existingLead } = await supabase
      .from('leads')
      .select('email')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (existingLead) {
      return NextResponse.json(
        { message: "Email already registered", exists: true },
        { status: 200 }
      );
    }

    // Save email to leads table
    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          email: email.toLowerCase().trim(),
          source: 'hero_signup',
          created_at: new Date().toISOString(),
        }
      ])
      .select();

    if (error) {
      console.error('Error saving lead:', error);
      return NextResponse.json(
        { error: "Failed to save email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Email saved successfully", data },
      { status: 201 }
    );

  } catch (error) {
    console.error('Email signup error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
