import { AwsKmsWorkshopAppStack } from './aws-kms-workshop-app-stack';
import { AwsKmsWorkshopApiStack } from './aws-kms-workshop-api-stack';

import { Stage, StageProps ,CfnOutput} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class WorkshopAppStage extends Stage {
  public readonly cfnOutApiUrl: CfnOutput;
  public readonly cfnOutCloudFrontUrl: CfnOutput;
  public readonly cfnOutBucketName: CfnOutput;
  public readonly cfnOutDistributionId: CfnOutput;

  constructor(scope: Construct, id: string, props?: StageProps) {
        super(scope, id, props);
        let websiteHosting = new AwsKmsWorkshopAppStack(this, 'KMSWorkshopApp');
        let restApi = new AwsKmsWorkshopApiStack(this, 'KMSWorkshopAPI');

        this.cfnOutApiUrl = restApi.cfnOutApiUrl;
        this.cfnOutCloudFrontUrl = websiteHosting.cfnOutCloudFrontUrl;
        this.cfnOutBucketName = websiteHosting.cfnOutBucketName;
        this.cfnOutDistributionId = websiteHosting.cfnOutDistributionId;
    }
}