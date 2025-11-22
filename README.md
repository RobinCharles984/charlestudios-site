<br/>
<p align="center">
  <a href="https://github.com/RobinCharles984/charlestudios-site">
    <img src="https://img.icons8.com/fluency/96/null/imac.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Charles Fullstack Portfolio</h3>

  <p align="center">
    A modern, responsive, and dynamic portfolio website built with the MERN stack (MongoDB, Express, React, Node) and TypeScript.
    <br/>
    <br/>
    <a href="https://github.com/RobinCharles984"><strong>Explore the docs »</strong></a>
    <br/>
    <br/>
    <a href="#">View Demo</a>
    .
    <a href="https://github.com/RobinCharles984/charlestudios-site/issues">Report Bug</a>
    .
    <a href="https://github.com/RobinCharles984/charlestudios-site/issues">Request Feature</a>
  </p>
</p>

<div align="center">

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

</div>

## Table Of Contents

* [About the Project](#about-the-project)
* [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
  * [Environment Variables](#environment-variables)
* [Usage](#usage)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Authors](#authors)
* [Acknowledgements](#acknowledgements)

## About The Project

This project was created to showcase my work as a Fullstack and Game Developer. Unlike static portfolios, this application features a complete Content Management System (CMS) built from scratch.

**Key Features:**
* **Dynamic Project Loading:** Projects are fetched from a MongoDB database.
* **Admin Dashboard:** A restricted area (`/admin/new`) allows the owner to create new posts securely.
* **Image Upload:** Support for uploading project covers directly to the database (Base64) or using external URLs.
* **Community Integration:** Users can comment on projects using their GitHub accounts (via Giscus integration).
* **Auto-Slug:** Automatic URL generation based on project titles.
* **Responsive Design:** Fully adapted for mobile and desktop using Tailwind CSS.

## Built With

This project uses a separated Front-end and Back-end architecture:

* [React](https://reactjs.org/) - UI Library
* [TypeScript](https://www.typescriptlang.org/) - Static Typing
* [Tailwind CSS](https://tailwindcss.com/) - Styling
* [Node.js](https://nodejs.org/) - Runtime Environment
* [Express](https://expressjs.com/) - Web Framework
* [MongoDB Atlas](https://www.mongodb.com/atlas) - Database
* [Giscus](https://giscus.app/) - Comments System

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

* Node.js (v18 or higher)
* MongoDB Account (Atlas) or local instance

### Installation

1. Clone the repo
```sh
git clone [https://github.com/RobinCharles984/charlestudios-site.git](https://github.com/RobinCharles984/charlestudios-site.git)
```

2. Install **Back-end** dependencies
```sh
cd portfolio-backend
npm install
```

3. Install **Front-end** dependencies
```sh
cd portfolio-front
npm install
```

### Environment Variables

You need to configure the secrets for the Back-end.

1. Create a `.env` file inside the `portfolio-backend` folder.
2. Add the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
ADMIN_SECRET=your_super_secret_password
```

## Usage

### Running Development Servers

You need to run both terminals (Front and Back) simultaneously.

**Terminal 1 (Back-end):**
```sh
cd portfolio-backend
npm run dev
```
*Server will start at http://localhost:5000*

**Terminal 2 (Front-end):**
```sh
cd portfolio-front
npm run dev
```
*Client will start at http://localhost:5173*

### Accessing Admin Area

To post a new project:
1. Go to `http://localhost:5173/admin/new`
2. Fill in the project details.
3. Enter the `ADMIN_SECRET` you defined in your `.env` file.
4. Click Publish.

## Roadmap

See the [open issues](https://github.com/RobinCharles984/charlestudios-site/issues) for a list of proposed features (and known issues).

* [x] Basic CRUD for Projects
* [x] Image Upload Support
* [x] Comment System
* [ ] Dark/Light Mode Toggle
* [ ] Edit/Delete Functionality in Admin Panel
* [ ] Markdown Rendering for Descriptions

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Authors

* **Robin Charles** - *Fullstack & Game Developer* - [RobinCharles984](https://github.com/RobinCharles984/)

## Acknowledgements

* [Giscus](https://giscus.app)
* [Vite](https://vitejs.dev)
* [Shields.io](https://shields.io)