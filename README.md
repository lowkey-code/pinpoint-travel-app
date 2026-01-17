# PinPoint (Remix)

PinPoint is a client-first PWA to save and organize travel places. It supports categories, search, offline storage, and a light/dark theme.

## Features

- Add, edit, delete, and filter places
- Fast search by name, address, and notes
- Light/dark theme with persistence
- Offline-first storage via localStorage
- Tailwind CSS styling and a polished UI

## Stack

- React Router 7 (Remix-style app)
- React 19
- Tailwind CSS v4
- Vite

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Build and Run

Create a production build:

```bash
npm run build
```

Run the production server:

```bash
npm run start
```

The server defaults to port 3000 in production.

## Tests

Run Playwright smoke tests:

```bash
npm run test:e2e
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

The UI is styled with Tailwind CSS v4 and a custom theme in `app/app.css`.

---

Built with ❤️ using React Router.
