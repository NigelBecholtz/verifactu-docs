# Quick Reference

## Endpoints & URLs

### Production Environment
- **WSDL URL**: `https://www1.aeat.es/jebi/ws/VeriFactu.wsdl`
- **SOAP Endpoint**: `https://www1.aeat.es/jebi/ws/VeriFactu`
- **XSD Schema**: `https://www1.aeat.es/jebi/ws/VeriFactu.xsd`

### Test Environment
- **WSDL URL**: `https://www7.aeat.es/jebi/ws/VeriFactu.wsdl`
- **SOAP Endpoint**: `https://www7.aeat.es/jebi/ws/VeriFactu`
- **XSD Schema**: `https://www7.aeat.es/jebi/ws/VeriFactu.xsd`

## SOAP Operations

| Operation | SOAP Action | Purpose |
|-----------|-------------|---------|
| **Alta** | `urn:VeriFactu/Alta` | Register invoice |
| **Baja** | `urn:VeriFactu/Baja` | Cancel invoice |
| **Consulta** | `urn:VeriFactu/Consulta` | Query invoice |

## Complete SOAP Envelope Template

### Request Template
```xml
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
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
        <!-- Invoice data here -->
      </verifactu:Factura>
    </verifactu:Alta>
  </soap:Body>
</soap:Envelope>
```

### Response Template
```xml
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
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

## Required Headers

```http
POST /jebi/ws/VeriFactu HTTP/1.1
Host: www1.aeat.es
Content-Type: application/soap+xml; charset=utf-8
SOAPAction: "urn:VeriFactu/Alta"
Content-Length: [length]
```

## Certificate Requirements

- **Type**: Qualified certificate (FNMT or equivalent eIDAS)
- **Format**: X.509 with private key
- **Storage**: Secure keystore or HSM
- **Validity**: 2-3 years typically

## Limits & Performance

- **Max records per batch**: 1,000 invoices
- **Request timeout**: 60 seconds
- **Rate limit**: Varies by certificate type
- **Processing time**: 30-300 seconds depending on complexity

## Common Error Codes

| Code | Description | Action |
|------|-------------|--------|
| 001 | Invalid NIF format | Check NIF format and check digit |
| 101 | Duplicate invoice number | Use unique invoice number |
| 201 | Certificate not found | Provide valid client certificate |
| 301 | Service unavailable | Retry with exponential backoff |

## Legal References

- **RD 1007/2023**: Real Decreto sobre el Registro de Facturas
- **AEAT Technical Docs**: [Agencia Tributaria](https://www.agenciatributaria.es/)
- **FNMT Certificates**: [FNMT](https://www.fnmt.es/)
