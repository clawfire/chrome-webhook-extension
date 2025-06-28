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

- **background.js:1-43**: Queue initialization and management
- **background.js:45-115**: Queue processing with rate limiting
- **background.js:184-291**: Data extraction and webhook sending
- **background.js:303-355**: Queue notifications system
- **popup.js:51-118**: Webhook card creation and rendering
- **popup.js:324-358**: Form toggle functionality
- **popup.js:405-413**: Form submission and settings handling
- **popup.html:31-420**: Modern CSS design system and layout
- **manifest.json:6-14**: Permissions and host permissions

### Storage Structure

Webhooks are stored in Chrome local storage as:
```json
{
  "webhooks": [
    {
      "name": "Friendly Name", 
      "url": "https://webhook.url",
      "rateLimit": 30
    }
  ],
  "settings": {
    "notificationInterval": 5
  }
}
```

### Context Menu Integration

- Parent menu: "Send to Webhook"
- Dynamic child menus created for each registered webhook
- Supports page, link, image, and selection contexts
- Enhanced payloads with metadata, timestamps, and context-specific data

## Implemented Features (v2.0 Status)

✅ **Core Functionality**
- Webhook registration, editing, deletion with validation
- Context menu integration for all content types
- Enhanced data collection (metadata, timestamps, selected text)
- Webhook testing with response time feedback
- Smart notifications with emoji feedback (✅/❌/⏳)
- Error handling with toast notifications
- Retry mechanism (3 attempts with progressive delays)
- Performance optimizations (debouncing, ID sanitization)

✅ **Rate Limiting & Queue System (v2.0)**
- Per-webhook configurable rate limits (in seconds)
- Intelligent queueing system with independent queues
- Queue notifications with ⏳ emoji and countdown timers
- Configurable notification update intervals (1-60 seconds)
- Smart queue detection (only shows notifications when actually queued)

✅ **Modern UI Design (v2.0)**
- Complete interface redesign with card-based layout
- Professional design system with CSS custom properties
- Tabbed navigation (Webhooks | Settings)
- Collapsible form design for space optimization
- Enhanced typography and consistent spacing
- Modern button states and hover effects
- Accessible keyboard navigation
- Responsive design optimized for 400x600px popup

✅ **Enhanced User Experience (v2.0)**
- Improved form validation and error messaging
- Success/error notifications with auto-dismissal
- Enhanced webhook cards with action buttons
- Two-click deletion confirmation
- Edit mode with form pre-filling
- Settings management interface
- Author attribution with external link

## Future Development Ideas

### 6. User Experience Enhancements
- **Webhook Categories/Tags**: Organize webhooks into categories for better management
- **Export/Import Configuration**: Allow users to backup and restore webhook configurations
- **Keyboard Shortcuts**: Add hotkeys for quick webhook sending (e.g., Ctrl+Shift+W)
- **Webhook History**: Show recent webhook calls with timestamps and status

### 7. Advanced Features
- **Custom Payload Templates**: Allow users to define custom JSON payload structures
- **Conditional Webhooks**: Only send webhooks if URL matches specific patterns/rules
- **Webhook Queue with Offline Support**: Queue webhooks when offline, retry when connection restored
- **Batch Operations**: Select multiple webhooks and send to all at once

### 8. Security & Configuration
- **HTTPS-Only Validation**: Enforce HTTPS-only webhook URLs for security
- **Authentication Headers**: Support for custom headers (API keys, tokens)
- ✅ **Rate Limiting**: Prevent spam by limiting webhook calls per minute
- **Webhook Encryption**: Optional payload encryption for sensitive data

### 9. Analytics & Monitoring
- **Usage Statistics**: Track webhook usage patterns and success rates
- **Response Logging**: Store webhook responses for debugging
- **Performance Metrics**: Track response times and identify slow webhooks
- **Error Analytics**: Categorize and track different types of failures

### 10. Integration Features
- **Popular Service Presets**: Pre-configured templates for services like Zapier, IFTTT, Discord
- **Webhook Health Monitoring**: Periodic health checks for registered webhooks
- **Content Filtering**: Options to exclude certain domains or content types
- **Collaboration**: Share webhook configurations between team members

## Development Notes

- Current codebase is clean and well-structured for extensions
- All major architectural pieces are in place for future features
- Storage system can be extended for additional webhook metadata
- Context menu system supports expansion to more content types