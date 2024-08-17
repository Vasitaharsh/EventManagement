import mongoose from 'mongoose';

const connectDB = async () => {
  try {
     await mongoose.connect(process.env.MONGO_URI!);
   
    console.log('MongoDB connected');

  } catch (err) {
    
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    console.error(errorMessage);
    process.exit(1);
  }
};  


export default connectDB;
