<p align="center"><a target="_blank" href="https://chromewebstore.google.com/detail/scroll-minimap-for-chatgp/apekbedjllgmacohbcckgipfhjddehkf"><img src="./assets/icon.png" height=100 ></a></p>
<h1 align="center"> ChatGPS </h1>
<p align="center"><a target="_blank" href="https://chromewebstore.google.com/detail/scroll-minimap-for-chatgp/apekbedjllgmacohbcckgipfhjddehkf"><img src="https://img.shields.io/badge/Chrome%20Web%20Store-4285F4?logo=chromewebstore&logoColor=fff&style=for-the-badge" /></a></p>
<p align="center">Chrome extension which gives you a birds eye view of your chats.</p>


<p align="center">
  <a target="_blank" href="https://chromewebstore.google.com/detail/scroll-minimap-for-chatgp/apekbedjllgmacohbcckgipfhjddehkf">
    <img src="https://github.com/user-attachments/assets/8a40120d-1a57-40b9-93ee-ef3820d9ca5c" />
  </a>
</p>

I made this extension because I kept getting lost during my conversations with chatgpt. Sometimes chatgpt be giving you alot of useless info you didnt ask for. Navigating through what it says and finding the useful bits can be pretty tedious. This extension aims to solve that.

## Usage
1. Download the extension from [Chrome web store](https://chromewebstore.google.com/detail/scroll-minimap-for-chatgp/apekbedjllgmacohbcckgipfhjddehkf)

2. Restart chrome

3. Go to chatgpt, you should see a toggle button for the minimap in the top right corner. Open the minimap by pressing this button.

4. Ask chatgpt a message and hit refresh minimap. A condensed view of the conversation should be shown in the minimap.

## About
* Chrome extension framework: [WXT chrome extension framework](https://wxt.dev/guide/installation.html). (Solves alot of problems when trying to develop chrome extensions)
* For the ui: [shadcn components](https://ui.shadcn.com/docs/components).
* For the styling: [tailwind](https://tailwindcss.com/plus/ui-blocks/ecommerce/components/category-filters)
* Also: React, Typescript, Chrome extension apis (with wxt)

### Folder structure
The folder structure is determined by WXT https://wxt.dev/guide/essentials/project-structure.html.

| Path                | Description                                            | Links
| ------------------- | ------------------------------------------------------ | -
| `assets/`           | Static resources such as images, fonts, or other media |
| **`components/`**       | Components used across all entrypoints             
| **`components/ui`**  | Folder where pre built shadcn components live | https://ui.shadcn.com/docs/components
| **`entrypoints/`**     | Application entry points                    | https://wxt.dev/guide/essentials/entrypoints.html
| **`entrypoints/content`**| Entry point for content script loaded on every page | https://wxt.dev/guide/essentials/content-scripts.html
| **`entrypoints/popup`** | Entry point for popup page
| `hooks/`            | Custom React hooks                          | https://react.dev/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component
| `lib/`              | Utility functions and core library logic               | 
| `public/`           | Publicly accessible static files                       |
| `components.json`   | Configuration for shadcn components                    | https://ui.shadcn.com/docs/components-json
| `package-lock.json` | Exact dependency tree snapshot                         |
| `package.json`      | Project metadata, scripts, and dependencies            |
| `README.md`         | Project documentation (this file)                      |
| `tsconfig.json`     | TypeScript compiler configuration                      |
| `types.ts`          | Shared TypeScript type definitions                     |
| `wxt.config.ts`     | WXT build/configuration file. Also manifest.json low key but not really                           | https://wxt.dev/guide/essentials/config/manifest.html

### Project setup

0. Make sure the following are installed:
  * node (& npm)
  * chrome
1. Clone repo
2. Navigate to directory and run
```bash
npm i
```
3. Run the following to develop chrome extension. This should open new chrome window navigated to chat.com.
 ```bash
 npm run dev
 ```
4. Make changes to React tsx code in components & entrypoints. (Web page hot reloads due to WXT)
5. Build extension. (zip file should appear in .outputs)
```bash
npm run build
```


