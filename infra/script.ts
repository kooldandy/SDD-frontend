import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export class ReactStaticSiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. Create a Private S3 Bucket to hold React build files
    const siteBucket = new s3.Bucket(this, "ReactAppBucket", {
    //   bucketName: `my-react-app-${cdk.Aws.ACCOUNT_ID}`, // Must be globally unique
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL, // Secure: Fully private
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Free tier friendly: deletes on stack destroy
      autoDeleteObjects: true, // Free tier friendly: empties bucket on stack destroy
    });

    // 2. Create CloudFront Origin Access Control (OAC)
    // This allows CloudFront to securely read files from your private S3 bucket
    const oac = new cloudfront.CfnOriginAccessControl(this, "ReactAppOAC", {
      originAccessControlConfig: {
        name: "ReactAppOACConfig",
        originAccessControlOriginType: "s3",
        signingBehavior: "always",
        signingProtocol: "sigv4",
      },
    });

    // 3. Create the CloudFront Distribution
    const distribution = new cloudfront.Distribution(
      this,
      "ReactAppDistribution",
      {
        defaultBehavior: {
          origin: new origins.S3Origin(siteBucket),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
          cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
          compress: true,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
          responseHeadersPolicy:
            cloudfront.ResponseHeadersPolicy.SECURITY_HEADERS,
        },
        defaultRootObject: "index.html",
        priceClass: cloudfront.PriceClass.PRICE_CLASS_100, // Cost optimization: Use only US, Canada & Europe edge locations

        // 🚀 CRUCIAL FOR REACT/SPA ROUTING:
        // If a user refreshes on `/dashboard`, CloudFront intercepts the 403/404
        // and silently routes them back to index.html so React Router can handle it.
        errorResponses: [
          {
            httpStatus: 403,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
            ttl: cdk.Duration.seconds(0),
          },
          {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
            ttl: cdk.Duration.seconds(0),
          },
        ],
      },
    );

    // 4. Override CloudFront configuration to use the modern OAC instead of old OAI
    const cfnDistribution = distribution.node
      .defaultChild as cloudfront.CfnDistribution;
    cfnDistribution.addPropertyOverride(
      "DistributionConfig.Origins.0.S3OriginConfig.OriginAccessIdentity",
      "",
    );
    cfnDistribution.addPropertyOverride(
      "DistributionConfig.Origins.0.OriginAccessControlId",
      oac.attrId,
    );

    // 5. Grant CloudFront explicit permission to read from the S3 Bucket via Bucket Policy
    siteBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ["s3:GetObject"],
        resources: [siteBucket.arnForObjects("*")],
        principals: [new iam.ServicePrincipal("cloudfront.amazonaws.com")],
        conditions: {
          StringEquals: {
            "AWS:SourceArn": `arn:aws:cloudfront::${cdk.Aws.ACCOUNT_ID}:distribution/${distribution.distributionId}`,
          },
        },
      }),
    );

    // 6. Outputs - This prints your URLs in the terminal and GitHub logs
    new cdk.CfnOutput(this, "CloudFrontURL", {
      value: `https://${distribution.distributionDomainName}`,
      description: "The global live URL for your React Application",
    });

    new cdk.CfnOutput(this, "S3BucketName", {
      value: siteBucket.bucketName,
      description: "The S3 bucket name to upload your build/ folder to",
    });

    // Ensure these IDs match your jq lookup targets exactly!
    new cdk.CfnOutput(this, 'ReactAppS3BucketName', {
      value: siteBucket.bucketName,
    });

    new cdk.CfnOutput(this, 'ReactAppCloudFrontDistributionId', {
      value: distribution.distributionId,
    });
  }
}
