#!/usr/bin/env bash

echo "Environment Variables"
echo "DEVSTAGE"
echo "$DEVSTAGE"
echo "**********"
echo "IS_STUDENT_SITE"
echo "$IS_STUDENT_SITE"
echo "**********"
echo "IS_VR_SITE"
echo "$IS_VR_SITE"
echo "**********"
echo "IS_DEMS_SITE"
echo "$IS_DEMS_SITE"
echo "**********"
echo "DEPLOY_PRIME_URL"
echo "$DEPLOY_PRIME_URL"
echo "**********"
echo "URL"
echo "$URL"
echo "**********"
echo "COMMIT_REF"
echo "$COMMIT_REF"
echo "**********"
echo "BRANCH"
echo "$BRANCH"
echo "**********"
echo "**********"


curl https://sentry.io/api/hooks/release/builtin/1223778/6fb3afb73e3ffe85f787ed5d8f69df4ea7b662fd4eddbd2a26edfdea7ad50925/ \
  -X POST \
  -H 'Content-Type: application/json' \
  -d '{"version": "'"$COMMIT_REF"'"}'
