import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
    title: string;
    description: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    organizerDetails: string;
    paidStatus: boolean;
    eventImages: mongoose.Types.ObjectId[]; // Array of Image references
    displayStatus: boolean;
    createdBy: mongoose.Types.ObjectId;
    likesCount: number;   // Total number of likes
    dislikesCount: number; // Total number of dislikes
}

const eventSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    organizerDetails: {
        type: String,
        required: true,
    },
    paidStatus: {
        type: Boolean,
        required: true,
    },
    eventImages: [{
        type: Schema.Types.ObjectId,
        ref: 'Image', // Reference to the Image model
    }],
    displayStatus: {
        type: Boolean,
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    likesCount: {
        type: Number,
        default: 0,
    },
    dislikesCount: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

const Event = mongoose.model<IEvent>('Event', eventSchema);

export default Event;
