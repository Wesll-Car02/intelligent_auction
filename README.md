# Fullstack Application

This project is a fullstack application consisting of a backend and a frontend, designed to be easily deployed using Docker and Docker Compose.

## Project Structure

```
fullstack-app
├── backend
│   ├── Dockerfile
│   ├── index.js
│   ├── package.json
│   └── .env
├── frontend
│   ├── Dockerfile
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── public
│   │   └── index.html
│   └── src
│       ├── index.js
│       ├── App.js
│       └── index.css
├── docker-compose.yml
├── .env
└── README.md
```

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd fullstack-app
   ```

2. Configure environment variables:
   - Update the `.env` file in the root directory with your configuration.
   - Optionally, update the `backend/.env` file for backend-specific variables.

### Running the Application

To start the application, run the following command in the root directory:

```
docker-compose up --build
```

This command will build the Docker images for both the backend and frontend and start the services.

### Accessing the Application

- The frontend will be available at `http://localhost:<frontend-port>`.
- The backend API will be accessible at `http://localhost:<backend-port>`.

### Stopping the Application

To stop the application, press `CTRL + C` in the terminal where the application is running, or run:

```
docker-compose down
```

## Contributing

Feel free to submit issues or pull requests for any improvements or bug fixes.

## License

This project is licensed under the MIT License.