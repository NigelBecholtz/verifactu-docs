# Certificate Visual Guide

## Overview

This document provides a comprehensive visual step-by-step guide for certificate procurement, installation, and management for VERI*FACTU implementation.

## FNMT Certificate Application Process

### Step 1: FNMT Registration

#### 1.1 Access FNMT Portal
**URL**: https://www.fnmt.es/

**Screenshot Description**:
```
┌─────────────────────────────────────────────────────────┐
│ FNMT - Fábrica Nacional de Moneda y Timbre              │
│ ┌─────────────────────────────────────────────────────┐   │
│ │ [Certificados] [Servicios] [Soporte] [Contacto]    │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐   │
│ │  🔐 Certificados Digitales                          │   │
│ │  ┌─────────────────────────────────────────────┐   │   │
│ │  │ [Solicitar Certificado] [Renovar] [Revocar] │   │   │
│ │  └─────────────────────────────────────────────┘   │   │
│ └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

#### 1.2 Create Account
**Command Sequence**:
```bash
# Navigate to registration
curl -L "https://www.fnmt.es/certificados/solicitar-certificado"

# Fill registration form
echo "Company: Your Company Name"
echo "NIF: 12345678Z"
echo "Email: admin@yourcompany.com"
echo "Phone: +34 123 456 789"
```

**Form Fields**:
- **Company Name**: [Your Company Name]
- **NIF**: [Your Tax ID]
- **Email**: [Contact Email]
- **Phone**: [Contact Phone]
- **Address**: [Company Address]

### Step 2: Certificate Generation

#### 2.1 Download Certificate Generation Tool
**Download Link**: https://www.fnmt.es/certificados/herramientas

**Installation Commands**:
```bash
# Download certificate generation tool
wget https://www.fnmt.es/certificados/herramientas/certificados-generator-linux.tar.gz

# Extract and install
tar -xzf certificados-generator-linux.tar.gz
cd certificados-generator
sudo ./install.sh

# Verify installation
certificados-generator --version
```

#### 2.2 Generate Certificate Request (CSR)
**Command Sequence**:
```bash
# Generate private key
openssl genrsa -out client-key.pem 4096

# Generate certificate request
openssl req -new -key client-key.pem -out client.csr -subj "/C=ES/ST=Madrid/L=Madrid/O=Your Company/OU=IT Department/CN=yourcompany.com/emailAddress=admin@yourcompany.com"

# Verify CSR
openssl req -in client.csr -text -noout
```

**CSR Content Example**:
```
-----BEGIN CERTIFICATE REQUEST-----
MIICVjCCAT4CAQAwZDELMAkGA1UEBhMCRVMxDzANBgNVBAgTBk1hZHJpZDEQMA4G
A1UEBxMHTWFkcmlkMRYwFAYDVQQKEw1Zb3VyIENvbXBhbnkxFDASBgNVBAsTC0lU
IERlcGFydG1lbnQxGTAXBgNVBAMTEHlvdXJjb21wYW55LmNvbTCCASIwDQYJKoZI
hvcNAQEBBQADggEPADCCAQoCggEBAL...
-----END CERTIFICATE REQUEST-----
```

### Step 3: Certificate Installation

#### 3.1 Linux Server Installation

**Step-by-Step Commands**:
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

# Set ownership
sudo chown root:root /etc/ssl/verifactu
sudo chown root:root /etc/ssl/verifactu/client-key.pem
```

**Directory Structure**:
```
/etc/ssl/verifactu/
├── client-cert.pem    (644) - Certificate
├── client-key.pem     (600) - Private key
└── ca-chain.pem       (644) - Certificate chain
```

#### 3.2 Windows Server Installation

**PowerShell Commands**:
```powershell
# Create certificate store directory
New-Item -ItemType Directory -Path "C:\Certificates\VeriFactu" -Force

# Import PFX certificate
Import-PfxCertificate -FilePath "client-cert.pfx" -CertStoreLocation "Cert:\LocalMachine\My" -Password (ConvertTo-SecureString -String "YourPassword" -Force -AsPlainText)

# View imported certificate
Get-ChildItem -Path "Cert:\LocalMachine\My" | Where-Object {$_.Subject -like "*YourCompany*"}

# Export certificate to PEM format
$cert = Get-ChildItem -Path "Cert:\LocalMachine\My" | Where-Object {$_.Subject -like "*YourCompany*"}
$cert | Export-Certificate -FilePath "C:\Certificates\VeriFactu\client-cert.cer" -Type CERT
```

**Windows Certificate Store**:
```
Cert:\LocalMachine\My\
└── Your Company Certificate
    ├── Subject: CN=yourcompany.com
    ├── Issuer: FNMT
    ├── Valid From: 2024-01-15
    └── Valid To: 2027-01-15
```

### Step 4: Certificate Testing

#### 4.1 Test Certificate Validity
**Command Sequence**:
```bash
# Test certificate format
openssl x509 -in /etc/ssl/verifactu/client-cert.pem -text -noout

# Test private key
openssl rsa -in /etc/ssl/verifactu/client-key.pem -check -noout

# Test certificate chain
openssl verify -CAfile /etc/ssl/verifactu/ca-chain.pem /etc/ssl/verifactu/client-cert.pem
```

**Expected Output**:
```
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number: 1234567890 (0x499602d2)
        Signature Algorithm: sha256WithRSAEncryption
        Issuer: C=ES, O=FNMT, CN=FNMT Clase 2 CA
        Validity
            Not Before: Jan 15 10:30:00 2024 GMT
            Not After : Jan 15 10:30:00 2027 GMT
        Subject: C=ES, ST=Madrid, L=Madrid, O=Your Company, CN=yourcompany.com
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                Public-Key: (4096 bit)
                Modulus: 00:aa:bb:cc:dd...
```

#### 4.2 Test SSL Connection
**Command Sequence**:
```bash
# Test connection to AEAT test environment
openssl s_client -connect www7.aeat.es:443 \
  -cert /etc/ssl/verifactu/client-cert.pem \
  -key /etc/ssl/verifactu/client-key.pem \
  -CAfile /etc/ssl/verifactu/ca-chain.pem \
  -verify_return_error
```

**Expected Output**:
```
CONNECTED(00000003)
depth=2 C = ES, O = FNMT, CN = FNMT Root CA
verify return:1
depth=1 C = ES, O = FNMT, CN = FNMT Clase 2 CA
verify return:1
depth=0 C = ES, O = AEAT, CN = www7.aeat.es
verify return:1
---
Certificate chain
 0 s:C = ES, O = AEAT, CN = www7.aeat.es
   i:C = ES, O = FNMT, CN = FNMT Clase 2 CA
 1 s:C = ES, O = FNMT, CN = FNMT Clase 2 CA
   i:C = ES, O = FNMT, CN = FNMT Root CA
 2 s:C = ES, O = FNMT, CN = FNMT Root CA
   i:C = ES, O = FNMT, CN = FNMT Root CA
---
New, TLSv1.2, Cipher is ECDHE-RSA-AES256-GCM-SHA384
Server public key is 4096 bit
Secure Renegotiation IS supported
Compression: NONE
Expansion: NONE
No ALPN negotiated
SSL-Session:
    Protocol  : TLSv1.2
    Cipher    : ECDHE-RSA-AES256-GCM-SHA384
    Session-ID: 1234567890ABCDEF...
    Session-ID-ctx:
    Master-Key: 1234567890ABCDEF...
    PSK identity: None
    PSK identity hint: None
    SRP username: None
    Start Time: 1642248600
    Timeout   : 7200 (sec)
    Verify return code: 0 (ok)
```

## Certificate Format Conversions

### PFX to PEM Conversion

#### Step 1: Extract Certificate
**Command Sequence**:
```bash
# Extract certificate from PFX
openssl pkcs12 -in client-cert.pfx -out client-cert.pem -clcerts -nokeys -passin pass:YourPassword

# Extract private key from PFX
openssl pkcs12 -in client-cert.pfx -out client-key.pem -nocerts -nodes -passin pass:YourPassword

# Extract CA chain from PFX
openssl pkcs12 -in client-cert.pfx -out ca-chain.pem -cacerts -nokeys -passin pass:YourPassword
```

#### Step 2: Verify Conversion
**Command Sequence**:
```bash
# Verify certificate
openssl x509 -in client-cert.pem -text -noout

# Verify private key
openssl rsa -in client-key.pem -check -noout

# Verify CA chain
openssl verify -CAfile ca-chain.pem client-cert.pem
```

### PEM to PFX Conversion

**Command Sequence**:
```bash
# Convert PEM to PFX
openssl pkcs12 -export -out client-cert.pfx \
  -inkey client-key.pem \
  -in client-cert.pem \
  -certfile ca-chain.pem \
  -passout pass:YourPassword
```

## HSM Integration

### HSM Setup

#### Step 1: Install HSM Drivers
**Command Sequence**:
```bash
# Install PKCS#11 library
sudo apt-get update
sudo apt-get install libp11-kit0 libp11-kit-dev

# Install HSM-specific drivers (example: SafeNet Luna)
sudo dpkg -i luna-hsm-client-*.deb

# Verify installation
pkcs11-tool --module /usr/lib/libpkcs11.so --list-slots
```

#### Step 2: Configure PKCS#11
**Configuration File**: `/etc/pkcs11/pkcs11.conf`
```ini
# HSM Configuration
name = "Luna HSM"
library = /usr/lib/libpkcs11.so
slot = 0
```

#### Step 3: Generate Keys in HSM
**Command Sequence**:
```bash
# Generate RSA key pair in HSM
pkcs11-tool --module /usr/lib/libpkcs11.so \
  --login --pin 1234 \
  --keypairgen --key-type rsa:2048 \
  --id 1 --label "VeriFactu-Key"

# List keys in HSM
pkcs11-tool --module /usr/lib/libpkcs11.so \
  --login --pin 1234 \
  --list-objects
```

## Certificate Monitoring

### Certificate Expiration Monitoring

#### Script: Certificate Expiry Check
**File**: `check-certificate-expiry.sh`
```bash
#!/bin/bash
# Certificate expiry monitoring script

CERT_FILE="/etc/ssl/verifactu/client-cert.pem"
EXPIRY_DATE=$(openssl x509 -in $CERT_FILE -noout -enddate | cut -d= -f2)
EXPIRY_EPOCH=$(date -d "$EXPIRY_DATE" +%s)
CURRENT_EPOCH=$(date +%s)
DAYS_UNTIL_EXPIRY=$(( (EXPIRY_EPOCH - CURRENT_EPOCH) / 86400 ))

echo "Certificate expires in $DAYS_UNTIL_EXPIRY days"

if [ $DAYS_UNTIL_EXPIRY -lt 30 ]; then
    echo "WARNING: Certificate expires in $DAYS_UNTIL_EXPIRY days. Renewal required."
    # Send alert
    echo "Certificate renewal required" | mail -s "Certificate Expiry Alert" admin@yourcompany.com
fi

if [ $DAYS_UNTIL_EXPIRY -lt 7 ]; then
    echo "CRITICAL: Certificate expires in $DAYS_UNTIL_EXPIRY days. Immediate renewal required."
    # Send critical alert
    echo "CRITICAL: Certificate expires in $DAYS_UNTIL_EXPIRY days" | mail -s "CRITICAL: Certificate Expiry" admin@yourcompany.com
fi
```

#### Cron Job Setup
**Crontab Entry**:
```bash
# Check certificate expiry daily
0 9 * * * /path/to/check-certificate-expiry.sh

# Check certificate expiry weekly
0 9 * * 1 /path/to/check-certificate-expiry.sh
```

### Certificate Health Check

#### Script: Certificate Health Check
**File**: `certificate-health-check.sh`
```bash
#!/bin/bash
# Comprehensive certificate health check

CERT_FILE="/etc/ssl/verifactu/client-cert.pem"
KEY_FILE="/etc/ssl/verifactu/client-key.pem"
CA_FILE="/etc/ssl/verifactu/ca-chain.pem"

echo "=== Certificate Health Check ==="

# Check certificate validity
echo "1. Checking certificate validity..."
openssl x509 -in $CERT_FILE -text -noout > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Certificate is valid"
else
    echo "❌ Certificate is invalid"
fi

# Check private key
echo "2. Checking private key..."
openssl rsa -in $KEY_FILE -check -noout > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Private key is valid"
else
    echo "❌ Private key is invalid"
fi

# Check certificate chain
echo "3. Checking certificate chain..."
openssl verify -CAfile $CA_FILE $CERT_FILE > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Certificate chain is valid"
else
    echo "❌ Certificate chain is invalid"
fi

# Check file permissions
echo "4. Checking file permissions..."
if [ -r $CERT_FILE ] && [ -r $KEY_FILE ] && [ -r $CA_FILE ]; then
    echo "✅ All certificate files are readable"
else
    echo "❌ Some certificate files are not readable"
fi

# Check key permissions
if [ $(stat -c %a $KEY_FILE) -eq 600 ]; then
    echo "✅ Private key has correct permissions (600)"
else
    echo "❌ Private key has incorrect permissions"
fi

echo "=== Health Check Complete ==="
```

## Troubleshooting

### Common Certificate Issues

#### Issue 1: Certificate Format Error
**Error Message**: `unable to load certificate`
**Solution**:
```bash
# Check certificate format
file /etc/ssl/verifactu/client-cert.pem

# Convert if necessary
openssl x509 -in client-cert.pem -outform PEM -out client-cert.pem
```

#### Issue 2: Private Key Mismatch
**Error Message**: `private key does not match certificate`
**Solution**:
```bash
# Check key and certificate match
openssl x509 -noout -modulus -in client-cert.pem | openssl md5
openssl rsa -noout -modulus -in client-key.pem | openssl md5

# If hashes don't match, regenerate certificate
```

#### Issue 3: Certificate Chain Issues
**Error Message**: `unable to verify certificate`
**Solution**:
```bash
# Check certificate chain
openssl verify -CAfile ca-chain.pem client-cert.pem

# If verification fails, download updated CA chain
wget https://www.fnmt.es/certificados/ca-chain.pem
```

### Performance Optimization

#### Certificate Caching
**File**: `certificate-cache.js`
```javascript
const fs = require('fs');
const crypto = require('crypto');

class CertificateCache {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 300000; // 5 minutes
  }
  
  getCertificate(certPath) {
    const cacheKey = this.getCacheKey(certPath);
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.certificate;
    }
    
    const certificate = fs.readFileSync(certPath);
    this.cache.set(cacheKey, {
      certificate: certificate,
      timestamp: Date.now()
    });
    
    return certificate;
  }
  
  getCacheKey(certPath) {
    const stats = fs.statSync(certPath);
    return crypto.createHash('md5')
      .update(certPath + stats.mtime.getTime())
      .digest('hex');
  }
  
  clearCache() {
    this.cache.clear();
  }
}

module.exports = CertificateCache;
```

## Security Best Practices

### Certificate Storage Security

#### Secure Directory Setup
**Command Sequence**:
```bash
# Create secure directory with proper permissions
sudo mkdir -p /etc/ssl/verifactu
sudo chmod 700 /etc/ssl/verifactu
sudo chown root:root /etc/ssl/verifactu

# Set up audit logging
sudo auditctl -w /etc/ssl/verifactu -p rwxa -k verifactu_certificates
```

#### Backup and Recovery
**Command Sequence**:
```bash
# Create encrypted backup
tar -czf certificates-backup.tar.gz /etc/ssl/verifactu/
gpg --symmetric --cipher-algo AES256 certificates-backup.tar.gz

# Store backup securely
mv certificates-backup.tar.gz.gpg /secure/backup/location/
```

### Monitoring and Alerting

#### Certificate Monitoring Dashboard
**File**: `certificate-monitor.js`
```javascript
const fs = require('fs');
const cron = require('node-cron');

class CertificateMonitor {
  constructor() {
    this.certificates = [
      '/etc/ssl/verifactu/client-cert.pem',
      '/etc/ssl/verifactu/ca-chain.pem'
    ];
  }
  
  checkCertificateExpiry(certPath) {
    const cert = fs.readFileSync(certPath);
    const expiryDate = new Date(cert.toString().match(/Not After : (.+)/)[1]);
    const daysUntilExpiry = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
    
    return {
      path: certPath,
      expiryDate: expiryDate,
      daysUntilExpiry: daysUntilExpiry,
      isExpiring: daysUntilExpiry < 30
    };
  }
  
  startMonitoring() {
    // Check certificates every day at 9 AM
    cron.schedule('0 9 * * *', () => {
      this.certificates.forEach(certPath => {
        const status = this.checkCertificateExpiry(certPath);
        
        if (status.isExpiring) {
          console.warn(`Certificate ${certPath} expires in ${status.daysUntilExpiry} days`);
          // Send alert
          this.sendAlert(status);
        }
      });
    });
  }
  
  sendAlert(status) {
    // Implement alerting logic
    console.log(`ALERT: Certificate ${status.path} expires in ${status.daysUntilExpiry} days`);
  }
}

module.exports = CertificateMonitor;
```
