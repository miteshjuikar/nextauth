import { log } from "console";
import mongoose, { connection } from "mongoose";

export async function connectDB() {
    try {

        await mongoose.connect(process.env.MONGO_URL!);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('MongoDB connected');
        });
        connection.on('error', (err) => {
            console.log('MongoDB connection error, please make sure db is up and running: ', err);
            process.exit();
        });

    } catch (error) {
        console.log('Something went wrong in connectiong db');
        console.log(error);
    }
}