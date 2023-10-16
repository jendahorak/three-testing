# vite-three-boilerplate

Boilerplate code for aframe library with Vite as a dev server and build tool.

First of all **fork this repo**, or create your repo from **template**

Your website:

Install:

```shell
npm install
```

Run dev server:

```shell
npm run dev
```

Deploy to gh-pages

```shell
npm run deploy
```

npm run deploy is shorthand for:

```shell
npm run build && git add . && git add dist -f && git commit -m 'deployed-from-script' && git subtree push --prefix dist origin gh-pages && git push origin main
```

Project is setup in such a way, that it will serve static assets specified in the public folder. Name of the repo is taken from folder name so be sure that name of your local repo is the same as the remote one.
