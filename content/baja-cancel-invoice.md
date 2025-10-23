# Cancel Invoice (Baja/Anulación)

## Overview

The Baja operation is used to cancel previously registered invoices with the Spanish tax authority (AEAT). This operation is required when invoices need to be voided, corrected, or annulled.

## Purpose

- **Invoice Cancellation**: Cancel previously registered invoices
- **Error Correction**: Handle registration errors
- **Compliance**: Maintain audit trail of cancellations
- **Data Integrity**: Ensure accurate tax records

## SOAP Action

```
SOAPAction: "urn:VeriFactu/Baja"
```

## XML Namespaces

```xml
xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
xmlns:verifactu="urn:VeriFactu"
xmlns:aeat="http://www.aeat.es/verifactu"
xmlns:factura="urn:VeriFactu:Factura"
xmlns:cabecera="urn:VeriFactu:Cabecera"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xmlns:xsd="http://www.w3.org/2001/XMLSchema"
```

## When to Use Baja

### Valid Cancellation Scenarios

**Invoice Errors**:
- Incorrect invoice data
- Wrong amounts or tax calculations
- Invalid customer information
- Duplicate invoice registration

**Business Changes**:
- Customer cancellation request
- Product return or refund
- Contract termination
- Service cancellation

**System Corrections**:
- Data migration errors
- System integration issues
- Manual corrections
- Audit findings

### Invalid Cancellation Scenarios

**Cannot Cancel**:
- Invoices already sent to customers
- Invoices with payments received
- Invoices older than 4 years
- Invoices with legal disputes

## Request Structure

### SOAP Envelope

```xml
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:verifactu="urn:VeriFactu"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <soap:Header>
    <!-- Authentication handled via mutual TLS -->
  </soap:Header>
  <soap:Body>
    <verifactu:Baja>
      <verifactu:Cabecera>
        <!-- Header information -->
      </verifactu:Cabecera>
      <verifactu:Factura>
        <!-- Invoice reference and cancellation details -->
      </verifactu:Factura>
    </verifactu:Baja>
  </soap:Body>
</soap:Envelope>
```

### Cabecera (Header) Fields

**Required Fields**:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `NIFEmisor` | String | Tax ID of invoice issuer | "12345678Z" |
| `FechaEnvio` | DateTime | Date and time of cancellation | "2024-01-15T10:30:00" |
| `TiempoEsperaEnvio` | Integer | Expected processing time in seconds | 30 |
| `TipoComunicacion` | Enum | Type of communication | "Baja" |

**Optional Fields**:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `NumeroRegistro` | String | Registration number | "REG001" |
| `Observaciones` | String | Additional observations | "Customer cancellation" |

### Factura (Invoice) Fields

**Required Fields**:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `NumFactura` | String | Invoice number to cancel | "INV-2024-001" |
| `FechaFactura` | Date | Original invoice date | "2024-01-15" |
| `NIFReceptor` | String | Tax ID of invoice recipient | "87654321A" |
| `ImporteTotal` | Decimal | Original invoice amount | 1000.00 |
| `TipoFactura` | Enum | Original invoice type | "F1" |

**Cancellation-Specific Fields**:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `MotivoBaja` | Enum | Reason for cancellation | "01" |
| `FechaOperacion` | Date | Cancellation date | "2024-01-15" |
| `DescripcionOperacion` | String | Cancellation description | "Customer cancellation" |
| `SerieFactura` | String | Invoice series | "A" |

**Optional Fields**:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `NumFacturaRectificativa` | String | Replacement invoice number | "INV-2024-002" |
| `ClaveRegimenEspecialOTrascendencia` | String | Special regime key | "01" |

## Complete Request Example

```xml
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:verifactu="urn:VeriFactu"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <soap:Header />
  <soap:Body>
    <verifactu:Baja>
      <verifactu:Cabecera>
        <verifactu:NIFEmisor>12345678Z</verifactu:NIFEmisor>
        <verifactu:FechaEnvio>2024-01-15T10:30:00</verifactu:FechaEnvio>
        <verifactu:TiempoEsperaEnvio>30</verifactu:TiempoEsperaEnvio>
        <verifactu:TipoComunicacion>Baja</verifactu:TipoComunicacion>
      </verifactu:Cabecera>
      <verifactu:Factura>
        <verifactu:NumFactura>INV-2024-001</verifactu:NumFactura>
        <verifactu:FechaFactura>2024-01-15</verifactu:FechaFactura>
        <verifactu:NIFReceptor>87654321A</verifactu:NIFReceptor>
        <verifactu:ImporteTotal>1000.00</verifactu:ImporteTotal>
        <verifactu:TipoFactura>F1</verifactu:TipoFactura>
        <verifactu:MotivoBaja>01</verifactu:MotivoBaja>
        <verifactu:FechaOperacion>2024-01-15</verifactu:FechaOperacion>
        <verifactu:DescripcionOperacion>Customer cancellation</verifactu:DescripcionOperacion>
      </verifactu:Factura>
    </verifactu:Baja>
  </soap:Body>
</soap:Envelope>
```

## Response Structure

### SOAP Response Envelope

```xml
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:verifactu="urn:VeriFactu"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <soap:Header />
  <soap:Body>
    <verifactu:BajaResponse>
      <verifactu:Cabecera>
        <!-- Response header -->
      </verifactu:Cabecera>
      <verifactu:RespuestaLinea>
        <!-- Per-invoice response -->
      </verifactu:RespuestaLinea>
    </verifactu:BajaResponse>
  </soap:Body>
</soap:Envelope>
```

### Response Fields

**Cabecera (Response Header)**:

| Field | Type | Description | Possible Values |
|-------|------|-------------|-----------------|
| `EstadoEnvio` | Enum | Overall status | Correcto, Rechazado, AceptadoConErrores |
| `TiempoEsperaEnvio` | Integer | Processing time used | 30 |
| `TimestampRespuesta` | DateTime | Response timestamp | "2024-01-15T10:30:30" |

**RespuestaLinea (Per-Invoice Response)**:

| Field | Type | Description | Possible Values |
|-------|------|-------------|-----------------|
| `EstadoRegistro` | Enum | Cancellation status | Correcto, Rechazado, AceptadoConErrores |
| `NumFactura` | String | Invoice number | "INV-2024-001" |
| `FechaFactura` | Date | Original invoice date | "2024-01-15" |
| `ImporteTotal` | Decimal | Original invoice amount | 1000.00 |
| `Errores` | Array | Error details (if any) | See error codes |

## Complete Response Example

```xml
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:verifactu="urn:VeriFactu"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <soap:Header />
  <soap:Body>
    <verifactu:BajaResponse>
      <verifactu:Cabecera>
        <verifactu:EstadoEnvio>Correcto</verifactu:EstadoEnvio>
        <verifactu:TiempoEsperaEnvio>30</verifactu:TiempoEsperaEnvio>
        <verifactu:TimestampRespuesta>2024-01-15T10:30:30</verifactu:TimestampRespuesta>
      </verifactu:Cabecera>
      <verifactu:RespuestaLinea>
        <verifactu:EstadoRegistro>Correcto</verifactu:EstadoRegistro>
        <verifactu:NumFactura>INV-2024-001</verifactu:NumFactura>
        <verifactu:FechaFactura>2024-01-15</verifactu:FechaFactura>
        <verifactu:ImporteTotal>1000.00</verifactu:ImporteTotal>
      </verifactu:RespuestaLinea>
    </verifactu:BajaResponse>
  </soap:Body>
</soap:Envelope>
```

## MotivoBaja (Cancellation Reason) Codes

### Standard Cancellation Reasons

| Code | Description | Use Case |
|------|-------------|----------|
| **01** | Customer cancellation | Customer requested cancellation |
| **02** | Data error | Incorrect invoice data |
| **03** | Duplicate invoice | Duplicate registration |
| **04** | System error | Technical system error |
| **05** | Business change | Contract termination |
| **06** | Product return | Return of goods |
| **07** | Service cancellation | Service no longer provided |
| **08** | Price correction | Price adjustment |
| **09** | Tax correction | Tax calculation error |
| **10** | Other | Other valid reason |

### Special Cases

| Code | Description | Use Case |
|------|-------------|----------|
| **11** | Legal requirement | Court order or legal requirement |
| **12** | Audit finding | Internal or external audit |
| **13** | Regulatory change | Change in tax regulations |
| **14** | System migration | Data migration error |
| **15** | Manual correction | Manual data correction |

## Validation Rules

### Invoice Reference Validation
- **Invoice Must Exist**: Invoice must be previously registered
- **Status Check**: Invoice must be in correct status for cancellation
- **Time Limits**: Check if cancellation is within allowed timeframe
- **Authority**: Verify cancellation authority

### Data Consistency
- **Original Data**: Must match original registration data
- **Amounts**: Must match original invoice amounts
- **Dates**: Must match original invoice dates
- **NIFs**: Must match original NIFs

### Business Rules
- **Time Limits**: Cancellation must be within allowed timeframe
- **Status**: Invoice must be in cancellable status
- **Dependencies**: Check for dependent operations
- **Legal**: Verify legal requirements

## Error Handling

### Common Cancellation Errors

**Validation Errors**:
- Invoice not found
- Invalid cancellation reason
- Missing required fields
- Data mismatch with original

**Business Logic Errors**:
- Invoice already cancelled
- Invoice too old for cancellation
- Invoice has dependent operations
- Legal restrictions

**System Errors**:
- Service unavailable
- Timeout errors
- Certificate issues
- Network problems

### Error Response Structure

```xml
<verifactu:RespuestaLinea>
  <verifactu:EstadoRegistro>Rechazado</verifactu:EstadoRegistro>
  <verifactu:Errores>
    <verifactu:Error>
      <verifactu:Codigo>201</verifactu:Codigo>
      <verifactu:Descripcion>Invoice not found</verifactu:Descripcion>
    </verifactu:Error>
  </verifactu:Errores>
</verifactu:RespuestaLinea>
```

## Best Practices

### Before Cancellation
- **Verify Need**: Ensure cancellation is necessary
- **Check Dependencies**: Verify no dependent operations
- **Validate Data**: Ensure all data is correct
- **Check Time Limits**: Verify cancellation is allowed

### During Cancellation
- **Use Correct Reason**: Select appropriate MotivoBaja
- **Provide Description**: Add clear description
- **Log Everything**: Log all cancellation attempts
- **Handle Errors**: Implement proper error handling

### After Cancellation
- **Verify Success**: Confirm cancellation was successful
- **Update Records**: Update local records
- **Notify Stakeholders**: Inform relevant parties
- **Audit Trail**: Maintain audit trail

## Audit Trail Requirements

### What to Store
- **Original Invoice**: Keep original invoice data
- **Cancellation Request**: Store cancellation request
- **Cancellation Response**: Store cancellation response
- **Timestamps**: Record all timestamps
- **User Information**: Record who initiated cancellation

### Retention Period
- **Legal Requirement**: 4 years minimum
- **Business Policy**: May require longer retention
- **Audit Purpose**: Keep for audit purposes
- **Legal Disputes**: May need for legal proceedings

### Storage Requirements
- **Secure Storage**: Store securely
- **Access Control**: Limit access to authorized personnel
- **Backup**: Include in backup procedures
- **Integrity**: Ensure data integrity

## Integration Considerations

### System Integration
- **ERP Integration**: Integrate with ERP systems
- **Workflow**: Include in business workflows
- **Notifications**: Set up notifications
- **Monitoring**: Monitor cancellation rates

### Data Synchronization
- **Real-time**: Synchronize in real-time
- **Batch Processing**: Handle batch cancellations
- **Error Handling**: Handle synchronization errors
- **Recovery**: Implement recovery procedures

### Performance
- **Response Time**: Monitor response times
- **Throughput**: Monitor cancellation throughput
- **Error Rates**: Monitor error rates
- **Availability**: Ensure high availability
