import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

export async function POST(request: NextRequest) {
  console.log("abt to connect");
  connect();
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    console.log(reqBody);

    console.log("connected and searching");

    //check if user already exists
    const user = await User.findOne({ $or:[
      {email:email},
      {username:username}
    ] });

    console.log("searched for user");

    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    //hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    console.log(savedUser);

    // send verification email

    await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });
    console.log("user saved");

    return NextResponse.json({
      message: "Account created successfully",
      success: true,
      savedUser,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
