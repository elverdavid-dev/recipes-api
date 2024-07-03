import { Injectable } from '@nestjs/common'
import {
  UploadApiErrorResponse,
  UploadApiOptions,
  UploadApiResponse,
  v2 as cloudinary
} from 'cloudinary'
import { Readable } from 'stream'

type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDNAME,
      api_key: process.env.APIKEY,
      api_secret: process.env.APISECRET
    })
  }

  async uploadImage(fileImage: Express.Multer.File, folder: string) {
    try {
      return new Promise<CloudinaryResponse>((resolve, reject) => {
        const uploadOptions: UploadApiOptions = {
          folder,
          transformation: {
            width: '700',
            height: '500',
            crop: 'fill',
            quality: '80'
          }
        }

        //Upload image to cloudinary
        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) {
              return reject(error)
            }
            resolve(result)
          }
        )
        let str = Readable.from(fileImage.buffer)
        str.pipe(uploadStream)
      })
    } catch (error) {
      console.error(error)
    }
  }

  async deleteImage(public_id: string) {
    await cloudinary.uploader.destroy(public_id)
  }
}
