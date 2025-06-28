# Webhook Manager Chrome Extension v2.0

This extension was born out of an irresistible drive to solve a specific problem: the need to send URLs of elements on a webpage directly to my N8N workflow for automating my tech watch. In the world of software development, finding no existing solutions that support the latest Chrome Manifest V3 was not just a challenge—it was an unavoidable call to action. For someone with ADHD, the impulse to dive deep into a problem and craft a solution isn't just a choice; it's often an innate response that cannot be ignored.

The rapid creation of the first prototype within an hour and the additional enhancements over the next two hours are reflections of how ADHD can fuel intense periods of focus and productivity, known as hyperfocus. This intense engagement with tasks that capture our interest is a common trait among those with ADHD, leading us to achieve remarkable feats in bursts of passion and creativity.

This project isn't merely a functional tool; it's a personal statement and a beacon for others in the tech industry who might find themselves similarly driven by their neurodivergent traits. It serves as a reminder that our unique wiring can lead to powerful bursts of innovation and that embracing this can lead to practical, impactful solutions. Here's to all the software developers living with ADHD: Your intense need to solve problems, create solutions, or improve systems is not just a challenge—it's also your superpower.

## ✨ What's New in v2.0

### 🎨 **Complete UI Redesign**
- **Modern card-based interface** with professional design system
- **Tabbed navigation** separating Webhooks and Settings
- **Collapsible forms** to maximize space for webhook management
- **Enhanced typography** and consistent spacing throughout
- **Responsive design** optimized for Chrome extension popup

### ⚡ **Rate Limiting & Queue System**
- **Configurable rate limits** per webhook (in seconds)
- **Intelligent queueing** prevents spam and respects API limits
- **Queue notifications** with ⏳ emoji and countdown timers
- **Configurable notification intervals** (1-60 seconds)

### 🔧 **Enhanced User Experience**
- **Improved form workflows** with better validation feedback
- **Success/error messaging** with auto-dismissal
- **Enhanced button states** for test/edit/delete actions
- **Keyboard accessibility** throughout the interface
- **Author attribution** with link to developer

## Features

### Core Functionality
- **Register and Manage Webhooks**: Add, edit, and delete webhooks with friendly names, URLs, and rate limits
- **Context Menu Integration**: Right-click on any page, link, image, or selected text to send data to registered webhooks
- **Enhanced Data Collection**: Automatically extracts page metadata, timestamps, and context-specific information
- **Webhook Testing**: Test webhooks directly from the popup with response time and status feedback
- **Smart Notifications**: Desktop notifications with emoji feedback (✅/❌/⏳) for webhook status and queue updates

### Advanced Features
- **Rate Limiting**: Configure per-webhook rate limits to prevent API abuse
- **Queue Management**: Intelligent queueing system with real-time status updates
- **URL Validation**: Built-in validation ensures only valid HTTP/HTTPS URLs are accepted
- **Retry Mechanism**: Automatic retry (up to 3 attempts) for failed webhook calls with progressive delays
- **Secure Storage**: All webhook information is securely stored using Chrome's local storage
- **Settings Management**: Configurable notification update intervals and future expandability

## Installation

### From Source
1. Clone the repository or download the ZIP file
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer Mode** at the top right
4. Click **"Load unpacked"** and select the extension directory where the `manifest.json` file is located

### Requirements
- Chrome browser with Manifest V3 support
- Developer mode enabled for unpacked extensions

## Usage

### Managing Webhooks
- **Adding a Webhook**: Click the "➕ Add New Webhook" button, fill in the URL, name, and optional rate limit
- **Testing a Webhook**: Click the "🧪 Test" button next to any webhook to verify connectivity
- **Editing a Webhook**: Click the "✏️ Edit" button to modify webhook details
- **Deleting a Webhook**: Click the "🗑️ Delete" button, then confirm by clicking "Confirm?"

### Using Webhooks
Right-click on any webpage element:
- **Pages**: Right-click anywhere on the page
- **Links**: Right-click on any link
- **Images**: Right-click on any image  
- **Text**: Select text and right-click
- Choose **"Send to Webhook"** → Select your desired webhook

### Settings
- **Notification Intervals**: Configure how often queue notifications update (1-60 seconds)
- Access via the **"Settings"** tab in the extension popup

## Webhook Payload Examples

The extension sends different payload structures depending on the context:

### Page Context (right-click on page)
```json
{
  "url": "https://example.com/article",
  "timestamp": "2024-06-28T15:30:45.123Z",
  "type": "page",
  "title": "Article Title",
  "description": "Article description from meta tag",
  "keywords": "technology, programming, tutorial",
  "favicon": "https://example.com/favicon.ico"
}
```

### Selected Text Context (right-click on selected text)
```json
{
  "url": "https://example.com/article",
  "timestamp": "2024-06-28T15:30:45.123Z",
  "type": "selection",
  "title": "Article Title",
  "description": "Article description from meta tag",
  "keywords": "technology, programming, tutorial",
  "favicon": "https://example.com/favicon.ico",
  "selectedText": "This is the selected text from the page"
}
```

### Link Context (right-click on a link)
```json
{
  "url": "https://linked-page.com",
  "timestamp": "2024-06-28T15:30:45.123Z",
  "type": "link",
  "title": "Link title attribute",
  "linkTitle": "Link title attribute"
}
```

### Image Context (right-click on an image)
```json
{
  "url": "https://example.com/image.jpg",
  "timestamp": "2024-06-28T15:30:45.123Z",
  "type": "image",
  "title": "Image alt text",
  "altText": "Image alt text"
}
```

### Test Webhook Payload
```json
{
  "url": "https://example.com/test",
  "title": "Test webhook from Chrome Extension",
  "timestamp": "2024-06-28T15:30:45.123Z",
  "type": "test"
}
```

## Rate Limiting

Configure rate limits per webhook to prevent API abuse:
- **0 seconds**: No rate limiting (immediate sending)
- **1-999 seconds**: Webhooks will be queued and sent at the specified interval
- **Queue notifications**: Get real-time updates when webhooks are queued
- **Smart queueing**: Only items that are actually delayed will show queue notifications

## Architecture

### Core Components
- **manifest.json**: Chrome extension manifest (Manifest V3)
- **background.js**: Service worker handling context menus, webhook management, and queue processing
- **popup.html/popup.js**: Modern tabbed UI for webhook registration and settings management
- **Chrome Storage**: Local storage for webhook persistence and settings

### Queue System
- **Independent queues** per webhook URL with configurable rate limits
- **Asynchronous processing** with setTimeout-based scheduling
- **Memory-efficient** cleanup of completed notifications
- **Persistent storage** integration for queue state management

## Development

### File Structure
```
chrome-webhook-extension/
├── manifest.json          # Extension manifest
├── background.js          # Service worker (queue system, context menus)
├── popup.html            # Modern tabbed UI
├── popup.js              # UI logic and form handling
├── images/               # Extension icons
├── CLAUDE.md            # Development guide
└── README.md            # This file
```

### Key Technologies
- **Chrome Extension Manifest V3**
- **Service Workers** for background processing
- **Chrome Storage API** for data persistence
- **Chrome Context Menus API** for right-click integration
- **Chrome Notifications API** for queue status updates
- **Modern CSS** with custom properties and flexbox
- **Vanilla JavaScript** with ES6+ features

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request with detailed description

### Development Setup
1. Clone the repository
2. Load unpacked extension in Chrome
3. Make changes and reload extension
4. Test across different webpage contexts

## Changelog

### v2.0.0 (2024-06-28)
- **MAJOR UI REDESIGN**: Complete interface overhaul with modern card-based design
- **NEW**: Rate limiting system with configurable per-webhook limits
- **NEW**: Intelligent queue management with real-time notifications
- **NEW**: Tabbed interface separating Webhooks and Settings
- **NEW**: Collapsible form design for better space utilization
- **NEW**: Enhanced accessibility with keyboard navigation
- **NEW**: Configurable notification update intervals
- **IMPROVED**: Form validation and error handling
- **IMPROVED**: Button states and visual feedback
- **IMPROVED**: Typography and spacing consistency
- **IMPROVED**: Test webhook functionality with enhanced payloads

### v1.0.0 (2024-06-26)
- Initial release with basic webhook management
- Context menu integration for pages, links, images, and text
- Webhook testing and validation
- Chrome storage integration

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Author

**Thibault Milan**
- Website: [thibaultmilan.com](https://thibaultmilan.com)
- Email: hello@thibaultmilan.com

## Acknowledgments

- **Font Awesome** for icons used throughout the interface
- **PureCSS** for the foundational CSS framework
- **Claude Code (Anthropic)** for AI-assisted development and architecture guidance
- The **ADHD developer community** for inspiration and hyperfocus superpowers