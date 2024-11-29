# LuckyJinx

## Overview

This project is a collaborative coding platform designed to facilitate real-time pair programming, problem-solving, and communication. Built as part of the CS3219 module, it leverages a microservice-based architecture deployed on a Google Kubernetes Engine (GKE) cluster. The platform provides features such as real-time code collaboration, user matching based on skill and topic preferences, integrated communication, and enhanced code execution functionalities.

---

## Features

### Core Features

1. **User Management**:

   - User registration and login with email/password.
   - Integration with Google and GitHub for OAuth-based authentication.
   - Profile management, including preferred programming languages and profile pictures.
   - Differentiation between admin and user roles.

2. **Matching Service**:

   - Real-time matching based on difficulty level and topics.
   - Advanced algorithms to ensure unique and efficient matches.
   - Notifications and options for users to confirm or cancel matches.

3. **Question Repository**:

   - A comprehensive database of coding problems categorized by difficulty and topic.
   - Filtering, sorting, and viewing detailed problem statements.
   - Admins can add, edit, and delete questions.

4. **Collaboration Tools**:

   - Real-time code editor with synchronized changes and conflict resolution.
   - Cursor tracking to visualize user activity.
   - Integrated video and chat functionality for seamless communication.

5. **Code Execution**:

   - Secure and sandboxed environment for code compilation and execution.
   - Support for multiple programming languages.

6. **AI Integration**:
   - AI-assisted hints to guide problem-solving.
   - Session history and replay features for review and learning.

---

## Tech Stack

### Backend

- **Node.js**:
  - Frameworks: Express.js, Socket.IO.
  - Purpose: API development and real-time communication.
- **Python**:
  - Framework: FastAPI.
  - Purpose: Backend microservices for specific functionalities.
- **Database**:
  - MongoDB (primary database for persistence).
  - SQLite (lightweight in-memory database for certain services).
- **Messaging**:
  - RabbitMQ (message broker for inter-service communication).
- **Authentication**:
  - JSON Web Tokens (JWT) for secure and stateless authentication.

### Frontend

- **React**:
  - Framework for building the Single Page Application (SPA).
- **Code Editor**:
  - CodeMirror (integrated editor for coding functionalities).
- **UI/UX**:
  - MaterialUI for responsive components.
  - Sass for styling.

### Deployment

- **Containerization**:
  - Docker for packaging applications into containers.
- **Orchestration**:
  - Kubernetes for managing containerized applications.
- **Cloud Provider**:
  - Google Cloud Platform (GKE) for scalable and reliable deployment.
- **Service Discovery**:
  - Kubernetes-native mechanisms for discovering and linking services.

---

## Architecture

The platform employs a **microservices architecture**:

- **Frontend Service**: Built with React for user interaction.
- **User Service**: Handles authentication and user management.
- **Matching Service**: Manages real-time matching based on criteria.
- **Question Service**: Manages the coding problems repository.
- **Collaboration Service**: Enables real-time document sharing and conflict resolution.
- **Code Execution Service**: Executes user code securely.
- **Communication Service**: Video and chat integration.

---

## Installation and Setup

### Prerequisites

- Docker and Kubernetes installed locally.
- Access to Google Cloud Platform for Kubernetes deployment.
- MongoDB and RabbitMQ running.

### Steps

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Build Docker images:

   ```bash
   docker-compose build
   ```

3. Start services locally:

   ```bash
   docker-compose up
   ```

---

## Contributions

### Team Members

- **Kumar Prabhat**: Backend services, Dockerization, and collaboration refinements.
- **Luo Jiale**: Frontend integration, matching service components, and session management.
- **Sun Yitong**: UI development, AI hints service, and test cases.
- **Sun Xinyu**: Backend deployment, matching service optimizations.
- **Nguyen Khoi Nguyen**: Collaboration backend, user service, and execution environment.

---

## Future Enhancements

1. Enhanced analytics and reporting for collaborative sessions.
2. Expansion of the AI assistant capabilities for real-time debugging.
3. Integration of more advanced matching algorithms.
4. Support for additional languages in the execution environment.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contact

For any queries or feedback, contact the team at [itsprabxxx@gmail.com](mailto:itsprabxxx@gmail.com).

---
