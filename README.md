# About

This app is a Voltmeter web component made with LitElement. It uses the ws Websocket library and is styled with Tailwindcss
   
![image.png](lit_voltmeter.png)
   

It is using the LitElement TypeScript starter template from the `lit-starter-ts` package in [the main Lit
repo](https://github.com/lit/lit).

## Setup

Install dependencies:

```bash
npm i
```

## Build

This sample uses the TypeScript compiler to produce JavaScript that runs in modern browsers.

To build the JavaScript version of your component and watch files and rebuild when the files are modified, run the following command:

```bash
npm run build:watch
```

## Node Websocket Server

To run the node server that send websocket messages to the voltmeter and gets changes from the dropdown menu:

```bash
node server.js
```

## Dev Server

To run the dev server and open the project in a new browser tab:

```bash
npm run serve
```

There is a development HTML file located at `/dev/index.html` that you can view at http://localhost:8000/dev/index.html. Note that this command will serve your code using Lit's development mode (with more verbose errors). To serve your code against Lit's production mode, use `npm run serve:prod`.

The project uses modern-web.dev's [@web/dev-server](https://www.npmjs.com/package/@web/dev-server) for previewing the project without additional build steps. See [modern-web.dev's Web Dev Server documentation](https://modern-web.dev/docs/dev-server/overview/) for more information.


## More information about litElement by Google

See [Get started](https://lit.dev/docs/getting-started/) on the Lit site for more information.
