ROLE=''
RUNTIME='nodejs6.10'

echo "Building DynamoDB tables..."
ELECTIONS_TABLE_ARN=$(awslocal dynamodb create-table --cli-input-json file://config/schema/elections.json | node config/parse key="TableDescription.TableArn")
echo "  Elections table $ELECTIONS_TABLE_ARN"

BALLOTS_TABLE_ARN=$(awslocal dynamodb create-table --cli-input-json file://config/schema/ballots.json | node config/parse key="TableDescription.TableArn")
echo "  Ballots table $BALLOTS_TABLE_ARN"
echo "  Done."
echo ""

echo "Building Lambda function..."
LAMBDA_ARN=$(awslocal lambda create-function --function-name voting-api --runtime nodejs6.10 --role "''" --handler handler.api --zip-file fileb://build/handler.zip | node config/parse key="FunctionArn")
echo "  Done."
echo ""

echo "Building API Gateway..."
API_ID=$(awslocal apigateway create-rest-api --cli-input-json file://config/api/root.json | node config/parse key="id")

ROOT_ID=$(awslocal apigateway get-resources --rest-api-id $API_ID | node config/parse key="items.0.id")
echo "  New REST API $API_ID with $ROOT_ID at /api"
echo "  Generating endpoints..."

PROXY_ID=$(awslocal apigateway create-resource --rest-api-id $API_ID --parent-id $ROOT_ID --path-part '{proxy+}' | node config/parse key="id")
echo "    $PROXY_ID /api/:proxy+"

echo "  Adding proxy method..."
PROXY_METHOD_ID=$(awslocal apigateway put-method --rest-api-id $API_ID --resource-id $PROXY_ID --http-method ANY --authorization-type 'NONE')

echo "  Adding integration..."
PROXY_INTEGRATION_ARN=$(awslocal apigateway put-integration --rest-api-id $API_ID --resource-id $PROXY_ID --http-method ANY --type AWS --integration-http-method POST --uri $LAMBDA_ARN | node config/parse key="uri")

# echo "  Creating deployment..."
# awslocal apigateway create-deployment --rest-api-id $API_ID

echo "  Done."
echo ""
