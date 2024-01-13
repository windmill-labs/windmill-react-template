# windmill-react-template

This repository contains a starter template for [custom react applications as windmill
apps](https://www.windmill.dev/docs/react_vue_svelte_apps/react).

## Development

```bash
npm i # or `yarn`
# development hot-reload mode
npm run dev # or `yarn dev`
# create a bundle to drag and drop into windmill
npm run build # or `yarn build`
```

## Configuration

For development, set a valid user token in `.env.development` or `.env.development.local`.

Once deployed on windmill, the token will be set automatically.

```ini
VITE_TOKEN=your_token
```

You can additionally set a workspace if in this file. It defaults to `demo` otherwise:

```ini
VITE_WORKSPACE=demo
```

Similar for the user and email, they will be passed in the global context.

To use a self-hosted windmill instance in development, set the `REMOTE` environment variable:

```bash
REMOTE="https://your-instance.com/" npm run dev
# or
export REMOTE="https://your-instance.com/"; npm run dev
```

# Note

Do not change tailwind.css, it is the exact same than windmill and allow you to
have the same look and feel in development and once deployed as an app on
windmill.
