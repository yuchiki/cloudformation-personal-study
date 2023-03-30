import * as cdk from 'aws-cdk-lib';
import { ISecurityGroup, ISubnet, IVpc, SecurityGroup, Subnet, SubnetSelection } from 'aws-cdk-lib/aws-ec2';
import { AuroraEngineVersion, DatabaseCluster, DatabaseClusterEngine, IDatabaseCluster } from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';
export class RDSStack extends cdk.Stack {
  public readonly databaseCluster: IDatabaseCluster
  public readonly securityGroup: ISecurityGroup

  constructor(scope: Construct, id: string, vpc: IVpc, subnets: SubnetSelection, props?: cdk.StackProps) {
    super(scope, id, props);

    this.securityGroup = new SecurityGroup(this, "rdb-sg", {
      vpc: vpc,
      allowAllOutbound: false
    });

    this.databaseCluster = new DatabaseCluster(this, "rds-cluster", {
      engine: DatabaseClusterEngine.aurora({ version: AuroraEngineVersion.VER_1_23_4 }),
      instanceProps: {
        vpc: vpc,
        vpcSubnets: subnets,
        securityGroups: [this.securityGroup]
      }
    })
  }
}
