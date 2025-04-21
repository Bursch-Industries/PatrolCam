import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { NextResponse } from 'next/server';

export async function GET() {
// access r2 bucket which holds ours stored video streams
	const bucketName = process.env.R2_BUCKET;
	const r2 = new S3Client({
		region: process.env.R2_REGION,
		endpoint: process.env.R2_ENDPOINT,
		credentials: {
			accessKeyId: process.env.R2_ACCESS_KEY_ID,
			secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
		},
	});
	
	const input = {
		Bucket: bucketName,
	};
	const bucketReq = new ListObjectsV2Command(input);
	const bucketRes = await r2.send(bucketReq); // get a list of objects from the bucket
	// unzip the tar files and concat them
	// return download links for these concatenated files
	
	// For testing
	console.log(bucketRes);
	return NextResponse.json({ videoFiles: bucketRes });

}
