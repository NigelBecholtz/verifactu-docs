# STEP 6: Production Deployment

## Overview

This is the final step - deploying your AEAT VERI*FACTU integration to production. Make sure you've completed all previous steps before proceeding.

## STEP 6: Production Deployment

### Production Checklist
**Before going live, verify:**

- ✅ **All tests passed** in test environment
- ✅ **Production certificate** is valid and configured
- ✅ **Error handling** is implemented
- ✅ **Logging** is set up
- ✅ **Monitoring** is configured

### Production Environment Setup
**Use the production environment:**

- **Production URL**: `https://www1.agenciatributaria.gob.es/wlpl/TIKE-CONT/ws/SistemaFacturacion/VerifactuSOAP`
- **Production Certificate**: Use your valid FNMT certificate
- **Real Data**: Use actual invoice data

**→ [Back to Overview](index.md)**

---

## API Endpoints & Operations

## SOAP Endpoints

### Test Environment (VERI*FACTU)
- **URL**: `https://prewww1.aeat.es/wlpl/TIKE-CONT/ws/SistemaFacturacion/VerifactuSOAP`
- **WSDL**: `https://prewww1.aeat.es/wlpl/TIKE-CONT/ws/SistemaFacturacion/SistemaFacturacion.wsdl`
- **Purpose**: Development and testing
- **Data**: Test data only, not real invoices
- **Certificates**: Test certificates required

### Production Environment (VERI*FACTU)
- **URL**: `https://www1.agenciatributaria.gob.es/wlpl/TIKE-CONT/ws/SistemaFacturacion/VerifactuSOAP`
- **WSDL**: `https://www1.agenciatributaria.gob.es/wlpl/TIKE-CONT/ws/SistemaFacturacion/SistemaFacturacion.wsdl`
- **Purpose**: Live invoice processing
- **Data**: Real invoice data
- **Certificates**: Production certificates required

### Production Environment (Certificate Seal)
- **URL**: `https://www10.agenciatributaria.gob.es/wlpl/TIKE-CONT/ws/SistemaFacturacion/VerifactuSOAP`
- **Purpose**: Production with certificate seal
- **Data**: Real invoice data
- **Certificates**: Production certificates with seal required

## Test Data and Sandbox

### Test Environment Access
- **Registration Required**: Must register for test environment access
- **Test Certificates**: Use test certificates only
- **Data Isolation**: Test data is completely isolated from production
- **Rate Limits**: Higher rate limits for testing purposes

### Test Data Guidelines
- **NIF Format**: Use test NIFs (e.g., 12345678Z for testing)
- **Invoice Numbers**: Use test prefixes (e.g., TEST-2024-001)
- **Amounts**: Use realistic test amounts
- **Dates**: Use current or past dates only

### Sandbox Features
- **Full API Access**: All operations available in test environment
- **Error Simulation**: Can simulate various error conditions
- **Performance Testing**: Suitable for load testing
- **Integration Testing**: Complete integration testing support

**Official Source**: [AEAT Test Environment](https://sede.agenciatributaria.gob.es/Sede/iva/sistemas-informaticos-facturacion-verifactu.html) (geopend 23-10-2025)

## Main Operations

### 1. RegFactuSistemaFacturacion (Register Invoice)

**Purpose**: Register a new invoice with AEAT for verification

**SOAP Action**: `RegFactuSistemaFacturacion`

**Description**: 
The RegFactuSistemaFacturacion operation is used to register invoices with the Spanish tax authority. This is the primary operation for invoice verification and must be performed before sending invoices to customers.

**Key Features**:
- Real-time validation of invoice data
- Generation of CSV (Código Seguro de Verificación)
- Support for various invoice types
- Batch processing capabilities (max 1,000 records per request)
- Support for both voluntary and required submissions

**When to Use**:
- Before sending invoices to customers
- For B2B transactions
- For B2C transactions above threshold
- For international transactions
- Response to AEAT requirements

### 2. ConsultaFactuSistemaFacturacion (Query Invoice)

**Purpose**: Retrieve information about registered invoices

**SOAP Action**: `ConsultaFactuSistemaFacturacion`

**Description**:
The ConsultaFactuSistemaFacturacion operation allows querying of previously registered invoices to retrieve their status, CSV codes, and other relevant information.

**Key Features**:
- Query by multiple criteria (issuer, recipient, date range)
- Retrieve invoice status
- Access to CSV codes
- Historical data access
- Pagination support
- Filter by external reference (RefExterna)
- Query by System Information (SIF)

**When to Use**:
- Verify invoice registration status
- Retrieve CSV codes for customer verification
- Audit and compliance checking
- System synchronization
- Response to customer inquiries

**Note**: This service is only available for voluntary submissions (VERI*FACTU), not for required submissions.

## SOAP Protocol Details

### SOAP Version
- **Version**: SOAP 1.1 Document/Literal
- **Namespace**: `http://schemas.xmlsoap.org/soap/envelope/`
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
- `soap`: `http://schemas.xmlsoap.org/soap/envelope/`
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
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
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

### Performance Specifications

**Response Times**:
- **Simple Operations**: < 5 seconds
- **Complex Operations**: < 30 seconds
- **Batch Operations**: < 2 minutes
- **Peak Hours**: May be 2-3x longer

**Throughput Limits**:
- **Single Requests**: 1 request per second
- **Batch Requests**: Up to 100 invoices per batch
- **Daily Volume**: Based on business certificate type
- **Concurrent Connections**: Maximum 10 concurrent connections

**Official Source**: [AEAT Performance Guidelines](https://sede.agenciatributaria.gob.es/Sede/iva/sistemas-informaticos-facturacion-verifactu.html) (geopend 23-10-2025)

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
