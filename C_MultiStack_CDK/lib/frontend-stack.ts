import * as cdk from 'aws-cdk-lib';
import { AutoScalingGroup, IAutoScalingGroup } from 'aws-cdk-lib/aws-autoscaling';
import { AmazonLinuxImage, IInstance, Instance, InstanceClass, InstanceSize, InstanceType, ISecurityGroup, ISubnet, IVpc, SecurityGroup, Subnet, SubnetSelection, UserData } from 'aws-cdk-lib/aws-ec2';
import { Key } from 'aws-cdk-lib/aws-kms';
import { Construct } from 'constructs';
export class FrontendStack extends cdk.Stack {
    public readonly securityGroup: ISecurityGroup
    public readonly autoScalingGroup: AutoScalingGroup

    constructor(scope: Construct, id: string, availabilityZones: string[], vpc: IVpc, subnets: SubnetSelection, props?: cdk.StackProps) {
        super(scope, id, props);

        this.securityGroup = new SecurityGroup(this, "frontend-sg", {
            vpc: vpc,
        });

        const userData = UserData.forLinux({
            shebang: "#!/bin/bash"
        });
        userData.addCommands(
            "yum update -y",
            "yum install -y httpd",
            "service httpd start",
        )

        this.autoScalingGroup = new AutoScalingGroup(this, "frontend-asg", {
            vpc,
            instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
            machineImage: new AmazonLinuxImage(),
            securityGroup: this.securityGroup,
            userData: userData,
            minCapacity: 2,
            maxCapacity: 2,
            vpcSubnets: subnets,
            associatePublicIpAddress: true,
            keyName: "growi2"
        })
    }
}
