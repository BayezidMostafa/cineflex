import mongoose from 'mongoose';

const connectToDb = async () => {
    try {
        const DB_URI = process.env.MONGODB_URI || 'your-default-mongodb-uri';
        await mongoose.connect(DB_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        process.exit(1);
    }
};

export default connectToDb;