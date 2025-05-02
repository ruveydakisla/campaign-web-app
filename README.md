# Campaign Management Project

This project is a campaign management system that utilizes **Supabase** for authentication, PostgreSQL database, and file storage. The project allows users to view, create, update, and delete campaigns. The frontend is built using Next.js, and it integrates with Supabase for authentication and storage functionalities.

## Features

- User authentication via Supabase Auth
- Campaign listing with options to view, update, and delete campaigns
- File storage for campaign images using Supabase Storage
- Responsive design built with Tailwind CSS
- Toast notifications for success and error messages

## Prerequisites

Before running this project locally, make sure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v14.x or higher)
- [npm](https://www.npmjs.com/) (v6.x or higher)
- A Supabase account for authentication and database setup

## Getting Started

### 1. Clone the Repository

Clone this repository to your local machine:

```sh
git clone <repository-url>

```
### 2. Install Dependencies
Navigate to the project folder and install dependencies:
```sh
cd <project-folder>
npm install
```
### 3. Set Up Environment Variables
Create a .env.local file in the root of the project and add your Supabase credentials:
```sh
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
```
### 4. Run the Development Server
Start the development server:
```sh
npm run dev
```


