# XSD Schema Reference

## Overview

This document provides detailed XSD schema information for all VERI*FACTU fields, including exact data types, length constraints, regex patterns, and validation rules.

## Core Schema Information

### Namespace Definitions

```xml
xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
xmlns:verifactu="urn:VeriFactu"
xmlns:aeat="http://www.aeat.es/verifactu"
xmlns:factura="urn:VeriFactu:Factura"
xmlns:cabecera="urn:VeriFactu:Cabecera"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xmlns:xsd="http://www.w3.org/2001/XMLSchema"
```

### Schema Location
- **Production XSD**: `https://www1.aeat.es/jebi/ws/VeriFactu.xsd`
- **Test XSD**: `https://www7.aeat.es/jebi/ws/VeriFactu.xsd`

## Field Definitions

### Cabecera (Header) Fields

#### NIFEmisor
- **XSD Type**: `xsd:string`
- **MaxLength**: 9 characters
- **MinLength**: 9 characters
- **Pattern**: `^[0-9]{8}[A-Z]$|^[A-Z][0-9]{7}[A-Z]$`
- **Required**: Yes
- **Description**: Tax ID of invoice issuer
- **Examples**: `"12345678Z"`, `"A12345674"`

#### FechaEnvio
- **XSD Type**: `xsd:dateTime`
- **Format**: `YYYY-MM-DDTHH:MM:SS`
- **Pattern**: `^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$`
- **Required**: Yes
- **Description**: Date and time of submission
- **Examples**: `"2024-01-15T10:30:00"`

#### TiempoEsperaEnvio
- **XSD Type**: `xsd:positiveInteger`
- **MinValue**: 30
- **MaxValue**: 300
- **Required**: Yes
- **Description**: Expected processing time in seconds
- **Examples**: `30`, `60`, `120`

#### TipoComunicacion
- **XSD Type**: `xsd:string`
- **Enumeration**: `["Alta", "Baja", "Consulta", "Modificacion"]`
- **MaxLength**: 12 characters
- **Required**: Yes
- **Description**: Type of communication
- **Examples**: `"Alta"`, `"Baja"`

### Factura (Invoice) Fields

#### NumFactura
- **XSD Type**: `xsd:string`
- **MaxLength**: 60 characters
- **MinLength**: 1 character
- **Pattern**: `^[A-Za-z0-9\-_\.]+$`
- **Required**: Yes
- **Description**: Invoice number
- **Examples**: `"INV-2024-001"`, `"F2024001"`

#### FechaFactura
- **XSD Type**: `xsd:date`
- **Format**: `YYYY-MM-DD`
- **Pattern**: `^\d{4}-\d{2}-\d{2}$`
- **Required**: Yes
- **Description**: Invoice date
- **Examples**: `"2024-01-15"`

#### NIFReceptor
- **XSD Type**: `xsd:string`
- **MaxLength**: 9 characters
- **MinLength**: 9 characters
- **Pattern**: `^[0-9]{8}[A-Z]$|^[A-Z][0-9]{7}[A-Z]$`
- **Required**: Yes
- **Description**: Tax ID of invoice recipient
- **Examples**: `"87654321A"`, `"B12345674"`

#### ImporteTotal
- **XSD Type**: `xsd:decimal`
- **TotalDigits**: 10
- **FractionDigits**: 2
- **MinValue**: 0.01
- **MaxValue**: 999999.99
- **Required**: Yes
- **Description**: Total invoice amount
- **Examples**: `1000.00`, `1234.56`

#### TipoFactura
- **XSD Type**: `xsd:string`
- **Enumeration**: `["F1", "F2", "F3", "F4", "F5"]`
- **MaxLength**: 2 characters
- **Required**: Yes
- **Description**: Invoice type
- **Examples**: `"F1"`, `"F2"`

### DetalleFactura (Invoice Line) Fields

#### NumLinea
- **XSD Type**: `xsd:positiveInteger`
- **MinValue**: 1
- **MaxValue**: 9999
- **Required**: Yes
- **Description**: Line number
- **Examples**: `1`, `2`, `10`

#### Descripcion
- **XSD Type**: `xsd:string`
- **MaxLength**: 500 characters
- **MinLength**: 1 character
- **Pattern**: `^[^<>]*$`
- **Required**: Yes
- **Description**: Line description
- **Examples**: `"Product A"`, `"Service B"`

#### Cantidad
- **XSD Type**: `xsd:decimal`
- **TotalDigits**: 8
- **FractionDigits**: 3
- **MinValue**: 0.001
- **MaxValue**: 99999.999
- **Required**: Yes
- **Description**: Quantity
- **Examples**: `1.000`, `2.500`, `10.000`

#### PrecioUnitario
- **XSD Type**: `xsd:decimal`
- **TotalDigits**: 10
- **FractionDigits**: 4
- **MinValue**: 0.0001
- **MaxValue**: 999999.9999
- **Required**: Yes
- **Description**: Unit price
- **Examples**: `100.0000`, `1234.5678`

#### ImporteTotal (Line)
- **XSD Type**: `xsd:decimal`
- **TotalDigits**: 10
- **FractionDigits**: 2
- **MinValue**: 0.01
- **MaxValue**: 999999.99
- **Required**: Yes
- **Description**: Line total amount
- **Examples**: `200.00`, `1234.56`

#### TipoIVA
- **XSD Type**: `xsd:string`
- **Enumeration**: `["Gravado", "Exento", "NoGravado"]`
- **MaxLength**: 10 characters
- **Required**: Yes
- **Description**: VAT type
- **Examples**: `"Gravado"`, `"Exento"`

#### BaseImponible
- **XSD Type**: `xsd:decimal`
- **TotalDigits**: 10
- **FractionDigits**: 2
- **MinValue**: 0.00
- **MaxValue**: 999999.99
- **Required**: Yes (when TipoIVA = "Gravado")
- **Description**: Taxable base amount
- **Examples**: `826.45`, `1000.00`

#### TipoImpositivo
- **XSD Type**: `xsd:decimal`
- **TotalDigits**: 5
- **FractionDigits**: 2
- **MinValue**: 0.00
- **MaxValue**: 100.00
- **Required**: Yes (when TipoIVA = "Gravado")
- **Description**: Tax rate percentage
- **Examples**: `21.00`, `10.00`, `4.00`

#### CuotaImpuesto
- **XSD Type**: `xsd:decimal`
- **TotalDigits**: 10
- **FractionDigits**: 2
- **MinValue**: 0.00
- **MaxValue**: 999999.99
- **Required**: Yes (when TipoIVA = "Gravado")
- **Description**: Tax amount
- **Examples**: `173.55`, `100.00`

### Descuento (Discount) Fields

#### Descuento
- **XSD Type**: `xsd:decimal`
- **TotalDigits**: 10
- **FractionDigits**: 2
- **MinValue**: 0.00
- **MaxValue**: 999999.99
- **Required**: No
- **Description**: Discount amount
- **Examples**: `10.00`, `100.00`

#### TipoDescuento
- **XSD Type**: `xsd:string`
- **Enumeration**: `["Importe", "Porcentaje"]`
- **MaxLength**: 10 characters
- **Required**: No (required if Descuento is provided)
- **Description**: Discount type
- **Examples**: `"Importe"`, `"Porcentaje"`

### Response Fields

#### EstadoEnvio
- **XSD Type**: `xsd:string`
- **Enumeration**: `["Correcto", "Rechazado", "AceptadoConErrores", "Pendiente", "Procesando"]`
- **MaxLength**: 20 characters
- **Required**: Yes
- **Description**: Overall operation status
- **Examples**: `"Correcto"`, `"Rechazado"`

#### EstadoRegistro
- **XSD Type**: `xsd:string`
- **Enumeration**: `["Correcto", "Rechazado", "AceptadoConErrores"]`
- **MaxLength**: 20 characters
- **Required**: Yes
- **Description**: Per-invoice registration status
- **Examples**: `"Correcto"`, `"Rechazado"`

#### CSV
- **XSD Type**: `xsd:string`
- **MaxLength**: 12 characters
- **MinLength**: 12 characters
- **Pattern**: `^[A-Za-z0-9]{12}$`
- **Required**: Yes (when EstadoRegistro = "Correcto")
- **Description**: Secure verification code
- **Examples**: `"ABC123DEF456"`, `"XYZ789GHI012"`

### Error Fields

#### Codigo
- **XSD Type**: `xsd:string`
- **MaxLength**: 3 characters
- **MinLength**: 3 characters
- **Pattern**: `^[0-9]{3}$`
- **Required**: Yes
- **Description**: Error code
- **Examples**: `"001"`, `"101"`, `"201"`

#### Descripcion
- **XSD Type**: `xsd:string`
- **MaxLength**: 200 characters
- **MinLength**: 1 character
- **Required**: Yes
- **Description**: Error description
- **Examples**: `"Invalid NIF format"`, `"Duplicate invoice number"`

#### Campo
- **XSD Type**: `xsd:string`
- **MaxLength**: 50 characters
- **MinLength**: 1 character
- **Pattern**: `^[A-Za-z][A-Za-z0-9]*$`
- **Required**: No
- **Description**: Field that caused error
- **Examples**: `"NIFEmisor"`, `"NumFactura"`

#### Valor
- **XSD Type**: `xsd:string`
- **MaxLength**: 100 characters
- **Required**: No
- **Description**: Value that caused error
- **Examples**: `"12345678"`, `"INV-2024-001"`

## Validation Rules

### NIF Validation Algorithm

```javascript
// NIF validation function
function validateNIF(nif) {
  const pattern = /^[0-9]{8}[A-Z]$|^[A-Z][0-9]{7}[A-Z]$/;
  if (!pattern.test(nif)) return false;
  
  if (nif.length === 9 && /^[0-9]{8}[A-Z]$/.test(nif)) {
    // Individual NIF validation
    const numbers = nif.substring(0, 8);
    const letter = nif.charAt(8);
    const expectedLetter = calculateNIFLetter(numbers);
    return letter === expectedLetter;
  }
  
  if (nif.length === 9 && /^[A-Z][0-9]{7}[A-Z]$/.test(nif)) {
    // Company NIF validation
    const numbers = nif.substring(1, 8);
    const letter = nif.charAt(8);
    const expectedLetter = calculateNIFLetter(numbers);
    return letter === expectedLetter;
  }
  
  return false;
}

function calculateNIFLetter(numbers) {
  const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
  const remainder = parseInt(numbers) % 23;
  return letters.charAt(remainder);
}
```

### Date Validation

```javascript
// Date validation function
function validateDate(dateString) {
  const pattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!pattern.test(dateString)) return false;
  
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Check if date is valid
  if (date.getFullYear() !== parseInt(dateString.substring(0, 4))) return false;
  if (date.getMonth() + 1 !== parseInt(dateString.substring(5, 7))) return false;
  if (date.getDate() !== parseInt(dateString.substring(8, 10))) return false;
  
  // Check year range
  if (year < 1900 || year > 2099) return false;
  
  return true;
}
```

### Amount Validation

```javascript
// Amount validation function
function validateAmount(amount) {
  const pattern = /^\d{1,6}\.\d{2}$/;
  if (!pattern.test(amount)) return false;
  
  const num = parseFloat(amount);
  if (num < 0.01 || num > 999999.99) return false;
  
  // Check decimal places
  const decimalPlaces = (amount.split('.')[1] || '').length;
  if (decimalPlaces !== 2) return false;
  
  return true;
}
```

## Complex Type Definitions

### CabeceraType
```xml
<xsd:complexType name="CabeceraType">
  <xsd:sequence>
    <xsd:element name="NIFEmisor" type="xsd:string" minOccurs="1" maxOccurs="1"/>
    <xsd:element name="FechaEnvio" type="xsd:dateTime" minOccurs="1" maxOccurs="1"/>
    <xsd:element name="TiempoEsperaEnvio" type="xsd:positiveInteger" minOccurs="1" maxOccurs="1"/>
    <xsd:element name="TipoComunicacion" type="TipoComunicacionType" minOccurs="1" maxOccurs="1"/>
    <xsd:element name="NumeroRegistro" type="xsd:string" minOccurs="0" maxOccurs="1"/>
    <xsd:element name="Observaciones" type="xsd:string" minOccurs="0" maxOccurs="1"/>
  </xsd:sequence>
</xsd:complexType>
```

### FacturaType
```xml
<xsd:complexType name="FacturaType">
  <xsd:sequence>
    <xsd:element name="NumFactura" type="xsd:string" minOccurs="1" maxOccurs="1"/>
    <xsd:element name="FechaFactura" type="xsd:date" minOccurs="1" maxOccurs="1"/>
    <xsd:element name="NIFReceptor" type="xsd:string" minOccurs="1" maxOccurs="1"/>
    <xsd:element name="ImporteTotal" type="xsd:decimal" minOccurs="1" maxOccurs="1"/>
    <xsd:element name="TipoFactura" type="TipoFacturaType" minOccurs="1" maxOccurs="1"/>
    <xsd:element name="SerieFactura" type="xsd:string" minOccurs="0" maxOccurs="1"/>
    <xsd:element name="NumFacturaRectificativa" type="xsd:string" minOccurs="0" maxOccurs="1"/>
    <xsd:element name="FechaOperacion" type="xsd:date" minOccurs="0" maxOccurs="1"/>
    <xsd:element name="ClaveRegimenEspecialOTrascendencia" type="xsd:string" minOccurs="0" maxOccurs="1"/>
    <xsd:element name="DescripcionOperacion" type="xsd:string" minOccurs="0" maxOccurs="1"/>
    <xsd:element name="TipoDesglose" type="TipoDesgloseType" minOccurs="0" maxOccurs="1"/>
    <xsd:element name="DesgloseFactura" type="DesgloseFacturaType" minOccurs="0" maxOccurs="1"/>
  </xsd:sequence>
</xsd:complexType>
```

### DetalleFacturaType
```xml
<xsd:complexType name="DetalleFacturaType">
  <xsd:sequence>
    <xsd:element name="NumLinea" type="xsd:positiveInteger" minOccurs="1" maxOccurs="1"/>
    <xsd:element name="Descripcion" type="xsd:string" minOccurs="1" maxOccurs="1"/>
    <xsd:element name="Cantidad" type="xsd:decimal" minOccurs="1" maxOccurs="1"/>
    <xsd:element name="PrecioUnitario" type="xsd:decimal" minOccurs="1" maxOccurs="1"/>
    <xsd:element name="Descuento" type="xsd:decimal" minOccurs="0" maxOccurs="1"/>
    <xsd:element name="TipoDescuento" type="TipoDescuentoType" minOccurs="0" maxOccurs="1"/>
    <xsd:element name="ImporteTotal" type="xsd:decimal" minOccurs="1" maxOccurs="1"/>
    <xsd:element name="TipoIVA" type="TipoIVAType" minOccurs="1" maxOccurs="1"/>
    <xsd:element name="BaseImponible" type="xsd:decimal" minOccurs="0" maxOccurs="1"/>
    <xsd:element name="TipoImpositivo" type="xsd:decimal" minOccurs="0" maxOccurs="1"/>
    <xsd:element name="CuotaImpuesto" type="xsd:decimal" minOccurs="0" maxOccurs="1"/>
  </xsd:sequence>
</xsd:complexType>
```

## Enumeration Types

### TipoComunicacionType
```xml
<xsd:simpleType name="TipoComunicacionType">
  <xsd:restriction base="xsd:string">
    <xsd:enumeration value="Alta"/>
    <xsd:enumeration value="Baja"/>
    <xsd:enumeration value="Consulta"/>
    <xsd:enumeration value="Modificacion"/>
  </xsd:restriction>
</xsd:simpleType>
```

### TipoFacturaType
```xml
<xsd:simpleType name="TipoFacturaType">
  <xsd:restriction base="xsd:string">
    <xsd:enumeration value="F1"/>
    <xsd:enumeration value="F2"/>
    <xsd:enumeration value="F3"/>
    <xsd:enumeration value="F4"/>
    <xsd:enumeration value="F5"/>
  </xsd:restriction>
</xsd:simpleType>
```

### TipoIVAType
```xml
<xsd:simpleType name="TipoIVAType">
  <xsd:restriction base="xsd:string">
    <xsd:enumeration value="Gravado"/>
    <xsd:enumeration value="Exento"/>
    <xsd:enumeration value="NoGravado"/>
  </xsd:restriction>
</xsd:simpleType>
```

### TipoDescuentoType
```xml
<xsd:simpleType name="TipoDescuentoType">
  <xsd:restriction base="xsd:string">
    <xsd:enumeration value="Importe"/>
    <xsd:enumeration value="Porcentaje"/>
  </xsd:restriction>
</xsd:simpleType>
```

## Schema Validation

### XSD Validation Example

```xml
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:verifactu="urn:VeriFactu"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xsi:schemaLocation="urn:VeriFactu https://www1.aeat.es/jebi/ws/VeriFactu.xsd">
  <soap:Header />
  <soap:Body>
    <verifactu:Alta>
      <!-- Content validated against XSD schema -->
    </verifactu:Alta>
  </soap:Body>
</soap:Envelope>
```

### Schema Validation Tools

**Online XSD Validators:**
- [XML Schema Validator](https://www.xmlvalidation.com/)
- [W3C Markup Validator](https://validator.w3.org/)

**Command Line Tools:**
```bash
# XMLLint validation
xmllint --schema VeriFactu.xsd request.xml

# Java XSD validation
javax.xml.validation.Validator
```

**Node.js Validation:**
```javascript
const xsd = require('libxmljs');
const fs = require('fs');

const schema = fs.readFileSync('VeriFactu.xsd', 'utf8');
const xml = fs.readFileSync('request.xml', 'utf8');

const schemaDoc = xsd.parseXml(schema);
const xmlDoc = xsd.parseXml(xml);

const isValid = xmlDoc.validate(schemaDoc);
console.log('Valid:', isValid);
```
