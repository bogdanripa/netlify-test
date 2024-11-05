import https from 'https';
import { lookup } from 'dns/promises';

const test = async () => {
  console.log('START');
  const host = 'nextjsblog122.netlify.app';
  const hostIp = (await lookup(host)).address;
  console.log("Calling " + host + " / " + hostIp);

  const options = {
    hostname: hostIp,
    port: 443, // Use the correct port for HTTPS, typically 443
    path: '/', // Specify the endpoint path
    method: 'GET',
    rejectUnauthorized: false, // Ignore invalid or self-signed certificates
    headers: {
      'host': host
    },
    servername: host
  };

  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const request = https.request(options, (res) => {
    
      // Accumulate data as it comes in
      res.on('data', () => {});
    
      // Log the response data once the entire response is received
      res.on('end', () => {
        const fetchTime = Date.now() - startTime;
        console.log(`DONE in ${fetchTime}`);
        resolve(`${fetchTime}`);
      });
    });
  
    // Log errors if they occur
    request.on('error', (error) => {
      console.log(error);
      reject(JSON.stringify({
          message: 'Request failed',
          error: error.toString()
      }));
    });

    // Send the request
    request.end();
  });
}

// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
  try {
    let body = await test();
    return {
      statusCode: 200,
      body,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
