# windmill-react-template

For development, at least set a valid user token in .env.development or in
.env.development.local

```
VITE_TOKEN=your_token
```

Once deployed on windmill, the token will be set automatically.

Similar for the user and email, they will be passed in the global context.

# Note

Do not change tailwind.css, it is the exact same than windmill and allow you to
have the same look and feel in development and once deployed as an app on
windmill.
