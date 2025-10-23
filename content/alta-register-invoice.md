# Register Invoice (Alta)

## Overview

The Alta operation is used to register invoices with the Spanish tax authority (AEAT) for verification. This is the primary operation for invoice verification and must be performed before sending invoices to customers.

## Purpose

- **Real-time Validation**: Validate invoice data against Spanish tax rules
- **CSV Generation**: Generate secure verification codes for invoices
- **Compliance**: Ensure compliance with Spanish tax regulations
- **Fraud Prevention**: Prevent tax fraud through verification

## SOAP Action

```
SOAPAction: "urn:VeriFactu/Alta"
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

## Request Structure

### Complete SOAP Request Example

```xml
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:verifactu="urn:VeriFactu"
               xmlns:aeat="http://www.aeat.es/verifactu"
               xmlns:factura="urn:VeriFactu:Factura"
               xmlns:cabecera="urn:VeriFactu:Cabecera"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <soap:Header>
    <!-- Authentication handled via mutual TLS -->
    <aeat:Autenticacion>
      <aeat:Certificado>BASE64_ENCODED_CERTIFICATE</aeat:Certificado>
    </aeat:Autenticacion>
  </soap:Header>
  <soap:Body>
    <verifactu:Alta>
      <verifactu:Cabecera>
        <verifactu:NIFEmisor>12345678Z</verifactu:NIFEmisor>
        <verifactu:FechaEnvio>2024-01-15T10:30:00</verifactu:FechaEnvio>
        <verifactu:TiempoEsperaEnvio>30</verifactu:TiempoEsperaEnvio>
        <verifactu:TipoComunicacion>Alta</verifactu:TipoComunicacion>
        <verifactu:NumeroRegistro>REG001</verifactu:NumeroRegistro>
        <verifactu:Observaciones>Test invoice registration</verifactu:Observaciones>
      </verifactu:Cabecera>
      <verifactu:Factura>
        <verifactu:NumFactura>INV-2024-001</verifactu:NumFactura>
        <verifactu:FechaFactura>2024-01-15</verifactu:FechaFactura>
        <verifactu:NIFReceptor>87654321A</verifactu:NIFReceptor>
        <verifactu:ImporteTotal>1000.00</verifactu:ImporteTotal>
        <verifactu:TipoFactura>F1</verifactu:TipoFactura>
        <verifactu:SerieFactura>A</verifactu:SerieFactura>
        <verifactu:FechaOperacion>2024-01-15</verifactu:FechaOperacion>
        <verifactu:ClaveRegimenEspecialOTrascendencia>01</verifactu:ClaveRegimenEspecialOTrascendencia>
        <verifactu:DescripcionOperacion>Sale of goods</verifactu:DescripcionOperacion>
        <verifactu:TipoDesglose>DesgloseTipoOperacion</verifactu:TipoDesglose>
        <verifactu:DetalleFactura>
          <verifactu:IDDetalleFactura>1</verifactu:IDDetalleFactura>
          <verifactu:DescripcionDetalle>Product description</verifactu:DescripcionDetalle>
          <verifactu:Cantidad>1.00</verifactu:Cantidad>
          <verifactu:PrecioUnitario>1000.00</verifactu:PrecioUnitario>
          <verifactu:ImporteTotal>1000.00</verifactu:ImporteTotal>
          <verifactu:DesgloseTipoOperacion>
            <verifactu:Sujeta>
              <verifactu:NoExenta>
                <verifactu:TipoNoExenta>S1</verifactu:TipoNoExenta>
                <verifactu:TipoDesglose>DesgloseTipoOperacion</verifactu:TipoDesglose>
                <verifactu:DesgloseIVA>
                  <verifactu:TipoImpositivo>21.00</verifactu:TipoImpositivo>
                  <verifactu:BaseImponible>826.45</verifactu:BaseImponible>
                  <verifactu:CuotaImpuesto>173.55</verifactu:CuotaImpuesto>
                </verifactu:DesgloseIVA>
              </verifactu:NoExenta>
            </verifactu:Sujeta>
          </verifactu:DesgloseTipoOperacion>
        </verifactu:DetalleFactura>
      </verifactu:Factura>
    </verifactu:Alta>
  </soap:Body>
</soap:Envelope>
```

### SOAP Headers Required

**HTTP Headers:**
```
Content-Type: application/soap+xml; charset=utf-8
SOAPAction: "urn:VeriFactu/Alta"
Content-Length: [calculated]
```

**Authentication:**
- Mutual TLS with FNMT certificate
- Certificate must be valid and not expired
- Certificate must be properly installed on client system

### Cabecera (Header) Fields

**Required Fields**:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `NIFEmisor` | String | Tax ID of invoice issuer | "12345678Z" |
| `FechaEnvio` | DateTime | Date and time of submission | "2024-01-15T10:30:00" |
| `TiempoEsperaEnvio` | Integer | Expected processing time in seconds | 30 |
| `TipoComunicacion` | Enum | Type of communication | "Alta" |

**Optional Fields**:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `NumeroRegistro` | String | Registration number | "REG001" |
| `Observaciones` | String | Additional observations | "Test invoice" |

### Factura (Invoice) Fields

**Required Fields**:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `NumFactura` | String | Invoice number | "INV-2024-001" |
| `FechaFactura` | Date | Invoice date | "2024-01-15" |
| `NIFReceptor` | String | Tax ID of invoice recipient | "87654321A" |
| `ImporteTotal` | Decimal | Total invoice amount | 1000.00 |
| `TipoFactura` | Enum | Type of invoice | "F1" |

**Optional Fields**:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `SerieFactura` | String | Invoice series | "A" |
| `NumFacturaRectificativa` | String | Original invoice number (for corrections) | "INV-2024-000" |
| `FechaOperacion` | Date | Operation date | "2024-01-15" |
| `ClaveRegimenEspecialOTrascendencia` | String | Special regime key | "01" |
| `DescripcionOperacion` | String | Operation description | "Sale of goods" |
| `TipoDesglose` | Enum | Breakdown type | "DesgloseTipoOperacion" |

### Invoice Lines (DetalleFactura)

**Required Fields per Line**:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `NumLinea` | Integer | Line number | 1 |
| `Descripcion` | String | Line description | "Product A" |
| `Cantidad` | Decimal | Quantity | 2.0 |
| `PrecioUnitario` | Decimal | Unit price | 100.00 |
| `ImporteTotal` | Decimal | Line total | 200.00 |

**Optional Fields per Line**:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `Descuento` | Decimal | Discount amount | 10.00 |
| `TipoDescuento` | Enum | Discount type | "Porcentaje" |
| `TipoIVA` | Enum | VAT type | "Gravado" |
| `BaseImponible` | Decimal | Taxable base | 190.00 |
| `TipoImpositivo` | Decimal | Tax rate | 21.0 |
| `CuotaImpuesto` | Decimal | Tax amount | 39.90 |

## Complete Request Example

```xml
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:verifactu="urn:VeriFactu"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <soap:Header />
  <soap:Body>
    <verifactu:Alta>
      <verifactu:Cabecera>
        <verifactu:NIFEmisor>12345678Z</verifactu:NIFEmisor>
        <verifactu:FechaEnvio>2024-01-15T10:30:00</verifactu:FechaEnvio>
        <verifactu:TiempoEsperaEnvio>30</verifactu:TiempoEsperaEnvio>
        <verifactu:TipoComunicacion>Alta</verifactu:TipoComunicacion>
      </verifactu:Cabecera>
      <verifactu:Factura>
        <verifactu:NumFactura>INV-2024-001</verifactu:NumFactura>
        <verifactu:FechaFactura>2024-01-15</verifactu:FechaFactura>
        <verifactu:NIFReceptor>87654321A</verifactu:NIFReceptor>
        <verifactu:ImporteTotal>1000.00</verifactu:ImporteTotal>
        <verifactu:TipoFactura>F1</verifactu:TipoFactura>
        <verifactu:DescripcionOperacion>Sale of goods</verifactu:DescripcionOperacion>
        <verifactu:TipoDesglose>DesgloseTipoOperacion</verifactu:TipoDesglose>
        <verifactu:DesgloseFactura>
          <verifactu:TipoOperacion>
            <verifactu:DesgloseTipoOperacion>
              <verifactu:Entrega>
                <verifactu:DetalleFactura>
                  <verifactu:NumLinea>1</verifactu:NumLinea>
                  <verifactu:Descripcion>Product A</verifactu:Descripcion>
                  <verifactu:Cantidad>2.0</verifactu:Cantidad>
                  <verifactu:PrecioUnitario>100.00</verifactu:PrecioUnitario>
                  <verifactu:ImporteTotal>200.00</verifactu:ImporteTotal>
                  <verifactu:TipoIVA>Gravado</verifactu:TipoIVA>
                  <verifactu:BaseImponible>190.00</verifactu:BaseImponible>
                  <verifactu:TipoImpositivo>21.0</verifactu:TipoImpositivo>
                  <verifactu:CuotaImpuesto>39.90</verifactu:CuotaImpuesto>
                </verifactu:DetalleFactura>
              </verifactu:Entrega>
            </verifactu:DesgloseTipoOperacion>
          </verifactu:TipoOperacion>
        </verifactu:DesgloseFactura>
      </verifactu:Factura>
    </verifactu:Alta>
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
    <verifactu:AltaResponse>
      <verifactu:Cabecera>
        <!-- Response header -->
      </verifactu:Cabecera>
      <verifactu:RespuestaLinea>
        <!-- Per-invoice response -->
      </verifactu:RespuestaLinea>
    </verifactu:AltaResponse>
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
| `EstadoRegistro` | Enum | Registration status | Correcto, Rechazado, AceptadoConErrores |
| `CSV` | String | Secure verification code | "ABC123DEF456" |
| `NumFactura` | String | Invoice number | "INV-2024-001" |
| `FechaFactura` | Date | Invoice date | "2024-01-15" |
| `ImporteTotal` | Decimal | Total amount | 1000.00 |
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
    <verifactu:AltaResponse>
      <verifactu:Cabecera>
        <verifactu:EstadoEnvio>Correcto</verifactu:EstadoEnvio>
        <verifactu:TiempoEsperaEnvio>30</verifactu:TiempoEsperaEnvio>
        <verifactu:TimestampRespuesta>2024-01-15T10:30:30</verifactu:TimestampRespuesta>
      </verifactu:Cabecera>
      <verifactu:RespuestaLinea>
        <verifactu:EstadoRegistro>Correcto</verifactu:EstadoRegistro>
        <verifactu:CSV>ABC123DEF456</verifactu:CSV>
        <verifactu:NumFactura>INV-2024-001</verifactu:NumFactura>
        <verifactu:FechaFactura>2024-01-15</verifactu:FechaFactura>
        <verifactu:ImporteTotal>1000.00</verifactu:ImporteTotal>
      </verifactu:RespuestaLinea>
    </verifactu:AltaResponse>
  </soap:Body>
</soap:Envelope>
```

## Field Validation Rules

### NIF Validation
- **Format**: 8 digits + 1 letter (individuals) or 1 letter + 7 digits + 1 letter (companies)
- **Check Digit**: Must be valid according to Spanish NIF algorithm
- **Examples**: "12345678Z", "A12345674"

### Date Formats
- **Date**: YYYY-MM-DD
- **DateTime**: YYYY-MM-DDTHH:MM:SS
- **Timezone**: UTC recommended

### Amount Validation
- **Precision**: 2 decimal places
- **Range**: Positive values only
- **Currency**: EUR (implicit)

### Invoice Number Validation
- **Length**: 1-60 characters
- **Characters**: Alphanumeric and common symbols
- **Uniqueness**: Must be unique per issuer

## Enumeration Values

### TipoFactura (Invoice Type)
- **F1**: Standard invoice
- **F2**: Simplified invoice
- **F3**: Invoice with VAT exemption
- **F4**: Invoice with reverse charge
- **F5**: Invoice with special regime

### TipoComunicacion (Communication Type)
- **Alta**: Registration
- **Baja**: Cancellation
- **Modificacion**: Modification

### EstadoEnvio (Status)
- **Correcto**: Successful
- **Rechazado**: Rejected
- **AceptadoConErrores**: Accepted with errors

### TipoIVA (VAT Type)
- **Gravado**: Taxable
- **Exento**: Exempt
- **NoGravado**: Non-taxable

## Error Handling

### Common Errors

**Validation Errors**:
- Invalid NIF format
- Missing required fields
- Invalid date formats
- Amount calculation errors

**Business Logic Errors**:
- Duplicate invoice number
- Invalid tax rates
- Missing tax information
- Incorrect invoice type

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
      <verifactu:Codigo>001</verifactu:Codigo>
      <verifactu:Descripcion>Invalid NIF format</verifactu:Descripcion>
    </verifactu:Error>
  </verifactu:Errores>
</verifactu:RespuestaLinea>
```

## Best Practices

### Data Preparation
- **Validate Data**: Validate all data before sending
- **Check NIFs**: Verify NIF validity
- **Calculate Amounts**: Ensure correct tax calculations
- **Unique Numbers**: Ensure invoice number uniqueness

### Error Handling
- **Retry Logic**: Implement retry for transient errors
- **Logging**: Log all requests and responses
- **Monitoring**: Monitor success rates
- **Alerting**: Set up alerts for failures

### Performance
- **Batch Processing**: Process multiple invoices together
- **Timeout Handling**: Set appropriate timeouts
- **Connection Pooling**: Reuse connections
- **Rate Limiting**: Respect rate limits

## CSV (Código Seguro de Verificación)

### What is CSV?
The CSV is a secure verification code generated by AEAT for each successfully registered invoice. It serves as proof of invoice authenticity.

### CSV Characteristics
- **Length**: 12 characters
- **Format**: Alphanumeric
- **Uniqueness**: Unique per invoice
- **Validity**: Permanent (does not expire)

### Using CSV
- **Customer Verification**: Customers can verify invoice authenticity
- **Audit Trail**: Proof of registration with AEAT
- **Compliance**: Required for tax compliance
- **Storage**: Must be stored securely

### CSV Storage Requirements
- **Local Storage**: Store CSV locally for each invoice
- **Backup**: Include in backup procedures
- **Access**: Ensure authorized access only
- **Retention**: Keep for legal retention period
