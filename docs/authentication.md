# Authentication & Certificates

## Overview

The AEAT VERI*FACTU webservice uses **mutual TLS authentication** (also known as client certificate authentication). This means both the client (your application) and the server (AEAT) authenticate each other using digital certificates.

**Key Requirements:**
- **Protocol**: HTTPS
- **Authentication**: Qualified electronic certificate required
- **Encoding**: UTF-8
- **SOAP Version**: SOAP 1.1 Document/Literal style
- **Message Format**: XML messages according to XSD schemas

## Required Certificates

### Client Certificate
- **Purpose**: Authenticates your application to AEAT
- **Format**: X.509 certificate with private key
- **Storage**: Must be securely stored on your server
- **Validity**: Typically 2-3 years, must be renewed before expiration

### Server Certificate
- **Purpose**: Verifies AEAT's identity
- **Format**: X.509 certificate
- **Source**: Provided by AEAT
- **Verification**: Your application must verify this certificate

### Certificate Authority (CA) Chain
- **Purpose**: Establishes trust between client and server
- **Components**: Root CA + Intermediate CA certificates
- **Source**: AEAT provides the complete chain

## Obtaining Certificates

### From FNMT (RECOMMENDED for VERI*FACTU)

**FNMT is the primary certificate authority for Spanish government services:**

1. **Registration Process**:
   - Visit [FNMT website](https://www.sede.fnmt.gob.es/)
   - Navigate to "Certificados de Persona Física" or "Certificados de Persona Jurídica"
   - Complete online registration
   - **FREE** for individuals (Persona Física)
   - **€14-20** for companies (Persona Jurídica)

2. **Certificate Types**:
   - **Persona Física**: For individuals
   - **Persona Jurídica**: For companies/organizations
   - **Representante**: For authorized representatives

3. **Application Requirements**:
   - Valid Spanish NIF/NIE
   - Company registration documents (for legal entities)
   - Proof of identity
   - **Payment**: FREE for individuals, €14-20 for companies

### Alternative Certificate Authorities

**Other recognized certificate authorities in Spain:**

1. **Camerfirma**:
   - Visit [Camerfirma website](https://www.camerfirma.com/)
   - Professional certificate services
   - May have associated costs

2. **Firmaprofesional**:
   - Visit [Firmaprofesional website](https://www.firmaprofesional.com/)
   - Business-focused certificates
   - May have associated costs

## Quick Start Guide

### Step-by-Step FNMT Certificate Process

**1. Online Registration:**
- Go to [FNMT website](https://www.sede.fnmt.gob.es/)
- Click "Certificados de Persona Física" (individuals) or "Certificados de Persona Jurídica" (companies)
- Complete online application
   - **Cost**: FREE for individuals, €14-20 for companies

**2. Identity Verification:**
- Visit FNMT registration point or AEAT office
- Bring valid ID and company documents
- Verification takes 5-10 minutes
- Alternative: Use DNI Electrónico for online verification

**3. Certificate Download:**
- Download certificate after verification
- Install on your system
- Test with VERI*FACTU test environment

**Total Time: 1-2 weeks | Cost: FREE (Personal) / €14-20 (Business)**

## Certificate Formats

### PFX/P12 Format
- **Extension**: `.pfx` or `.p12`
- **Content**: Certificate + Private Key + CA Chain
- **Password**: Protected with passphrase
- **Usage**: Most common for Windows environments

### PEM Format
- **Extension**: `.pem` or `.crt`
- **Content**: Base64 encoded certificate
- **Usage**: Common in Unix/Linux environments
- **Note**: Private key stored separately

### Combined PEM
- **Format**: Certificate + Private Key in single file
- **Usage**: Convenient for some applications
- **Security**: Less secure than separate files

## CRM Implementation Guide

### Prerequisites
**You already have:**
- ✅ Client certificate (PFX/P12 or PEM format)
- ✅ Private key
- ✅ Certificate password (if applicable)
- ✅ CRM system ready for integration

### CRM Integration Steps

**1. Certificate Storage in CRM:**
```javascript
// Store certificates securely in your CRM
const certificateConfig = {
  clientCert: process.env.AEAT_CLIENT_CERT, // Base64 encoded or file path
  clientKey: process.env.AEAT_CLIENT_KEY,   // Base64 encoded or file path
  caChain: process.env.AEAT_CA_CHAIN,      // Certificate Authority chain
  password: process.env.AEAT_CERT_PASSWORD // Certificate password
};
```

**2. CRM Database Configuration:**
```sql
-- Add certificate fields to your CRM settings table
ALTER TABLE crm_settings ADD COLUMN aeat_cert_path VARCHAR(255);
ALTER TABLE crm_settings ADD COLUMN aeat_cert_password VARCHAR(255);
ALTER TABLE crm_settings ADD COLUMN aeat_environment ENUM('test', 'production');
```

**3. CRM Invoice Processing Flow:**
```javascript
// CRM invoice processing workflow
async function processInvoiceForAEAT(invoice) {
  try {
    // 1. Validate invoice data
    const validation = validateInvoiceData(invoice);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    
    // 2. Register with AEAT
    const aeatResponse = await registerInvoiceWithAEAT(invoice);
    
    // 3. Update CRM with CSV code
    await updateInvoiceWithCSV(invoice.id, aeatResponse.csv);
    
    // 4. Mark invoice as verified
    await markInvoiceAsVerified(invoice.id);
    
    return aeatResponse;
  } catch (error) {
    // Handle errors and update CRM
    await logAEATError(invoice.id, error);
    throw error;
  }
}
```

## Technical Implementation in Node.js

### TLS Handshake Process

**The mutual TLS handshake works as follows:**

1. **Client Hello**: Your application initiates connection with supported cipher suites
2. **Server Hello**: AEAT responds with selected cipher suite and its certificate
3. **Certificate Exchange**: Both parties exchange certificates
4. **Verification**: Each party verifies the other's certificate
5. **Key Exchange**: Symmetric encryption keys are established
6. **Secure Communication**: All data is encrypted using established keys

### HTTPS Agent Configuration

**Node.js requires specific configuration for mutual TLS:**

```javascript
const https = require('https');
const fs = require('fs');
const axios = require('axios');

// Load client certificate and private key
const clientCert = fs.readFileSync('path/to/client-cert.pem');
const clientKey = fs.readFileSync('path/to/client-key.pem');
const caChain = fs.readFileSync('path/to/ca-chain.pem');

// Configure HTTPS agent
const agent = new https.Agent({
  cert: clientCert,
  key: clientKey,
  ca: caChain, // Certificate Authority chain
  rejectUnauthorized: true, // Verify server certificate
  secureProtocol: 'TLSv1_2_method' // Use TLS 1.2
});

// Example usage with axios
const response = await axios.post('https://www1.aeat.es/jebi/ws/VeriFactu.wsdl', soapData, {
  httpsAgent: agent,
  headers: {
    'Content-Type': 'application/soap+xml; charset=utf-8',
    'SOAPAction': 'urn:VeriFactu/Alta'
  }
});
```

**Certificate Conversion (.p12 to .pem):**

```bash
# Convert .p12 to .pem files
openssl pkcs12 -in client-cert.p12 -clcerts -nokeys -out client-cert.pem
openssl pkcs12 -in client-cert.p12 -nocerts -nodes -out client-key.pem
openssl pkcs12 -in client-cert.p12 -cacerts -nokeys -out ca-chain.pem

# cURL example with mTLS
curl --cert client-cert.pem --key client-key.pem --cacert ca-chain.pem \
     -X POST https://www1.aeat.es/jebi/ws/VeriFactu.wsdl \
     -H "Content-Type: application/soap+xml; charset=utf-8" \
     -H "SOAPAction: urn:VeriFactu/Alta" \
     -d @request.xml
```

**Official Source**: [AEAT Certificate Configuration](https://sede.agenciatributaria.gob.es/Sede/condiciones-uso-sede-electronica/validacion-certificado-sede/validacion-certificado-sede.html) (geopend 23-10-2025)

### Java Keystore Configuration

**Converting .p12 to JKS:**

```bash
# Convert .p12 to JKS keystore
keytool -importkeystore -srckeystore client-cert.p12 -srcstoretype PKCS12 -destkeystore client-keystore.jks -deststoretype JKS

# List certificates in keystore
keytool -list -keystore client-keystore.jks

# Java HTTPS configuration
System.setProperty("javax.net.ssl.trustStore", "path/to/truststore.jks");
System.setProperty("javax.net.ssl.trustStorePassword", "password");
System.setProperty("javax.net.ssl.keyStore", "path/to/client-keystore.jks");
System.setProperty("javax.net.ssl.keyStorePassword", "password");
```

**Official Source**: [AEAT Java Configuration](https://sede.agenciatributaria.gob.es/Sede/condiciones-uso-sede-electronica/validacion-certificado-sede/validacion-certificado-sede.html) (geopend 23-10-2025)

### Certificate Loading from Filesystem

**Loading certificates in Node.js involves:**

1. **File System Access**: Read certificate files from secure location
2. **Format Parsing**: Parse PEM/PFX format appropriately
3. **Memory Management**: Load certificates into memory for use
4. **Error Handling**: Handle file not found, permission, or format errors

**Security Considerations**:
- Store certificates in secure, restricted directories
- Use appropriate file permissions (600 for private keys)
- Consider using environment variables for file paths
- Implement proper error handling for missing files

### Passphrase Handling

**Private keys are typically protected with passphrases:**

1. **Passphrase Input**: Securely obtain passphrase (environment variable, secure input)
2. **Key Decryption**: Use passphrase to decrypt private key
3. **Memory Security**: Clear passphrase from memory after use
4. **Error Handling**: Handle incorrect passphrase gracefully

**Best Practices**:
- Never hardcode passphrases in source code
- Use environment variables or secure key management
- Implement timeout for passphrase input
- Log security events appropriately

### Server Certificate Verification

**Your application must verify AEAT's server certificate:**

1. **Certificate Chain**: Verify complete certificate chain to trusted root
2. **Hostname Verification**: Ensure certificate matches AEAT's hostname
3. **Expiration Check**: Verify certificate is not expired
4. **Revocation Check**: Check if certificate is revoked (OCSP/CRL)

**Implementation Details**:
- Use Node.js built-in certificate verification
- Configure custom CA bundle if needed
- Handle certificate validation errors appropriately
- Implement certificate pinning for additional security

## Security Best Practices

### Certificate Storage
- **File Permissions**: Restrict access to certificate files (600 for private keys)
- **Directory Security**: Store in secure, non-web-accessible directory
- **Backup Strategy**: Secure backup of certificates and private keys
- **Rotation**: Plan for certificate renewal before expiration

### Network Security
- **TLS Version**: Use TLS 1.2 or higher
- **Cipher Suites**: Use strong cipher suites only
- **Certificate Pinning**: Consider pinning AEAT's certificate
- **Connection Security**: Use secure network connections

### Application Security
- **Memory Management**: Clear sensitive data from memory
- **Error Handling**: Don't expose certificate details in error messages
- **Logging**: Log security events without exposing sensitive data
- **Access Control**: Restrict access to certificate management functions

## Troubleshooting

### Common Issues

**Certificate Format Errors**:
- Verify certificate format (PEM vs PFX)
- Check for proper encoding
- Ensure private key matches certificate

**Authentication Failures**:
- Verify certificate is not expired
- Check certificate chain completeness
- Ensure private key is correct
- Verify passphrase if applicable

**Connection Issues**:
- Check TLS version compatibility
- Verify cipher suite support
- Test with AEAT test environment first
- Check network connectivity and firewall rules

### Testing Certificate Setup

**Before production deployment:**

1. **Test Environment**: Always test with AEAT test environment
2. **Certificate Validation**: Verify all certificates load correctly
3. **Connection Test**: Test basic TLS connection
4. **SOAP Test**: Test actual SOAP operations
5. **Error Scenarios**: Test with invalid certificates

## Certificate Renewal

**Plan for certificate renewal:**

1. **Monitoring**: Track certificate expiration dates
2. **Renewal Process**: Start renewal process well before expiration
3. **Testing**: Test new certificates in test environment
4. **Deployment**: Deploy new certificates with minimal downtime
5. **Rollback**: Have rollback plan for certificate issues

**Timeline Recommendations**:
- Start renewal process 60 days before expiration
- Test new certificates for 30 days before production
- Deploy new certificates 7 days before expiration
- Keep old certificates as backup for 30 days
