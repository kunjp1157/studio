# Sports Arena: A Next.js Facility Booking Application

Sports Arena is a modern, full-stack web application designed to be the go-to platform for discovering and booking sports facilities. Built with Next.js, Firebase, and featuring AI-powered tools via Genkit, this project serves as a comprehensive example of a real-world booking system.

## Key Features

### For Users:
- **Facility Discovery:** Search, filter, and browse sports facilities by sport, location, price, and more.
- **Real-Time Booking:** View live availability and book slots instantly.
- **Secure Payments:** Mock integration for various payment methods including card, UPI, and QR code.
- **User Accounts:** Manage profiles, booking history, and favorite venues.
- **AI-Powered Tools:**
    - **Recommender:** Get personalized facility suggestions based on your preferences.
    - **Weekend Planner:** Describe your ideal sporty weekend and get a custom itinerary.
- **Event & Matchmaking:** Discover and register for sports events, or find players for a game.
- **Notifications:** Receive timely updates on bookings, reminders, and cancellations.

### For Admins & Owners:
- **Comprehensive Dashboards:** Separate dashboards for site administrators and facility owners.
- **Facility Management:** Admins can add, edit, and manage all facility listings, including photos, amenities, and pricing.
- **Booking Management:** Admins can view and manage all bookings on the platform.
- **User Management:** Admins can oversee user accounts, roles, and statuses.
- **Dynamic Pricing & Promotions:** Create rules to dynamically adjust prices or offer discounts.
- **AI Presentation Generator:** An admin tool that analyzes live app data and generates a business summary presentation.
- **Real-Time Updates:** Data management is powered by real-time Firestore listeners, ensuring instant UI updates.

## Technology Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **Database & Auth:** [Firebase](https://firebase.google.com/) (Firestore, Auth)
- **AI Integration:** [Genkit (by Google)](https://firebase.google.com/docs/genkit)
- **State Management:** React Hooks & Server Components
- **Form Handling:** [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/sports-arena-app.git
    cd sports-arena-app
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root of the project and add your Firebase project configuration keys:
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## Available Scripts

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts a production server.
- `npm run lint`: Runs ESLint for code analysis.

## Folder Structure

- `src/app/`: Contains all the pages and routes for the application, following the Next.js App Router structure.
- `src/components/`: Shared React components used across the application (e.g., `FacilityCard`, `PageTitle`).
- `src/lib/`: Core logic, type definitions (`types.ts`), data-fetching functions (`data.ts`), Firebase configuration (`firebase.ts`), and utility functions (`utils.ts`).
- `src/ai/`: Home for all AI-related code, including Genkit flows and tools.
- `src/hooks/`: Custom React hooks.
- `public/`: Static assets like images and fonts.
