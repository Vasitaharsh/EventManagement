import mongoose, { Document, Schema } from 'mongoose';

export interface IImage extends Document {
    filename: string;
    path: string;
}

const ImageSchema: Schema = new Schema({
    filename: { type: String, required: true },
    path: { type: String, required: true }
}, {
    timestamps: true,
});

const Image = mongoose.model<IImage>('Image', ImageSchema);
export default Image;
