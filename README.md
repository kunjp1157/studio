
# Sports Arena: A Next.js Facility Booking Application

**Sports Arena** is a modern, full-stack web application designed to streamline the process of discovering and booking sports facilities. Addressing the common challenge of finding and securing sports venues, this application provides a centralized, user-friendly hub that connects sports enthusiasts with facility owners. Built with a professional tech stack including Next.js for the frontend, a robust server backend, and integrated with Google's Genkit for AI-powered features, the project serves as a comprehensive, real-world example of a feature-rich booking system. It includes advanced search capabilities, real-time availability calendars, secure (mock) payment processing, and personalized user accounts, alongside an administrative portal for facility and user management. By leveraging modern web technologies and AI, Sports Arena aims to deliver a seamless, efficient, and engaging experience for both players and facility managers.

## Key Features

The application is split into two main user experiences: the public-facing site for players and a robust portal for administrators and facility owners.

### Core Functionality (For Players)

*   **Advanced Facility Search**: A powerful search engine to discover facilities. Users can filter by sport type, location, city, price range, and specific amenities like parking or locker rooms.
*   **Real-Time Booking System**: Users can view live availability calendars for each facility and book their desired time slots instantly.
*   **Secure (Mock) Payments**: A mock payment gateway is integrated, demonstrating the flow for paying with credit cards, UPI, or QR codes.
*   **Event Discovery & Registration**: A dedicated section for upcoming tournaments, leagues, and sports events. Users can view event details and register to participate.
*   **Player Matchmaking**: A "Looking for Game" board where users can post requests to find other players for a specific sport and skill level.
*   **Team Management**: Users can create their own sports teams, invite friends, and manage their roster.

### User Account Features

*   **Personalized Profiles**: Users have a detailed profile page where they can manage their information, set preferred sports, and specify their skill levels.
*   **Booking Management**: A dedicated "My Bookings" page to view upcoming and past reservations, with options to modify or cancel bookings.
*   **Favorites**: Users can save their favorite facilities for quick access in the future.
*   **Loyalty & Achievements**: A points-based loyalty system and a series of unlockable achievements to encourage user engagement.
*   **Public Profiles & Leaderboard**: Users can make their profiles public to showcase their skills and achievements, and compete for a top spot on the loyalty points leaderboard.

### Advanced AI-Powered Tools (User-Facing)

*   **AI Facility Recommender**: Analyzes a user's stated preferences and past booking history to provide intelligent, personalized facility suggestions.
*   **AI Weekend Planner**: A conversational tool where a user can describe their ideal sporty weekend in natural language (e.g., "A fun weekend for two, we like badminton and swimming"), and the AI generates a custom itinerary complete with facility suggestions, timings, and estimated costs.
*   **AI Review Summarizer**: Instead of reading through dozens of reviews, the AI analyzes all user feedback for a facility and presents a concise list of pros and cons, helping users make faster, more informed decisions.

### Admin & Owner Portal Features

*   **Comprehensive Dashboards**: Separate dashboards for site administrators and facility owners to view key metrics like revenue, bookings, and user growth.
*   **Facility Management**: Admins can add, edit, and manage all facility listings, including photos, amenities, pricing, and operating hours. Owners can manage their own specific facilities.
*   **Booking & User Management**: Admins can view and manage all bookings and user accounts on the platform.
*   **Availability Control**: Owners can block out time slots for their facilities for maintenance or private events.
*   **Dynamic Pricing & Promotions**: An admin-level engine to create rules that dynamically adjust prices (e.g., weekend surge pricing) or offer discounts.
*   **AI Presentation Generator**: An admin tool that analyzes live app data (users, bookings, revenue) and generates a professional business summary presentation with insightful talking points and strategic recommendations.
*   **AI Image Generation**: When creating or editing a facility, an admin can simply describe an image (e.g., "a modern indoor basketball court at night") and the AI will generate a high-quality, relevant photo, eliminating the need for stock imagery.

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
