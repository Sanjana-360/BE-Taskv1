import DOT_ENV from '../config-env'
import * as AWS from 'aws-sdk'
import mime from 'mime-types'
import { ERROR_CODES } from '../middlewares/errors/error.constants';
import { AppError } from '../middlewares/errors/error'


AWS.config.update({
    accessKeyId: DOT_ENV.AWS_ACCESS_KEY_ID,
    secretAccessKey: DOT_ENV.AWS_SECRET_ACCESS_KEY,
    region: DOT_ENV.AWS_REGION
});

// CDN for QA and DEV
const shouldUseCDN = (): boolean => {
    const prefix = DOT_ENV.AWS_BUCKET_FOLDER_PREFIX;
    return (
        prefix && prefix !== 'NONE' && prefix !== 'null' && prefix !== 'disabled'
    );
};


const s3Upload = async (Key: string, fileBuffer: Buffer): Promise<string> => {


    try {
        const useCDN = shouldUseCDN();
        const bucketPrefix = useCDN
            ? DOT_ENV.AWS_BUCKET_FOLDER_PREFIX.replace(/\/+$/, '') + '/'
            : '';

        const s3Key = bucketPrefix + Key;

        if (!Buffer.isBuffer(fileBuffer)) {
            throw new AppError(ERROR_CODES.INTERNAL_SERVER_ERROR, 'Invalid file buffer. Expected a Buffer object.');
        }

        const s3 = new AWS.S3();
        const fileType = mime.lookup(Key)
        if (!fileType) {
            throw new AppError(ERROR_CODES.INTERNAL_SERVER_ERROR, `Could not determine file type for key: ${Key}`)
        }

        const params: AWS.S3.PutObjectRequest = {
            Bucket: DOT_ENV.AWS_BUCKET_NAME,
            Key: s3Key,
            Body: fileBuffer,
            ContentType: fileType
        }

        const uploadResponse = await s3.upload(params).promise();
        if (useCDN) {
            // QA environment
            return s3Key.replace(bucketPrefix, '');
        } else {
            // PROD environment 
            return uploadResponse.Location;
        }
    }
    catch (error) {
        throw error

    }
}
export { s3Upload }