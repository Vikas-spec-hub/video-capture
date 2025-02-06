import { NextRequest, NextResponse } from "next/server";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { s3Client } from "@/lib/aws-config";

export const runtime = "edge";

/**
 * POST handler for generating a presigned URL to upload a video directly to an S3 bucket.
 * The presigned URL is returned to the client for secure upload without exposing AWS credentials.
 *
 * @param {NextRequest} request - The incoming Next.js request object.
 * @returns {NextResponse} - A Next.js response containing the presigned post data or an error message.
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<unknown>> {
  try {
    // Parse JSON data from the incoming request
    const data = await request.json();
    const { filename, contentType } = data;

    // Generate a presigned post for uploading to S3
    const BUCKET_NAME = process.env.NEXT_PUBLIC_S3_BUCKET_NAME;

    if (!BUCKET_NAME) {
      throw new Error("Bucket name missing in env variable");
    }
    const post = await createPresignedPost(s3Client, {
      Bucket: BUCKET_NAME, // Your S3 bucket name
      Key: filename + new Date().getTime(), // Unique file key for the upload (includes timestamp)
      Conditions: [
        ["content-length-range", 0, 104857600], // Limit file size to 100 MB
        ["starts-with", "$Content-Type", contentType], // Ensure the content type starts with the provided content type
      ],
      Fields: {
        "Content-Type": contentType, // Set the content type for the file upload
      },
      Expires: 600, // Expiry time for the presigned URL (10 minutes)
    });

    // Return the presigned post data in the response
    return NextResponse.json(post);
  } catch (error) {
    // Log and handle errors that may occur during the presigned URL creation process
    console.error("Error creating presigned URL:", error);
    return NextResponse.json(
      { error: "Error creating upload URL" },
      { status: 500 }
    );
  }
}
