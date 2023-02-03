import { Schema, model, connect } from 'mongoose';
import { IRefreshToken } from '../types/types';

export const RefreshToken = new Schema<IRefreshToken>({
    token: { type: Schema.Types.String, required: true },
    userId: { type: Schema.Types.String, required: true },
    expiresAt: { type: Schema.Types.Number, required: true }
})

export default model('RefreshToken', RefreshToken)

