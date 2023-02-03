import { Schema, model, connect } from 'mongoose';
import { IUser } from '../types/types';

export const User = new Schema<IUser>({
    name: { type: Schema.Types.String, required: true },
    email: { type: Schema.Types.String, required: true },
    designation: { type: Schema.Types.String, required: false },
})

export default model('User', User)

