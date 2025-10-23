# Query Invoice (Consulta)

## Overview

The Consulta operation is used to retrieve information about previously registered invoices with the Spanish tax authority (AEAT). This operation allows you to query invoice status, retrieve CSV codes, and access historical invoice data.

## Purpose

- **Status Verification**: Check invoice registration status
- **CSV Retrieval**: Retrieve secure verification codes
- **Audit Trail**: Access historical invoice data
- **Compliance**: Support audit and compliance requirements

## SOAP Action

```
SOAPAction: "urn:VeriFactu/Consulta"
```

## XML Namespaces

```xml
xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
xmlns:verifactu="urn:VeriFactu"
xmlns:aeat="http://www.aeat.es/verifactu"
xmlns:factura="urn:VeriFactu:Factura"
xmlns:cabecera="urn:VeriFactu:Cabecera"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xmlns:xsd="http://www.w3.org/2001/XMLSchema"
```

## Query Types

### By Invoice Number
- **Purpose**: Query specific invoice by number
- **Use Case**: Check status of specific invoice
- **Response**: Invoice details and status

### By Date Range
- **Purpose**: Query invoices within date range
- **Use Case**: Bulk status checking, reporting
- **Response**: List of invoices with status

### By CSV Code
- **Purpose**: Verify invoice using CSV code
- **Use Case**: Customer verification, fraud prevention
- **Response**: Invoice details if valid

### By Customer NIF
- **Purpose**: Query invoices for specific customer
- **Use Case**: Customer service, reporting
- **Response**: List of customer invoices

## Request Structure

### SOAP Envelope

```xml
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
               xmlns:verifactu="urn:VeriFactu"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <soap:Header>
    <!-- Authentication handled via mutual TLS -->
  </soap:Header>
  <soap:Body>
    <verifactu:Consulta>
      <verifactu:Cabecera>
        <!-- Header information -->
      </verifactu:Cabecera>
      <verifactu:CriteriosBusqueda>
        <!-- Search criteria -->
      </verifactu:CriteriosBusqueda>
    </verifactu:Consulta>
  </soap:Body>
</soap:Envelope>
```

### Cabecera (Header) Fields

**Required Fields**:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `NIFEmisor` | String | Tax ID of invoice issuer | "12345678Z" |
| `FechaEnvio` | DateTime | Date and time of query | "2024-01-15T10:30:00" |
| `TiempoEsperaEnvio` | Integer | Expected processing time in seconds | 30 |
| `TipoComunicacion` | Enum | Type of communication | "Consulta" |

**Optional Fields**:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `NumeroRegistro` | String | Registration number | "REG001" |
| `Observaciones` | String | Additional observations | "Status check" |

### CriteriosBusqueda (Search Criteria) Fields

**Required Fields**:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `TipoConsulta` | Enum | Type of query | "PorNumeroFactura" |

**Query-Specific Fields**:

**By Invoice Number**:
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `NumFactura` | String | Invoice number | "INV-2024-001" |
| `SerieFactura` | String | Invoice series (optional) | "A" |

**By Date Range**:
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `FechaDesde` | Date | Start date | "2024-01-01" |
| `FechaHasta` | Date | End date | "2024-01-31" |

**By CSV Code**:
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `CSV` | String | CSV code | "ABC123DEF456" |

**By Customer NIF**:
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `NIFReceptor` | String | Customer tax ID | "87654321A" |

**Optional Filters**:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `TipoFactura` | Enum | Invoice type filter | "F1" |
| `EstadoRegistro` | Enum | Registration status filter | "Correcto" |
| `ImporteMinimo` | Decimal | Minimum amount filter | 100.00 |
| `ImporteMaximo` | Decimal | Maximum amount filter | 1000.00 |

## Complete Request Examples

### Query by Invoice Number

```xml
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
               xmlns:verifactu="urn:VeriFactu"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <soap:Header />
  <soap:Body>
    <verifactu:Consulta>
      <verifactu:Cabecera>
        <verifactu:NIFEmisor>12345678Z</verifactu:NIFEmisor>
        <verifactu:FechaEnvio>2024-01-15T10:30:00</verifactu:FechaEnvio>
        <verifactu:TiempoEsperaEnvio>30</verifactu:TiempoEsperaEnvio>
        <verifactu:TipoComunicacion>Consulta</verifactu:TipoComunicacion>
      </verifactu:Cabecera>
      <verifactu:CriteriosBusqueda>
        <verifactu:TipoConsulta>PorNumeroFactura</verifactu:TipoConsulta>
        <verifactu:NumFactura>INV-2024-001</verifactu:NumFactura>
        <verifactu:SerieFactura>A</verifactu:SerieFactura>
      </verifactu:CriteriosBusqueda>
    </verifactu:Consulta>
  </soap:Body>
</soap:Envelope>
```

### Query by Date Range

```xml
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
               xmlns:verifactu="urn:VeriFactu"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <soap:Header />
  <soap:Body>
    <verifactu:Consulta>
      <verifactu:Cabecera>
        <verifactu:NIFEmisor>12345678Z</verifactu:NIFEmisor>
        <verifactu:FechaEnvio>2024-01-15T10:30:00</verifactu:FechaEnvio>
        <verifactu:TiempoEsperaEnvio>30</verifactu:TiempoEsperaEnvio>
        <verifactu:TipoComunicacion>Consulta</verifactu:TipoComunicacion>
      </verifactu:Cabecera>
      <verifactu:CriteriosBusqueda>
        <verifactu:TipoConsulta>PorRangoFechas</verifactu:TipoConsulta>
        <verifactu:FechaDesde>2024-01-01</verifactu:FechaDesde>
        <verifactu:FechaHasta>2024-01-31</verifactu:FechaHasta>
        <verifactu:TipoFactura>F1</verifactu:TipoFactura>
      </verifactu:CriteriosBusqueda>
    </verifactu:Consulta>
  </soap:Body>
</soap:Envelope>
```

### Query by CSV Code

```xml
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
               xmlns:verifactu="urn:VeriFactu"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <soap:Header />
  <soap:Body>
    <verifactu:Consulta>
      <verifactu:Cabecera>
        <verifactu:NIFEmisor>12345678Z</verifactu:NIFEmisor>
        <verifactu:FechaEnvio>2024-01-15T10:30:00</verifactu:FechaEnvio>
        <verifactu:TiempoEsperaEnvio>30</verifactu:TiempoEsperaEnvio>
        <verifactu:TipoComunicacion>Consulta</verifactu:TipoComunicacion>
      </verifactu:Cabecera>
      <verifactu:CriteriosBusqueda>
        <verifactu:TipoConsulta>PorCSV</verifactu:TipoConsulta>
        <verifactu:CSV>ABC123DEF456</verifactu:CSV>
      </verifactu:CriteriosBusqueda>
    </verifactu:Consulta>
  </soap:Body>
</soap:Envelope>
```

## Response Structure

### SOAP Response Envelope

```xml
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
               xmlns:verifactu="urn:VeriFactu"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <soap:Header />
  <soap:Body>
    <verifactu:ConsultaResponse>
      <verifactu:Cabecera>
        <!-- Response header -->
      </verifactu:Cabecera>
      <verifactu:Resultados>
        <!-- Query results -->
      </verifactu:Resultados>
    </verifactu:ConsultaResponse>
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
| `TotalRegistros` | Integer | Total number of records found | 5 |
| `RegistrosDevueltos` | Integer | Number of records returned | 5 |

**Resultados (Query Results)**:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `Facturas` | Array | List of invoices found | See invoice structure below |

**Invoice Structure (per invoice)**:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `NumFactura` | String | Invoice number | "INV-2024-001" |
| `SerieFactura` | String | Invoice series | "A" |
| `FechaFactura` | Date | Invoice date | "2024-01-15" |
| `NIFReceptor` | String | Customer tax ID | "87654321A" |
| `ImporteTotal` | Decimal | Total amount | 1000.00 |
| `TipoFactura` | Enum | Invoice type | "F1" |
| `EstadoRegistro` | Enum | Registration status | "Correcto" |
| `CSV` | String | Secure verification code | "ABC123DEF456" |
| `FechaRegistro` | DateTime | Registration date | "2024-01-15T10:30:00" |
| `TimestampRespuesta` | DateTime | Response timestamp | "2024-01-15T10:30:30" |

## Complete Response Example

```xml
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
               xmlns:verifactu="urn:VeriFactu"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <soap:Header />
  <soap:Body>
    <verifactu:ConsultaResponse>
      <verifactu:Cabecera>
        <verifactu:EstadoEnvio>Correcto</verifactu:EstadoEnvio>
        <verifactu:TiempoEsperaEnvio>30</verifactu:TiempoEsperaEnvio>
        <verifactu:TimestampRespuesta>2024-01-15T10:30:30</verifactu:TimestampRespuesta>
        <verifactu:TotalRegistros>1</verifactu:TotalRegistros>
        <verifactu:RegistrosDevueltos>1</verifactu:RegistrosDevueltos>
      </verifactu:Cabecera>
      <verifactu:Resultados>
        <verifactu:Facturas>
          <verifactu:Factura>
            <verifactu:NumFactura>INV-2024-001</verifactu:NumFactura>
            <verifactu:SerieFactura>A</verifactu:SerieFactura>
            <verifactu:FechaFactura>2024-01-15</verifactu:FechaFactura>
            <verifactu:NIFReceptor>87654321A</verifactu:NIFReceptor>
            <verifactu:ImporteTotal>1000.00</verifactu:ImporteTotal>
            <verifactu:TipoFactura>F1</verifactu:TipoFactura>
            <verifactu:EstadoRegistro>Correcto</verifactu:EstadoRegistro>
            <verifactu:CSV>ABC123DEF456</verifactu:CSV>
            <verifactu:FechaRegistro>2024-01-15T10:30:00</verifactu:FechaRegistro>
            <verifactu:TimestampRespuesta>2024-01-15T10:30:30</verifactu:TimestampRespuesta>
          </verifactu:Factura>
        </verifactu:Facturas>
      </verifactu:Resultados>
    </verifactu:ConsultaResponse>
  </soap:Body>
</soap:Envelope>
```

## Query Types and Enumerations

### TipoConsulta (Query Type)

| Value | Description | Use Case |
|-------|-------------|----------|
| **PorNumeroFactura** | By invoice number | Check specific invoice |
| **PorRangoFechas** | By date range | Bulk status checking |
| **PorCSV** | By CSV code | Customer verification |
| **PorNIFReceptor** | By customer NIF | Customer service |
| **PorEstado** | By status | Status reporting |
| **PorTipoFactura** | By invoice type | Type-specific reporting |

### EstadoRegistro (Registration Status)

| Value | Description | Meaning |
|-------|-------------|---------|
| **Correcto** | Successful | Invoice registered successfully |
| **Rechazado** | Rejected | Invoice rejected by AEAT |
| **AceptadoConErrores** | Accepted with errors | Invoice accepted but with warnings |
| **Pendiente** | Pending | Invoice pending processing |
| **Cancelado** | Cancelled | Invoice was cancelled |

### TipoFactura (Invoice Type)

| Value | Description | Use Case |
|-------|-------------|----------|
| **F1** | Standard invoice | Regular B2B invoices |
| **F2** | Simplified invoice | Small amount invoices |
| **F3** | Invoice with VAT exemption | Exempt transactions |
| **F4** | Invoice with reverse charge | Reverse charge scenarios |
| **F5** | Invoice with special regime | Special tax regimes |

## Pagination and Limits

### Result Limits

**Default Limits**:
- **Maximum Results**: 100 invoices per query
- **Date Range**: Maximum 1 year per query
- **Timeout**: 60 seconds per query

**Large Result Sets**:
- **Pagination**: Use offset and limit parameters
- **Batch Processing**: Process results in batches
- **Caching**: Cache results for performance

### Pagination Parameters

**Optional Pagination Fields**:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `Offset` | Integer | Starting record number | 0 |
| `Limit` | Integer | Maximum records to return | 50 |
| `OrdenarPor` | Enum | Sort field | "FechaFactura" |
| `DireccionOrden` | Enum | Sort direction | "ASC" |

## Error Handling

### Common Query Errors

**Validation Errors**:
- Invalid query parameters
- Missing required fields
- Invalid date formats
- Invalid NIF formats

**Business Logic Errors**:
- No invoices found
- Access denied to invoice
- Invoice not found
- Invalid CSV code

**System Errors**:
- Service unavailable
- Timeout errors
- Certificate issues
- Network problems

### Error Response Structure

```xml
<verifactu:ConsultaResponse>
  <verifactu:Cabecera>
    <verifactu:EstadoEnvio>Rechazado</verifactu:EstadoEnvio>
    <verifactu:Errores>
      <verifactu:Error>
        <verifactu:Codigo>301</verifactu:Codigo>
        <verifactu:Descripcion>No invoices found</verifactu:Descripcion>
      </verifactu:Error>
    </verifactu:Errores>
  </verifactu:Cabecera>
</verifactu:ConsultaResponse>
```

## Performance Considerations

### Query Optimization

**Efficient Queries**:
- Use specific criteria when possible
- Limit date ranges to reasonable periods
- Use filters to reduce result sets
- Avoid overly broad queries

**Caching Strategy**:
- Cache frequently accessed data
- Implement appropriate cache expiration
- Use cache invalidation strategies
- Monitor cache performance

### Rate Limiting

**AEAT Rate Limits**:
- **Queries per minute**: Varies by certificate type
- **Daily limits**: Based on business size
- **Peak hours**: May have additional restrictions

**Best Practices**:
- Implement client-side rate limiting
- Use batch queries when possible
- Monitor rate limit usage
- Implement backoff strategies

## Use Cases and Examples

### Customer Service
- **Invoice Verification**: Verify invoice authenticity
- **Status Checking**: Check invoice status
- **CSV Retrieval**: Retrieve verification codes
- **Problem Resolution**: Resolve customer issues

### Audit and Compliance
- **Audit Trail**: Maintain audit records
- **Compliance Reporting**: Generate compliance reports
- **Data Reconciliation**: Reconcile with local records
- **Error Analysis**: Analyze registration errors

### System Integration
- **Status Synchronization**: Sync with local systems
- **Data Validation**: Validate local data
- **Error Recovery**: Recover from errors
- **Monitoring**: Monitor system health

## Best Practices

### Query Design
- **Specific Criteria**: Use specific search criteria
- **Appropriate Filters**: Apply relevant filters
- **Date Ranges**: Use reasonable date ranges
- **Result Limits**: Limit result sets appropriately

### Error Handling
- **Retry Logic**: Implement retry for transient errors
- **Logging**: Log all queries and responses
- **Monitoring**: Monitor query performance
- **Alerting**: Set up alerts for failures

### Security
- **Access Control**: Control query access
- **Audit Logging**: Log all query activities
- **Data Protection**: Protect sensitive data
- **Compliance**: Ensure regulatory compliance
