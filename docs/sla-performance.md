# SLA & Performance Specifications

## Overview

This document provides detailed Service Level Agreement (SLA) specifications, performance targets, and recommended batch sizes for the AEAT VERI*FACTU webservice.

## Performance Targets

### Response Time SLAs

| Operation Type | Target Response Time | Maximum Response Time | Peak Hours Adjustment |
|----------------|---------------------|----------------------|----------------------|
| **Single Invoice (Alta)** | 30 seconds | 60 seconds | +50% |
| **Batch Processing (≤100 invoices)** | 2 minutes | 5 minutes | +100% |
| **Batch Processing (≤500 invoices)** | 5 minutes | 10 minutes | +100% |
| **Batch Processing (≤1000 invoices)** | 10 minutes | 15 minutes | +100% |
| **Query Operations (Consulta)** | 15 seconds | 30 seconds | +50% |
| **Cancel Operations (Baja)** | 30 seconds | 60 seconds | +50% |

### Availability SLAs

| Environment | Target Availability | Maintenance Windows | Downtime Allowance |
|-------------|-------------------|-------------------|-------------------|
| **Production** | 99.5% | Sunday 02:00-04:00 CET | 3.6 hours/month |
| **Test** | 95% | Any time | 36 hours/month |

### Throughput Specifications

| Certificate Type | Requests per Minute | Daily Limit | Monthly Limit |
|------------------|-------------------|-------------|---------------|
| **Basic Certificate** | 10 requests/min | 1,000 requests | 30,000 requests |
| **Qualified Certificate** | 30 requests/min | 5,000 requests | 150,000 requests |
| **Enterprise Certificate** | 60 requests/min | 10,000 requests | 300,000 requests |

## Batch Processing Guidelines

### Recommended Batch Sizes

| Invoice Complexity | Recommended Batch Size | Processing Time | Success Rate |
|-------------------|----------------------|-----------------|--------------|
| **Simple Invoices (1-2 lines)** | 500 invoices | 3-5 minutes | 99.5% |
| **Medium Invoices (3-10 lines)** | 200 invoices | 4-6 minutes | 99.0% |
| **Complex Invoices (10+ lines)** | 100 invoices | 5-8 minutes | 98.5% |
| **Mixed Complexity** | 250 invoices | 4-7 minutes | 99.0% |

### Batch Size Limits

| Limit Type | Maximum Value | Recommended Value | Notes |
|------------|---------------|-------------------|-------|
| **Invoices per Batch** | 1,000 | 500 | AEAT hard limit |
| **Lines per Invoice** | 100 | 50 | Performance optimization |
| **Batch File Size** | 10 MB | 5 MB | Network optimization |
| **Concurrent Batches** | 3 | 1 | Certificate limit |

### Batch Processing Strategy

#### Optimal Batch Configuration
```javascript
const batchConfig = {
  maxInvoices: 500,
  maxLinesPerInvoice: 50,
  maxFileSize: '5MB',
  timeout: 300000, // 5 minutes
  retryAttempts: 3,
  retryDelay: 5000 // 5 seconds
};
```

#### Batch Size Calculator
```javascript
function calculateOptimalBatchSize(invoiceComplexity) {
  const complexityFactors = {
    'simple': { maxInvoices: 500, processingTime: 180 },
    'medium': { maxInvoices: 200, processingTime: 300 },
    'complex': { maxInvoices: 100, processingTime: 480 }
  };
  
  const factor = complexityFactors[invoiceComplexity] || complexityFactors['medium'];
  return {
    recommendedBatchSize: factor.maxInvoices,
    expectedProcessingTime: factor.processingTime,
    successRate: 99.0
  };
}
```

## Performance Monitoring

### Key Performance Indicators (KPIs)

| Metric | Target | Warning Threshold | Critical Threshold |
|--------|--------|------------------|-------------------|
| **Response Time** | < 30s | > 45s | > 60s |
| **Success Rate** | > 99% | < 98% | < 95% |
| **Error Rate** | < 1% | > 2% | > 5% |
| **Availability** | > 99.5% | < 99% | < 95% |

### Performance Monitoring Setup

```javascript
const performanceMonitor = {
  metrics: {
    responseTime: [],
    successRate: 0,
    errorRate: 0,
    availability: 100
  },
  
  recordResponse: function(startTime, endTime, success) {
    const responseTime = endTime - startTime;
    this.metrics.responseTime.push(responseTime);
    
    if (success) {
      this.metrics.successRate = (this.metrics.successRate + 1) / 2;
    } else {
      this.metrics.errorRate = (this.metrics.errorRate + 1) / 2;
    }
  },
  
  getAverageResponseTime: function() {
    return this.metrics.responseTime.reduce((a, b) => a + b, 0) / this.metrics.responseTime.length;
  },
  
  checkThresholds: function() {
    const avgResponseTime = this.getAverageResponseTime();
    
    if (avgResponseTime > 60000) {
      console.warn('CRITICAL: Average response time exceeds 60 seconds');
    } else if (avgResponseTime > 45000) {
      console.warn('WARNING: Average response time exceeds 45 seconds');
    }
    
    if (this.metrics.successRate < 0.95) {
      console.warn('CRITICAL: Success rate below 95%');
    } else if (this.metrics.successRate < 0.98) {
      console.warn('WARNING: Success rate below 98%');
    }
  }
};
```

## Rate Limiting

### AEAT Rate Limits

| Limit Type | Value | Reset Period | Burst Allowance |
|------------|-------|--------------|-----------------|
| **Requests per Minute** | 30 | 1 minute | 50 (first minute) |
| **Requests per Hour** | 1000 | 1 hour | 1200 (first hour) |
| **Requests per Day** | 10000 | 24 hours | 12000 (first day) |

### Rate Limit Handling

```javascript
class RateLimiter {
  constructor() {
    this.requests = [];
    this.limits = {
      perMinute: 30,
      perHour: 1000,
      perDay: 10000
    };
  }
  
  canMakeRequest() {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    const oneHourAgo = now - 3600000;
    const oneDayAgo = now - 86400000;
    
    // Clean old requests
    this.requests = this.requests.filter(time => time > oneDayAgo);
    
    // Check limits
    const recentRequests = this.requests.filter(time => time > oneMinuteAgo);
    const hourlyRequests = this.requests.filter(time => time > oneHourAgo);
    const dailyRequests = this.requests.length;
    
    if (recentRequests.length >= this.limits.perMinute) {
      return { allowed: false, reason: 'minute_limit', retryAfter: 60 };
    }
    
    if (hourlyRequests.length >= this.limits.perHour) {
      return { allowed: false, reason: 'hour_limit', retryAfter: 3600 };
    }
    
    if (dailyRequests >= this.limits.perDay) {
      return { allowed: false, reason: 'day_limit', retryAfter: 86400 };
    }
    
    return { allowed: true };
  }
  
  recordRequest() {
    this.requests.push(Date.now());
  }
}
```

## Error Handling SLAs

### Error Response Times

| Error Type | Target Response Time | Maximum Response Time |
|------------|---------------------|----------------------|
| **Validation Errors** | 5 seconds | 10 seconds |
| **Authentication Errors** | 10 seconds | 20 seconds |
| **Business Logic Errors** | 15 seconds | 30 seconds |
| **System Errors** | 30 seconds | 60 seconds |

### Error Recovery Times

| Error Type | Target Recovery | Maximum Recovery |
|------------|----------------|------------------|
| **Transient Errors** | 1 minute | 5 minutes |
| **Certificate Errors** | 5 minutes | 15 minutes |
| **System Errors** | 15 minutes | 60 minutes |

## Capacity Planning

### Resource Requirements

| Load Level | CPU Usage | Memory Usage | Network Bandwidth | Storage |
|------------|-----------|--------------|-------------------|---------|
| **Light (< 100 req/hour)** | 10% | 512 MB | 1 Mbps | 1 GB |
| **Medium (100-1000 req/hour)** | 30% | 2 GB | 10 Mbps | 10 GB |
| **Heavy (1000+ req/hour)** | 60% | 8 GB | 50 Mbps | 50 GB |

### Scaling Recommendations

```javascript
const scalingConfig = {
  light: {
    instances: 1,
    cpu: '1 core',
    memory: '1 GB',
    storage: '10 GB SSD'
  },
  medium: {
    instances: 2,
    cpu: '2 cores',
    memory: '4 GB',
    storage: '50 GB SSD'
  },
  heavy: {
    instances: 4,
    cpu: '4 cores',
    memory: '16 GB',
    storage: '200 GB SSD'
  }
};
```

## Performance Optimization

### Best Practices

1. **Connection Pooling**
   - Reuse HTTPS connections
   - Set appropriate pool size
   - Monitor connection health

2. **Caching Strategy**
   - Cache certificate data
   - Cache configuration settings
   - Implement cache invalidation

3. **Batch Processing**
   - Use optimal batch sizes
   - Implement parallel processing
   - Monitor batch performance

4. **Error Handling**
   - Implement exponential backoff
   - Use circuit breaker pattern
   - Monitor error rates

### Performance Testing

```javascript
const performanceTest = {
  testScenarios: [
    {
      name: 'Single Invoice',
      invoices: 1,
      expectedTime: 30000,
      maxTime: 60000
    },
    {
      name: 'Small Batch',
      invoices: 50,
      expectedTime: 120000,
      maxTime: 300000
    },
    {
      name: 'Large Batch',
      invoices: 500,
      expectedTime: 300000,
      maxTime: 600000
    }
  ],
  
  runTest: async function(scenario) {
    const startTime = Date.now();
    
    try {
      const result = await this.processBatch(scenario.invoices);
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      return {
        scenario: scenario.name,
        duration: duration,
        expected: scenario.expectedTime,
        max: scenario.maxTime,
        passed: duration <= scenario.maxTime,
        performance: duration / scenario.expectedTime
      };
    } catch (error) {
      return {
        scenario: scenario.name,
        error: error.message,
        passed: false
      };
    }
  }
};
```

## Compliance Requirements

### Data Retention SLAs

| Data Type | Retention Period | Storage Requirements | Access Requirements |
|-----------|------------------|----------------------|-------------------|
| **Request/Response Logs** | 4 years | Encrypted storage | Audit trail access |
| **CSV Codes** | 4 years | Secure database | Authorized access only |
| **Error Logs** | 2 years | Compressed storage | Technical support access |
| **Performance Metrics** | 1 year | Aggregated storage | Monitoring access |

### Security SLAs

| Security Aspect | Requirement | Monitoring | Response Time |
|-----------------|-------------|-------------|---------------|
| **Certificate Validation** | 100% | Real-time | < 1 second |
| **Data Encryption** | AES-256 | Continuous | N/A |
| **Access Logging** | 100% | Real-time | < 1 second |
| **Audit Trail** | 100% | Real-time | < 1 second |

## Service Level Objectives (SLOs)

### Primary SLOs

1. **Availability**: 99.5% uptime
2. **Performance**: 95% of requests < 30 seconds
3. **Accuracy**: 99.9% correct processing
4. **Security**: 100% encrypted communications

### Secondary SLOs

1. **Recovery Time**: < 15 minutes for system errors
2. **Data Integrity**: 100% data consistency
3. **Compliance**: 100% regulatory compliance
4. **Support**: < 4 hours response time

## Monitoring and Alerting

### Alert Thresholds

```javascript
const alertConfig = {
  critical: {
    responseTime: 60000, // 60 seconds
    errorRate: 0.05, // 5%
    availability: 0.95 // 95%
  },
  warning: {
    responseTime: 45000, // 45 seconds
    errorRate: 0.02, // 2%
    availability: 0.99 // 99%
  }
};
```

### Monitoring Dashboard

```javascript
const monitoringDashboard = {
  metrics: [
    'response_time_p95',
    'success_rate',
    'error_rate',
    'availability',
    'throughput',
    'batch_processing_time'
  ],
  
  alerts: [
    'high_response_time',
    'low_success_rate',
    'high_error_rate',
    'low_availability',
    'certificate_expiry',
    'rate_limit_exceeded'
  ]
};
```
