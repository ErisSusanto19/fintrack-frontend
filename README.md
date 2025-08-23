# Finance Tracker - Front-End

## 1. Introduction

This is the Front-End project for the Finance Tracker application, built with Next.js and TypeScript. This project serves as the user interface (UI) to interact with the [Finance Tracker Backend API](https://github.com/ErisSusanto19/fintrack-backend).

## 2. Core Features (Roadmap)

- [x] User Authentication (Login & Register)
- [ ] Dashboard (Financial Overview)
- [ ] Transaction Management (CRUD)
- [ ] Account Management (CRUD)
- [ ] Category Management (CRUD)
- [ ] Budgeting
- [ ] Reporting & Analytics

## 3. Technology Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **API Communication:** Axios
- **Form Management:** React Hook Form & Zod

## 4. Project Structure

This project follows an organized folder structure designed for scalability:

- `src/app`: Routing and pages using the App Router.
- `src/components`: Reusable UI components.
- `src/lib`: Utilities, API configuration (Axios), and helpers.
- `src/store`: All Redux logic (store, slices, thunks).
- `src/types`: Global TypeScript type definitions.

## 5. Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm / yarn / pnpm

### Installation & Running Locally

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/ErisSusanto19/fintrack-backend]
    cd fintrack-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will be available at [http://localhost:3000](http://localhost:3000).