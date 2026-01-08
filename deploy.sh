#!/bin/bash
S3_BUCKET="www.uniatorun.pl"
CLOUDFRONT_ID="E2FWM8CSRWDCDP"

cd /d/uniatorun.pl
npm run build
aws s3 sync dist/ s3://${S3_BUCKET} --delete
aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_ID} --paths "/*"
echo "✅ Deployed to https://www.uniatorun.pl"
