
# Sports Arena: A Next.js Facility Booking Application

Sports Arena is a modern, full-stack web application designed to be the go-to platform for discovering and booking sports facilities. Built with Next.js and PostgreSQL, and featuring AI-powered tools via Genkit, this project serves as a comprehensive example of a real-world booking system.

## Key Features

### For Users:
- **Facility Discovery:** Search, filter, and browse sports facilities by sport, location, price, and more.
- **Real-Time Booking:** View live availability and book slots instantly.
- **Secure Payments:** Mock integration for various payment methods including card, UPI, and QR code.
- **User Accounts:** Manage profiles, booking history, and favorite venues.
- **Event & Matchmaking:** Discover and register for sports events, or find players for a game.
- **Notifications:** Receive timely updates on bookings, reminders, and cancellations.

### AI-Powered User Tools:
- **Facility Recommender:** Analyzes your stated preferences (favorite sports, amenities) and past booking history to provide intelligent, personalized facility suggestions.
- **Weekend Planner:** Describe your ideal sporty weekend in natural language (e.g., "A fun weekend for two, we like badminton and swimming"), and the AI will generate a custom itinerary complete with facility suggestions, timings, and estimated costs.
- **Review Summarizer:** Instead of reading through dozens of reviews, the AI analyzes all user feedback for a facility and presents a concise list of pros and cons, helping you make faster, more informed decisions.

### For Admins & Owners:
- **Comprehensive Dashboards:** Separate dashboards for site administrators and facility owners.
- **Facility Management:** Admins can add, edit, and manage all facility listings, including photos, amenities, and pricing.
- **Booking Management:** Admins can view and manage all bookings on the platform.
- **User Management:** Admins can oversee user accounts, roles, and statuses.
- **Dynamic Pricing & Promotions:** Create rules to dynamically adjust prices or offer discounts.
- **Real-Time Updates:** Data management is powered by real-time Firestore listeners, ensuring instant UI updates.

### AI-Powered Admin Tools:
- **AI Presentation Generator:** An admin tool that analyzes live app data (users, bookings, revenue) and generates a professional business summary presentation with insightful talking points and strategic recommendations.
- **AI Image Generation:** When creating or editing a facility, admins can simply describe an image (e.g., "a modern indoor basketball court at night") and the AI will generate a high-quality, relevant photo, eliminating the need for stock imagery.

## Technology Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (connected via `pg`)
- **AI Integration:** [Genkit (by Google)](https://firebase.google.com/docs/genkit)
- **State Management:** React Hooks & Server Components
- **Form Handling:** [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- PostgreSQL installed and running on your local machine.

### 1. Clone the Repository
```sh
git clone https://github.com/your-username/sports-arena-app.git
cd sports-arena-app
```

### 2. Install Application Dependencies
```sh
npm install
```

### 3. Set Up the PostgreSQL Database

1.  **Create a New Database:**
    Open your PostgreSQL command-line tool (`psql`) or a GUI tool like pgAdmin. Create a new database for this project.
    ```sql
    CREATE DATABASE sports_arena;
    ```

2.  **Run the Schema Script:**
    The `schema.sql` file in the project root contains all the table definitions. Use `psql` to execute this file and create the necessary tables in your new database.
    ```sh
    psql -d sports_arena -f schema.sql
    ```
    *Note: You might need to provide host, username, and password flags depending on your PostgreSQL setup.*

### 4. Set up Environment Variables
Create a `.env` file in the root of the project. You need to add your PostgreSQL connection string to this file.

-   **Replace the placeholders** (`your_user`, `your_password`, `your_host`, `your_port`, `sports_arena`) with your actual local PostgreSQL credentials.

```env
# Example PostgreSQL Connection URL
DATABASE_URL="postgresql://your_user:your_password@your_host:your_port/sports_arena"
```

### 5. Run the Development Server
Now you can start the Next.js development server.
```sh
npm run dev
```
The application will be available at `http://localhost:3000`. The first time you run it, the application will automatically seed the database with initial data.

## Available Scripts

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts a production server.
- `npm run lint`: Runs ESLint for code analysis.

## Folder Structure

- `src/app/`: Contains all the pages and routes for the application, following the Next.js App Router structure.
- `src/components/`: Shared React components used across the application (e.g., `FacilityCard`, `PageTitle`).
- `src/lib/`: Core logic, type definitions (`types.ts`), data-fetching functions (`data.ts`), database configuration (`db.ts`), and utility functions (`utils.ts`).
- `src/ai/`: Home for all AI-related code, including Genkit flows and tools.
- `src/hooks/`: Custom React hooks.
- `public/`: Static assets like images and fonts.
- `schema.sql`: The complete database schema definition.
