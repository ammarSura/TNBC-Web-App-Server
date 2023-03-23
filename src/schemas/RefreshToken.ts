import { Schema, model, connect } from 'mongoose'
import { type IRefreshToken } from '../types/types'

export const RefreshToken = new Schema<IRefreshToken>({
  token: { type: Schema.Types.String, required: true },
  userId: { type: Schema.Types.String, required: true },
  issuedAt: { type: Schema.Types.Number, required: true },
  expiresAt: { type: Schema.Types.Number, required: true },
  isAdmin: { type: Schema.Types.Boolean, required: false }
})

export default model('RefreshToken', RefreshToken)
