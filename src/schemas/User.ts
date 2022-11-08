import { Schema, model, connect } from 'mongoose';
import { IUser } from '../types/types';

export const User = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    designation: { type: String, required: false },
})

