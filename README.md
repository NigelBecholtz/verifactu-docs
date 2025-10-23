# AEAT VERI*FACTU API Documentation

## Overview

This comprehensive documentation describes the AEAT VERI*FACTU SOAP webservice for invoice registration in Spain. The documentation is specifically designed for JavaScript/Node.js developers who need to integrate with the Spanish tax authority's invoice verification system.

## What is VERI*FACTU?

VERI*FACTU (Verificación de Facturas) is the Spanish tax authority's (AEAT) system for electronic invoice verification. It's designed to:

- **Prevent tax fraud** by verifying invoice authenticity
- **Ensure compliance** with Spanish tax regulations
- **Provide real-time validation** of invoice data
- **Generate secure verification codes** (CSV) for invoices

## How VERI*FACTU Works

1. **Invoice Registration**: Businesses register invoices with AEAT before sending them to customers
2. **Real-time Validation**: AEAT validates the invoice data against tax rules
3. **Secure Code Generation**: AEAT generates a unique CSV (Código Seguro de Verificación) for each valid invoice
4. **Customer Verification**: Customers can verify invoice authenticity using the CSV code

## Documentation Structure

This documentation is organized into focused sections:

### Core API Documentation
- **[Endpoints Overview](docs/endpoints.md)** - SOAP endpoints and operation overview
- **[Register Invoice](docs/alta-register-invoice.md)** - Complete guide to invoice registration
- **[Cancel Invoice](docs/baja-cancel-invoice.md)** - How to cancel registered invoices
- **[Query Invoice](docs/consulta-query-invoice.md)** - Retrieve invoice information

### Technical Implementation
- **[Authentication](docs/authentication.md)** - Mutual TLS setup and certificate management
- **[Parameters & Fields](docs/parameters-and-fields.md)** - Detailed field explanations and validation rules
- **[Error Handling](docs/error-handling.md)** - Error codes, validation, and troubleshooting
- **[Node.js Implementation](docs/node-implementation.md)** - Technical guidance for JavaScript developers

### Practical Examples
- **[XML Examples](docs/examples.md)** - Complete working examples for common scenarios

## Quick Start

1. **Obtain Certificates**: Get your client certificate from FNMT or AEAT
2. **Configure TLS**: Set up mutual TLS authentication
3. **Register Invoice**: Use the Alta operation to register invoices
4. **Handle Responses**: Process CSV codes and status information
5. **Store Data**: Maintain audit trail as required by law

## Important Notes

- **Production vs Test**: Always use test environment first
- **Certificate Security**: Store certificates securely
- **Data Retention**: Keep audit trail for legal compliance
- **Error Handling**: Implement robust error handling for production use

## Official AEAT Resources

- [AEAT Official Website](https://www.agenciatributaria.es/)
- [VERI*FACTU Technical Documentation](https://www.agenciatributaria.es/AEAT.internet/Inicio/Ayuda/Manuales/_Ayuda_Manuales_/Manuales_tecnico/Manuales_tecnico.html)
- [FNMT Certificate Services](https://www.fnmt.es/)

## Support

For technical issues with this documentation, please refer to the specific sections above. For AEAT-specific questions, consult the official AEAT documentation or contact their technical support.

---

*This documentation is designed to complement, not replace, the official AEAT documentation. Always refer to the latest official sources for regulatory compliance.*
