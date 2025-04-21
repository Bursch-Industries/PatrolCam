import {S3Client,
	ListBucketsCommand,
	ListObjectsV2Command, 
	GetObjectCommand,
} from "@aws-sdk/client-s3";

export async function GET() {
// access r2 bucket which holds ours stored video streams
	const r2 = new S3Client({
		region: process.env.R2_REGION,
		endpoint: `https://${process.env.R2_ENDPOINT}.r2.cloudflarestorage.com`,
		credentials: {
			accessKeyId: process.env.R2_ACCESS_KEY_ID,
			secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
		},
	})

}
