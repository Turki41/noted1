import mongoose from "mongoose";

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!)
        console.log('connected to DB')
    } catch (error) {
        console.log('Error in connect to db', error instanceof Error ? error.message : 'Unknown error')
        process.exit(1)
    }
}

export default connectToDB