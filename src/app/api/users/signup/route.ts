import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/helper/mailer";

connectDB();

export async function POST(request:NextRequest) {
    try {
        const reqBody = await request.json();
        const { firstName, lastName, email, password } = reqBody;

        const user = await User.findOne({email});

        if(user){
            return NextResponse.json({
                error: 'User already exist'
            }, {status: 400})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName, lastName, email, password: hashedPassword
        })

        const saveUser = await newUser.save();

        await sendEmail({email, emailType: "VERIFY", userId: saveUser._id})

        return NextResponse.json({
            message: "User registered successfully.",
            success: true,
            saveUser
        })

    } catch (error: any) {
        return NextResponse.json({
            error: error.message
        }, {status: 500})
    }
}