# IR Assist

> AI-Powered Incident Response & Observability Platform

IR Assist is a production-style full-stack incident response and observability platform built with Next.js, TypeScript, Prisma, PostgreSQL (Neon), Prometheus, Grafana, Loki, Tempo, and Docker.

It enables engineering teams to monitor infrastructure, manage incidents, analyze logs, visualize metrics, receive notifications, and leverage AI-powered insights to reduce downtime and accelerate incident resolution.

---

# How IR Assist Works

IR Assist is an internal incident response platform designed for enterprise scalability. 

Application services send logs, metrics, and incident events through REST APIs. The platform stores operational data inside a serverless PostgreSQL database (Neon).

Engineers use the dashboard to:
• monitor service health
• create and manage incidents
• investigate failures
• review automated timelines
• analyze logs
• receive AI-generated root cause summaries
• track notifications

Grafana connects to the project database and Loki to visualize operational data in real-time.

---

# Features

## Multi-Tenancy & Team Management
- Organization-level data isolation
- Seamless team onboarding via Admin invitation system
- Strict permission boundaries

## Incident Management
- Create, update, and resolve incidents
- Incident history and timeline tracking
- Severity management
- Status tracking
- Service association

## Dashboard
- Real-time overview of active incidents
- Critical alerts and healthy services
- Analytics charts and incident trends
- Service health at a glance

## Service Monitoring
- Service inventory
- Health monitoring and availability tracking
- Response metrics
- Dependency visualization

## Metrics & Observability
- Prometheus integration
- Grafana dashboards
- CPU and Memory usage tracking
- Request rate, error rate, and latency monitoring

## Logs Explorer
- Search logs and filter by severity
- Real-time updates
- AI-powered log analysis

## Notifications
- Organization-wide incident notifications
- Critical alerts
- Unread count with real-time updates

## Timeline
Complete incident history including:
- Incident creation and assignment
- Severity and status updates
- Resolution events

## Audit Logs
Tamper-proof tracking of:
- User actions and incident changes
- Login events
- Administrative actions

## AI Features (Powered by Google Gemini)
- AI Incident Summary & Root Cause Suggestions
- AI Log Analysis & Timeline Summary
- AI Dashboard Insights
- AI Service Health Analysis
- AI Executive Report

## Authentication
- NextAuth integration
- Supports both secure Credentials and Google OAuth
- Protected routes and secure session management

## Role-Based Access Control (RBAC)
Roles:
- Admin (Can manage org settings and invite team members)
- Engineer (Can manage incidents and view metrics)
- Viewer (Read-only access)

## Testing
- Stress and load testing via Artillery
- GitHub Actions for CI
- ESLint

---

# Tech Stack

## Frontend
- Next.js App Router, React, TypeScript
- Tailwind CSS, Recharts, Framer Motion

## Backend
- Next.js API Routes
- Prisma ORM
- PostgreSQL (Neon)
- NextAuth
- Google Gemini API

## Observability
- Grafana, Prometheus, Loki, Tempo, Grafana Alloy

## Infrastructure
- Docker & Docker Compose
- GitHub Actions
- Vercel

---

# Architecture

```text
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
PostgreSQL       Gemini API    Prometheus
  (Neon)                           │
                                   ▼
                                Grafana
                                   │
                        Loki + Tempo + Alloy
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
