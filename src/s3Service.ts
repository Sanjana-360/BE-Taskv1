// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
// import DOT_ENV from './config-env'
// const s3 = new S3Client({
//     region: DOT_ENV.AWS_REGION,
//     credentials: {
//         accessKeyId: DOT_ENV.AWS_ACCESS_KEY_ID,
//         secretAccessKey: DOT_ENV.AWS_SECRET_ACCESS_KEY
//     }
// })


// const s3Upload = async (fileName: string, fileBuffer: Buffer) => {

//     const s3Key = fileName;

//     const param = {
//         Bucket: DOT_ENV.AWS_BUCKET_NAME,
//         Key: s3Key,
//         Body: fileBuffer
//     }



//     await s3.send(new PutObjectCommand(param))
//     const url = `https://${DOT_ENV.AWS_BUCKET_NAME}.s3.${DOT_ENV.AWS_REGION}.amazonaws.com/${s3Key}`
//     return url
// }

// export { s3Upload }