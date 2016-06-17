// The MIT License (MIT)
//
// Copyright (c) 2016 Claudemiro
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

const config = require('./config.js');

const wkhtmltopdf = require('wkhtmltopdf');
const fs = require('fs');
const AWS = require('aws-sdk');

const logger = config.logger;
const S3 = new AWS.S3();

// handler handle eventes in the following format
// 
// {
//     "data" : "<h1>Claudemiro</h1>",
//     "filename": "optional filename",
//     "pagesize": "optional pagesize default: a4"
// }
exports.handler = function handler(event, context, callback) {
    if (!event.data) {
        logger.log().error('unable to get the data');
        callback('unable to get the data', {});
        return;
    }

    const filename = `${(event.filename || Math.random().toString(36).slice(2))}.pdf`;
    const pageSize = event.pagesize || 'a4';
    const data = event.data;

    logger.log({ data, pageSize, filename }).info('Variables');

    const output = `/tmp/${filename}`;
    const writeStream = fs.createWriteStream(output);

    wkhtmltopdf(data, { pageSize }, () => {
        S3.putObject({
            Bucket: config.bucket,
            Key: filename,
            Body: fs.createReadStream(output),
            ContentType: 'application/pdf',
        }, (error) => {
            if (error != null) {
                logger.log({ error }).error('Unable to send file to S3');
                callback('Unable to send file to S3', {});
            } else {
                logger.log({ filename }).info('Upload done!');
                callback(null, { filename });
            }
        });
    }).pipe(writeStream);
};