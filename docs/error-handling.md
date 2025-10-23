# Error Handling

## Overview

This document provides comprehensive information about error handling in the AEAT VERI*FACTU webservice, including error codes, validation rules, and troubleshooting guidance.

## HTTP Status Codes

### Standard HTTP Status Codes

**Success Codes**:
- **200 OK**: Successful operation
- **202 Accepted**: Operation accepted for processing

**Client Error Codes**:
- **400 Bad Request**: Invalid request format or data
- **401 Unauthorized**: Authentication failure (certificate issues)
- **403 Forbidden**: Access denied or insufficient permissions
- **404 Not Found**: Endpoint not found
- **405 Method Not Allowed**: Invalid HTTP method
- **413 Payload Too Large**: Request too large
- **415 Unsupported Media Type**: Invalid content type

**Server Error Codes**:
- **500 Internal Server Error**: Server processing error
- **502 Bad Gateway**: Gateway error
- **503 Service Unavailable**: Service temporarily unavailable
- **504 Gateway Timeout**: Request timeout

### AEAT-Specific Status Codes

**Additional Status Codes**:
- **422 Unprocessable Entity**: Business logic validation failed
- **429 Too Many Requests**: Rate limit exceeded
- **451 Unavailable For Legal Reasons**: Legal restrictions

## SOAP Faults

### SOAP Fault Structure

```xml
<soap:Fault xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Code>
    <soap:Value>soap:Client</soap:Value>
    <soap:Subcode>
      <soap:Value>aeat:ValidationError</soap:Value>
    </soap:Subcode>
  </soap:Code>
  <soap:Reason>
    <soap:Text xml:lang="en">Invalid NIF format</soap:Text>
  </soap:Reason>
  <soap:Detail>
    <aeat:ErrorDetails>
      <aeat:ErrorCode>001</aeat:ErrorCode>
      <aeat:ErrorMessage>Invalid NIF format</aeat:ErrorMessage>
      <aeat:FieldName>NIFEmisor</aeat:FieldName>
    </aeat:ErrorDetails>
  </soap:Detail>
</soap:Fault>
```

### SOAP Fault Types

**Client Faults (soap:Client)**:
- Invalid request data
- Missing required fields
- Invalid field formats
- Business rule violations

**Server Faults (soap:Server)**:
- System processing errors
- Database errors
- Service unavailable
- Internal system errors

## Error Codes and Descriptions

### Validation Errors (001-099)

| Code | Description | Field | Solution |
|------|-------------|-------|----------|
| **001** | Invalid NIF format | NIFEmisor, NIFReceptor | Check NIF format and check digit |
| **002** | Missing required field | Various | Provide all required fields |
| **003** | Invalid date format | FechaFactura, FechaEnvio | Use YYYY-MM-DD format |
| **004** | Invalid amount format | ImporteTotal, BaseImponible | Use decimal format with 2 places |
| **005** | Invalid invoice number format | NumFactura | Use valid invoice number format |
| **006** | Invalid time format | FechaEnvio | Use YYYY-MM-DDTHH:MM:SS format |
| **007** | Invalid enumeration value | TipoFactura, TipoComunicacion | Use valid enumeration values |
| **008** | Field too long | Various | Reduce field length |
| **009** | Field too short | Various | Increase field length |
| **010** | Invalid characters | Various | Remove invalid characters |

**Official Source**: [AEAT Error Codes](https://sede.agenciatributaria.gob.es/Sede/iva/sistemas-informaticos-facturacion-verifactu/informacion-tecnica/especificaciones-tecnicas-firma-electronica-registros-evento.html) (geopend 23-10-2025)

### Business Logic Errors (100-199)

| Code | Description | Cause | Solution |
|------|-------------|-------|----------|
| **101** | Duplicate invoice number | Invoice already exists | Use unique invoice number |
| **102** | Invalid tax calculation | Tax amounts don't match | Recalculate tax amounts |
| **103** | Missing tax information | Required tax data missing | Provide complete tax information |
| **104** | Invalid invoice type | Wrong invoice type for data | Use correct invoice type |
| **105** | Invoice too old | Invoice date too old | Use recent invoice date |
| **106** | Invoice in future | Invoice date in future | Use current or past date |
| **107** | Invalid customer NIF | Customer NIF not found | Verify customer NIF |
| **108** | Invalid issuer NIF | Issuer NIF not authorized | Verify issuer authorization |
| **109** | Amount mismatch | Line totals don't match | Recalculate line totals |
| **110** | Invalid discount | Discount calculation error | Correct discount calculation |

### Authentication Errors (200-299)

| Code | Description | Cause | Solution |
|------|-------------|-------|----------|
| **201** | Certificate not found | Missing client certificate | Provide valid certificate |
| **202** | Certificate expired | Certificate has expired | Renew certificate |
| **203** | Certificate invalid | Certificate format error | Use valid certificate format |
| **204** | Certificate not authorized | Certificate not authorized for service | Use authorized certificate |
| **205** | Certificate revoked | Certificate has been revoked | Use valid certificate |
| **206** | Invalid certificate chain | Certificate chain incomplete | Provide complete certificate chain |
| **207** | Certificate verification failed | Certificate verification error | Check certificate validity |
| **208** | Mutual TLS failed | TLS handshake failed | Check TLS configuration |
| **209** | Server certificate invalid | Server certificate error | Contact AEAT support |
| **210** | Certificate pinning failed | Certificate pinning error | Update certificate pinning |

### System Errors (300-399)

| Code | Description | Cause | Solution |
|------|-------------|-------|----------|
| **301** | Service unavailable | AEAT service down | Retry later |
| **302** | Database error | Database processing error | Contact AEAT support |
| **303** | Processing timeout | Operation timed out | Retry with longer timeout |
| **304** | Rate limit exceeded | Too many requests | Reduce request frequency |
| **305** | Maintenance mode | Service in maintenance | Wait for maintenance completion |
| **306** | Internal server error | Server processing error | Contact AEAT support |
| **307** | Gateway error | Gateway processing error | Retry request |
| **308** | Network error | Network connectivity issue | Check network connection |
| **309** | Service overloaded | Service under heavy load | Retry with backoff |
| **310** | Configuration error | Service configuration issue | Contact AEAT support |

## What Happens with Incorrect Invoices

### Partial Acceptance

**Scenario**: Some invoices in a batch are valid, others are not.

**Response**:
```xml
<verifactu:EstadoEnvio>AceptadoConErrores</verifactu:EstadoEnvio>
<verifactu:RespuestaLinea>
  <verifactu:EstadoRegistro>Correcto</verifactu:EstadoRegistro>
  <verifactu:CSV>ABC123DEF456</verifactu:CSV>
  <verifactu:NumFactura>INV-2024-001</verifactu:NumFactura>
</verifactu:RespuestaLinea>
<verifactu:RespuestaLinea>
  <verifactu:EstadoRegistro>Rechazado</verifactu:EstadoRegistro>
  <verifactu:NumFactura>INV-2024-002</verifactu:NumFactura>
  <verifactu:Errores>
    <verifactu:Error>
      <verifactu:Codigo>101</verifactu:Codigo>
      <verifactu:Descripcion>Duplicate invoice number</verifactu:Descripcion>
    </verifactu:Error>
  </verifactu:Errores>
</verifactu:RespuestaLinea>
```

**Action Required**:
- Process successful invoices normally
- Correct and resubmit failed invoices
- Maintain audit trail of both

### Complete Rejection

**Scenario**: All invoices in a batch are invalid.

**Response**:
```xml
<verifactu:EstadoEnvio>Rechazado</verifactu:EstadoEnvio>
<verifactu:Errores>
  <verifactu:Error>
    <verifactu:Codigo>001</verifactu:Codigo>
    <verifactu:Descripcion>Invalid NIF format</verifactu:Descripcion>
  </verifactu:Error>
</verifactu:Errores>
```

**Action Required**:
- Correct all errors
- Resubmit entire batch
- Check data validation

### Retry Strategy

**Transient Errors**:
- Network timeouts
- Service unavailable
- Rate limit exceeded
- Maintenance mode

**Retry Logic**:
1. **Immediate Retry**: For network errors
2. **Exponential Backoff**: For rate limits
3. **Maximum Retries**: 3-5 attempts
4. **Timeout**: Increase timeout for retries

**Example Retry Logic**:
```
Attempt 1: Immediate
Attempt 2: Wait 5 seconds
Attempt 3: Wait 15 seconds
Attempt 4: Wait 45 seconds
Attempt 5: Wait 135 seconds
```

## Local Storage Requirements

### CSV Storage

**What to Store**:
- CSV code for each successful invoice
- Invoice number and date
- Registration timestamp
- Response status

**Storage Format**:
```json
{
  "invoiceNumber": "INV-2024-001",
  "csv": "ABC123DEF456",
  "registrationDate": "2024-01-15T10:30:00",
  "status": "Correcto",
  "amount": 1000.00
}
```

**Storage Requirements**:
- **Security**: Encrypt sensitive data
- **Access Control**: Limit access to authorized personnel
- **Backup**: Include in backup procedures
- **Retention**: Keep for legal retention period

### Request/Response Audit Trail

**What to Store**:
- Complete request XML
- Complete response XML
- Timestamps
- User information
- Error details

**Storage Format**:
```json
{
  "requestId": "REQ-2024-001",
  "timestamp": "2024-01-15T10:30:00",
  "operation": "Alta",
  "request": "<xml>...</xml>",
  "response": "<xml>...</xml>",
  "status": "Correcto",
  "userId": "user123"
}
```

**Storage Requirements**:
- **Complete Records**: Store complete request/response
- **Immutable**: Do not modify stored records
- **Searchable**: Index for easy retrieval
- **Retention**: Keep for legal retention period

### Timestamps and Status

**What to Store**:
- Request timestamp
- Response timestamp
- Processing time
- Status changes
- Error timestamps

**Storage Format**:
```json
{
  "requestTimestamp": "2024-01-15T10:30:00",
  "responseTimestamp": "2024-01-15T10:30:30",
  "processingTime": 30,
  "status": "Correcto",
  "lastUpdated": "2024-01-15T10:30:30"
}
```

**Storage Requirements**:
- **Accuracy**: Use precise timestamps
- **Timezone**: Store in UTC
- **Synchronization**: Sync with system clock
- **Monitoring**: Monitor for time drift

### Legal Retention Period

**Retention Requirements**:
- **Minimum Period**: 4 years
- **Business Policy**: May require longer
- **Audit Purpose**: Keep for audit purposes
- **Legal Disputes**: May need for legal proceedings

**Storage Considerations**:
- **Secure Storage**: Use secure storage systems
- **Access Control**: Implement proper access controls
- **Backup**: Regular backups
- **Disposal**: Secure disposal after retention period

## Error Recovery Procedures

### Data Correction

**Validation Errors**:
1. **Identify Errors**: Parse error responses
2. **Correct Data**: Fix invalid data
3. **Validate Locally**: Check data before resubmission
4. **Resubmit**: Send corrected data

**Business Logic Errors**:
1. **Analyze Errors**: Understand business rule violations
2. **Correct Logic**: Fix business logic
3. **Test Changes**: Validate changes
4. **Resubmit**: Send corrected data

### System Recovery

**Transient Errors**:
1. **Wait**: Wait for service recovery
2. **Retry**: Retry with backoff
3. **Monitor**: Monitor service status
4. **Escalate**: Escalate if persistent

**Persistent Errors**:
1. **Investigate**: Investigate root cause
2. **Fix**: Fix underlying issues
3. **Test**: Test fixes
4. **Deploy**: Deploy fixes

### Data Synchronization

**After Errors**:
1. **Check Status**: Verify current status
2. **Reconcile**: Reconcile with AEAT
3. **Update**: Update local records
4. **Monitor**: Monitor for consistency

## Monitoring and Alerting

### Error Monitoring

**Key Metrics**:
- Error rate by type
- Response time
- Success rate
- Retry rate

**Monitoring Setup**:
- **Real-time Monitoring**: Monitor errors in real-time
- **Alerting**: Set up alerts for critical errors
- **Reporting**: Generate error reports
- **Analysis**: Analyze error patterns

### Alert Configuration

**Critical Alerts**:
- Authentication failures
- Service unavailable
- High error rates
- Data corruption

**Warning Alerts**:
- Increased response times
- Rate limit approaching
- Certificate expiration
- Storage issues

### Error Analysis

**Regular Analysis**:
- Weekly error reports
- Monthly trend analysis
- Quarterly review
- Annual audit

**Root Cause Analysis**:
- Identify error patterns
- Analyze error causes
- Implement preventive measures
- Document lessons learned

## Troubleshooting Guide

### Common Issues

**Certificate Issues**:
- Check certificate validity
- Verify certificate format
- Ensure proper certificate chain
- Check certificate permissions

**Network Issues**:
- Check network connectivity
- Verify firewall rules
- Test DNS resolution
- Check proxy settings

**Data Issues**:
- Validate data formats
- Check required fields
- Verify business rules
- Test with sample data

**System Issues**:
- Check system resources
- Verify configuration
- Test with minimal data
- Check logs for errors

### Diagnostic Steps

**Step 1: Check Certificates**:
- Verify certificate validity
- Check certificate format
- Ensure proper installation
- Test certificate chain

**Step 2: Test Connectivity**:
- Ping AEAT servers
- Test HTTPS connectivity
- Check firewall rules
- Verify DNS resolution

**Step 3: Validate Data**:
- Check data formats
- Verify required fields
- Test with sample data
- Validate business rules

**Step 4: Check Logs**:
- Review application logs
- Check system logs
- Analyze error messages
- Identify patterns

### Escalation Procedures

**Level 1: Application Issues**:
- Check application configuration
- Verify data formats
- Test with sample data
- Review application logs

**Level 2: System Issues**:
- Check system configuration
- Verify network connectivity
- Test certificate installation
- Review system logs

**Level 3: AEAT Issues**:
- Contact AEAT support
- Provide error details
- Include request/response data
- Follow up on resolution

**Level 4: Critical Issues**:
- Escalate to management
- Notify stakeholders
- Implement workarounds
- Document issues

## Monitoring and Alerting

### Key Metrics to Monitor
- **Success Rate**: Track successful vs failed requests
- **Response Time**: Monitor average response times
- **Error Rate**: Track error frequency by type
- **Certificate Status**: Monitor certificate expiration
- **Queue Depth**: Monitor pending requests

### Alert Thresholds
- **Critical**: Success rate < 95%
- **Warning**: Response time > 30 seconds
- **Info**: Certificate expires in 30 days
- **Critical**: Service unavailable

### Monitoring Tools
- **Application Monitoring**: Use APM tools
- **Infrastructure Monitoring**: Monitor servers and network
- **Log Aggregation**: Centralize log collection
- **Dashboard**: Real-time monitoring dashboard

**Official Source**: [AEAT Monitoring Guidelines](https://sede.agenciatributaria.gob.es/Sede/iva/sistemas-informaticos-facturacion-verifactu.html) (geopend 23-10-2025)
