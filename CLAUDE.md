# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome extension (Manifest V3) that allows users to manage webhooks and send webpage URLs to registered webhook endpoints via context menus. The extension is designed to integrate with automation workflows like N8N.

## Architecture

### Core Components

- **manifest.json**: Chrome extension manifest defining permissions, background scripts, and UI components
- **background.js**: Service worker handling context menu creation, webhook management, and HTTP requests
- **popup.html/popup.js**: Extension popup UI for webhook registration and management
- **Chrome Storage**: Local storage for webhook persistence

### Key Features

- Context menu integration for pages, links, and images
- Dynamic webhook menu generation based on stored webhooks
- Data extraction (page titles, link titles, image alt text) before sending to webhooks
- Two-click deletion confirmation for webhook management

## Development

### Installation for Development

1. Load extension in Chrome: `chrome://extensions/` → "Load unpacked" → select project directory
2. Enable "Developer mode" in Chrome extensions page

### Testing

- No automated test framework is configured
- Test manually by:
  1. Loading extension in Chrome
  2. Adding webhooks via popup
  3. Right-clicking on pages/links/images to test context menu functionality
  4. Verifying webhook payloads are sent correctly

### Key Files to Modify

- **background.js:62-115**: Webhook sending logic and data extraction
- **popup.js:1-36**: Webhook form handling and storage operations
- **popup.js:38-84**: Webhook list rendering and UI interactions
- **manifest.json:6-14**: Permissions and host permissions

### Storage Structure

Webhooks are stored in Chrome local storage as:
```json
{
  "webhooks": [
    {"name": "Friendly Name", "url": "https://webhook.url"}
  ]
}
```

### Context Menu Integration

- Parent menu: "Send to Webhook"
- Dynamic child menus created for each registered webhook
- Supports page, link, and image contexts
- Payloads include: `{url: string, title: string|null}`