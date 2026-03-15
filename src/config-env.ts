import { config } from 'dotenv'
config({ path: `.env` })

const DOT_ENV = {
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    // AWS_REGION
    // AWS_BUCKET_NAME
    // AWS_ACCESS_KEY
    // AWS_SECRET_KEY
}
export default DOT_ENV