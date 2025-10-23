# API Endpoints & Operations

## Overview

The AEAT VERI*FACTU webservice provides three main operations for invoice management. All operations use SOAP 1.2 protocol with mutual TLS authentication.

## SOAP Endpoints

### Test Environment
- **URL**: `https://www7.aeat.es/jebi/ws/VeriFactu.wsdl`
- **Purpose**: Development and testing
- **Data**: Test data only, not real invoices
- **Certificates**: Test certificates required

### Production Environment
- **URL**: `https://www1.aeat.es/jebi/ws/VeriFactu.wsdl`
- **Purpose**: Live invoice processing
- **Data**: Real invoice data
- **Certificates**: Production certificates required

## Main Operations

### 1. Alta (Register Invoice)

**Purpose**: Register a new invoice with AEAT for verification

**SOAP Action**: `urn:VeriFactu/Alta`

**Description**: 
The Alta operation is used to register invoices with the Spanish tax authority. This is the primary operation for invoice verification and must be performed before sending invoices to customers.

**Key Features**:
- Real-time validation of invoice data
- Generation of CSV (Código Seguro de Verificación)
- Support for various invoice types
- Batch processing capabilities

**When to Use**:
- Before sending invoices to customers
- For B2B transactions
- For B2C transactions above threshold
- For international transactions

### 2. Baja/Anulación (Cancel Invoice)

**Purpose**: Cancel a previously registered invoice

**SOAP Action**: `urn:VeriFactu/Baja`

**Description**:
The Baja operation allows cancellation of previously registered invoices. This is required when invoices need to be voided or corrected.

**Key Features**:
- Cancel by invoice reference
- Support for partial cancellations
- Reason codes for cancellation
- Audit trail maintenance

**When to Use**:
- Invoice errors discovered after registration
- Customer requests cancellation
- Duplicate invoice registration
- System corrections

### 3. Consulta (Query Invoice)

**Purpose**: Retrieve information about registered invoices

**SOAP Action**: `urn:VeriFactu/Consulta`

**Description**:
The Consulta operation allows querying of previously registered invoices to retrieve their status, CSV codes, and other relevant information.

**Key Features**:
- Query by multiple criteria
- Retrieve invoice status
- Access to CSV codes
- Historical data access

**When to Use**:
- Verify invoice registration status
- Retrieve CSV codes for customer verification
- Audit and compliance checking
- System synchronization

## SOAP Protocol Details

### SOAP Version
- **Version**: SOAP 1.2
- **Namespace**: `http://www.w3.org/2003/05/soap-envelope`
- **Encoding**: UTF-8

### Required Headers

**SOAP Action Header**:
```
SOAPAction: "urn:VeriFactu/[OperationName]"
```

**Content-Type Header**:
```
Content-Type: application/soap+xml; charset=utf-8
```

**Authentication**: Handled via mutual TLS (client certificates)

### XML Namespaces

**Core Namespaces**:
- `soap`: `http://www.w3.org/2003/05/soap-envelope`
- `verifactu`: `urn:VeriFactu`
- `xsi`: `http://www.w3.org/2001/XMLSchema-instance`
- `xsd`: `http://www.w3.org/2001/XMLSchema`

**AEAT Specific Namespaces**:
- `aeat`: `http://www.aeat.es/verifactu`
- `factura`: `urn:VeriFactu:Factura`
- `cabecera`: `urn:VeriFactu:Cabecera`

## Request/Response Structure

### SOAP Envelope Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
               xmlns:verifactu="urn:VeriFactu"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <soap:Header>
    <!-- Authentication and session information -->
  </soap:Header>
  <soap:Body>
    <!-- Operation-specific content -->
  </soap:Body>
</soap:Envelope>
```

### Common Response Elements

**All operations return common response elements**:

- **EstadoEnvio**: Overall operation status
- **TiempoEsperaEnvio**: Processing time information
- **RespuestaLinea**: Per-invoice response details
- **CSV**: Secure verification code (for successful registrations)
- **Timestamp**: Processing timestamp
- **Error Details**: Error information if applicable

## Operation-Specific Details

### Alta Operation Details

**Request Structure**:
- **Cabecera**: Header information (sender, timestamp, etc.)
- **Factura**: Invoice data (lines, amounts, taxes, etc.)
- **TiempoEsperaEnvio**: Expected processing time

**Response Structure**:
- **EstadoEnvio**: Registration status
- **RespuestaLinea**: Per-line validation results
- **CSV**: Generated verification code
- **Timestamp**: Processing timestamp

### Baja Operation Details

**Request Structure**:
- **Cabecera**: Header information
- **ReferenciaFactura**: Reference to invoice to cancel
- **MotivoBaja**: Reason for cancellation
- **Timestamp**: Cancellation timestamp

**Response Structure**:
- **EstadoEnvio**: Cancellation status
- **RespuestaLinea**: Cancellation result
- **Timestamp**: Processing timestamp

### Consulta Operation Details

**Request Structure**:
- **Cabecera**: Header information
- **CriteriosBusqueda**: Search criteria
- **Filtros**: Optional filters

**Response Structure**:
- **EstadoEnvio**: Query status
- **Resultados**: Query results
- **Facturas**: Invoice details (if found)

## Error Handling

### HTTP Status Codes

**Common HTTP status codes**:
- **200 OK**: Successful operation
- **400 Bad Request**: Invalid request format
- **401 Unauthorized**: Authentication failure
- **403 Forbidden**: Access denied
- **500 Internal Server Error**: Server error

### SOAP Faults

**SOAP faults are returned for operation-specific errors**:
- **Client Faults**: Invalid data, missing required fields
- **Server Faults**: System errors, processing failures
- **Authentication Faults**: Certificate issues, authorization problems

## Performance Considerations

### Timeout Settings

**Recommended timeout values**:
- **Connection Timeout**: 30 seconds
- **Request Timeout**: 60 seconds
- **Total Timeout**: 90 seconds

### Batch Processing

**For multiple invoices**:
- **Batch Size**: Maximum 100 invoices per request
- **Processing Time**: Allow 2-5 minutes for large batches
- **Error Handling**: Partial success is possible

### Rate Limiting

**AEAT rate limits**:
- **Requests per minute**: Varies by certificate type
- **Daily limits**: Based on business size
- **Peak hours**: May have additional restrictions

## Testing Strategy

### Test Environment Usage

**Always test in test environment first**:
1. **Certificate Testing**: Verify certificate setup
2. **Operation Testing**: Test all three operations
3. **Error Testing**: Test error scenarios
4. **Performance Testing**: Test with realistic data volumes

### Production Deployment

**Before going live**:
1. **Certificate Validation**: Ensure production certificates work
2. **End-to-End Testing**: Complete workflow testing
3. **Monitoring Setup**: Implement proper logging and monitoring
4. **Rollback Plan**: Have rollback strategy ready

## Security Considerations

### Certificate Management

- **Secure Storage**: Store certificates securely
- **Access Control**: Limit access to certificate files
- **Monitoring**: Monitor certificate expiration
- **Backup**: Maintain secure backups

### Network Security

- **TLS Configuration**: Use strong TLS settings
- **Firewall Rules**: Configure appropriate firewall rules
- **Network Monitoring**: Monitor for suspicious activity
- **VPN Usage**: Consider VPN for additional security

### Data Security

- **Data Encryption**: Encrypt sensitive data in transit and at rest
- **Access Logging**: Log all access to sensitive data
- **Audit Trail**: Maintain complete audit trail
- **Data Retention**: Follow legal data retention requirements
