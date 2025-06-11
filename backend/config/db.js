import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            ssl: true,
            tls: true,
            tlsAllowInvalidCertificates: true,
            retryWrites: true,
            w: 'majority'
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        console.error('Connection URI:', process.env.MONGO_URI ? 'URI is set' : 'URI is not set');
        process.exit(1);
    }
};

export default connectDB;