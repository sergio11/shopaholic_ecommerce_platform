# 🛍️ Shopaholic Ecommerce Platform 🛒

Welcome to Shopaholic! 🎉 Your ultimate destination for fashion ecommerce. This state-of-the-art platform, powered by NestJS (Typescript) 🚀, brings you a curated selection of clothing items. With robust features like intuitive product search 🔍, secure payment processing through Stripe and MercadoPago 💳💰, and a collaborative filtering recommendation system 🤝, shopping here is a breeze.

Not only does Shopaholic cater to customers, but it also empowers administrators with an Angular-based backoffice 🖥️. Manage products, orders, and users effortlessly. The deployment is Dockerized for scalability 🐳, while a HaProxy load balancer ensures smooth traffic distribution 🔄.

Explore Shopaholic now for a modern, seamless, and delightful shopping experience! 😊👗👠


<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Visual_Studio_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white" />
  <img src="https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white" />
  <img src="https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white" />
  <img src="https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white" />
  <img src="https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white" />
  <img src="https://img.shields.io/badge/redis-%23DD0031.svg?&style=for-the-badge&logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=white" />
  <img src="https://img.shields.io/badge/ts--node-3178C6?style=for-the-badge&logo=ts-node&logoColor=white" />
  <img src="https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E" />
  <img src="https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" />
</p>

## Features

- Fashion product catalog.
- Product search and filtering.
- Shopping cart and checkout process.
- Integration with Stripe and MercadoPago for payment processing.
- Collaborative filtering-based recommendation system to suggest products.
- User account and profile management.
- Social media integration for sharing products.
- Administration panel for managing products, orders, and users.

## Technologies Used

| Technology                  | Description                                                                 | Logo                                                                                   |
|----------------------------|-----------------------------------------------------------------------------|----------------------------------------------------------------------------------------|
| NestJS (Typescript)        | Backend framework for building scalable applications.                     | ![NestJS Logo](url_to_logo)                                                           |
| MariaDB Galera Cluster     | High availability and replication relational database.                    | ![MariaDB Logo](url_to_logo)                                                          |
| Redis Cluster              | In-memory storage system for caching and session management.              | ![Redis Logo](url_to_logo)                                                           |
| Stripe                     | Online payment platform for transaction processing.                        | ![Stripe Logo](url_to_logo)                                                          |
| MercadoPago                | Online payment and collections solution for ecommerce.                    | ![MercadoPago Logo](url_to_logo)                                                     |
| MinIO Cluster              | High-performance object storage for handling media and assets.            | ![MinIO Logo](url_to_logo)                                                           |
| Swagger Documentation     | Automatically generated API documentation using Swagger.                  | ![Swagger Logo](url_to_logo)                                                         |
| HaProxy Load Balancer      | Load balancer for distributing traffic among backend services.             | ![HaProxy Logo](url_to_logo)                                                         |

## Installation and Usage

1. Clone this repository.
2. Install dependencies using `npm install`.
3. Configure environment variables in a `.env` file.
4. Run the application using `npm start`.

For more detailed instructions on setting up and using the application, please refer to our [documentation](link_to_documentation).

## Backoffice Administration

We have developed an Angular-based backoffice for administrators to easily manage the product catalog, orders, and users of the platform.

### Backoffice Features

- Secure administrator login.
- Dashboard with key statistics and metrics.
- Product management: Add, edit, and delete products from the catalog.
- Order viewing and processing.
- User account management: View and manage user profiles.
- Intuitive and user-friendly interface for easy navigation and management.

### Backoffice Technologies Used

| Technology  | Description                                                                | Logo                                                                                   |
|-------------|----------------------------------------------------------------------------|----------------------------------------------------------------------------------------|
| Angular     | Frontend framework for creating dynamic user interfaces.                   | ![Angular Logo](url_to_logo)                                                         |
| TypeScript  | Programming language for Angular application development.                  | ![TypeScript Logo](url_to_logo)                                                      |
| Bootstrap   | CSS framework for creating responsive and appealing interfaces.            | ![Bootstrap Logo](url_to_logo)                                                       |

## Docker Deployment

We offer Docker Compose-based deployment for easy scaling and management:

1. Clone the repository.
2. Navigate to the deployment folder using `cd deployment`.
3. Modify the configuration files as needed.
4. Run `docker-compose up -d` to deploy the services.

For detailed instructions on setting up and deploying using Docker, please check our [Docker Deployment Guide](link_to_docker_guide).

## Screenshots

Here are some screenshots showcasing the platform and backoffice:
