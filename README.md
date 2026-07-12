# IR Assist

> AI-Powered Incident Response & Observability Platform

IR Assist is a production-style full-stack incident response and observability platform built with Next.js, TypeScript, Prisma, PostgreSQL, Prometheus, Grafana, Loki, Tempo and Docker.

It enables engineering teams to monitor infrastructure, manage incidents, analyze logs, visualize metrics, receive notifications and leverage AI-powered insights to reduce downtime and accelerate incident resolution.

---

# How IR Assist Works

IR Assist is an internal incident response platform.

Application services send logs, metrics and incident events through REST APIs.

The platform stores operational data inside PostgreSQL.

Engineers use the dashboard to:

• monitor service health
• create incidents
• investigate failures
• review timelines
• analyze logs
• receive AI-generated summaries
• track notifications

Grafana connects to the project database and Loki to visualize operational data in real time.

---

# Features

## Incident Management

- Create incidents
- Update incidents
- Resolve incidents
- Incident history
- Severity management
- Status tracking
- Service association

---

## Dashboard

- Real-time overview
- Active incidents
- Critical alerts
- Healthy services
- Analytics charts
- Incident trends
- Service health

---

## Service Monitoring

- Service inventory
- Health monitoring
- Availability tracking
- Response metrics
- Dependency visualization

---

## Metrics & Observability

- Prometheus integration
- Grafana dashboards
- CPU usage
- Memory usage
- Request rate
- Error rate
- Latency monitoring

---

## Logs Explorer

- Search logs
- Filter by severity
- Real-time updates
- AI log analysis

---

## Notifications

- Incident notifications
- Critical alerts
- Unread count
- Real-time updates

---

## Timeline

Complete incident history including:

- Incident created
- Assignment
- Severity updates
- Status changes
- Resolution events

---

## Audit Logs

Tracks

- User actions
- Incident changes
- Login events
- Administrative actions

---

## AI Features

- AI Incident Summary
- AI Log Analysis
- AI Timeline Summary
- AI Dashboard Insights
- AI Service Health Analysis
- AI Executive Report
- AI Root Cause Suggestions

---

## Authentication

- NextAuth
- Protected routes
- Session management

---

## RBAC

Roles

- Admin
- Engineer
- Viewer

---

## Monitoring Stack

- Grafana
---

## Testing

- Stress testing
- Load testing
- GitHub Actions
- ESLint

---

# Tech Stack

## Frontend

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Recharts
- Framer Motion

## Backend

- Next.js API Routes
- Prisma ORM
- PostgreSQL
- NextAuth

## Observability

- Grafana

## Infrastructure

- Docker
- Docker Compose
- GitHub Actions
- Vercel

---

# Architecture

```
                 Users
                    │
                    ▼
            Next.js Frontend
                    │
                    ▼
              API Routes
                    │
      ┌─────────────┼──────────────┐
      ▼             ▼              ▼
 Prisma ORM      AI Services   Monitoring
      │             │              │
      ▼             ▼              ▼
 PostgreSQL      Gemini AI   Prometheus
                                     │
                                     ▼
                                  Grafana
                                     │
                          Loki + Tempo
```

---

# Folder Structure

```
src
 ├── app
 ├── components
 ├── hooks
 ├── context
 ├── lib
 ├── types
 └── workers

monitoring
 ├── grafana
 ├── prometheus
 ├── tempo
 ├── loki
 └── alloy

docker

stress

prisma
```

---

# Installation

```bash
git clone https://github.com/mridul2507/AI-Powered-INCIDENT-RESPONSE-PLATFORM.git

cd AI-Powered-INCIDENT-RESPONSE-PLATFORM

npm install

npm run dev
```

---

# Deployment

Production deployment is available on Vercel.

Monitoring stack is containerized using Docker Compose.

---

# Load Testing

Stress and load testing were performed using Artillery.

Metrics collected include:

- Requests/sec
- Response time
- Throughput
- Failure rate
- Concurrent users

---

# Monitoring

The platform integrates

- Prometheus
- Grafana
- Loki
- Tempo

to provide complete observability for services, metrics, logs and traces.

---

# Security

- Authentication
- RBAC
- Protected APIs
- Audit Logging

---

# CI/CD

GitHub Actions automatically

- Install dependencies
- Run lint
- Build application



---

# License

MIT

---

Built by **Mridul Srivastava**