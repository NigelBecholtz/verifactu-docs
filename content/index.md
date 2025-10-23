# Welcome to AEAT VERI*FACTU API documentation

#### Base URL

<https://prewww1.aeat.es/wlpl/TIKE-CONT/ws/SistemaFacturacion/VerifactuSOAP>

Find out all APIs at `API Reference` tab.

### Authentication

When working with the API, you need to use **mutual TLS authentication** with a qualified electronic certificate. For example: `X-509 Certificate <CERTIFICATE>`

##### Obtaining the certificate

To get your certificate, visit the [FNMT website](https://www.sede.fnmt.gob.es/) and complete the registration process:

1. **For Individuals (Persona Física)**: FREE
2. **For Companies (Persona Jurídica)**: €14-20

Navigate to "Certificados de Persona Física" or "Certificados de Persona Jurídica" and follow the online registration process.

**Certificate Requirements:**
- **Format**: X.509 certificate with private key
- **Authority**: FNMT (Fábrica Nacional de Moneda y Timbre)
- **Storage**: Must be securely stored on your server
- **Validity**: Typically 2-3 years, must be renewed before expiration

## API Operations

### Invoice Management
- **[Register Invoice](alta-register-invoice.md)** - Register new invoices with AEAT
- **[Cancel Invoice](baja-cancel-invoice.md)** - Cancel registered invoices  
- **[Query Invoice](consulta-query-invoice.md)** - Retrieve invoice information

### Technical Reference
- **[Parameters & Fields](parameters-and-fields.md)** - Detailed field explanations
- **[Error Handling](error-handling.md)** - Error codes and troubleshooting
- **[XSD Schema Reference](xsd-schema-reference.md)** - Complete schema documentation

## Implementation Guide

### Getting Started
- **[Authentication Setup](authentication.md)** - Certificate configuration and TLS setup
- **[Database Setup](node-implementation.md)** - Database schema modifications
- **[Code Implementation](node-implementation.md)** - Node.js implementation examples

### Examples & Testing
- **[Complete Examples](examples.md)** - Working examples for common scenarios
- **[Quick Reference](quick-reference.md)** - Quick lookup for developers

## Important Notes

- **Production vs Test**: Always use test environment first
- **Certificate Security**: Store certificates securely
- **Data Retention**: Keep audit trail for legal compliance
- **Error Handling**: Implement robust error handling for production use

## Official Resources

- [AEAT Official Website](https://www.agenciatributaria.es/)
- [VERI*FACTU Technical Documentation](https://sede.agenciatributaria.gob.es/Sede/iva/sistemas-informaticos-facturacion-verifactu.html)
- [FNMT Certificate Services](https://www.fnmt.es/)
- [AEAT Security Guidelines](https://sede.agenciatributaria.gob.es/Sede/condiciones-uso-sede-electronica/validacion-certificado-sede/validacion-certificado-sede.html)

---

*This documentation is designed to complement, not replace, the official AEAT documentation. Always refer to the latest official sources for regulatory compliance.*
