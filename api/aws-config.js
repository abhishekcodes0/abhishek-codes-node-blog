import { S3Client } from "@aws-sdk/client-s3";
import { secret } from "./app.js";

export const s3 = new S3Client(
  process.env.NODE_ENV == "production"
    ? {
        region: secret?.AWS_REGION,
        credentials: {
          accessKeyId: secret?.AWS_ACCESS_KEY_ID,
          secretAccessKey: secret?.AWS_SECRET_ACCESS_KEY,
        },
      }
    : {
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      }
);
