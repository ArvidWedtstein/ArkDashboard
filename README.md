<a name="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![Version][version-shield]][version-url]
[![Netlify Status](https://api.netlify.com/api/v1/badges/6eca3877-cf13-47fa-9f48-2f722ba00ea4/deploy-status)](https://app.netlify.com/sites/arkdashboard/deploys)

<br />
<div align="center">
  <a href="https://github.com/ArvidWedtstein/ArkDashboard">
    <img src="web/public/favicon.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">ArkDashboard</h3>

  <p align="center">
    Website for ARK: Survival Evolved Basespots and more
    <br />
    <a href="https://github.com/ArvidWedtstein/ArkDashboard"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/ArvidWedtstein/ArkDashboard/issues">Report Bug</a>
    ·
    <a href="https://github.com/ArvidWedtstein/ArkDashboard/issues">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li>
      <a href="#usage">Usage</a>
      <ul>
        <li><a href="#pages">Pages</a></li>
        <li><a href="#sdl">SDL</a></li>
        <li><a href="#cell">Cell</a></li>
        <li><a href="#database">Database</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

Description in progress

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

This project is mainly written in React, together with these frameworks and libraries:

<div align="left">

![Stuff used in this project](https://arvidgithubembed.herokuapp.com/skills?languages=typescript,redwood,prisma,sql,react&backgroundcolor=0D1117&title=-&titlecolor=ffffff&textcolor=ffffff&boxcolor=CFCDFF&bordercolor=0D1117)

</div>
<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

To run this project you'll need to have nodejs installed on your computer. You can download it [here](https://nodejs.org/en/download/)

Get latest npm version

- npm

  ```sh
  npm install npm@latest -g
  ```

- yarn
  ```sh
  npm install -g yarn
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/ArvidWedtstein/ArkDashboard.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create a .env file in the root directory and add your environment variables. I used supabase postgres for this project, so you'll need to create a supabase account and add the url and key to your .env file. You can also use a different database, but you'll need to change the database url in the api/prisma/schema.prisma file.
   ```sh
    DATABASE_URL=postgresql://<user>:<pass>@db.<project>.supabase.co:<port>/postgres
   ```
4. Check if everything is fine.
   ```sh
   yarn redwood check
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Deploying

Deploying image to scaleway:

1. build the docker image
   ```sh
   docker build -t ArkDashboard .
   ```
2. pull docker image
   ```sh
   docker pull ubuntu:latest
   ```
3. tag the image
   ```sh
   docker tag ArkDashboard arvidwedtstein/ArkDashboard:latest
   ```
4. push the image to docker hub
   ```sh
   docker push arvidwedtstein/ArkDashboard:latest
   ```

<!-- USAGE EXAMPLES -->

## Usage

Project can be used to browse through some of the best Ark: Survival Evolved spots out there, and much more.

Apply changes to database:

```sh
yarn rw prisma migrate dev (yarn rw db push for mongodb)
```

```sh
prisma migrate dev --name added_job_title
```

To view SQLite data in a GUI:

```sh
yarn rw prisma studio
```

To generate types:

```sh
yarn rw g types
```

Generate schema:

```sh
yarn rw g sdl basespot
```

Generate Secret:

```sh
yarn rw g secret
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

To deploy:

```sh
yarn rw prisma migrate deploy
```

To open redwood console:

```sh
yarn rw c
```

Fucked up the database? Start all over again with

```sh
yarn rw prisma migrate reset
```

Seed the database with

```sh
yarn rw prisma db seed
```

Sometimes typescript doesn't detect all changes so you'll have to restart the server by pressing Ctrl + Shift + P and then typing "Restart TS Server"

Check for stuff:

```sh
yarn redwood check
```

Local supabase postgresql setup:

```sh
supabase login
```

```sh
supabase init
```

```sh
supabase start
```

<!-- ROADMAP -->

## Roadmap

- [ ] Get to know Redwood and React
- [x] Add a base spot system
- [x] Add a map system
- [ ] Testing
- [ ] Github CI Testing
- [ ] Fix readme

<!--https://redwoodjs.com/docs/how-to/test-in-github-actions-->

See the [open issues](https://github.com/ArvidWedtstein/ArkDashboard/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this project better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! <3

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

No contact :)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->

[contributors-shield]: https://img.shields.io/github/contributors/ArvidWedtstein/ArkDashboard.svg?style=for-the-badge
[contributors-url]: https://github.com/ArvidWedtstein/ArkDashboard/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/ArvidWedtstein/ArkDashboard.svg?style=for-the-badge
[forks-url]: https://github.com/ArvidWedtstein/ArkDashboard/network/members
[stars-shield]: https://img.shields.io/github/stars/ArvidWedtstein/ArkDashboard.svg?style=for-the-badge
[stars-url]: https://github.com/ArvidWedtstein/ArkDashboard/stargazers
[issues-shield]: https://img.shields.io/github/issues/ArvidWedtstein/ArkDashboard.svg?style=for-the-badge
[issues-url]: https://github.com/ArvidWedtstein/ArkDashboard/issues
[license-shield]: https://img.shields.io/github/license/ArvidWedtstein/ArkDashboard.svg?style=for-the-badge
[license-url]: https://github.com/ArvidWedtstein/ArkDashboard/blob/prod/LICENSE.txt
[version-shield]: https://img.shields.io/github/package-json/v/ArvidWedtstein/ArkDashboard/dev?style=for-the-badge
[version-url]: https://github.com/ArvidWedtstein/ArkDashboard

<!-- https://supabase.com/docs/guides/auth/auth-discord -->
<!--https://api.kanye.rest-->

# README

Welcome to [RedwoodJS](https://redwoodjs.com)!

> **Prerequisites**
>
> - Redwood requires [Node.js](https://nodejs.org/en/) (>=14.19.x <=16.x) and [Yarn](https://yarnpkg.com/) (>=1.15)
> - Are you on Windows? For best results, follow our [Windows development setup](https://redwoodjs.com/docs/how-to/windows-development-setup) guide

Start by installing dependencies:

```
yarn install
```

Then change into that directory and start the development server:

```
cd my-redwood-project
yarn redwood dev
```

Your browser should automatically open to http://localhost:8910 where you'll see the Welcome Page, which links out to a ton of great resources.

> **The Redwood CLI**
>
> Congratulations on running your first Redwood CLI command!
> From dev to deploy, the CLI is with you the whole way.
> And there's quite a few commands at your disposal:
>
> ```
> yarn redwood --help
> ```
>
> For all the details, see the [CLI reference](https://redwoodjs.com/docs/cli-commands).

## Prisma and the database

Redwood wouldn't be a full-stack framework without a database. It all starts with the schema. Open the [`schema.prisma`](api/db/schema.prisma) file in `api/db` and replace the `UserExample` model with the following `Post` model:

```
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  body      String
  createdAt DateTime @default(now())
}
```

Redwood uses [Prisma](https://www.prisma.io/), a next-gen Node.js and TypeScript ORM, to talk to the database. Prisma's schema offers a declarative way of defining your app's data models. And Prisma [Migrate](https://www.prisma.io/migrate) uses that schema to make database migrations hassle-free:

```
yarn rw prisma migrate dev

# ...

? Enter a name for the new migration: › create posts
```

> `rw` is short for `redwood`

You'll be prompted for the name of your migration. `create posts` will do.

Now let's generate everything we need to perform all the CRUD (Create, Retrieve, Update, Delete) actions on our `Post` model:

```
yarn redwood g scaffold post
```

Navigate to http://localhost:8910/posts/new, fill in the title and body, and click "Save":

Did we just create a post in the database? Yup! With `yarn rw g scaffold <model>`, Redwood created all the pages, components, and services necessary to perform all CRUD actions on our posts table.

## Frontend first with Storybook

Don't know what your data models look like?
That's more than ok—Redwood integrates Storybook so that you can work on design without worrying about data.
Mockup, build, and verify your React components, even in complete isolation from the backend:

```
yarn rw storybook
```

Before you start, see if the CLI's `setup ui` command has your favorite styling library:

```
yarn rw setup ui --help
```

## Testing with Jest

It'd be hard to scale from side project to startup without a few tests.
Redwood fully integrates Jest with the front and the backends and makes it easy to keep your whole app covered by generating test files with all your components and services:

```
yarn rw test
```

To make the integration even more seamless, Redwood augments Jest with database [scenarios](https://redwoodjs.com/docs/testing.md#scenarios) and [GraphQL mocking](https://redwoodjs.com/docs/testing.md#mocking-graphql-calls).

## Ship it

Redwood is designed for both serverless deploy targets like Netlify and Vercel and serverful deploy targets like Render and AWS:

```
yarn rw setup deploy --help
```

Don't go live without auth!
Lock down your front and backends with Redwood's built-in, database-backed authentication system ([dbAuth](https://redwoodjs.com/docs/authentication#self-hosted-auth-installation-and-setup)), or integrate with nearly a dozen third party auth providers:

```
yarn rw setup auth --help
```

## Next Steps

The best way to learn Redwood is by going through the comprehensive [tutorial](https://redwoodjs.com/docs/tutorial/foreword) and joining the community (via the [Discourse forum](https://community.redwoodjs.com) or the [Discord server](https://discord.gg/redwoodjs)).

## Quick Links

- Stay updated: read [Forum announcements](https://community.redwoodjs.com/c/announcements/5), follow us on [Twitter](https://twitter.com/redwoodjs), and subscribe to the [newsletter](https://redwoodjs.com/newsletter)
- [Learn how to contribute](https://redwoodjs.com/docs/contributing)
