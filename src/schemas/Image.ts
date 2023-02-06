import { Schema, model, connect } from 'mongoose'
import { type IImage } from '../types/types'

export const Image = new Schema<IImage>({
  id: { type: Schema.Types.String, required: true },
  url: { type: Schema.Types.String, required: true },
  algorithmMap: { type: Schema.Types.Mixed, required: true },
  annotsAssessed: { type: Schema.Types.Number, required: true },
  size: { type: Schema.Types.String, required: false }
})

export default model('Image', Image)
