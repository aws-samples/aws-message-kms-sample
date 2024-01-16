import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import {WorkshopAppStage} from './stage-app';
import {CodeBuildStep, CodePipeline, CodePipelineSource, ShellStep} from "aws-cdk-lib/pipelines";
import * as iam from "aws-cdk-lib/aws-iam";

export class AWSKMSWorkshopPipeline extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
      super(scope, id, props);

      // Repository
      const repository = new codecommit.Repository(this, 'WorkshopRepo', {
        repositoryName: "WorkshopRepo"
      });

      // CDK Pipeline
      let pipeline = new CodePipeline(this, "Pipeline", {
        pipelineName: `Pipeline-${this.stackName}`,
        selfMutation: false,
        publishAssetsInParallel: false,
        synth: new ShellStep("Synth", {
          input: CodePipelineSource.codeCommit(repository, "main"),
          commands: ["npm install", "npm run build", "npx cdk synth"],
        }),
        codeBuildDefaults: {
          rolePolicy: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ["s3:*"],
              resources: ["*"],
            }),
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ["cloudfront:*"],
              resources: ["*"],
            }),
          ],
        },
      });
  
      
      const appStage = new WorkshopAppStage(this, 'App');
      pipeline.addStage(appStage, {
        post: [
          new ShellStep("DeployFrontEnd", {
            envFromCfnOutputs: {
              REACT_PUBLIC_CLOUDFRONT_URL: appStage.cfnOutCloudFrontUrl,
              REACT_PUBLIC_API_URL: appStage.cfnOutApiUrl,
              BUCKET_NAME: appStage.cfnOutBucketName,
              DISTRIBUTION_ID: appStage.cfnOutDistributionId,
            },
            commands: [
              "cd frontend",
              "npm ci",
              "npm run build",
              "aws s3 cp ./src/build s3://$BUCKET_NAME/frontend --recursive",
              `aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"`,
            ],
          }),
        ],
      });
      new cdk.CfnOutput(this, "RepositoryCloneUrlHttp", {
        value: repository.repositoryCloneUrlGrc,
        description: "Code Repository Clone Url Http",
      });
    }
}