# Complete XML Examples

## Overview

This document provides complete, working XML examples for common scenarios with the AEAT VERI*FACTU webservice. Each example includes context, explanation, and complete SOAP envelopes.

## Simple B2B Invoice

### Scenario
A standard B2B invoice for goods with VAT.

### Context
- **Invoice Type**: Standard invoice (F1)
- **Customer**: Business customer with NIF
- **Goods**: Physical products
- **VAT**: Standard 21% VAT rate
- **Amount**: €1,000.00 total

### Complete Request

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
                  <verifactu:BaseImponible>165.29</verifactu:BaseImponible>
                  <verifactu:TipoImpositivo>21.0</verifactu:TipoImpositivo>
                  <verifactu:CuotaImpuesto>34.71</verifactu:CuotaImpuesto>
                </verifactu:DetalleFactura>
                <verifactu:DetalleFactura>
                  <verifactu:NumLinea>2</verifactu:NumLinea>
                  <verifactu:Descripcion>Product B</verifactu:Descripcion>
                  <verifactu:Cantidad>1.0</verifactu:Cantidad>
                  <verifactu:PrecioUnitario>800.00</verifactu:PrecioUnitario>
                  <verifactu:ImporteTotal>800.00</verifactu:ImporteTotal>
                  <verifactu:TipoIVA>Gravado</verifactu:TipoIVA>
                  <verifactu:BaseImponible>661.16</verifactu:BaseImponible>
                  <verifactu:TipoImpositivo>21.0</verifactu:TipoImpositivo>
                  <verifactu:CuotaImpuesto>138.84</verifactu:CuotaImpuesto>
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

### Expected Response

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

## Multi-Line Invoice with Discounts

### Scenario
A complex invoice with multiple lines, discounts, and different VAT rates.

### Context
- **Invoice Type**: Standard invoice (F1)
- **Customer**: Business customer
- **Goods**: Mixed products with different VAT rates
- **Discounts**: Percentage and fixed discounts
- **VAT**: Mixed VAT rates (21%, 10%, 4%)

### Complete Request

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
        <verifactu:TiempoEsperaEnvio>60</verifactu:TiempoEsperaEnvio>
        <verifactu:TipoComunicacion>Alta</verifactu:TipoComunicacion>
      </verifactu:Cabecera>
      <verifactu:Factura>
        <verifactu:NumFactura>INV-2024-002</verifactu:NumFactura>
        <verifactu:FechaFactura>2024-01-15</verifactu:FechaFactura>
        <verifactu:NIFReceptor>87654321A</verifactu:NIFReceptor>
        <verifactu:ImporteTotal>1500.00</verifactu:ImporteTotal>
        <verifactu:TipoFactura>F1</verifactu:TipoFactura>
        <verifactu:DescripcionOperacion>Sale of mixed goods</verifactu:DescripcionOperacion>
        <verifactu:TipoDesglose>DesgloseTipoOperacion</verifactu:TipoDesglose>
        <verifactu:DesgloseFactura>
          <verifactu:TipoOperacion>
            <verifactu:DesgloseTipoOperacion>
              <verifactu:Entrega>
                <verifactu:DetalleFactura>
                  <verifactu:NumLinea>1</verifactu:NumLinea>
                  <verifactu:Descripcion>Electronics - 21% VAT</verifactu:Descripcion>
                  <verifactu:Cantidad>1.0</verifactu:Cantidad>
                  <verifactu:PrecioUnitario>1000.00</verifactu:PrecioUnitario>
                  <verifactu:Descuento>100.00</verifactu:Descuento>
                  <verifactu:TipoDescuento>Importe</verifactu:TipoDescuento>
                  <verifactu:ImporteTotal>900.00</verifactu:ImporteTotal>
                  <verifactu:TipoIVA>Gravado</verifactu:TipoIVA>
                  <verifactu:BaseImponible>743.80</verifactu:BaseImponible>
                  <verifactu:TipoImpositivo>21.0</verifactu:TipoImpositivo>
                  <verifactu:CuotaImpuesto>156.20</verifactu:CuotaImpuesto>
                </verifactu:DetalleFactura>
                <verifactu:DetalleFactura>
                  <verifactu:NumLinea>2</verifactu:NumLinea>
                  <verifactu:Descripcion>Books - 4% VAT</verifactu:Descripcion>
                  <verifactu:Cantidad>5.0</verifactu:Cantidad>
                  <verifactu:PrecioUnitario>20.00</verifactu:PrecioUnitario>
                  <verifactu:Descuento>10.0</verifactu:Descuento>
                  <verifactu:TipoDescuento>Porcentaje</verifactu:TipoDescuento>
                  <verifactu:ImporteTotal>90.00</verifactu:ImporteTotal>
                  <verifactu:TipoIVA>Gravado</verifactu:TipoIVA>
                  <verifactu:BaseImponible>86.54</verifactu:BaseImponible>
                  <verifactu:TipoImpositivo>4.0</verifactu:TipoImpositivo>
                  <verifactu:CuotaImpuesto>3.46</verifactu:CuotaImpuesto>
                </verifactu:DetalleFactura>
                <verifactu:DetalleFactura>
                  <verifactu:NumLinea>3</verifactu:NumLinea>
                  <verifactu:Descripcion>Food - 10% VAT</verifactu:Descripcion>
                  <verifactu:Cantidad>2.0</verifactu:Cantidad>
                  <verifactu:PrecioUnitario>50.00</verifactu:PrecioUnitario>
                  <verifactu:ImporteTotal>100.00</verifactu:ImporteTotal>
                  <verifactu:TipoIVA>Gravado</verifactu:TipoIVA>
                  <verifactu:BaseImponible>90.91</verifactu:BaseImponible>
                  <verifactu:TipoImpositivo>10.0</verifactu:TipoImpositivo>
                  <verifactu:CuotaImpuesto>9.09</verifactu:CuotaImpuesto>
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

## Credit Note (Rectificativa)

### Scenario
A credit note to correct a previous invoice.

### Context
- **Invoice Type**: Credit note (F3)
- **Original Invoice**: Reference to original invoice
- **Reason**: Correction of amounts
- **Amount**: Negative amount (credit)

### Complete Request

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
        <verifactu:NumFactura>CN-2024-001</verifactu:NumFactura>
        <verifactu:FechaFactura>2024-01-15</verifactu:FechaFactura>
        <verifactu:NIFReceptor>87654321A</verifactu:NIFReceptor>
        <verifactu:ImporteTotal>-100.00</verifactu:ImporteTotal>
        <verifactu:TipoFactura>F3</verifactu:TipoFactura>
        <verifactu:NumFacturaRectificativa>INV-2024-001</verifactu:NumFacturaRectificativa>
        <verifactu:DescripcionOperacion>Credit note for correction</verifactu:DescripcionOperacion>
        <verifactu:TipoDesglose>DesgloseTipoOperacion</verifactu:TipoDesglose>
        <verifactu:DesgloseFactura>
          <verifactu:TipoOperacion>
            <verifactu:DesgloseTipoOperacion>
              <verifactu:Entrega>
                <verifactu:DetalleFactura>
                  <verifactu:NumLinea>1</verifactu:NumLinea>
                  <verifactu:Descripcion>Correction of amount</verifactu:Descripcion>
                  <verifactu:Cantidad>1.0</verifactu:Cantidad>
                  <verifactu:PrecioUnitario>-100.00</verifactu:PrecioUnitario>
                  <verifactu:ImporteTotal>-100.00</verifactu:ImporteTotal>
                  <verifactu:TipoIVA>Gravado</verifactu:TipoIVA>
                  <verifactu:BaseImponible>-82.64</verifactu:BaseImponible>
                  <verifactu:TipoImpositivo>21.0</verifactu:TipoImpositivo>
                  <verifactu:CuotaImpuesto>-17.36</verifactu:CuotaImpuesto>
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

## Invoice Cancellation

### Scenario
Cancelling a previously registered invoice.

### Context
- **Operation**: Baja (Cancellation)
- **Original Invoice**: Reference to invoice to cancel
- **Reason**: Customer cancellation
- **Amount**: Original invoice amount

### Complete Request

```xml
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
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

### Expected Response

```xml
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
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

## Query Invoice by Number

### Scenario
Querying a specific invoice by its number.

### Context
- **Operation**: Consulta (Query)
- **Query Type**: By invoice number
- **Invoice**: Previously registered invoice
- **Purpose**: Check status and retrieve CSV

### Complete Request

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

### Expected Response

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

## Query by Date Range

### Scenario
Querying invoices within a date range.

### Context
- **Operation**: Consulta (Query)
- **Query Type**: By date range
- **Period**: January 2024
- **Purpose**: Bulk status checking

### Complete Request

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
        <verifactu:TiempoEsperaEnvio>60</verifactu:TiempoEsperaEnvio>
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

## Query by CSV Code

### Scenario
Verifying an invoice using its CSV code.

### Context
- **Operation**: Consulta (Query)
- **Query Type**: By CSV code
- **CSV**: Customer-provided verification code
- **Purpose**: Customer verification

### Complete Request

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

## Error Response Example

### Scenario
An invoice registration that fails due to validation errors.

### Context
- **Operation**: Alta (Register)
- **Error**: Invalid NIF format
- **Response**: Error details with correction guidance

### Error Response

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
        <verifactu:EstadoEnvio>Rechazado</verifactu:EstadoEnvio>
        <verifactu:TiempoEsperaEnvio>30</verifactu:TiempoEsperaEnvio>
        <verifactu:TimestampRespuesta>2024-01-15T10:30:30</verifactu:TimestampRespuesta>
      </verifactu:Cabecera>
      <verifactu:RespuestaLinea>
        <verifactu:EstadoRegistro>Rechazado</verifactu:EstadoRegistro>
        <verifactu:NumFactura>INV-2024-001</verifactu:NumFactura>
        <verifactu:FechaFactura>2024-01-15</verifactu:FechaFactura>
        <verifactu:ImporteTotal>1000.00</verifactu:ImporteTotal>
        <verifactu:Errores>
          <verifactu:Error>
            <verifactu:Codigo>001</verifactu:Codigo>
            <verifactu:Descripcion>Invalid NIF format</verifactu:Descripcion>
            <verifactu:Campo>NIFReceptor</verifactu:Campo>
            <verifactu:Valor>87654321</verifactu:Valor>
          </verifactu:Error>
        </verifactu:Errores>
      </verifactu:RespuestaLinea>
    </verifactu:AltaResponse>
  </soap:Body>
</soap:Envelope>
```

## Partial Success Response

### Scenario
A batch operation where some invoices succeed and others fail.

### Context
- **Operation**: Alta (Register) - Batch
- **Result**: Mixed success and failure
- **Response**: Per-invoice status details

### Partial Success Response

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
        <verifactu:EstadoEnvio>AceptadoConErrores</verifactu:EstadoEnvio>
        <verifactu:TiempoEsperaEnvio>60</verifactu:TiempoEsperaEnvio>
        <verifactu:TimestampRespuesta>2024-01-15T10:30:30</verifactu:TimestampRespuesta>
      </verifactu:Cabecera>
      <verifactu:RespuestaLinea>
        <verifactu:EstadoRegistro>Correcto</verifactu:EstadoRegistro>
        <verifactu:CSV>ABC123DEF456</verifactu:CSV>
        <verifactu:NumFactura>INV-2024-001</verifactu:NumFactura>
        <verifactu:FechaFactura>2024-01-15</verifactu:FechaFactura>
        <verifactu:ImporteTotal>1000.00</verifactu:ImporteTotal>
      </verifactu:RespuestaLinea>
      <verifactu:RespuestaLinea>
        <verifactu:EstadoRegistro>Rechazado</verifactu:EstadoRegistro>
        <verifactu:NumFactura>INV-2024-002</verifactu:NumFactura>
        <verifactu:FechaFactura>2024-01-15</verifactu:FechaFactura>
        <verifactu:ImporteTotal>2000.00</verifactu:ImporteTotal>
        <verifactu:Errores>
          <verifactu:Error>
            <verifactu:Codigo>101</verifactu:Codigo>
            <verifactu:Descripcion>Duplicate invoice number</verifactu:Descripcion>
            <verifactu:Campo>NumFactura</verifactu:Campo>
            <verifactu:Valor>INV-2024-002</verifactu:Valor>
          </verifactu:Error>
        </verifactu:Errores>
      </verifactu:RespuestaLinea>
    </verifactu:AltaResponse>
  </soap:Body>
</soap:Envelope>
```

## Best Practices for XML Examples

### Namespace Management
- **Consistent Namespaces**: Use consistent namespace declarations
- **Namespace Prefixes**: Use meaningful namespace prefixes
- **Namespace Validation**: Validate namespace usage

### Data Validation
- **Required Fields**: Ensure all required fields are present
- **Data Formats**: Use correct data formats
- **Business Rules**: Follow business rule requirements
- **Validation**: Validate data before sending

### Error Handling
- **Error Parsing**: Parse error responses correctly
- **Error Recovery**: Implement error recovery strategies
- **Error Logging**: Log errors with context
- **Error Monitoring**: Monitor error patterns

### Performance Considerations
- **XML Size**: Keep XML size reasonable
- **Processing Time**: Consider processing time
- **Memory Usage**: Monitor memory usage
- **Caching**: Cache frequently used data
