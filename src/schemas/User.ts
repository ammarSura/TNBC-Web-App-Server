import { Schema, model, connect } from 'mongoose'
import { type IUser } from '../types/types'

export const User = new Schema<IUser>({
  name: { type: Schema.Types.String, required: true },
  email: { type: Schema.Types.String, required: true },
  designation: { type: Schema.Types.String, required: false },
  isAdmin: { type: Schema.Types.Boolean, required: false },
  annotatedImageIds: { type: Schema.Types.Array, required: false },
}, { timestamps: true })

export default model('User', User)
