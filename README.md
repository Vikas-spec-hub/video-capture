
# Video Upload Project

This project is a video upload platform where users can upload a video file or record one using their camera. We are currently using Shadcn components for the proof of concept (POC), but these components can also be implemented on our own in the future.

## Prerequisites

Before running the project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v22 or later recommended)
- [pnpm](https://pnpm.io/) (used for managing dependencies)

## Setup

### 1. Clone the Repository

Clone the repository to your local machine:

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Install Dependencies

Install project dependencies using pnpm:

```bash
pnpm install
```

### 3. Configure the Environment

If needed, create a .env file in the root of the project and add necessary environment variables (e.g., API keys, database credentials, etc.). For now, this project doesn't require any special configuration, but that might change as features are added.

### 4. Run the Development Server

To run the project in development mode, use the following command:

```bash
pnpm dev
```

This will start the development server and you can open the app in your browser at http://localhost:3000.

### 5. Building the Project

To build the project for production, run:

```bash
pnpm build
```

This will create an optimized build for deployment.

#### Project Structure

The project uses Next.js with TypeScript. Here’s a brief overview of the structure:

components/: Contains reusable UI components like forms, buttons, and error display.
pages/: Next.js pages for the app, such as index.tsx for the main page.
actions/: Contains business logic like the uploadVideoActions.ts for uploading videos.
public/: Static files like images and assets.
styles/: Global styles for the app.
Current Use of Shadcn Components
For the proof of concept (POC), we are using Shadcn UI components to handle the UI elements such as form inputs, progress bars, and alerts. These components can be replaced or customized to build our own UI components as we move forward with the project.
