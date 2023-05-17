import { Schema, model, connect } from 'mongoose'
import { type IImage } from '../types/types'

const Image = new Schema<IImage>({
  id: { type: Schema.Types.String, required: true },
  url: { type: Schema.Types.String, required: true },
  internalImageId: { type: Schema.Types.String, required: true },
}, { timestamps: true })

export default model('Image', Image)
