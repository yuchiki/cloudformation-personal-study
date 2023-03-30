import * as cdk from 'aws-cdk-lib';
import { AutoScalingGroup, IAutoScalingGroup } from 'aws-cdk-lib/aws-autoscaling';
import { AmazonLinuxImage, IInstance, Instance, InstanceClass, InstanceSize, InstanceType, ISecurityGroup, ISubnet, IVpc, SecurityGroup, Subnet, SubnetSelection, UserData } from 'aws-cdk-lib/aws-ec2';
import { ApplicationLoadBalancedEc2Service } from 'aws-cdk-lib/aws-ecs-patterns';
import { ApplicationLoadBalancer, ApplicationProtocol, ApplicationTargetGroup, ITargetGroup } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { AlbTarget, InstanceTarget } from 'aws-cdk-lib/aws-elasticloadbalancingv2-targets';
import { Construct } from 'constructs';
export class AlbStack extends cdk.Stack {
    public readonly securityGroup: ISecurityGroup
    public readonly httpTargetGroup: ApplicationTargetGroup

    constructor(scope: Construct, id: string, vpc: IVpc, subnets: SubnetSelection, autoScalingGroup: AutoScalingGroup, props?: cdk.StackProps) {
        super(scope, id, props);

        this.securityGroup = new SecurityGroup(this, "alb-sg", {
            vpc,
        })

        const alb = new ApplicationLoadBalancer(this, "alb", {
            internetFacing: true,
            vpc,
            vpcSubnets: subnets,
            securityGroup: this.securityGroup
        });

        const httpListener = alb.addListener("AlbHttpListener", {
            port: 80,
            protocol: ApplicationProtocol.HTTP
        });
        this.httpTargetGroup = httpListener.addTargets("httpTarget", {
            protocol: ApplicationProtocol.HTTP,
            targets: [autoScalingGroup],
        });
    }
}
