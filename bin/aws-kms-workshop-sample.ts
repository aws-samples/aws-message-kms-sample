#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsKmsWorkshopApiStack } from '../lib/aws-kms-workshop-api-stack';
import { AwsKmsWorkshopAppStack } from '../lib/aws-kms-workshop-app-stack';
import { AWSKMSWorkshopPipeline } from '../lib/aws-kms-pipeline';

const app = new cdk.App();
new AWSKMSWorkshopPipeline(app, 'AwsKmsWorkshopPipeline',{});
//new AwsKmsWorkshopApiStack(app, 'AwsKmsWorkshopAPIStack',{});
//new AwsKmsWorkshopAppStack(app, 'AwsKmsWorkshopAPPStack',{});
