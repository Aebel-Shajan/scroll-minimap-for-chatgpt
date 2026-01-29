# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ChatGPS is a Chrome extension that adds a minimap/outline view to AI chat interfaces (ChatGPT, Gemini, Claude). It helps users navigate long conversations by showing a condensed, scrollable outline of the chat with filtering and search capabilities.

## Build Commands

```bash
npm run dev          # Start dev mode (opens Chrome with extension loaded at chat.com)
npm run dev:firefox  # Start dev mode for Firefox
npm run build        # Build for Chrome (output in .output/)
npm run build:firefox # Build for Firefox
npm run zip          # Create distributable zip
npm run compile      # TypeScript type check (no emit)
```

## Architecture

### Framework
Built with [WXT](https://wxt.dev) - a Chrome extension framework that handles manifest generation, hot reload, and content script injection. WXT auto-imports React hooks and its own utilities (no explicit imports needed for `useState`, `useEffect`, `defineContentScript`, etc.).

### Entry Points (entrypoints/)
- **content/index.tsx**: Main content script injected into chat pages. Creates a shadow DOM overlay and mounts the React app. Matches `chatgpt.com/*`, `gemini.google.com/*`, `claude.ai/*`.
- **content/App.tsx**: Root component with the sidebar UI, search input, and filter dropdown.
- **background.ts**: Handles keyboard shortcut (`Ctrl+Shift+K` / `Cmd+Shift+K`) to toggle the UI.

### Multi-Provider Support
The extension detects which chat provider is active via `useChatProvider()` hook and uses provider-specific CSS selectors defined in `lib/constants.ts`:
- `CHAT_GPT_SELECTOR_MAP` - ChatGPT selectors (e.g., `[data-turn="user"]`)
- `GEMINI_SELECTOR_MAP` - Gemini selectors (e.g., `user-query`, `model-response`)
- `CLAUDE_SELECTOR_MAP` - Claude selectors (e.g., `[data-testid="user-message"]`)

### Core Logic (lib/chatgptElementUtils.ts)
- `extractFilteredTreeBySelectors()`: Builds a tree of chat items from DOM based on active filters
- `queryChatScrollContainer()`: Finds the scrollable chat container for a given provider
- DOM observers (`elementObserver`, `createChildObserver`) for detecting chat updates
- Navigation utilities (`onNextChat`, `onPreviousChat`)

### UI Components
- **components/chat-outline-rerwrite.tsx**: Renders the scrollable outline, handles scroll-position highlighting
- **components/ui/**: Shadcn components (Button, DropdownMenu, etc.)
- Uses Tailwind CSS v4 with the `@` alias pointing to project root

### State Management
- `useSyncedStorage()`: WXT hook for chrome.storage.sync (persists filter settings, sidebar open state)
- React state for UI interactions

### Types (types.ts)
- `ChatItem`: Tree node representing a chat message with nested children (code blocks, headers)
- `ReactComponentMap`: Maps icon names to React components
