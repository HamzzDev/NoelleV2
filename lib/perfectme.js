// lib/perfectme.js

import axios from 'axios'

import forge from 'node-forge'

import fs from 'fs'

import path from 'path'

const keyId = 'sk-5aQGCrsWDx6zYKjcOaRrEcv7HspJhyF5YFVe6eSTRFpQRup5CB'

const API_CONFIG = {

  upscale: {

    presignedUrl: 'https://enhance-core.apero.vn/api/v5/image-enhance/presigned-link',

    requestUrl: 'https://enhance-core.apero.vn/api/v5/image-enhance',

  },

  expand: {

    presignedUrl: 'https://core-outpaint.apero.vn/api/v5/image-outpainting/presigned-link',

    requestUrl: 'https://core-outpaint.apero.vn/api/v5/image-outpainting',

  },

  removebg: {

    presignedUrl: 'https://core-outpaint.apero.vn/api/v5/remove-background/presigned-link',

    requestUrl: 'https://core-outpaint.apero.vn/api/v5/remove-background',

  },

  restore: {

    presignedUrl: 'https://image-restore-core.apero.vn/api/v5/image-restore/presigned-link',

    requestUrl: 'https://image-restore-core.apero.vn/api/v5/image-restore',

  },

  outfit: {

    presignedUrl: 'https://cloth-change-core.apero.vn/api/v5/clothes-changing/presigned-link',

    requestUrl: 'https://cloth-change-core.apero.vn/api/v5/clothes-changing'

  },

  styleSource: 'https://pastebin.com/raw/1uLxX7HR'

}

function generateSignature(timestamp, keyId) {

  const publicKeyPem = `-----BEGIN PUBLIC KEY-----

MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5z8DrSdxAFy5ju27JzxUDGD5OdPRnKVrXPypiBVT7NK4ltgbcud3+Li3H1DiAFNvaSDPumZMEbAkfGWZ6s3KtiI7TRmZwQ2yyH6mug6GhrCLD6CZJUQ2CPmhO3JYTYOgN53E6hwm/Teb9I156S04qHjLLLBxk9Mklu5X06kdhMBYwHFAZ3oByeoWUryrQC0Mv9C5ZahKzoQNuJNL2sv+ws2e5Zaj8Rid4AjhvqB6dYhWP4QM+0IiNjs/j08aRgcyOrenbQEIieU+XF6mQWF2Jfg317e0KjWnpru+uPVVgrEn9rNvQeXu2u4SZhT6rnLQzBLbJrngNcNw3gXfxxsoowIDAQAB

-----END PUBLIC KEY-----`

  const randomInt = Math.floor(Math.random() * 1000000)

  const data = `${timestamp}@@@${keyId}@@@${randomInt}`

  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem)

  const encrypted = publicKey.encrypt(data, 'RSAES-PKCS1-V1_5')

  return Buffer.from(encrypted, 'binary').toString('base64')

}

export const perfectme = {

  getPresignedUrl: async (mode, signature, timestamp) => {

    const url = API_CONFIG[mode].presignedUrl

    const res = await axios.get(url, {

      headers: {

        'User-Agent': 'okhttp/4.12.0',

        'Accept': 'application/json',

        'Accept-Encoding': 'gzip',

        'app-name': 'APP_PERFECTME_ANDROID',

        'x-api-signature': signature,

        'x-api-keyid': keyId,

        'x-api-token': 'not_get_api_token',

        'device': 'android',

        'x-api-timestamp': timestamp.toString(),

        'x-api-bundleid': 'aiphotoeditor.aiphotoenhancer.aiphotofilter.photoediting',

        'Content-Type': 'application/json'

      }

    })

    return res.data.data

  },

  uploadAwsS3: async (uploadUrl, fileBuffer) => {

    const res = await axios.put(uploadUrl, fileBuffer, {

      headers: {

        'User-Agent': 'okhttp/4.12.0',

        'Connection': 'Keep-Alive',

        'Accept': 'application/json',

        'Accept-Encoding': 'gzip',

        'Content-Type': 'image/jpeg'

      },

      maxContentLength: Infinity,

      maxBodyLength: Infinity

    })

    return res.headers.etag

  },

  requestImageTools: async (mode, filePathOnS3, signature, timestamp) => {

    const url = API_CONFIG[mode].requestUrl

    const body = JSON.stringify({ file: filePathOnS3 })

    const res = await axios.post(url, body, {

      headers: {

        'User-Agent': 'okhttp/4.12.0',

        'Accept': 'application/json',

        'Accept-Encoding': 'gzip',

        'Content-Type': 'application/json; charset=UTF-8',

        'app-name': 'APP_PERFECTME_ANDROID',

        'x-api-signature': signature,

        'x-api-keyid': keyId,

        'x-api-token': 'not_get_api_token',

        'device': 'android',

        'x-api-timestamp': timestamp.toString(),

        'x-api-bundleid': 'aiphotoeditor.aiphotoenhancer.aiphotofilter.photoediting'

      }

    })

    return res.data

  },

  image: async (mode, filePath) => {

    if (!['upscale', 'expand', 'removebg', 'restore'].includes(mode)) {

      throw new Error(`Mode ${mode} tidak didukung.`)

    }

    const timestamp = Date.now()

    const signature = generateSignature(timestamp, keyId)

    const fileBuffer = fs.readFileSync(path.resolve(filePath))

    const { url, path: s3Path } = await perfectme.getPresignedUrl(mode, signature, timestamp)

    await perfectme.uploadAwsS3(url, fileBuffer)

    const result = await perfectme.requestImageTools(mode, s3Path, signature, timestamp)

    return result

  }

}