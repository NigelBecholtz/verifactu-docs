# AEAT VERI*FACTU API - Complete Implementation Guide

Welcome to the step-by-step guide for integrating the AEAT VERI*FACTU system with your CRM. This documentation will take you from zero to a fully working integration.

## 🎯 What is VERI*FACTU?

VERI*FACTU (Verificación de Facturas) is the Spanish tax authority's system for electronic invoice verification. It:

- **Prevents tax fraud** by verifying invoice authenticity
- **Ensures compliance** with Spanish tax regulations  
- **Provides real-time validation** of invoice data
- **Generates secure verification codes** (CSV) for invoices

## 📋 Complete Implementation Steps

### **STEP 1: Prerequisites** 
*[5 minutes]*

**What you need:**
- ✅ A certificate from FNMT (you already have one)
- ✅ Your CRM system
- ✅ Basic programming knowledge

**→ [Go to Step 1: Prerequisites](authentication.md#step-1-prerequisites)**

---

### **STEP 2: Database Setup**
*[10 minutes]*

**Update your database schema:**
```sql
-- Add these columns to your invoices table
ALTER TABLE invoices ADD COLUMN aeat_csv_code VARCHAR(100);
ALTER TABLE invoices ADD COLUMN aeat_status VARCHAR(20);
ALTER TABLE invoices ADD COLUMN aeat_error TEXT;
```

**→ [Go to Step 2: Database Setup](node-implementation.md#step-2-database-setup)**

---

### **STEP 3: Certificate Configuration**
*[15 minutes]*

**Configure your certificate for AEAT:**
- Store certificate securely
- Set up TLS configuration
- Test certificate connection

**→ [Go to Step 3: Certificate Setup](authentication.md#step-3-certificate-setup)**

---

### **STEP 4: Code Implementation**
*[30 minutes]*

**Implement the core functions:**
- Send invoice to AEAT
- Handle responses
- Error handling

**→ [Go to Step 4: Code Implementation](node-implementation.md#step-4-code-implementation)**

---

### **STEP 5: Testing**
*[20 minutes]*

**Test your integration:**
- Test environment setup
- Create test invoices
- Verify CSV codes

**→ [Go to Step 5: Testing](examples.md#step-5-testing)**

---

### **STEP 6: Production Deployment**
*[15 minutes]*

**Go live:**
- Production environment setup
- Monitoring and logging
- Error handling

**→ [Go to Step 6: Production](endpoints.md#step-6-production)**

---

## 🚀 Quick Start (30 Minutes)

**If you want to get started immediately:**

1. **Update Database** (5 min)
2. **Add Basic Code** (15 min)  
3. **Test Connection** (10 min)

**→ [Quick Start Guide](authentication.md#quick-start-30-minutes)**

## 📚 Additional Documentation

### 🔧 Technical Reference
- **[Parameters & Fields](parameters-and-fields.md)** - Detailed field explanations
- **[Error Handling](error-handling.md)** - Error codes and troubleshooting
- **[XSD Schema Reference](xsd-schema-reference.md)** - Complete schema documentation

### 📋 API Operations
- **[Register Invoice](alta-register-invoice.md)** - Complete guide to invoice registration
- **[Cancel Invoice](baja-cancel-invoice.md)** - How to cancel registered invoices
- **[Query Invoice](consulta-query-invoice.md)** - Retrieve invoice information

### 📖 Implementation Examples
- **[Complete Examples](examples.md)** - Working examples for common scenarios
- **[Quick Reference](quick-reference.md)** - Quick lookup for developers

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
