import { Document, Schema, model, Types } from 'mongoose';

export interface IPayment extends Document {
    event: Types.ObjectId;
    user: Types.ObjectId;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    paymentDate: Date;
}

const paymentSchema: Schema<IPayment> = new Schema({
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    paymentDate: { type: Date, default: Date.now }
}, {
    timestamps: true,
});

const Payment = model<IPayment>('Payment', paymentSchema);

export default Payment;
