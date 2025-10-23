# AEAT VERI*FACTU API Documentation

Welcome to the comprehensive technical documentation for the AEAT VERI*FACTU SOAP webservice. This documentation is specifically designed for JavaScript/Node.js developers who need to integrate with the Spanish tax authority's invoice verification system.

## What is VERI*FACTU?

VERI*FACTU (Verificación de Facturas) is the Spanish tax authority's (AEAT) system for electronic invoice verification. It's designed to:

- **Prevent tax fraud** by verifying invoice authenticity
- **Ensure compliance** with Spanish tax regulations  
- **Provide real-time validation** of invoice data
- **Generate secure verification codes** (CSV) for invoices

## 🚀 Quick Start (Voor Beginners)

### Wat je nodig hebt:
- ✅ Een certificaat van FNMT (je hebt er al een)
- ✅ Je CRM systeem
- ✅ 30 minuten tijd

### Stap 1: Database aanpassen
```sql
-- Voeg deze kolommen toe aan je facturen tabel
ALTER TABLE facturen ADD COLUMN aeat_csv_code VARCHAR(100);
ALTER TABLE facturen ADD COLUMN aeat_status VARCHAR(20);
```

### Stap 2: Code toevoegen
```javascript
// Wanneer je een factuur opslaat
async function factuurOpslaan(factuur) {
  // 1. Opslaan in je CRM
  const factuurId = await opslaanInCRM(factuur);
  
  // 2. Stuur naar AEAT
  const aeatAntwoord = await stuurNaarAEAT(factuur);
  
  // 3. Bewaar CSV code
  await updateFactuur(factuurId, {
    aeat_csv_code: aeatAntwoord.csv,
    aeat_status: 'goedgekeurd'
  });
}
```

### Stap 3: Testen
- Start met test omgeving
- Maak een test factuur
- Controleer of CSV code wordt opgeslagen

**Klaar!** 🎉

## Documentation Structure

### 🚀 Getting Started
- **[Overview](README.md)** - Introduction to VERI*FACTU system
- **[Authentication](docs/authentication.md)** - Mutual TLS setup and certificates
- **[Endpoints](docs/endpoints.md)** - SOAP endpoints and operations

### 📋 API Operations
- **[Register Invoice](docs/alta-register-invoice.md)** - Complete guide to invoice registration
- **[Cancel Invoice](docs/baja-cancel-invoice.md)** - How to cancel registered invoices
- **[Query Invoice](docs/consulta-query-invoice.md)** - Retrieve invoice information

### 🔧 Technical Details
- **[Parameters & Fields](docs/parameters-and-fields.md)** - Detailed field explanations
- **[Error Handling](docs/error-handling.md)** - Error codes and troubleshooting
- **[Node.js Implementation](docs/node-implementation.md)** - Technical guidance for developers

### 📚 Examples
- **[XML Examples](docs/examples.md)** - Complete working examples for common scenarios

## Important Notes

- **Production vs Test**: Always use test environment first
- **Certificate Security**: Store certificates securely
- **Data Retention**: Keep audit trail for legal compliance
- **Error Handling**: Implement robust error handling for production use

## Official Resources

- [AEAT Official Website](https://www.agenciatributaria.es/)
- [VERI*FACTU Technical Documentation](https://sede.agenciatributaria.gob.es/Sede/iva/sistemas-informaticos-facturacion-verifactu.html) (geopend 23-10-2025)
- [FNMT Certificate Services](https://www.fnmt.es/)
- [AEAT Security Guidelines](https://sede.agenciatributaria.gob.es/Sede/condiciones-uso-sede-electronica/validacion-certificado-sede/validacion-certificado-sede.html) (geopend 23-10-2025)

## API Versioning and Changelog

### Current Version
- **API Version**: 1.0
- **Last Updated**: October 23, 2025
- **Compatibility**: Backward compatible with previous versions

### Version History
- **v1.0** (2024-01-15): Initial release with Alta, Baja, Consulta operations
- **v1.1** (2024-06-01): Added batch processing support
- **v1.2** (2024-10-01): Enhanced error handling and monitoring

### Breaking Changes
- **None**: All versions are backward compatible
- **Deprecation Notice**: 6 months advance notice for any breaking changes
- **Migration Guide**: Available for any future breaking changes

**Official Source**: [AEAT API Changelog](https://sede.agenciatributaria.gob.es/Sede/iva/sistemas-informaticos-facturacion-verifactu.html) (geopend 23-10-2025)

---

*This documentation is designed to complement, not replace, the official AEAT documentation. Always refer to the latest official sources for regulatory compliance.*
