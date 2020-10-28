import * as dotenv from 'dotenv';

dotenv.config();

export default {
    port: process.env.PORT || 4000,
    jwtSecretKey: process.env.JWT_SECRET_KEY ?? ''
};