# Authentication & Certificates

## Overview

The AEAT VERI*FACTU webservice uses **mutual TLS authentication** (also known as client certificate authentication). This means both the client (your application) and the server (AEAT) authenticate each other using digital certificates.

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

### From FNMT (Fábrica Nacional de Moneda y Timbre)

**FNMT is the primary certificate authority for Spanish government services:**

1. **Registration Process**:
   - Visit [FNMT website](https://www.fnmt.es/)
   - Create account and verify identity
   - Submit required documentation
   - Pay applicable fees

2. **Certificate Types**:
   - **Persona Física**: For individuals
   - **Persona Jurídica**: For companies/organizations
   - **Representante**: For authorized representatives

3. **Application Requirements**:
   - Valid Spanish NIF/NIE
   - Company registration documents (for legal entities)
   - Proof of identity
   - Payment of fees

### From AEAT Direct

**AEAT also provides certificates directly:**

1. **AEAT Certificate Portal**:
   - Access through AEAT website
   - Requires existing FNMT certificate for initial setup
   - Streamlined process for VERI*FACTU specifically

2. **Advantages**:
   - Faster processing
   - Direct integration with tax systems
   - Specialized for tax-related services

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
// Conceptual example - not actual code
const https = require('https');
const fs = require('fs');

// Load client certificate and private key
const clientCert = fs.readFileSync('path/to/client-cert.pem');
const clientKey = fs.readFileSync('path/to/client-key.pem');

// Configure HTTPS agent
const agent = new https.Agent({
  cert: clientCert,
  key: clientKey,
  ca: caChain, // Certificate Authority chain
  rejectUnauthorized: true, // Verify server certificate
  secureProtocol: 'TLSv1_2_method' // Use TLS 1.2
});
```

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
