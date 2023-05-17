import { Schema, model, connect } from 'mongoose'
import { type IMask } from '../types/types'

export const Mask = new Schema<IMask>({
  id: { type: Schema.Types.String, required: true },
  parentImageId: { type: Schema.Types.String, required: true },
  createdBy: { type: Schema.Types.String, required: true },
}, { timestamps: true })

export default model('Mask', Mask)
