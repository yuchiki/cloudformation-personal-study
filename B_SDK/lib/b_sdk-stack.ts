import * as cdk from 'aws-cdk-lib';
import { IpAddresses, SubnetType, Vpc, } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class BSdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'BSdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    const vpc = new Vpc(this, "CDKPoCVPC", {
      ipAddresses: IpAddresses.cidr("10.0.0.0/16"),
      maxAzs: 2,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "public",
          subnetType: SubnetType.PUBLIC,
        }
      ]
    })
  }
}
