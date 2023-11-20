import { v2 as cloudinary } from 'cloudinary'

import { ConfigService } from '@nestjs/config'

export const cloudinaryConfigFactory = (configService: ConfigService) => {
  const cloudName = configService.get<string>('CLOUD_NAME')
  const apiKey = configService.get<string>('API_KEY')
  const apiSecret = configService.get<string>('API_SECRET')

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
  })
}

export const CloudinaryConfigProvider = {
  provide: 'CloudinaryConfig',
  useFactory: cloudinaryConfigFactory,
  inject: [ConfigService]
}

export async function uploadImage(filePath: string, folder: string) {
  return await cloudinary.uploader.upload(filePath, {
    folder,
    transformation: {
      width: '700',
      height: '500',
      crop: 'fill',
      quality: '80'
    }
  })
}

export async function deleteImage(public_id: string) {
  await cloudinary.uploader.destroy(public_id)
}
