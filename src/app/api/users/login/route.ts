import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'

connectDB();

export async function POST(request:NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;

        const user = await User.findOne({email});

        if(!user){
            return NextResponse.json({
                error: 'User does not exist'
            }, {status: 400})
        }
        
        const validPassword = await bcrypt.compare(password, user.password);
        
        if(!validPassword){
            return NextResponse.json({
                error: 'Check your credentials'
            }, {status: 400})
        }

        const tokenData = {
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email
        }

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: '1h' });

        const response = NextResponse.json({
            message: "Logged in successfully.",
            success: true,
        });

        response.cookies.set("token", token, { httpOnly: true });

        return response;

    } catch (error: any) {
        return NextResponse.json({
            error: error.message
        }, {status: 500})
    }
}