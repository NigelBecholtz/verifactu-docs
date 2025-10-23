# Implementation Examples

## cURL with mTLS

### Basic cURL Command
```bash
curl -X POST \
  --cert client-cert.pem \
  --key client-key.pem \
  --cacert ca-chain.pem \
  --header "Content-Type: application/soap+xml; charset=utf-8" \
  --header "SOAPAction: urn:VeriFactu/Alta" \
  --data @request.xml \
  https://www7.aeat.es/jebi/ws/VeriFactu
```

### cURL with Certificate in PFX Format
```bash
curl -X POST \
  --cert-type P12 \
  --cert client-cert.p12:password \
  --cacert ca-chain.pem \
  --header "Content-Type: application/soap+xml; charset=utf-8" \
  --header "SOAPAction: urn:VeriFactu/Alta" \
  --data @request.xml \
  https://www7.aeat.es/jebi/ws/VeriFactu
```

### cURL with Verbose Output
```bash
curl -v -X POST \
  --cert client-cert.pem \
  --key client-key.pem \
  --cacert ca-chain.pem \
  --tlsv1.2 \
  --ciphers ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256 \
  --header "Content-Type: application/soap+xml; charset=utf-8" \
  --header "SOAPAction: urn:VeriFactu/Alta" \
  --data @request.xml \
  https://www7.aeat.es/jebi/ws/VeriFactu
```

## Node.js with https.Agent

### Basic Node.js Implementation
```javascript
const https = require('https');
const fs = require('fs');

// Load certificates
const clientCert = fs.readFileSync('client-cert.pem');
const clientKey = fs.readFileSync('client-key.pem');
const caChain = fs.readFileSync('ca-chain.pem');

// Configure HTTPS agent
const agent = new https.Agent({
  cert: clientCert,
  key: clientKey,
  ca: caChain,
  rejectUnauthorized: true,
  secureProtocol: 'TLSv1_2_method',
  ciphers: 'ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256'
});

// SOAP request
const soapRequest = `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:verifactu="urn:VeriFactu">
  <soap:Header />
  <soap:Body>
    <verifactu:Alta>
      <!-- Your invoice data here -->
    </verifactu:Alta>
  </soap:Body>
</soap:Envelope>`;

const options = {
  hostname: 'www7.aeat.es',
  port: 443,
  path: '/jebi/ws/VeriFactu',
  method: 'POST',
  agent: agent,
  headers: {
    'Content-Type': 'application/soap+xml; charset=utf-8',
    'SOAPAction': 'urn:VeriFactu/Alta',
    'Content-Length': Buffer.byteLength(soapRequest)
  }
};

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  res.on('data', (chunk) => {
    console.log(`Body: ${chunk}`);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(soapRequest);
req.end();
```

## Node.js with Axios

### Axios with mTLS Configuration
```javascript
const axios = require('axios');
const https = require('https');
const fs = require('fs');

// Load certificates
const clientCert = fs.readFileSync('client-cert.pem');
const clientKey = fs.readFileSync('client-key.pem');
const caChain = fs.readFileSync('ca-chain.pem');

// Configure HTTPS agent
const httpsAgent = new https.Agent({
  cert: clientCert,
  key: clientKey,
  ca: caChain,
  rejectUnauthorized: true,
  secureProtocol: 'TLSv1_2_method'
});

// Axios configuration
const axiosConfig = {
  method: 'POST',
  url: 'https://www7.aeat.es/jebi/ws/VeriFactu',
  headers: {
    'Content-Type': 'application/soap+xml; charset=utf-8',
    'SOAPAction': 'urn:VeriFactu/Alta'
  },
  data: soapRequest,
  httpsAgent: httpsAgent,
  timeout: 60000
};

// Make request
axios(axiosConfig)
  .then(response => {
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
  })
  .catch(error => {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  });
```

## Node.js with node-soap

### SOAP Client with mTLS
```javascript
const soap = require('soap');
const https = require('https');
const fs = require('fs');

// Load certificates
const clientCert = fs.readFileSync('client-cert.pem');
const clientKey = fs.readFileSync('client-key.pem');
const caChain = fs.readFileSync('ca-chain.pem');

// Configure HTTPS agent
const httpsAgent = new https.Agent({
  cert: clientCert,
  key: clientKey,
  ca: caChain,
  rejectUnauthorized: true,
  secureProtocol: 'TLSv1_2_method'
});

// SOAP client options
const options = {
  httpsAgent: httpsAgent,
  timeout: 60000,
  connection_timeout: 30000
};

// Create SOAP client
const url = 'https://www7.aeat.es/jebi/ws/VeriFactu.wsdl';

soap.createClientAsync(url, options)
  .then(client => {
    // Set SOAP headers
    client.addSoapHeader({
      'soap:Header': {}
    });
    
    // Call Alta operation
    return client.AltaAsync({
      Cabecera: {
        NIFEmisor: '12345678Z',
        FechaEnvio: '2024-01-15T10:30:00',
        TiempoEsperaEnvio: 30,
        TipoComunicacion: 'Alta'
      },
      Factura: {
        // Invoice data here
      }
    });
  })
  .then(result => {
    console.log('SOAP Response:', result);
  })
  .catch(error => {
    console.error('SOAP Error:', error);
  });
```

## Java with wsdl2java

### Maven Configuration
```xml
<dependencies>
    <dependency>
        <groupId>com.sun.xml.ws</groupId>
        <artifactId>jaxws-rt</artifactId>
        <version>4.0.1</version>
    </dependency>
    <dependency>
        <groupId>com.sun.xml.ws</groupId>
        <artifactId>jaxws-tools</artifactId>
        <version>4.0.1</version>
    </dependency>
</dependencies>
```

### Java Client Code
```java
import javax.xml.ws.BindingProvider;
import javax.xml.ws.Service;
import java.net.URL;
import java.security.KeyStore;
import java.security.SecureRandom;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManagerFactory;
import javax.net.ssl.KeyManagerFactory;

public class VeriFactuClient {
    
    public static void main(String[] args) {
        try {
            // Load client certificate
            KeyStore keyStore = KeyStore.getInstance("PKCS12");
            keyStore.load(new FileInputStream("client-cert.p12"), "password".toCharArray());
            
            // Configure SSL context
            KeyManagerFactory kmf = KeyManagerFactory.getInstance("SunX509");
            kmf.init(keyStore, "password".toCharArray());
            
            TrustManagerFactory tmf = TrustManagerFactory.getInstance("SunX509");
            tmf.init(keyStore);
            
            SSLContext sslContext = SSLContext.getInstance("TLSv1.2");
            sslContext.init(kmf.getKeyManagers(), tmf.getTrustManagers(), new SecureRandom());
            
            // Create SOAP client
            URL wsdlUrl = new URL("https://www7.aeat.es/jebi/ws/VeriFactu.wsdl");
            Service service = Service.create(wsdlUrl, new QName("urn:VeriFactu", "VeriFactuService"));
            VeriFactuPortType port = service.getPort(VeriFactuPortType.class);
            
            // Configure SSL context
            BindingProvider bp = (BindingProvider) port;
            bp.getRequestContext().put("com.sun.xml.ws.transport.https.client.SSLSocketFactory", 
                sslContext.getSocketFactory());
            
            // Call Alta operation
            AltaRequest request = new AltaRequest();
            // Set request data...
            
            AltaResponse response = port.alta(request);
            System.out.println("Response: " + response);
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

## Python with requests

### Python mTLS Implementation
```python
import requests
import ssl
from requests.adapters import HTTPAdapter
from urllib3.util.ssl_ import create_urllib3_context

class VeriFactuClient:
    def __init__(self, cert_file, key_file, ca_file):
        self.cert_file = cert_file
        self.key_file = key_file
        self.ca_file = ca_file
        self.session = requests.Session()
        self._setup_ssl()
    
    def _setup_ssl(self):
        # Configure SSL context
        context = create_urllib3_context()
        context.set_ciphers('ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256')
        
        adapter = HTTPAdapter()
        adapter.init_poolmanager(ssl_context=context)
        self.session.mount('https://', adapter)
    
    def call_alta(self, soap_request):
        url = 'https://www7.aeat.es/jebi/ws/VeriFactu'
        headers = {
            'Content-Type': 'application/soap+xml; charset=utf-8',
            'SOAPAction': 'urn:VeriFactu/Alta'
        }
        
        response = self.session.post(
            url,
            data=soap_request,
            headers=headers,
            cert=(self.cert_file, self.key_file),
            verify=self.ca_file,
            timeout=60
        )
        
        return response

# Usage
client = VeriFactuClient('client-cert.pem', 'client-key.pem', 'ca-chain.pem')
response = client.call_alta(soap_request)
print(f"Status: {response.status_code}")
print(f"Response: {response.text}")
```

## Certificate Installation

### Linux Server Certificate Installation
```bash
# Convert PFX to PEM format
openssl pkcs12 -in client-cert.pfx -out client-cert.pem -nodes

# Set proper permissions
chmod 600 client-cert.pem
chmod 600 client-key.pem
chmod 644 ca-chain.pem

# Test certificate
openssl x509 -in client-cert.pem -text -noout

# Test SSL connection
openssl s_client -connect www7.aeat.es:443 -cert client-cert.pem -key client-key.pem -CAfile ca-chain.pem
```

### Windows Certificate Installation
```powershell
# Import certificate to Windows Certificate Store
Import-PfxCertificate -FilePath "client-cert.pfx" -CertStoreLocation "Cert:\LocalMachine\My"

# View installed certificates
Get-ChildItem -Path "Cert:\LocalMachine\My" | Where-Object {$_.Subject -like "*YourCompany*"}
```

## Error Handling Examples

### Node.js Error Handling
```javascript
const handleVeriFactuError = (error) => {
  if (error.code === 'CERT_HAS_EXPIRED') {
    console.error('Certificate has expired. Please renew your certificate.');
  } else if (error.code === 'ENOTFOUND') {
    console.error('Cannot resolve hostname. Check your network connection.');
  } else if (error.code === 'ECONNRESET') {
    console.error('Connection reset by server. Retry with exponential backoff.');
  } else if (error.response) {
    console.error(`HTTP Error: ${error.response.status}`);
    console.error(`Response: ${error.response.data}`);
  } else {
    console.error(`Unknown error: ${error.message}`);
  }
};
```

### Retry Logic with Exponential Backoff
```javascript
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Usage
const callVeriFactu = async () => {
  return await retryWithBackoff(async () => {
    const response = await axios(axiosConfig);
    return response.data;
  });
};
```
