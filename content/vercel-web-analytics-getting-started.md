---
title: "Getting Started with Vercel Web Analytics: Complete Guide"
description: "Learn how to enable Vercel Web Analytics, integrate it into your project, deploy to Vercel, and view your data in the dashboard."
excerpt: "This guide will help you get started with using Vercel Web Analytics on your project, showing you how to enable it, add the package to your project, deploy your app to Vercel, and view your data in the dashboard."
date: "2025-01-15"
author: "Teddy Automations"
category: "Analytics"
tags: ["vercel", "analytics", "web-analytics", "monitoring", "deployment"]
image: "/og-image.jpg"
featured: false
---

# Getting Started with Vercel Web Analytics: Complete Guide

This guide will help you get started with using Vercel Web Analytics on your project, showing you how to enable it, add the package to your project, deploy your app to Vercel, and view your data in the dashboard.

## Prerequisites

Before you begin, make sure you have the following:

- **A Vercel account** - If you don't have one, you can [sign up for free](https://vercel.com/signup).
- **A Vercel project** - If you don't have one, you can [create a new project](https://vercel.com/new).
- **The Vercel CLI installed** - If you don't have it, you can install it using one of the following commands:

### Install Vercel CLI

Choose your package manager:

**Using pnpm:**
```bash
pnpm i vercel
```

**Using yarn:**
```bash
yarn i vercel
```

**Using npm:**
```bash
npm i vercel
```

**Using bun:**
```bash
bun i vercel
```

## Step 1: Enable Web Analytics in Vercel

On the [Vercel dashboard](/dashboard), follow these steps:

1. Select your Project
2. Click the **Analytics** tab
3. Click **Enable** from the dialog

> **💡 Note:** Enabling Web Analytics will add new routes (scoped at `/_vercel/insights/*`) after your next deployment.

## Step 2: Add `@vercel/analytics` to Your Project

Using the package manager of your choice, add the `@vercel/analytics` package to your project:

### Using pnpm:
```bash
pnpm i @vercel/analytics
```

### Using yarn:
```bash
yarn i @vercel/analytics
```

### Using npm:
```bash
npm i @vercel/analytics
```

### Using bun:
```bash
bun i @vercel/analytics
```

## Step 3: Add Analytics to Your Application

The integration depends on your framework. Follow the instructions for your specific setup:

### Next.js (Pages Directory)

The `Analytics` component is a wrapper around the tracking script, offering more seamless integration with Next.js, including route support.

Add the following code to your main app file:

**TypeScript:**
```tsx
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/next";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}

export default MyApp;
```

**JavaScript:**
```jsx
import { Analytics } from "@vercel/analytics/next";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}

export default MyApp;
```

### Next.js (App Directory)

Add the following code to the root layout:

**TypeScript:**
```tsx
import { Analytics } from "@vercel/analytics/next";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Next.js</title>
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**JavaScript:**
```jsx
import { Analytics } from "@vercel/analytics/next";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Next.js</title>
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Remix

The `Analytics` component is a wrapper around the tracking script, offering a seamless integration with Remix, including route detection.

Add the following code to your root file:

**TypeScript:**
```tsx
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { Analytics } from "@vercel/analytics/remix";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Analytics />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
```

**JavaScript:**
```jsx
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { Analytics } from "@vercel/analytics/remix";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Analytics />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
```

### Nuxt

The `Analytics` component is a wrapper around the tracking script, offering more seamless integration with Nuxt, including route support.

Add the following code to your main component:

**TypeScript:**
```tsx
<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt';
</script>

<template>
  <Analytics />
  <NuxtPage />
</template>
```

**JavaScript:**
```jsx
<script setup>
import { Analytics } from '@vercel/analytics/nuxt';
</script>

<template>
  <Analytics />
  <NuxtPage />
</template>
```

### SvelteKit

The `injectAnalytics` function is a wrapper around the tracking script, offering more seamless integration with SvelteKit, including route support.

Add the following code to the main layout:

**TypeScript:**
```ts
import { dev } from "$app/environment";
import { injectAnalytics } from "@vercel/analytics/sveltekit";

injectAnalytics({ mode: dev ? "development" : "production" });
```

**JavaScript:**
```js
import { dev } from "$app/environment";
import { injectAnalytics } from "@vercel/analytics/sveltekit";

injectAnalytics({ mode: dev ? "development" : "production" });
```

### Astro

The `Analytics` component is a wrapper around the tracking script, offering more seamless integration with Astro, including route support.

**Note:** The `Analytics` component is available in version `@vercel/analytics@1.4.0` and later. If you are using an earlier version, you must configure the `webAnalytics` property in your `astro.config.mjs` file.

**Using Analytics Component (v1.4.0+):**
```tsx
---
import Analytics from '@vercel/analytics/astro';
{/* ... */}
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <!-- ... -->
    <Analytics />
  </head>
  <body>
    <slot />
  </body>
</html>
```

**Using Adapter Configuration (earlier versions):**
```ts
import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/serverless";

export default defineConfig({
  output: "server",
  adapter: vercel({
    webAnalytics: {
      enabled: true, // set to false when using @vercel/analytics@1.4.0
    },
  }),
});
```

### React (Create React App)

The `Analytics` component is a wrapper around the tracking script, offering more seamless integration with React.

**Note:** When using the plain React implementation, there is no route support.

**TypeScript:**
```tsx
import { Analytics } from "@vercel/analytics/react";

export default function App() {
  return (
    <div>
      {/* ... */}
      <Analytics />
    </div>
  );
}
```

**JavaScript:**
```jsx
import { Analytics } from "@vercel/analytics/react";

export default function App() {
  return (
    <div>
      {/* ... */}
      <Analytics />
    </div>
  );
}
```

### Vue

The `Analytics` component is a wrapper around the tracking script, offering more seamless integration with Vue.

**Note:** Route support is automatically enabled if you're using `vue-router`.

**TypeScript:**
```tsx
<script setup lang="ts">
import { Analytics } from '@vercel/analytics/vue';
</script>

<template>
  <Analytics />
  <!-- your content -->
</template>
```

**JavaScript:**
```jsx
<script setup>
import { Analytics } from '@vercel/analytics/vue';
</script>

<template>
  <Analytics />
  <!-- your content -->
</template>
```

### Plain HTML

For plain HTML sites, add the following script to your `.html` files:

```html
<script>
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
</script>
<script defer src="/_vercel/insights/script.js"></script>
```

**Note:** When using the HTML implementation, there is no need to install the `@vercel/analytics` package. However, there is no route support.

### Other Frameworks

For other frameworks, import the `inject` function from the package, which will add the tracking script to your app. **This should only be called once in your app, and must run in the client**.

**Note:** There is no route support with the `inject` function.

**TypeScript:**
```ts
import { inject } from "@vercel/analytics";

inject();
```

**JavaScript:**
```js
import { inject } from "@vercel/analytics";

inject();
```

## Step 4: Deploy Your App to Vercel

Deploy your app using the Vercel CLI:

```bash
vercel deploy
```

If you haven't already, we also recommend [connecting your project's Git repository](/docs/git#deploying-a-git-repository), which will enable Vercel to deploy your latest commits to main without terminal commands.

Once your app is deployed, it will start tracking visitors and page views.

> **💡 Note:** If everything is set up properly, you should be able to see a Fetch/XHR request in your browser's Network tab from `/_vercel/insights/view` when you visit any page.

## Step 5: View Your Data in the Dashboard

Once your app is deployed and users have visited your site, you can view your data in the dashboard:

1. Go to your [dashboard](/dashboard)
2. Select your project
3. Click the **Analytics** tab

After a few days of visitors, you'll be able to start exploring your data by viewing and filtering the panels.

Users on Pro and Enterprise plans can also add [custom events](/docs/analytics/custom-events) to their data to track user interactions such as button clicks, form submissions, or purchases.

## Privacy and Compliance

Vercel Web Analytics is built with privacy and data compliance in mind. Learn more about how Vercel supports [privacy and data compliance standards](/docs/analytics/privacy-policy) with Vercel Web Analytics.

## Next Steps

Now that you have Vercel Web Analytics set up, explore these additional topics to learn more:

- [Learn how to use the `@vercel/analytics` package](/docs/analytics/package)
- [Learn how to set custom events](/docs/analytics/custom-events)
- [Learn about filtering data](/docs/analytics/filtering)
- [Read about privacy and compliance](/docs/analytics/privacy-policy)
- [Explore pricing](/docs/analytics/limits-and-pricing)
- [Troubleshooting](/docs/analytics/troubleshooting)

## Conclusion

Vercel Web Analytics provides a powerful way to understand your users and optimize your application. By following this guide, you've set up analytics for your project and can now start collecting valuable insights about your visitors.

Remember that analytics data is most useful when tracked consistently over time, so make sure to keep your analytics enabled and review your data regularly to identify trends and opportunities for improvement.
