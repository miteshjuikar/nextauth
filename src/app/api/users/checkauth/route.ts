import { connectDB } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helper/getDataFromToken";
import User from "@/models/userModel";

connectDB();

export async function POST(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);
        console.log(userId);

        const user = await User.findOne({ _id: userId }).select("-password");

        if (!user) {
            return NextResponse.json({
                error: "User not found"
            }, { status: 403 });
        }

        return NextResponse.json({
            message: "User found",
            success: true,
            data: user
        });

    } catch (error: any) {
        return NextResponse.json({
            error: error.message
        }, { status: 500 });
    }
}
