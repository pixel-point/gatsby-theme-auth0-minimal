<img src="https://miro.medium.com/max/1003/1*vaizCYVmspYXc7W-Yavprw.png" />
<div align="center">
  <h1>gatsby-theme-auth0-minimal 🔐</h1>
</div>
<p align="center">
  <strong>Just-add-water Auth0 authorization in your GatsbyJS app</strong>
</p>
<div align="center">
<a href="https://github.com/pixel-point/gatsby-theme-auth0-minimal/blob/master/LICENSE" target="_blank">
<img src="https://img.shields.io/github/license/pixel-point/gatsby-theme-auth0-minimal?style=plastic">
</a>
<a href="https://www.npmjs.com/package/gatsby-theme-auth0-minimal" target="_blank">
<img src="https://img.shields.io/npm/v/gatsby-theme-auth0-minimal?style=plastic">
</a>
<a href="#" target="_blank">
<img src="https://img.shields.io/librariesio/github/pixel-point/gatsby-theme-auth0-minimal?style=plastic">
</a>
</div>
<div align="center"> 
<a href="#" target="_blank">
<img src="https://img.shields.io/npm/dy/gatsby-theme-auth0-minimal?style=plastic">
</a>
<a href="https://app.netlify.com/sites/gatsby-theme-auth0-minimal/deploys" target="_blank">
<img src="https://api.netlify.com/api/v1/badges/d2098311-5d8c-4e06-b253-0b639cdc8562/deploy-status">
</a>
</div>
<p align="center">
<a href="https://gatsby-theme-auth0-minimal.netlify.com">Live Example</a>
|
<a href="../example">Source Code</a>
</p>

## What is that?

This is Auth0 authorization plugin built upon such concept as [Gatsby Themes](https://www.gatsbyjs.org/docs/themes/what-are-gatsby-themes/). It will allow you to set up a full-fledged user authorization flow in your Gatsby app in a matter of minutes.

- :black_square_button: Minimal setup without dependencies overhead
- :monorail: Uses modern approach with functional components and hooks
- :gem: No crutches and cumbersome custom functionality, every line of code is easily explainable and written with Gatsby/Auth0 recommendations and best practices in mind
- :ok_hand: [`/auth/callback`](https://github.com/pixel-point/gatsby-theme-auth0-minimal/blob/master/gatsby-theme-auth0-minimal/src/pages/auth/callback.js) page comes out of the box. Easily tweakable via [`callbackPath`](#theme-options)
- :gear: Fully customisable thanks to [Shadowing](#shadowing)

## Installation

```sh
$ npm install --save gatsby-theme-auth0-minimal
```

## Usage

### Setting up environment variables

Before we begin you have to create `.env` file at the root of your project. There are actually a few other [approaches to provide variables into your app](https://www.gatsbyjs.org/docs/environment-variables/), but we will stick with simplest possible.

Here is example of how `.env` should look:

```env
# required
GATSBY_AUTH0_DOMAIN=your-auth-app.auth0.com
GATSBY_AUTH0_CLIENTID=ADG34DG236YQ2DGQXB345
GATSBY_AUTH0_CALLBACK=https://localhost:9000/auth/callback
# optional
GATSBY_AUTH0_AUDIENCE=https://your-auth-app.auth0.com/api/v2/
GATSBY_AUTH0_SCOPE='profile email'
GATSBY_AUTH0_CALLBACK_PATH=/callback
```

The same structure you can spot in our [example](../example/env.example). Feel free to copy that and use in your project.

Here is detailed explanation:

| Key                          | Default                  | Required | Description                    |
| ---------------------------- | ------------------------ | -------- | ------------------------------ |
| `GATSBY_AUTH0_DOMAIN`        |                          | `true`   | Configure Auth0 `Domain`.      |
| `GATSBY_AUTH0_CLIENTID`      |                          | `true`   | Configure Auth0 `Client ID`    |
| `GATSBY_AUTH0_CALLBACK`      |                          | `true`   | Configure Auth0 `Callback URL` |
| `GATSBY_AUTH0_AUDIENCE`      | false                    | `false`  | Configure Auth0 `Audience`     |
| `GATSBY_AUTH0_SCOPE`         | `"openid email profile"` | `false`  | Configure Auth0 `Scope`        |
| `GATSBY_AUTH0_CALLBACK_PATH` | `"/auth/callback"`       | `false`  | Change callback URL path       |

> Note :warning:
> Originally Auth0 [also allows to set up](https://auth0.com/docs/protocols/oauth2#how-response-type-works) the `responseType` field with exact three options in our [case of Implicit Flow](https://auth0.com/docs/flows/concepts/implicit) , those are `token`, `id_token` and `token id_token`. To offer you maximum flexibility and prevent potential bugs we removed ability to tweak this parameter and set it to `token id_token` by default.

### Wrapping root component

This theme uses [React Context](https://reactjs.org/docs/context.html) mechanism as the single source of truth in terms of auth state for the whole app, so the first step would be wrapping our root component with our [`AuthProvider`](/gatsby-theme-auth0-minimal/src/components/hoc/auth-provider.js).

This is our custom wrapper:

```jsx
// with-auth-provider.js
import React from 'react';
import { AuthProvider } from 'gatsby-theme-auth0-minimal';

export default ({ element }) => {
  return <AuthProvider>{element}</AuthProvider>;
};
```

[Here is it's example source code](../example/src/components/hoc/with-auth-provider.js)

Next step we are filling our `gatsby-browser.js` and `gatsby-ssr.js` as described in [Gatsby's doc](https://www.gatsbyjs.org/docs/browser-apis/#wrapRootElement):

```js
// gatsby-ssr.js
import withAuthProvider from './path/to/with-auth-provider';
export const wrapRootElement = withAuthProvider;
```

[gatsby-ssr.js example source code](../example/gatsby-ssr.js)

```js
// gatsby-browser.js
import withAuthProvider from './path/to/with-auth-provider';
export const wrapRootElement = withAuthProvider;
```

[gatsby-browser.js example source code](../example/gatsby-browser.js)

And yes, this duplication is intentional.

### Using Auth Hook

The last part, we are getting access to `authState` via exposed `useAuth` hook:

```jsx
import React from 'react';
import { useAuth } from 'gatsby-theme-auth0-minimal';

export default () => {
  const {
    isAuthenticated,
    login,
    logout,
    checkSession,
    authState: {
      // handful
      token, // access token for API requests
      user, // auth0 user data
      // just in case
      idToken, // contains user payload
      expiresAt, // how long token are going to live
      unschedule, // auxillary field to manually unschedule token renewing
    },
    handleAuthentication, // would be useful implementing you own callback component
  } = useAuth();
  // set this up at highest level of your protected client routes
  // to automatically handle the authentication (this is called silent auth)
  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      checkSession();
    }
  }, []);
  return (
    <div>
      {user && <p>Hello {user.name}</p>}
      {isAuthenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </div>
  );
};
```

[Source code for this piece](../example/src/pages/account.js)

### Check out full example

- Live at [gatsby-theme-auth0-minimal.netlify.com](https://gatsby-theme-auth0-minimal.netlify.com)
- Code at [this repo](../example)

## Important concepts in use

### Shadowing

Gatsby Themes has a concept called [Shadowing](https://www.gatsbyjs.org/blog/2019-04-29-component-shadowing/), which allows users to override a file in a gatsby theme. This allows the theme to be fully customizable.

To start shadowing, create a folder with the theme name `gatsby-theme-auth0` in your project's `src` directory.

Now you're able to override any file in the theme. For example, if you want to override the `callback` component, create a file:

```sh
src/gatsby-theme-auth0-minimal/components/common/callback.js
```

### Auth0 Implicit Flow

#### How everything works under the hood in 1 minute

There is [a number of authentication flow exist](https://auth0.com/docs/api-auth/which-oauth-flow-to-use), but for Gatsby its the [Implicit Flow](https://auth0.com/docs/api-auth/tutorials/implicit-grant) since its basically SPA when it comes to authorization business. Keep in mind that tokens are short-lived and refresh tokens are not available in this flow.

![Implicit Flow Authentication Sequence](https://cdn2.auth0.com/docs/media/articles/flows/concepts/auth-sequence-implicit.png)

1.  The user clicks **Login** within the SPA.
2.  Auth0's SDK redirects the user to the Auth0 Authorization Server (**/authorize** endpoint) passing along a `response_type` parameter that indicates the type of requested credential.
3.  Your Auth0 Authorization Server redirects the user to the login and authorization prompt.
4.  The user authenticates using one of the configured login options and may see a consent page listing the permissions Auth0 will give to the SPA.
5.  Your Auth0 Authorization Server redirects the user back to the SPA with an ID token and an Access Token.
6.  Your SPA can use the Access Token to call an API.
7.  The API responds with requested data.

## Contribution

Contributions of any kind are welcome! If you know, how to make it better, add a new exciting functionality or simply fix a typ0 in this README file - go for it! Your previous coding experience doesn't matter as long as you understand what are you trying to do :smile:

In order to start contributing, run

```sh
git clone git@github.com:pixel-point/gatsby-theme-auth0-minimal.git && yarn install
```

that will get you a local copy of the project with all deps installed, but make sure you read next chapters before you put your hands on the code.

### Understanding Yarn workspaces

This project is using [Yarn's workspaces concept](https://classic.yarnpkg.com/en/docs/workspaces/), which allows to skip the mess with `npm link` , mantain both example and actual theme's code in the same repo and painless development. More info on that you can find in [this awesome post](https://www.gatsbyjs.org/blog/2019-05-22-setting-up-yarn-workspaces-for-theme-development/) by Brent Jackson.

### Auth0 Application Settings

To use this example, certain application settings must be set correctly, otherwise unexpected behavior will occur.

Set the following fields to the values shown below, where {portNumber} is whatever port number you are using (e.g., port 8000 in development mode):

- **Allowed Callback URLs** `http://localhost:{portNumber}/auth/callback`

- **Allowed Web Origins** `http://localhost:{portNumber}`

- **Allowed Logout URLs** `http://localhost:{portNumber}`

Make sure that there is no trailing '/' after the port number in the **Allowed Web Origins** and **Allowed Logout URLs** fields.

### Set up env variables

To be able to work on that locally you should get an acc on [Auth0](https://auth0.com/) (its' free), follow their initiation procedure and grab values from your dashboard.

Go to [example directory](../example), copy the `env.example` -> `.env.development`. Fill in the required environment variables before starting up the client dev server.

### Available Scripts

#### `$ yarn dev`

This will run the demo app in development mode using `.env.development`.

Navigate to [http://localhost:8000](http://localhost:8000) to view it in the browser.

#### `$ yarn build`

This will build the demo app for production using `.env.production`.

Outputs to the `example/public` folder.

#### `$ yarn serve`

This will serve previously built demo app for production using `.env.production`.

Outputs to the `example/public` folder.

#### `$ yarn clean`

This will remove contents of `example/public` and its cache by running `gatsby clean` in `example` dir

#### `$ yarn format`

This will format all files with `js`, `js`, `json` or `md` extensions in the repo, excluding those in `.prettierignore`

#### `$ yarn lint`

Same as above, but with linting.

## Issues

If you experiencing any issue or believe there is a bug, feel free leave an [issue](https://github.com/pixel-point/gatsby-theme-auth0-minimal/issues) with thorough description and how to reproduce step-by-step instruction. However, don't hesitate to make a PR, as was previously mentioned, contributions of any kind are welcome.

## Credits

- [gatsby-theme-auth0](https://github.com/epilande/gatsby-theme-auth0)
- [gatsby-auth0](https://github.com/auth0-blog/gatsby-auth0)
- [gatsby-auth0-app](https://github.com/jlengstorf/gatsby-auth0-app)
- Heavily undervalued [Rewrite Auth0 Example with React Hooks](https://dev.to/terrierscript/example-for-auth0-and-react-hooks-41e4) by terrierscript
- [Gatsby docs](https://www.gatsbyjs.org/docs/building-a-site-with-authentication/)
- [Auth0 docs](https://auth0.com/docs/quickstart/spa/react)

## Licence

MIT (C) 2020
