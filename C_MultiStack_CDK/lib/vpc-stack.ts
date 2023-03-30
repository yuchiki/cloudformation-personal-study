import * as cdk from 'aws-cdk-lib';
import { IpAddresses, ISubnet, IVpc, SubnetSelection, SubnetType, Vpc, } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class VPCStack extends cdk.Stack {
  public readonly vpc: IVpc
  public readonly frontendSubnets: SubnetSelection
  public readonly dbSubnets: SubnetSelection

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    this.vpc = new Vpc(this, "CDKPoCVPC", {
      ipAddresses: IpAddresses.cidr("10.0.0.0/16"),
      maxAzs: 2,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "frontend",
          subnetType: SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: "db",
          subnetType: SubnetType.PRIVATE_ISOLATED
        }
      ]
    })

    this.frontendSubnets = this.vpc.selectSubnets({ subnetGroupName: "frontend" });
    this.dbSubnets = this.vpc.selectSubnets({ subnetGroupName: "db" });
  }
}
