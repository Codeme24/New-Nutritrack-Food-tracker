# NutriTrack Application

## Overview

NutriTrack is a comprehensive nutrition tracking application built with a modern full-stack architecture. The application is designed for college students and healthcare professionals to track their nutrition intake, set goals, and monitor their progress. It features a React frontend with a Node.js/Express backend, using PostgreSQL for data persistence and Drizzle ORM for database operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives with custom styling via shadcn/ui

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL (via Neon serverless)
- **ORM**: Drizzle ORM for type-safe database operations
- **Session Management**: Express session with PostgreSQL store
- **Authentication**: Replit Auth with OpenID Connect

## Key Components

### Database Schema
The application uses several core tables:
- `users`: User profiles and authentication data
- `foods`: Food items with nutritional information
- `userGoals`: User-specific nutrition goals
- `foodEntries`: Daily food intake entries
- `sessions`: Session storage for authentication

### API Structure
RESTful API endpoints organized by domain:
- `/api/auth/*`: Authentication and user management
- `/api/foods/*`: Food database operations
- `/api/goals/*`: User goal management
- `/api/food-entries/*`: Daily food logging
- `/api/stats/*`: Progress tracking and analytics

### Core Features
- **Food Search**: Search and add foods from database
- **Daily Logging**: Track meals by type (breakfast, lunch, dinner, snacks)
- **Goal Setting**: Set and track daily nutrition targets
- **Progress Monitoring**: View daily stats and weekly progress
- **Mobile Responsive**: Optimized for both desktop and mobile use

## Data Flow

1. **Authentication**: Users authenticate via Replit Auth (OpenID Connect)
2. **Data Fetching**: TanStack Query manages server state with automatic caching
3. **Form Submission**: React Hook Form handles client-side validation before API calls
4. **Database Operations**: Drizzle ORM provides type-safe database queries
5. **Real-time Updates**: Query invalidation ensures UI stays synchronized with server state

## External Dependencies

### Authentication
- **Replit Auth**: Primary authentication provider using OpenID Connect
- **Session Storage**: PostgreSQL-backed session management

### Database
- **Neon**: Serverless PostgreSQL hosting
- **Connection Pooling**: Built-in connection management for scalability

### UI/UX
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide Icons**: Consistent icon library

## Deployment Strategy

### Development
- **Local Development**: Vite dev server with hot module replacement
- **Database Migrations**: Drizzle Kit for schema management
- **Environment Variables**: Separate configurations for development/production

### Production
- **Build Process**: Vite builds frontend, esbuild bundles backend
- **Static Assets**: Frontend built to `dist/public` directory
- **Server Bundle**: Backend bundled as ES module for Node.js execution
- **Database**: Automated migrations via Drizzle Kit

### Architecture Decisions

**Problem**: Need for type-safe database operations
**Solution**: Drizzle ORM with TypeScript
**Rationale**: Provides compile-time type safety and excellent developer experience

**Problem**: Complex state management for server data
**Solution**: TanStack Query for server state management
**Rationale**: Handles caching, synchronization, and background updates automatically

**Problem**: Authentication complexity
**Solution**: Replit Auth integration
**Rationale**: Leverages existing Replit ecosystem for seamless authentication

**Problem**: Mobile responsiveness
**Solution**: Tailwind CSS with mobile-first approach
**Rationale**: Ensures consistent experience across devices with utility-first styling

**Problem**: Component consistency
**Solution**: shadcn/ui with Radix UI primitives
**Rationale**: Provides accessible, customizable components with consistent design system