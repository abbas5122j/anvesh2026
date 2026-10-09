# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

## Groq API configuration

The Python client reads `GROQ_API_KEY` from the process environment. The Vite frontend reads `VITE_GROQ_API_KEY` from a local `.env.local` file:

```env
VITE_GROQ_API_KEY=your-groq-api-key
```

Vite embeds `VITE_` variables in browser code, so this key is visible to users. Use this only for local development with a disposable key; production deployments should make Groq requests through a server-side endpoint instead. Local `.env` files and Python bytecode are ignored by Git.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
