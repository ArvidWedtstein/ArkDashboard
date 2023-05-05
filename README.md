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
        <li><a href="#database">Prisma & Database</a></li>
        <li><a href="#sdl">SDL</a></li>
        <li><a href="#cells">Cells</a></li>
        <li><a href="#storybook">Storybook</a></li>
        <li><a href="#testing">Testing</a></li>
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

[![Redwood][redwood.js]][redwood-url]

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

To run this project you'll need to have nodejs installed on your computer. You can download it [here](https://nodejs.org/en/download/)

> - Redwood requires [Node.js](https://nodejs.org/en/) (>=14.19.x <=16.x) and [Yarn](https://yarnpkg.com/) (>=1.15)
> - Are you on Windows? For best results, follow redwood's [Windows development setup](https://redwoodjs.com/docs/how-to/windows-development-setup) guide

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

To generate types:

```sh
yarn rw g types
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

Seed the database with

```sh
yarn rw prisma db seed
```

Sometimes typescript doesn't detect all changes so you'll have to restart the server by pressing Ctrl + Shift + P and then typing "Restart TS Server"

Check for stuff:

```sh
yarn redwood check
```

### Pages

Pages can be generated with the `yarn rw g page` command. For example, to generate a page named `About`:

```sh
yarn rw g page About
```

> `g` is short for `generate`

### Database

Redwood wouldn't be a full-stack framework without a database. It all starts with the schema. The [`schema.prisma`](api/db/schema.prisma) file is located in `api/db`

Local supabase postgresql setup:

`supabase login`

`supabase init`

`supabase start`

To view SQLite data in a GUI:

```sh
yarn rw prisma studio
```

Redwood uses [Prisma](https://www.prisma.io/), a next-gen Node.js and TypeScript <abbr title="Object Relational Mapping">ORM</abbr>, to talk to the database. Prisma's schema offers a declarative way of defining your app's data models. And Prisma [Migrate](https://www.prisma.io/migrate) uses that schema to make database migrations hassle-free:

```
yarn rw prisma migrate dev (yarn rw prisma db push for mongodb)

# ...

? Enter a name for the new migration: › create <model>
```

> `rw` is short for `redwood`

You'll be prompted for the name of your migration. `create <model>`

With `yarn rw g scaffold <model>`, Redwood created all the pages, components, and services necessary to perform all <abbr title="Create, Retrieve, Update, Delete">CRUD</abbr> actions on our table.

Fucked up the database once again? Start all over again with:
`yarn rw prisma migrate reset`

### SDL

If you only want to generate services for your table, you can use:
`yarn rw g sdl <model>`

### Cells

Cells are a declarative approach to data fetching and one of Redwood's signature modes of abstraction. By providing conventions around data fetching, Redwood can get in between the request and the response to do things like query optimization and more, all without you ever having to change your code.

A Cell can be generated with `yarn rw generate cell <name>`

<b>Single Item Cell vs List Cell</b>

Sometimes you want a Cell that renders a single item, like the example above, and other times you want a Cell that renders a list. Redwood's Cell generator can do both.
Just specify the `--list` flag and you'll get a list cell
`yarn rw generate cell equipment --list`

Cells has up to seven exports to work with, only 2 are required though (success and QUERY).

| Name          | Type               | Description                                                  |
| :------------ | :----------------- | :----------------------------------------------------------- |
| `QUERY`       | `string\|function` | The query to execute                                         |
| `beforeQuery` | `function`         | Lifecycle hook; prepares variables and options for the query |
| `isEmpty`     | `function`         | Lifecycle hook; decides if Cell should render Empty          |
| `afterQuery`  | `function`         | Lifecycle hook; sanitizes data returned from the query       |
| `Loading`     | `component`        | If the request is in flight, render this component           |
| `Empty`       | `component`        | If there's no data (`null` or `[]`), render this component   |
| `Failure`     | `component`        | If something went wrong, render this component               |
| `Success`     | `component`        | If the data has loaded, render this component                |

### Storybook

I personally don't make use of storybook in this project, but it's a great tool to use when you're working on a design system.

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

### Testing

It'd be hard to scale from side project to startup without a few tests.
Redwood fully integrates Jest with the front and the backends and makes it easy to keep your whole app covered by generating test files with all your components and services:

```
yarn rw test
```

To make the integration even more seamless, Redwood augments Jest with database [scenarios](https://redwoodjs.com/docs/testing.md#scenarios) and [GraphQL mocking](https://redwoodjs.com/docs/testing.md#mocking-graphql-calls).

<!-- ROADMAP -->

## Roadmap

- [x] Get to know Redwood and React
- [x] Add a base spot system
- [x] Add a map system
- [ ] Testing
- [ ] Github CI Testing
- [x] Fix readme

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
[redwood.js]: https://img.shields.io/badge/Redwood-454545?style=for-the-badge&logo=redwoodjs&logoColor=BF4722
[redwood-url]: https://redwoodjs.com/
