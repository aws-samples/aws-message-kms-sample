import * as cdk from 'aws-cdk-lib';
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Cors, IResource, LambdaIntegration, MethodLoggingLevel,MockIntegration, PassthroughBehavior, RestApi } from "aws-cdk-lib/aws-apigateway"

import { Construct } from 'constructs';
import { CfnOutput } from 'aws-cdk-lib';
import path = require('path');
import * as kms from "aws-cdk-lib/aws-kms"

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwsKmsWorkshopApiStack extends cdk.Stack {
  public readonly cfnOutApiUrl: CfnOutput;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    

    
    
    // apigateway and lambda integration
    const encryption_handler = new lambda.Function(this, "kmsencrpytion", {
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda'), {
        bundling: {
          image: lambda.Runtime.PYTHON_3_12.bundlingImage,
          command: [
            'bash', '-c',
            'pip install -r requirements.txt -t /asset-output && cp -au . /asset-output'
          ],
        },
      }),
      architecture: lambda.Architecture.ARM_64,
      runtime: lambda.Runtime.PYTHON_3_12, // So we can use async in widget.js
      handler: "kmsencryption.handler",
      // add python lambda requirements install
            
    });
    const encryptionIntegrationRest = new LambdaIntegration(encryption_handler,{
      proxy: false,
      passthroughBehavior: PassthroughBehavior.WHEN_NO_TEMPLATES,
      integrationResponses: [{
        statusCode: '200',
        responseParameters: {
          'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
          'method.response.header.Access-Control-Allow-Origin': "'*'",
          'method.response.header.Access-Control-Allow-Credentials': "'false'",
          'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
        },
      }],
    });
    
    const decryption_handler = new lambda.Function(this, "kmsdecrpytion", {
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda'), {
        bundling: {
          image: lambda.Runtime.PYTHON_3_12.bundlingImage,
          command: [
            'bash', '-c',
            'pip install -r requirements.txt -t /asset-output && cp -au . /asset-output'
          ],
        },
      }),
      architecture: lambda.Architecture.ARM_64,
      runtime: lambda.Runtime.PYTHON_3_12, // So we can use async in widget.js
      handler: "kmsdecryption.handler",
    });
    const decryptionIntegrationRest = new LambdaIntegration(decryption_handler,{
      proxy: false,
      passthroughBehavior: PassthroughBehavior.WHEN_NO_TEMPLATES,
      integrationResponses: [{
        statusCode: '200',
        responseParameters: {
          'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
          'method.response.header.Access-Control-Allow-Origin': "'*'",
          'method.response.header.Access-Control-Allow-Credentials': "'false'",
          'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
        },
      }],
      
    });

    const api = new RestApi(this, 'kms-api',{
      deployOptions: {
        metricsEnabled: true,
        loggingLevel: MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
      },
      // 👇 enable CORS
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS // this is also the default
      }
    });

    api.root.addMethod('ANY');

    
    const encryption = api.root.addResource('encryption');
    encryption.addMethod('POST', encryptionIntegrationRest,{
      // we can set request validator options like below
      // requestValidatorOptions: {
      //   validateRequestBody: true,
      //   validateRequestParameters: true
      // }
      methodResponses: [{
        statusCode: '200',
        responseParameters: {
          'method.response.header.Access-Control-Allow-Headers': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Credentials': true,
          'method.response.header.Access-Control-Allow-Origin': true,
        },
      }]
    });
   // addCorsOptions(encryption);
    
    const decryption = api.root.addResource('decryption');
    decryption.addMethod('POST', decryptionIntegrationRest,{
      // requestValidatorOptions: {
      //   validateRequestBody: true,
      //   validateRequestParameters: true
      // }
      methodResponses: [{
        statusCode: '200',
        responseParameters: {
          'method.response.header.Access-Control-Allow-Headers': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Credentials': true,
          'method.response.header.Access-Control-Allow-Origin': true,
        },
      }]
    },);
  //  addCorsOptions(decryption);
    
    
    this.cfnOutApiUrl = new CfnOutput(this, 'apigateway', { value: api.url });
    
    const kmskey = new kms.Key(this, 'KMSWorkshopKey', {
      enableKeyRotation: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
    kmskey.grantEncrypt(encryption_handler);
    kmskey.grantDecrypt(decryption_handler);
    
    new CfnOutput(this, 'kmsarn', { value: kmskey.keyArn });
  };   
}

// export function addCorsOptions(apiResource: IResource) {
//   apiResource.addMethod('OPTIONS', new MockIntegration({
//     // In case you want to use binary media types, uncomment the following line
//     // contentHandling: ContentHandling.CONVERT_TO_TEXT,
//     integrationResponses: [{
//       statusCode: '200',
//       responseParameters: {
//         'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
//         'method.response.header.Access-Control-Allow-Origin': "'*'",
//         'method.response.header.Access-Control-Allow-Credentials': "'false'",
//         'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
//       },
//     }],
//     // In case you want to use binary media types, comment out the following line
//     passthroughBehavior: PassthroughBehavior.NEVER,
//     requestTemplates: {
//       "application/json": "{\"statusCode\": 200}"
//     },
//   }), {
//     methodResponses: [{
//       statusCode: '200',
//       responseParameters: {
//         'method.response.header.Access-Control-Allow-Headers': true,
//         'method.response.header.Access-Control-Allow-Methods': true,
//         'method.response.header.Access-Control-Allow-Credentials': true,
//         'method.response.header.Access-Control-Allow-Origin': true,
//       },
//     }]
//   })
// }
