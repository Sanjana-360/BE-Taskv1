import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import DOT_ENV from './config-env'

// connecting with aws
const s3 = new S3Client({
    region: DOT_ENV.AWS_REGION,
    credentials: {
        accessKeyId: DOT_ENV.AWS_ACCESS_KEY_ID,
        secretAccessKey: DOT_ENV.AWS_SECRET_ACCESS_KEY
    }
})


const s3Upload = async (fileName: string, fileBuffer: Buffer) => {
    // where to put the file and which one
    const params = {
        Bucket: DOT_ENV.AWS_BUCKET_NAME,
        Key: fileName,
        Body: fileBuffer
    }

    try {
        // constructing the url
        const metadata = await s3.send(new PutObjectCommand(params))
        const url = `https://${DOT_ENV.AWS_BUCKET_NAME}.s3.${DOT_ENV.AWS_REGION}.amazonS3.com/${fileName}`
        return url
    } catch (error) {
        throw new Error(`S3 upload failed: ${error.message}`)
    }
}
export { s3Upload }