# Copyright 2010-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
#
# This file is licensed under the Apache License, Version 2.0 (the "License").
# You may not use this file except in compliance with the License. A copy of the
# License is located at
#
# http://aws.amazon.com/apache2.0/
#
# This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS
# OF ANY KIND, either express or implied. See the License for the specific
# language governing permissions and limitations under the License.

import boto3

# Create an SNS client
sns = boto3.client('sns', region_name = 'eu-central-1')

# Publish a simple message to the specified SNS topic
response = sns.publish(
    TopicArn='arn:aws:sns:eu-central-1:197099301124:turbineDown',
    Message='ATTENTION *Urgent* a turbine is offline, please tend to this need instantly',
)

# Print out the response
print(response)
