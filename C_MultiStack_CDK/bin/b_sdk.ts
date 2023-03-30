#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { VPCStack } from '../lib/vpc-stack';
import { RDSStack } from '../lib/rds-stack';
import { FrontendStack } from '../lib/frontend-stack';
import { Port } from 'aws-cdk-lib/aws-ec2';
import { AlbStack } from '../lib/alb-stack';

const availabilityZone = ["ap-northeast-1a", "ap-northeast-1c"];

const app = new cdk.App();
const vpcStack = new VPCStack(app, 'VPCStack');
const frontendStack = new FrontendStack(app, 'FrontendStack', availabilityZone, vpcStack.vpc, vpcStack.frontendSubnets)


const albStack = new AlbStack(app, "AlbStack", vpcStack.vpc, vpcStack.frontendSubnets, frontendStack.autoScalingGroup)
frontendStack.securityGroup.connections.allowFrom(albStack.securityGroup, Port.tcp(80));


const rdsStack = new RDSStack(app, "RDSStack", vpcStack.vpc, vpcStack.dbSubnets);
frontendStack.securityGroup.connections.allowTo(rdsStack.securityGroup, Port.tcp(3306));



// 依存の向きが正しくなっていることを確かめるために、明示的に想定の依存の無気を書いておく
frontendStack.addDependency(albStack);
frontendStack.addDependency(rdsStack);


frontendStack.addDependency(vpcStack);
albStack.addDependency(vpcStack);
rdsStack.addDependency(vpcStack);
