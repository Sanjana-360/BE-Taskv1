import DOT_ENV from './config-env'
import * as AWS from 'aws-sdk'
import mime from 'mime-types'


AWS.config.update({
    accessKeyId: DOT_ENV.AWS_ACCESS_KEY_ID,
    secretAccessKey: DOT_ENV.AWS_SECRET_ACCESS_KEY,
    region: DOT_ENV.AWS_REGION
});

const shouldUseCDN = (): boolean => {
    const prefix = DOT_ENV.AWS_BUCKET_FOLDER_PREFIX;
    return (
        prefix && prefix !== 'NONE' && prefix !== 'null' && prefix !== 'disabled'
    );
};


const s3Upload = async (fileName: string, fileBuffer: Buffer): Promise<string> => {


    try {
        console.log('DOT_ENV.AWS_S3_BUCKET_NAME: ', DOT_ENV.AWS_BUCKET_NAME);
        console.log(
            'DOT_ENV.AWS_BUCKET_FOLDER_PREFIX: ',
            DOT_ENV.AWS_BUCKET_FOLDER_PREFIX,
        );
        const useCDN = shouldUseCDN();
        const bucketPrefix = useCDN
            ? DOT_ENV.AWS_BUCKET_FOLDER_PREFIX.replace(/\/+$/, '') + '/'
            : '';

        const s3Key = bucketPrefix + fileName;

        if (!Buffer.isBuffer(fileBuffer)) {
            throw new Error('Invalid file buffer. Expected a Buffer object.');
        }

        const s3 = new AWS.S3();
        const fileType = mime.lookup(fileName) || ""

        const params: AWS.S3.PutObjectRequest = {
            Bucket: DOT_ENV.AWS_BUCKET_NAME,
            Key: s3Key,
            Body: fileBuffer,
            ContentType: fileType
        }

        const uploadResponse = await s3.upload(params).promise();
        if (useCDN) {
            // QA environment - return path without bucket prefix for CDN routing
            return s3Key.replace(bucketPrefix, '');
        } else {
            // PROD environment - return full S3 URL
            return uploadResponse.Location;
        }
    }
    catch (error) {
        throw new Error(`S3 upload failed: ${error.message}`)
    }
}
export { s3Upload }