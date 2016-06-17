# lambda-wkhtmltopdf
Convert HTML to PDF using Webkit (QtWebKit) on AWS Lambda

## Input

```json
{
    "data" : "<h1>Claudemiro</h1>",
    "filename": "optional filename",
    "pagesize": "optional pagesize default: a4"
}
```

## Output

```json
{
    "filename": "8rqj9td0pvjf9a4i.pdf"
}
```

## Configuration

1. Open `config.js` and set `bucket` variable to name of S3 bucket where you want function to save output PDF files.
2. Make sure AWS Lambda function has `PutObject` access to S3 bucket
3. Download the binary wkhtmltopdf for linux-x64 and put in the current directory
4. Run npm install
5. Zip everything and upload to aws-lambda

## Links

* http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html
* http://aws.amazon.com/documentation/apigateway/
* http://wkhtmltopdf.org/
* https://www.npmjs.com/package/wkhtmltopdf
* http://swagger.io/
* https://github.com/ashiina/lambda-local