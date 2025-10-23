# Certificate Procurement & Installation Guide

## Certificate Requirements

### Required Certificate Types

**Primary Options:**
- **FNMT Qualified Certificate** (Recommended)
- **eIDAS Qualified Certificate** (EU equivalent)
- **AEAT Direct Certificate** (For tax-specific services)

**Certificate Specifications:**
- **Format**: X.509 v3
- **Key Algorithm**: RSA 2048-bit minimum, RSA 4096-bit recommended
- **Signature Algorithm**: SHA-256 or higher
- **Validity Period**: 2-3 years typically
- **Usage**: Digital signature and authentication

## FNMT Certificate Application

### Step 1: FNMT Registration

1. **Visit FNMT Website**: https://www.fnmt.es/
2. **Create Account**: Register with your business details
3. **Verify Identity**: Submit required documentation
4. **FREE**: No fees required - FNMT certificates are completely free

### Required Documentation

**For Legal Entities (Persona Jurídica):**
- Company registration certificate
- Tax identification number (NIF)
- Authorized representative identification
- Power of attorney (if applicable)
- Company bylaws

**For Individuals (Persona Física):**
- Spanish NIF/NIE
- Proof of identity (DNI/NIE)
- Proof of address
- Contact information

### Step 2: Certificate Generation

1. **Download Certificate Generation Tool**
2. **Generate Certificate Request (CSR)**
3. **Submit CSR to FNMT**
4. **Receive Certificate via secure channel**
5. **Install Certificate on your system**

## AEAT Direct Certificate Application

### Prerequisites
- Valid FNMT certificate for initial authentication
- AEAT business registration
- Tax representative authorization

### Application Process

1. **AEAT Certificate Portal**: https://www.agenciatributaria.es/
2. **Login with FNMT Certificate**
3. **Request AEAT Certificate**
4. **Download Certificate Package**
5. **Install and Configure**

## Certificate Installation

### Linux Server Installation

#### Step 1: Prepare Certificate Files
```bash
# Create secure directory
sudo mkdir -p /etc/ssl/verifactu
sudo chmod 700 /etc/ssl/verifactu

# Copy certificate files
sudo cp client-cert.pem /etc/ssl/verifactu/
sudo cp client-key.pem /etc/ssl/verifactu/
sudo cp ca-chain.pem /etc/ssl/verifactu/

# Set proper permissions
sudo chmod 600 /etc/ssl/verifactu/client-key.pem
sudo chmod 644 /etc/ssl/verifactu/client-cert.pem
sudo chmod 644 /etc/ssl/verifactu/ca-chain.pem
```

#### Step 2: Convert Certificate Formats (if needed)
```bash
# Convert PFX to PEM
openssl pkcs12 -in client-cert.pfx -out client-cert.pem -nodes

# Extract private key
openssl pkcs12 -in client-cert.pfx -nocerts -out client-key.pem -nodes

# Extract certificate
openssl pkcs12 -in client-cert.pfx -clcerts -nokeys -out client-cert.pem
```

#### Step 3: Test Certificate
```bash
# Test certificate validity
openssl x509 -in /etc/ssl/verifactu/client-cert.pem -text -noout

# Test SSL connection
openssl s_client -connect www7.aeat.es:443 \
  -cert /etc/ssl/verifactu/client-cert.pem \
  -key /etc/ssl/verifactu/client-key.pem \
  -CAfile /etc/ssl/verifactu/ca-chain.pem
```

### Windows Server Installation

#### Step 1: Import Certificate to Certificate Store
```powershell
# Import PFX certificate
Import-PfxCertificate -FilePath "client-cert.pfx" -CertStoreLocation "Cert:\LocalMachine\My"

# View imported certificate
Get-ChildItem -Path "Cert:\LocalMachine\My" | Where-Object {$_.Subject -like "*YourCompany*"}
```

#### Step 2: Export Certificate and Key
```powershell
# Export certificate to PEM format
$cert = Get-ChildItem -Path "Cert:\LocalMachine\My" | Where-Object {$_.Subject -like "*YourCompany*"}
$cert | Export-Certificate -FilePath "client-cert.cer" -Type CERT

# Export private key (requires additional tools)
# Use OpenSSL or similar tools to extract private key
```

### Docker Container Installation

#### Dockerfile Example
```dockerfile
FROM node:18-alpine

# Install OpenSSL
RUN apk add --no-cache openssl

# Create SSL directory
RUN mkdir -p /app/ssl

# Copy certificate files
COPY client-cert.pem /app/ssl/
COPY client-key.pem /app/ssl/
COPY ca-chain.pem /app/ssl/

# Set permissions
RUN chmod 600 /app/ssl/client-key.pem
RUN chmod 644 /app/ssl/client-cert.pem
RUN chmod 644 /app/ssl/ca-chain.pem

# Set environment variables
ENV SSL_CERT_PATH=/app/ssl/client-cert.pem
ENV SSL_KEY_PATH=/app/ssl/client-key.pem
ENV SSL_CA_PATH=/app/ssl/ca-chain.pem
```

#### Docker Compose Example
```yaml
version: '3.8'
services:
  verifactu-app:
    build: .
    volumes:
      - ./certs:/app/ssl:ro
    environment:
      - SSL_CERT_PATH=/app/ssl/client-cert.pem
      - SSL_KEY_PATH=/app/ssl/client-key.pem
      - SSL_CA_PATH=/app/ssl/ca-chain.pem
```

## HSM (Hardware Security Module) Integration

### HSM Requirements
- **FIPS 140-2 Level 2 or higher**
- **PKCS#11 support**
- **RSA key generation and storage**
- **Digital signature capabilities**

### HSM Configuration

#### Step 1: Install HSM Drivers
```bash
# Install PKCS#11 library
sudo apt-get install libp11-kit0 libp11-kit-dev

# Install HSM-specific drivers (example: SafeNet Luna)
sudo dpkg -i luna-hsm-client-*.deb
```

#### Step 2: Configure PKCS#11
```bash
# Create PKCS#11 configuration
cat > /etc/pkcs11/pkcs11.conf << EOF
# HSM Configuration
name = "Luna HSM"
library = /usr/lib/libpkcs11.so
slot = 0
EOF
```

#### Step 3: Generate Keys in HSM
```bash
# Generate RSA key pair in HSM
pkcs11-tool --module /usr/lib/libpkcs11.so \
  --login --pin 1234 \
  --keypairgen --key-type rsa:2048 \
  --id 1 --label "VeriFactu-Key"
```

### Node.js HSM Integration
```javascript
const pkcs11 = require('pkcs11');

// Initialize HSM
const mod = pkcs11.Module.load('/usr/lib/libpkcs11.so');
const session = mod.getSlots()[0].open();

// Login to HSM
session.login('1234');

// Find key in HSM
const key = session.findObjects({
  class: pkcs11.CKO_PRIVATE_KEY,
  label: 'VeriFactu-Key'
})[0];

// Use key for SSL/TLS
const https = require('https');
const agent = new https.Agent({
  pfx: null, // Use HSM instead
  pkcs11: {
    module: '/usr/lib/libpkcs11.so',
    slot: 0,
    pin: '1234',
    keyId: key.id
  }
});
```

## Certificate Rotation & Renewal

### Automated Renewal Process

#### Step 1: Monitor Certificate Expiration
```bash
#!/bin/bash
# Certificate expiration check
CERT_FILE="/etc/ssl/verifactu/client-cert.pem"
EXPIRY_DATE=$(openssl x509 -in $CERT_FILE -noout -enddate | cut -d= -f2)
EXPIRY_EPOCH=$(date -d "$EXPIRY_DATE" +%s)
CURRENT_EPOCH=$(date +%s)
DAYS_UNTIL_EXPIRY=$(( (EXPIRY_EPOCH - CURRENT_EPOCH) / 86400 ))

if [ $DAYS_UNTIL_EXPIRY -lt 30 ]; then
    echo "Certificate expires in $DAYS_UNTIL_EXPIRY days. Renewal required."
    # Trigger renewal process
fi
```

#### Step 2: Automated Renewal Script
```bash
#!/bin/bash
# Certificate renewal script
RENEWAL_DATE=$(date -d "+90 days" +%Y-%m-%d)

# Generate new certificate request
openssl req -new -newkey rsa:4096 -keyout new-client-key.pem -out new-client.csr

# Submit renewal request to FNMT/AEAT
# (This step requires manual intervention or API integration)

# Install new certificate
if [ -f "new-client-cert.pem" ]; then
    # Backup old certificate
    cp /etc/ssl/verifactu/client-cert.pem /etc/ssl/verifactu/client-cert.pem.backup
    cp /etc/ssl/verifactu/client-key.pem /etc/ssl/verifactu/client-key.pem.backup
    
    # Install new certificate
    cp new-client-cert.pem /etc/ssl/verifactu/client-cert.pem
    cp new-client-key.pem /etc/ssl/verifactu/client-key.pem
    
    # Restart services
    systemctl restart your-verifactu-service
fi
```

## Security Best Practices

### Certificate Storage Security

#### File System Security
```bash
# Set restrictive permissions
chmod 700 /etc/ssl/verifactu
chmod 600 /etc/ssl/verifactu/client-key.pem
chmod 644 /etc/ssl/verifactu/client-cert.pem

# Set ownership
chown root:root /etc/ssl/verifactu
chown root:root /etc/ssl/verifactu/client-key.pem
```

#### Environment Variables
```bash
# Set environment variables for certificate paths
export SSL_CERT_PATH="/etc/ssl/verifactu/client-cert.pem"
export SSL_KEY_PATH="/etc/ssl/verifactu/client-key.pem"
export SSL_CA_PATH="/etc/ssl/verifactu/ca-chain.pem"
```

### Logging Security

#### Secure Logging Configuration
```javascript
// Log certificate events without exposing sensitive data
const logCertificateEvent = (event, details) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event: event,
    certificateId: details.certificateId, // Hash of certificate
    action: details.action,
    // DO NOT log: private keys, certificate content, passwords
  };
  
  console.log(JSON.stringify(logEntry));
};
```

### Backup and Recovery

#### Certificate Backup
```bash
#!/bin/bash
# Certificate backup script
BACKUP_DIR="/backup/certificates/$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR

# Backup certificate files
cp /etc/ssl/verifactu/*.pem $BACKUP_DIR/

# Encrypt backup
tar -czf $BACKUP_DIR/certificates.tar.gz $BACKUP_DIR/*.pem
gpg --symmetric --cipher-algo AES256 $BACKUP_DIR/certificates.tar.gz

# Remove unencrypted files
rm $BACKUP_DIR/*.pem
```

## Troubleshooting

### Common Certificate Issues

#### Certificate Format Issues
```bash
# Check certificate format
openssl x509 -in client-cert.pem -text -noout

# Convert between formats
openssl x509 -in client-cert.pem -outform DER -out client-cert.der
openssl x509 -in client-cert.der -inform DER -out client-cert.pem
```

#### SSL/TLS Connection Issues
```bash
# Test SSL connection with verbose output
openssl s_client -connect www7.aeat.es:443 \
  -cert client-cert.pem \
  -key client-key.pem \
  -CAfile ca-chain.pem \
  -verify_return_error
```

#### Certificate Chain Issues
```bash
# Verify certificate chain
openssl verify -CAfile ca-chain.pem client-cert.pem

# Check certificate chain
openssl s_client -connect www7.aeat.es:443 \
  -showcerts -cert client-cert.pem -key client-key.pem
```

### Performance Optimization

#### Certificate Caching
```javascript
// Cache certificate for performance
const certificateCache = new Map();

const getCertificate = async (certPath) => {
  if (certificateCache.has(certPath)) {
    return certificateCache.get(certPath);
  }
  
  const cert = fs.readFileSync(certPath);
  certificateCache.set(certPath, cert);
  return cert;
};
```

#### Connection Pooling
```javascript
// Reuse HTTPS agent for multiple requests
const httpsAgent = new https.Agent({
  cert: clientCert,
  key: clientKey,
  ca: caChain,
  keepAlive: true,
  maxSockets: 10
});
```
