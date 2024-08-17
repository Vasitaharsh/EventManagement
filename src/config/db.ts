import mongoose from 'mongoose';
import {createDefaultUser} from '../utility/createDefaultData'

const connectDB = async () => {
  try {
     await mongoose.connect(process.env.MONGO_URI!);
   
    console.log('MongoDB connected');
    await createDefaultUser();
  } catch (err) {
    
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    console.error(errorMessage);
    process.exit(1);
  }
};  


export default connectDB;
