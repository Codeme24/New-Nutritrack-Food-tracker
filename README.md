# NutriTrack - Food Nutrition Tracker

A comprehensive nutrition tracking web application built with React and Node.js, designed specifically for college students and healthcare professionals to monitor daily nutrition intake and maintain healthy lifestyle goals.

## 🚀 Features

- **User Authentication**: Secure login system using Replit Auth
- **Food Database**: Search and log foods with detailed nutritional information
- **Daily Tracking**: Monitor calories, protein, carbs, and fats intake
- **Goal Setting**: Set and track personalized daily nutrition goals
- **Progress Visualization**: Weekly progress charts and daily statistics
- **Meal Organization**: Categorize foods by meal type (breakfast, lunch, dinner, snacks)
- **Mobile Responsive**: Optimized for both desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **TanStack Query** for server state management
- **React Hook Form** with Zod validation
- **Wouter** for lightweight routing

### Backend
- **Node.js** with Express.js
- **TypeScript** with ES modules
- **PostgreSQL** database (via Neon serverless)
- **Drizzle ORM** for type-safe database operations
- **Passport.js** for authentication
- **Express Session** with PostgreSQL store

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd nutritrack
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Database connection (provided by Replit)
DATABASE_URL=your_database_url

# Session secret (provided by Replit)
SESSION_SECRET=your_session_secret

# Replit domains (provided by Replit)
REPLIT_DOMAINS=your_replit_domains
```

4. Push database schema:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

## 🏗️ Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── App.tsx        # Main application component
├── server/                 # Express backend
│   ├── db.ts              # Database configuration
│   ├── storage.ts         # Database operations
│   ├── routes.ts          # API routes
│   ├── replitAuth.ts      # Authentication setup
│   └── index.ts           # Server entry point
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema and types
└── package.json
```

## 📊 Database Schema

The application uses PostgreSQL with the following main tables:

- **users**: User profiles and authentication data
- **foods**: Food items with nutritional information
- **userGoals**: User-specific nutrition goals
- **foodEntries**: Daily food intake entries
- **sessions**: Session storage for authentication

## 🔌 API Endpoints

### Authentication
- `GET /api/auth/user` - Get current user information
- `GET /api/login` - Initiate login flow
- `GET /api/logout` - Logout user

### Foods
- `GET /api/foods/search?q=query` - Search foods
- `GET /api/foods/common` - Get common foods
- `POST /api/foods` - Create new food item

### Goals
- `GET /api/goals` - Get user goals
- `POST /api/goals` - Update user goals

### Food Entries
- `GET /api/food-entries?date=YYYY-MM-DD` - Get entries for date
- `POST /api/food-entries` - Create new entry
- `PATCH /api/food-entries/:id` - Update entry
- `DELETE /api/food-entries/:id` - Delete entry

### Statistics
- `GET /api/stats/daily?date=YYYY-MM-DD` - Get daily stats
- `GET /api/stats/weekly?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` - Get weekly progress

## 🎯 Target Audience

This application is designed for:

- **College Students**: Simple interface for tracking nutrition on a busy schedule
- **Healthcare Professionals**: Professional-grade tracking for patient care
- **Health-Conscious Individuals**: Anyone looking to monitor their nutrition intake

## 🌟 Key Benefits

- **Simple & Intuitive**: Easy-to-use interface designed for daily use
- **Comprehensive Tracking**: Monitor all essential macronutrients
- **Goal-Oriented**: Set and track personalized nutrition goals
- **Visual Progress**: Clear charts and statistics to track improvement
- **Mobile-Friendly**: Works seamlessly on all devices

## 🚀 Deployment

The application is optimized for deployment on Replit:

1. The project includes all necessary configuration files
2. Database migrations are handled automatically
3. Authentication is integrated with Replit Auth
4. Environment variables are managed through Replit's secrets system

## 📱 Usage

1. **Landing Page**: New users see a feature overview and can sign up
2. **Authentication**: Users log in using their Replit account
3. **Dashboard**: Main interface showing daily stats and quick food entry
4. **Food Logging**: Search for foods or add custom items
5. **Goal Setting**: Configure daily nutrition targets
6. **Progress Tracking**: View daily and weekly progress charts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

For support or questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation in `replit.md`

---

Built with ❤️ for the health and wellness community