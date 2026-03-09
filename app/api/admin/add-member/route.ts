import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { payload } = await request.json();

    if (!payload.email || !payload.password || !payload.name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // 1. Create User in Supabase Auth
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: payload.email,
        password: payload.password,
        email_confirm: true,
        user_metadata: {
          display_name: payload.name,
        },
      });

    if (authError) {
      console.error("Auth error:", authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const userId = authData.user.id;

    // 2. Create Profile
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: userId,
        name: payload.name,
        email: payload.email,
        mobileNo: payload.phone || "",
        bio: "",
        user_type: "responder",
        permanent_address: "",
      })
      .select()
      .single();

    if (profileError) {
      console.error("Profile error:", profileError);
      // Rollback auth user creation if profile creation fails?
      // In a real app, maybe, but here we'll just report the error.
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 },
      );
    }

    // 3. Create Responder Details
    const { error: responderDetailError } = await supabaseAdmin
      .from("responder_details")
      .insert({
        profile_id: profileData.id as string,
        is_available: true,
      });

    if (responderDetailError) {
      console.error("Responder details error:", responderDetailError);
      return NextResponse.json(
        { error: responderDetailError.message },
        { status: 400 },
      );
    }

    return NextResponse.json({
      meta: {
        success: true,
        message: "Member added successfully.",
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
