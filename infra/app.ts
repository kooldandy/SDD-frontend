#!/usr/bin/env node

import * as cdk from 'aws-cdk-lib';
import { ReactStaticSiteStack } from './script';

const app = new cdk.App();

new ReactStaticSiteStack(app, 'ReactStaticSiteStack');