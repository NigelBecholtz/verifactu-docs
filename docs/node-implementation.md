# Node.js Implementation Guide

## Overview

This document provides detailed technical guidance for implementing the AEAT VERI*FACTU webservice in Node.js applications for CRM integration. It covers SOAP client configuration, TLS setup, error handling, and CRM-specific implementation patterns.

## CRM Integration Architecture

### CRM-AEAT Integration Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CRM System    │───▶│  AEAT Service   │───▶│   CSV Response   │
│                 │    │                 │    │                 │
│ • Invoice Data  │    │ • Validation    │    │ • CSV Code      │
│ • Customer Info │    │ • Processing    │    │ • Status        │
│ • Tax Details   │    │ • Verification  │    │ • Timestamp     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### CRM Database Schema

**Required CRM Tables:**
```sql
-- Invoice table with AEAT integration
CREATE TABLE invoices (
  id INT PRIMARY KEY,
  invoice_number VARCHAR(50),
  customer_id INT,
  total_amount DECIMAL(10,2),
  tax_amount DECIMAL(10,2),
  aeat_csv_code VARCHAR(100),        -- CSV from AEAT
  aeat_status ENUM('pending', 'verified', 'error'),
  aeat_timestamp DATETIME,
  aeat_error_message TEXT,
  created_at DATETIME,
  updated_at DATETIME
);

-- AEAT configuration table
CREATE TABLE aeat_config (
  id INT PRIMARY KEY,
  environment ENUM('test', 'production'),
  cert_path VARCHAR(255),
  cert_password VARCHAR(255),
  endpoint_url VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE
);
```

## CRM Service Implementation

### AEAT Service Class

```javascript
class AEATService {
  constructor(config) {
    this.config = config;
    this.httpsAgent = this.createHttpsAgent();
    this.soapClient = this.createSoapClient();
  }

  createHttpsAgent() {
    const https = require('https');
    const fs = require('fs');
    
    return new https.Agent({
      cert: fs.readFileSync(this.config.certPath),
      key: fs.readFileSync(this.config.keyPath),
      ca: fs.readFileSync(this.config.caPath),
      rejectUnauthorized: true,
      secureProtocol: 'TLSv1_2_method'
    });
  }

  async registerInvoice(invoiceData) {
    try {
      const soapRequest = this.buildSoapRequest(invoiceData);
      const response = await this.sendSoapRequest(soapRequest);
      return this.parseResponse(response);
    } catch (error) {
      throw new AEATError('Invoice registration failed', error);
    }
  }

  buildSoapRequest(invoice) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <RegFactuSistemaFacturacion>
      <Cabecera>
        <NIFEmisor>${invoice.issuerNIF}</NIFEmisor>
        <FechaEnvio>${new Date().toISOString()}</FechaEnvio>
        <TiempoEsperaEnvio>30</TiempoEsperaEnvio>
        <TipoComunicacion>Alta</TipoComunicacion>
      </Cabecera>
      <RegistroFactura>
        <RegistroAlta>
          <IDFactura>
            <NumSerieFacturaEmisor>${invoice.series}</NumSerieFacturaEmisor>
            <NumFacturaEmisor>${invoice.number}</NumFacturaEmisor>
          </IDFactura>
          <FechaExpedicionFactura>${invoice.date}</FechaExpedicionFactura>
          <NIFReceptor>${invoice.recipientNIF}</NIFReceptor>
          <ImporteTotal>${invoice.totalAmount}</ImporteTotal>
        </RegistroAlta>
      </RegistroFactura>
    </RegFactuSistemaFacturacion>
  </soap:Body>
</soap:Envelope>`;
  }
}
```

### CRM Integration Service

```javascript
class CRMIntegrationService {
  constructor(aeatService, database) {
    this.aeatService = aeatService;
    this.db = database;
  }

  async processInvoice(invoiceId) {
    const invoice = await this.db.getInvoice(invoiceId);
    
    try {
      // 1. Validate invoice data
      this.validateInvoice(invoice);
      
      // 2. Register with AEAT
      const aeatResponse = await this.aeatService.registerInvoice(invoice);
      
      // 3. Update CRM database
      await this.updateInvoiceWithAEATData(invoiceId, aeatResponse);
      
      // 4. Log success
      await this.logAEATSuccess(invoiceId, aeatResponse);
      
      return aeatResponse;
    } catch (error) {
      // Handle errors
      await this.handleAEATError(invoiceId, error);
      throw error;
    }
  }

  async updateInvoiceWithAEATData(invoiceId, aeatResponse) {
    const updateData = {
      aeat_csv_code: aeatResponse.csv,
      aeat_status: 'verified',
      aeat_timestamp: new Date(),
      aeat_error_message: null
    };
    
    await this.db.updateInvoice(invoiceId, updateData);
  }

  async handleAEATError(invoiceId, error) {
    const errorData = {
      aeat_status: 'error',
      aeat_error_message: error.message,
      aeat_timestamp: new Date()
    };
    
    await this.db.updateInvoice(invoiceId, errorData);
    await this.logAEATError(invoiceId, error);
  }
}
```

## Technical Architecture

### SOAP Client Configuration

**SOAP Client Setup**:
The SOAP client must be configured to handle mutual TLS authentication, proper XML namespaces, and AEAT-specific requirements.

**Key Configuration Elements**:
- **Mutual TLS**: Client certificate authentication
- **XML Namespaces**: Proper namespace handling
- **SOAP Version**: SOAP 1.1 Document/Literal protocol
- **Content Type**: application/soap+xml
- **Character Encoding**: UTF-8

**Connection Configuration**:
- **Timeout Settings**: Appropriate timeout values
- **Retry Logic**: Transient error handling
- **Connection Pooling**: Efficient connection management
- **Error Handling**: Comprehensive error processing

### TLS/SSL Setup with Certificates

**Certificate Management**:
The implementation must handle client certificates, server certificate verification, and certificate chain validation.

**Certificate Loading Process**:
1. **File System Access**: Read certificate files from secure location
2. **Format Parsing**: Parse PEM/PFX format appropriately
3. **Memory Management**: Load certificates into memory for use
4. **Error Handling**: Handle file not found, permission, or format errors

**TLS Configuration**:
- **Protocol Version**: TLS 1.2 or higher
- **Cipher Suites**: Strong cipher suites only
- **Certificate Verification**: Verify server certificates
- **Certificate Pinning**: Consider pinning AEAT certificates

**Security Considerations**:
- **Secure Storage**: Store certificates in secure, restricted directories
- **File Permissions**: Use appropriate file permissions (600 for private keys)
- **Passphrase Handling**: Securely handle certificate passphrases
- **Memory Security**: Clear sensitive data from memory after use

### Request/Response Parsing

**XML Processing**:
The implementation must handle SOAP envelope parsing, namespace resolution, and data extraction.

**Request Construction**:
1. **SOAP Envelope**: Build proper SOAP 1.1 Document/Literal envelope
2. **Namespace Handling**: Include all required namespaces
3. **Data Serialization**: Convert JavaScript objects to XML
4. **Validation**: Validate data before sending

**Response Processing**:
1. **SOAP Parsing**: Parse SOAP response envelope
2. **Namespace Resolution**: Handle namespace prefixes
3. **Data Extraction**: Extract business data from XML
4. **Error Detection**: Identify and handle errors

**XML Library Considerations**:
- **Performance**: Choose efficient XML parsing library
- **Memory Usage**: Consider memory usage for large responses
- **Error Handling**: Robust error handling for malformed XML
- **Namespace Support**: Full namespace support required

### Error Handling Strategy

**Multi-Level Error Handling**:
The implementation must handle errors at multiple levels: network, SOAP, and business logic.

**Network Level Errors**:
- **Connection Errors**: Network connectivity issues
- **Timeout Errors**: Request timeout handling
- **Certificate Errors**: TLS certificate issues
- **HTTP Errors**: HTTP status code errors

**SOAP Level Errors**:
- **SOAP Faults**: SOAP protocol errors
- **Namespace Errors**: XML namespace issues
- **Parsing Errors**: XML parsing failures
- **Validation Errors**: SOAP schema validation

**Business Logic Errors**:
- **Validation Errors**: Data validation failures
- **Business Rule Errors**: AEAT business rule violations
- **Authentication Errors**: Certificate authentication failures
- **System Errors**: AEAT system errors

**Error Recovery Strategies**:
- **Retry Logic**: Implement exponential backoff
- **Circuit Breaker**: Prevent cascading failures
- **Fallback Mechanisms**: Alternative processing paths
- **Monitoring**: Comprehensive error monitoring

## Recommended Node.js Libraries

### SOAP Libraries

**Primary Recommendation: `soap`**:
- **Features**: Full SOAP 1.1 Document/Literal support, WSDL parsing, client generation
- **TLS Support**: Built-in HTTPS support with certificate handling
- **Error Handling**: Comprehensive error handling
- **Performance**: Good performance for most use cases

**Alternative: `strong-soap`**:
- **Features**: Enterprise-grade SOAP client, better performance
- **TLS Support**: Advanced TLS configuration options
- **Error Handling**: More detailed error information
- **Performance**: Better performance for high-volume applications

**Library Selection Criteria**:
- **SOAP Version**: Must support SOAP 1.1 Document/Literal
- **TLS Support**: Must support mutual TLS
- **Namespace Handling**: Must handle complex namespaces
- **Error Handling**: Must provide detailed error information

### HTTP Clients with TLS Support

**Built-in `https` Module**:
- **Features**: Native Node.js HTTPS support
- **TLS Support**: Full TLS configuration options
- **Certificate Handling**: Built-in certificate support
- **Performance**: Excellent performance

**`axios` Library**:
- **Features**: Promise-based HTTP client
- **TLS Support**: HTTPS support with certificate options
- **Error Handling**: Comprehensive error handling
- **Interceptors**: Request/response interceptors

**Library Selection Criteria**:
- **TLS Support**: Must support mutual TLS
- **Certificate Options**: Must support client certificates
- **Error Handling**: Must provide detailed error information
- **Performance**: Must handle high-volume requests

### XML Parsing Libraries

**`xml2js` Library**:
- **Features**: XML to JavaScript object conversion
- **Namespace Support**: Full namespace support
- **Performance**: Good performance for most use cases
- **Error Handling**: Robust error handling

**`fast-xml-parser` Library**:
- **Features**: Fast XML parsing, multiple formats
- **Performance**: Excellent performance
- **Memory Usage**: Low memory usage
- **Error Handling**: Basic error handling

**Library Selection Criteria**:
- **Performance**: Must handle large XML documents
- **Namespace Support**: Must support XML namespaces
- **Error Handling**: Must handle malformed XML
- **Memory Usage**: Must be memory efficient

### Certificate Management

**`node-forge` Library**:
- **Features**: Cryptographic operations, certificate handling
- **Certificate Support**: Full X.509 certificate support
- **Key Management**: Private key handling
- **Format Support**: Multiple certificate formats

**`pem` Library**:
- **Features**: Certificate and key management
- **Format Support**: PEM, PFX, P12 formats
- **Key Operations**: Key generation and management
- **Certificate Operations**: Certificate parsing and validation

**Library Selection Criteria**:
- **Format Support**: Must support required certificate formats
- **Security**: Must provide secure certificate handling
- **Performance**: Must handle certificate operations efficiently
- **Error Handling**: Must handle certificate errors gracefully

## Best Practices

### Connection Pooling

**Connection Pool Configuration**:
- **Pool Size**: Configure appropriate pool size
- **Idle Timeout**: Set idle connection timeout
- **Max Connections**: Set maximum connections
- **Connection Reuse**: Reuse connections when possible

**Pool Management**:
- **Connection Lifecycle**: Manage connection lifecycle
- **Error Handling**: Handle connection errors
- **Monitoring**: Monitor pool usage and performance
- **Cleanup**: Properly cleanup connections

### Timeout Configuration

**Timeout Settings**:
- **Connection Timeout**: 30 seconds for initial connection
- **Request Timeout**: 60 seconds for request processing
- **Total Timeout**: 90 seconds for complete operation
- **Retry Timeout**: 5 seconds between retries

**Timeout Implementation**:
- **Per-Request Timeouts**: Set timeouts per request
- **Global Timeouts**: Set global timeout limits
- **Timeout Handling**: Handle timeout errors gracefully
- **Timeout Monitoring**: Monitor timeout occurrences

### Retry Mechanism

**Retry Strategy**:
- **Exponential Backoff**: Use exponential backoff for retries
- **Maximum Retries**: Set maximum retry attempts
- **Retry Conditions**: Define when to retry
- **Retry Limits**: Set retry time limits

**Retry Implementation**:
- **Transient Errors**: Retry transient errors
- **Permanent Errors**: Don't retry permanent errors
- **Retry Logging**: Log retry attempts
- **Retry Monitoring**: Monitor retry patterns

### Logging and Monitoring

**Logging Requirements**:
- **Request Logging**: Log all requests and responses
- **Error Logging**: Log all errors with details
- **Performance Logging**: Log performance metrics
- **Security Logging**: Log security events

**Monitoring Setup**:
- **Real-time Monitoring**: Monitor operations in real-time
- **Alerting**: Set up alerts for critical issues
- **Reporting**: Generate performance reports
- **Analysis**: Analyze performance and error patterns

**Logging Best Practices**:
- **Structured Logging**: Use structured log format
- **Log Levels**: Use appropriate log levels
- **Sensitive Data**: Don't log sensitive data
- **Log Retention**: Implement log retention policies

### Secure Storage of Certificates and Credentials

**Certificate Storage**:
- **Secure Location**: Store certificates in secure location
- **File Permissions**: Use appropriate file permissions
- **Access Control**: Limit access to authorized personnel
- **Backup**: Include certificates in backup procedures

**Credential Management**:
- **Environment Variables**: Use environment variables for credentials
- **Secret Management**: Use secret management systems
- **Encryption**: Encrypt sensitive data at rest
- **Access Control**: Implement proper access controls

**Security Best Practices**:
- **Principle of Least Privilege**: Limit access to minimum required
- **Regular Rotation**: Rotate certificates and credentials regularly
- **Audit Logging**: Log all access to sensitive data
- **Incident Response**: Have incident response procedures

## Implementation Patterns

### Service Layer Pattern

**Service Architecture**:
- **Service Interface**: Define service interface
- **Implementation**: Implement service logic
- **Error Handling**: Handle errors at service level
- **Logging**: Log service operations

**Service Implementation**:
```javascript
// Conceptual example - not actual code
class VeriFactuService {
  constructor(config) {
    this.config = config;
    this.client = this.createSOAPClient();
  }
  
  async registerInvoice(invoiceData) {
    try {
      const request = this.buildRequest(invoiceData);
      const response = await this.client.Alta(request);
      return this.processResponse(response);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
}
```

### Error Handling Pattern

**Error Handling Strategy**:
- **Error Classification**: Classify errors by type
- **Error Recovery**: Implement error recovery strategies
- **Error Logging**: Log errors with context
- **Error Monitoring**: Monitor error patterns

**Error Handling Implementation**:
```javascript
// Conceptual example - not actual code
class ErrorHandler {
  handleError(error) {
    if (error.type === 'NetworkError') {
      return this.handleNetworkError(error);
    } else if (error.type === 'ValidationError') {
      return this.handleValidationError(error);
    } else if (error.type === 'BusinessError') {
      return this.handleBusinessError(error);
    }
  }
}
```

### Configuration Management

**Configuration Strategy**:
- **Environment-based**: Use environment-based configuration
- **Validation**: Validate configuration on startup
- **Default Values**: Provide sensible defaults
- **Documentation**: Document all configuration options

**Configuration Implementation**:
```javascript
// Conceptual example - not actual code
class ConfigManager {
  constructor() {
    this.config = this.loadConfiguration();
    this.validateConfiguration();
  }
  
  loadConfiguration() {
    return {
      endpoint: process.env.VERIFACTU_ENDPOINT,
      certificate: process.env.CLIENT_CERTIFICATE,
      timeout: parseInt(process.env.REQUEST_TIMEOUT) || 60
    };
  }
}
```

## Performance Optimization

### Caching Strategy

**Cache Implementation**:
- **Response Caching**: Cache frequently accessed responses
- **Certificate Caching**: Cache certificate data
- **Configuration Caching**: Cache configuration data
- **Cache Invalidation**: Implement cache invalidation

**Cache Best Practices**:
- **Cache Keys**: Use appropriate cache keys
- **Cache Expiration**: Set appropriate expiration times
- **Cache Size**: Limit cache size
- **Cache Monitoring**: Monitor cache performance

### Memory Management

**Memory Optimization**:
- **Object Pooling**: Use object pooling for frequently created objects
- **Memory Monitoring**: Monitor memory usage
- **Garbage Collection**: Optimize garbage collection
- **Memory Leaks**: Prevent memory leaks

**Memory Best Practices**:
- **Resource Cleanup**: Clean up resources properly
- **Memory Limits**: Set memory limits
- **Monitoring**: Monitor memory usage
- **Profiling**: Profile memory usage

### Connection Optimization

**Connection Management**:
- **Connection Pooling**: Use connection pooling
- **Connection Reuse**: Reuse connections when possible
- **Connection Monitoring**: Monitor connection usage
- **Connection Cleanup**: Clean up connections properly

**Connection Best Practices**:
- **Pool Configuration**: Configure connection pools appropriately
- **Connection Limits**: Set connection limits
- **Timeout Settings**: Set appropriate timeouts
- **Error Handling**: Handle connection errors gracefully

## Testing Strategy

### Unit Testing

**Test Coverage**:
- **Service Methods**: Test all service methods
- **Error Handling**: Test error handling paths
- **Data Validation**: Test data validation
- **Configuration**: Test configuration handling

**Test Implementation**:
- **Mock Objects**: Use mocks for external dependencies
- **Test Data**: Use realistic test data
- **Assertions**: Use appropriate assertions
- **Coverage**: Aim for high test coverage

### Integration Testing

**Integration Test Scope**:
- **End-to-End**: Test complete workflows
- **Error Scenarios**: Test error scenarios
- **Performance**: Test performance characteristics
- **Security**: Test security aspects

**Integration Test Implementation**:
- **Test Environment**: Use test environment
- **Test Data**: Use test data only
- **Test Isolation**: Isolate tests from each other
- **Test Cleanup**: Clean up after tests

### Load Testing

**Load Test Scenarios**:
- **Normal Load**: Test under normal load
- **Peak Load**: Test under peak load
- **Stress Testing**: Test under stress conditions
- **Endurance Testing**: Test over extended periods

**Load Test Implementation**:
- **Test Tools**: Use appropriate load testing tools
- **Test Data**: Use realistic test data
- **Monitoring**: Monitor system during tests
- **Analysis**: Analyze test results

## Deployment Considerations

### Environment Configuration

**Environment Setup**:
- **Development**: Development environment configuration
- **Testing**: Testing environment configuration
- **Staging**: Staging environment configuration
- **Production**: Production environment configuration

**Configuration Management**:
- **Environment Variables**: Use environment variables
- **Configuration Files**: Use configuration files
- **Secret Management**: Use secret management systems
- **Validation**: Validate configuration on startup

### Security Considerations

**Security Measures**:
- **Certificate Security**: Secure certificate storage
- **Network Security**: Secure network communication
- **Data Protection**: Protect sensitive data
- **Access Control**: Implement access controls

**Security Best Practices**:
- **Principle of Least Privilege**: Limit access to minimum required
- **Regular Updates**: Keep dependencies updated
- **Security Monitoring**: Monitor for security issues
- **Incident Response**: Have incident response procedures

### Monitoring and Alerting

**Monitoring Setup**:
- **Application Monitoring**: Monitor application performance
- **Infrastructure Monitoring**: Monitor infrastructure
- **Security Monitoring**: Monitor security events
- **Business Monitoring**: Monitor business metrics

**Alerting Configuration**:
- **Critical Alerts**: Set up critical alerts
- **Warning Alerts**: Set up warning alerts
- **Alert Escalation**: Configure alert escalation
- **Alert Management**: Manage alert noise
