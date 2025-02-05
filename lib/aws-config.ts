import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { S3Client } from "@aws-sdk/client-s3";

const REGION = process.env.NEXT_PUBLIC_AWS_REGION!;
const IDENTITY_POOL_ID = process.env.NEXT_PUBLIC_IDENTITY_POOL_ID!;

// Create a Cognito Identity Client
const cognitoIdentityClient = new CognitoIdentityClient({
  region: REGION,
});

// Create credentials using the Identity Pool
const credentials = fromCognitoIdentityPool({
  client: cognitoIdentityClient,
  identityPoolId: IDENTITY_POOL_ID,
});

// Create an S3 client using Cognito credentials
export const s3Client = new S3Client({
  region: REGION,
  credentials,
});
