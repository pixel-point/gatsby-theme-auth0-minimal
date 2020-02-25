<div align="center">
  <h1>gatsby-theme-auth0 🔐</h1>
</div>

<p align="center">
  <strong>A Gatsby theme for painless adding Auth0 to your application.</strong>
</p>

[![GitHub](https://img.shields.io/github/license/pixel-point/gatsby-theme-auth0-minimal?style=flat-square)](https://github.com/pixel-point/gatsby-theme-auth0-minimal/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/v/gatsby-theme-auth0-minimal?style=flat-square)](https://www.npmjs.com/package/gatsby-theme-auth0-minimal)
[![Netlify Status](https://api.netlify.com/api/v1/badges/d2098311-5d8c-4e06-b253-0b639cdc8562/deploy-status)](https://app.netlify.com/sites/gatsby-theme-auth0-minimal/deploys)

## What's in the box?

- 💯 Easy to set up authentication.
- 🤙 [`/auth/callback`](https://github.com/pixel-point/gatsby-theme-auth0-minimal/blob/master/gatsby-theme-auth0-minimal/src/pages/auth/callback.js) page automatically set up. Configurable via [`callbackPath`](#theme-options)
- 🎨 Fully customizable & extendable.

## Installation

```sh
$ npm install --save gatsby-theme-auth0-minimal
```

## Usage

Set up your login/logout buttons and you're good to go!

```jsx
import React from 'react';
import { AuthService, useAuth } from 'gatsby-theme-auth0';

export default () => {
  // order does matter
  const [isLoading, isLoggedIn, profile] = useAuth();
  return (
    <div>
      {profile && <p>Hello {profile.name}</p>}
      {isLoggedIn ? (
        <button onClick={AuthService.logout}>Logout</button>
      ) : (
        <button onClick={AuthService.login}>Login</button>
      )}
    </div>
  );
};
```

### Theme options

| Key            | Default                  | Required | Description                     |
| -------------- | ------------------------ | -------- | ------------------------------- |
| `domain`       |                          | `true`   | Configure Auth0 `Domain`        |
| `clientID`     |                          | `true`   | Configure Auth0 `Client ID`     |
| `redirectUri`  |                          | `true`   | Configure Auth0 `Callback URL`  |
| `audience`     |                          | `false`  | Configure Auth0 `Audience`      |
| `responseType` | `"token id_token"`       | `false`  | Configure Auth0 `Response Type` |
| `scope`        | `"openid email profile"` | `false`  | Configure Auth0 `Scope`         |
| `callbackPath` | `"/auth/callback"`       | `false`  | Change callback URL path        |

## Shadowing

Gatsby Themes has a concept called [**Shadowing**](https://www.gatsbyjs.org/blog/2019-04-29-component-shadowing/), which allows users to override a file in a gatsby theme. This allows the theme to be fully customizable.

To start shadowing, create a folder with the theme name `gatsby-theme-auth0` in your project's `src` directory.

Now you're able to override any file in the theme. For example, if you want to override the `callback` component, create a file:

```sh
src/gatsby-theme-auth0-minimal/components/callback.js
```

## Demos

- **Example:** [Demo](https://gatsby-theme-auth0-minimal.netlify.com/) | [Code](https://github.com/pixel-point/gatsby-theme-auth0-minimal/tree/master/example)

## Dev

### Set up env variables

Go to demo application directory, copy the `/example/.env.example` -> `.env.development`. Fill in the required environment variables before starting up the client dev server.

### Available Scripts

#### `$ yarn dev`

This will run the demo app in development mode using `.env.development`.

Navigate to [http://localhost:8000](http://localhost:8000) to view it in the browser.

#### `$ yarn build`

This will build the demo app for production using `.env.production`.

Outputs to the `demo/public` folder.

#### `$ yarn serve`

This will serve previously built demo app for production using `.env.production`.

Outputs to the `example/public` folder.

## Credits

- [gatsby-theme-auth0](https://github.com/epilande/gatsby-theme-auth0) for overall structure
- [gatsby-auth0](https://github.com/auth0-blog/gatsby-auth0) for some nice ideas
- [gatsby-auth0-app](https://github.com/jlengstorf/gatsby-auth0-app) nice illustration how to do all that stuff with React hooks
