---
title: 'Hosting a NextJS blog on Github Pages'
excerpt: "Create a statically generated blog with NextJS, Github Actions and Github Pages. Did I mention it'll be 100% free? 😏"
coverImage: '/assets/blog/hosting-a-nextjs-blog-on-github-pages/cover.png'
darkCoverImage: '/assets/blog/hosting-a-nextjs-blog-on-github-pages/cover-dark.png'
tags: 'meta'
date: '2021-05-06T19:51:00.322Z'
author:
  name: Jille van der Weerd
  picture: '/assets/blog/authors/jj.jpeg'
ogImage:
  url: '/assets/blog/hosting-a-nextjs-blog-on-github-pages/cover.png'
---

It was a task I'd been putting off for years: Getting my own blog up and running. I had been blogging on Medium, but I wanted more control. I decided to kill two (or actually, three?) birds with one stone: host my own blog, learn the basics of React, and see what NextJS is all about. If you're reading this, it means all three of those worked out 😉 But that doesn't mean it was without hurdles.

In this article I'll describe steps you can follow if you want to host a statically generated blog on Github Pages. A nice little bonus: this will be **100% free**. We'll go over the following:

- Checking out a Markdown powered NextJS blog template
- Export static HTML with NextJS and Github Actions
- Setting up Github Pages correctly
- How to resolve any issues that come up

### Getting started

Let's start with checking out the blog template and finding our way around it. For this tutorial we'll use the `blog-starter-typescript` template from the official NextJS repository. You can read more about it [here](https://github.com/vercel/next.js/tree/canary/examples/blog-starter-typescript). To use that as a template, run the following command in your terminal:

```
npx create-next-app --example blog-starter-typescript <app name here>
```

After that has finished running, open the newly created directory in your code editor of choice. This is a completely functional NextJS application, but for this tutorial we'll only concern ourselves with the following directories:

- `_posts`: This is where you'll find the posts that are shown on the blog.
- `public/assets`: This is where you add images that can be used on your blog.

> Note: you'll see there is currently a convention to create new folders in `public/assets/blog/` for each article you create, but you're free to do whatever you like. Anything in the `public` folder will be accessible by their path, relative to the `public` folder, e.g. `assets/blog/preview/cover.jpg`.

Run a quick `npm run dev` in the terminal, go to http://localhost:3000/ and tada 🎉 There's your blog! Though I'll admit, it looks eerily similar to this one... You might want to change the styling a bit 😬

Currently you're serving this blog through a webserver that is run locally on your device. While this opens up a lot of possibilities (dynamic content, server-side rendering), this is not what we need! To serve our blog on Github Pages we need a _statically generated_ website. Good thing there's this thing called

### Static HTML export

This is a way to export our project to static HTML (😝), which can be run without a Node.js server. That's exactly what we need! Open the `package.json` file in your blog project, and add the following entry to the `"scripts"` object:

```json
"static-export": "next build && next export"
```

Now you can run `npm run static-export` to create a static export of your blog!

> Note: If you run into an issue stating `Could not find a declaration file for module 'classnames'.`, create a file called `classnames.d.ts` in the `@types` directory. All you need to add to the file is `declare module 'classnames'`, and that should get the project to build.

Succesfully running the script we just created will result in an `out` directory containing the static export of your blog being created. While that's great, our aim is a bit further than just a folder on our computer. Also, if you take a quick look at your `.gitignore` file, you'll see that the `out` directory is explicitly ignored. This is simply because it's customary to not check build artifacts into source control. But we don't need that! 

### Publish your blog with Github Actions and Github Pages

Github has this really cool feature called [Github Actions](https://github.com/features/actions). This can help us automate the static code generation whenever we push code to our repository. First, create a new folder in your project called `.github`. Inside, create a second folder called `workflows`. Inside the `workflows` folder, create a file called `build-and-deploy.yml` with the following contents:

```yaml
name: Build and Deploy
on: 
  push:
    branches:
      - main
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout 🛎️
        uses: actions/checkout@v2.3.1

      - name: Install and Build 🔧
        run: |
          npm ci
          npm run static-export

      - name: Deploy 🚀
        uses: JamesIves/github-pages-deploy-action@4.1.1
        with:
          branch: gh-pages
          folder: out
```

We're using the [Github Pages Deploy Action](https://github.com/JamesIves/github-pages-deploy-action) written by [James Ives](https://jamesiv.es/) to upload the build output (can you spot the mention to the `out` folder in this snippet?) to a separate branch, which we will use to serve our Github Pages site.

Now we need to do a few things:

- Set up a Github repository
- Push your code to the repository (make sure to include the `package-lock.json` file)
- Open https://github.com/github-name/repository-name/actions and you should see that it's running the action we just created! Neat! Wait for it to complete.

Once the Action has completed, you should see a new branch in your repository called `gh-pages`. We will use this branch for our site:

- Go to https://github.com/github-name/repository-name/settings/pages
- Select the `gh-pages` branch as the source and press "Save"
- If you want to use a custom domain, follow the steps outlined [here](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

If you did not use a custom domain, your site should soon be live on https://github-name.github.io. If you already have other Github Pages you can find it at https://github-name.github.io/repository-name.

If you visit your site you'll see there are some issues with the styling... Let's deliver on the final part of the promise and

### Fix all issues that come up

This first issue is pretty simple to fix, but let's take a step back to look at what causes this weird absence of styling. If you use "Inspect Element" on your website, and select the *Console* tab, you'll be greeted with a bunch of error messages and warnings, including `Loading failed for the <script> with source <your domain>/_next/static/chunks/commons-5bbe2ea0fe711055318e.js`. This is caused by a feature of [Jekyll](https://jekyllrb.com/) (another tool to create static blogs which is supported out of the box by Github Pages). Directories that start with an underscore are treated differently from other directories, and that is exactly what's happening with the `_next` directory you see in the path in the error message. Luckily there is a way to disable this behavior. Open the `build-and-deploy.yml` file we created earlier, and modify the step called `Install and Build 🔧` to look like this:

```yaml
- name: Install and Build 🔧
  run: |
    npm ci
    npm run static-export
    cd out && touch .nojekyll
```

Once you commit that and wait for the Github Action to complete, your blog should look a lot better!

> Note: If you already have a different github pages site, you need to make sure the styles and scripts are served with a base path. You can read more about doing so [here](https://nextjs.org/docs/api-reference/next.config.js/basepath). The base path you need to set is the same as your repository name. That page also mentions what you need to do to get images to work.

### Afterword

And that's it! Your blog is now live, for the world to see. Completely driven by your Git repository and some Github Action magic ✨

There are a few other things I ran into while building this blog, like adding tags to articles and [making sure dynamically applied TailwindCSS classes do not get stripped out by PurgeCSS](https://tailwindcss.com/docs/optimizing-for-production#writing-purgeable-html), but I won't dive into that now. If you do run into issues, please reach out!