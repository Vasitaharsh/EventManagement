import { Document, Schema, model, Types } from 'mongoose';

export interface IEvent extends Document {
    title: string;
    description: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    organizerDetails: string;
    paidStatus: boolean;
    eventImages: Types.ObjectId[]; // Array of Image references
    displayStatus: boolean;
    createdBy: Types.ObjectId;
    likesCount: number;   // Total number of likes
    dislikesCount: number; // Total number of dislikes
    price?: number;        // Price for paid events
    payments: Types.ObjectId[]; // References to Payment model
}

const eventSchema: Schema<IEvent> = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    organizerDetails: { type: String, required: true },
    paidStatus: { type: Boolean, required: true },
    eventImages: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
    displayStatus: { type: Boolean, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    likesCount: { type: Number, default: 0 },
    dislikesCount: { type: Number, default: 0 },
    price: { type: Number }, // Price field for paid events
    payments: { type: [{ type: Schema.Types.ObjectId, ref: 'Payment' }], default: [] } // Array of Payment references
}, {
    timestamps: true,
});

const Event = model<IEvent>('Event', eventSchema);

export default Event;
