import { config } from 'dotenv'
config({ path: `.env` })

const DOT_ENV = {
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    AWS_REGION: process.env.AWS_REGION,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    AWS_BUCKET_FOLDER_PREFIX: process.env.AWS_BUCKET_FOLDER_PREFIX,
    SENDERPASSWORD: process.env.MYPASSWORD
}
export default DOT_ENV