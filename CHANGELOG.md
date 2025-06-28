# Changelog

All notable changes to the Webhook Manager Chrome Extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2024-06-28

### 🎨 Major UI Redesign
#### Added
- **Complete interface redesign** with modern card-based layout
- **Professional design system** using CSS custom properties for consistent theming
- **Tabbed navigation interface** separating Webhooks and Settings for better organization
- **Enhanced webhook cards** with proper spacing, typography, and visual hierarchy
- **Responsive design** optimized for 400x600px Chrome extension popup
- **Modern color scheme** with Microsoft Fluent-inspired design language
- **Enhanced typography** with improved font stack and consistent spacing system

#### Changed
- **Popup dimensions** increased to 400x600px for better usability
- **Form layout** redesigned with better labels, spacing, and visual feedback
- **Button styling** updated with modern hover states and transitions
- **Message system** redesigned with proper success/error styling and auto-dismissal

### ⚡ Rate Limiting & Queue System
#### Added
- **Per-webhook rate limiting** with configurable intervals in seconds (0 = no limit)
- **Intelligent queueing system** with independent queues per webhook URL
- **Queue notifications** with ⏳ emoji showing queue position and estimated wait time
- **Smart queue detection** - only shows notifications when items are actually queued
- **Real-time countdown updates** in queue notifications
- **Configurable notification intervals** (1-60 seconds) in Settings tab
- **Queue state persistence** across extension restarts
- **Memory-efficient cleanup** of completed notifications and timers

#### Changed
- **Webhook storage structure** updated to include `rateLimit` field
- **Context menu sending** now uses queue system instead of direct posting
- **Background script** restructured with dedicated queue management functions

### 🔧 Enhanced User Experience
#### Added
- **Collapsible form design** with "Add New Webhook" button that expands to show form
- **Form close button** (×) for intuitive form dismissal and clearing
- **Enhanced validation feedback** with inline error messages
- **Success notifications** for webhook save/delete operations
- **Auto-focus on form fields** when adding/editing webhooks
- **Keyboard accessibility** throughout the interface with proper focus management
- **Settings management interface** for future expandability
- **Author attribution** with link to developer website (thibaultmilan.com)

#### Changed
- **Form workflow** simplified from collapsible sections to clear show/hide behavior
- **Delete confirmation** improved with visual feedback and proper state management
- **Edit mode** enhanced with automatic form expansion and field pre-filling
- **Button grouping** reorganized for better visual hierarchy

#### Fixed
- **Double scrollbar issue** resolved with proper height management
- **Form state management** cleaned up to prevent JavaScript errors
- **Accessibility** improved with ARIA attributes and keyboard navigation

### 🔨 Technical Improvements
#### Added
- **Enhanced webhook testing** with improved payload structure including `type` field
- **Better error handling** throughout the application with proper user feedback
- **Modular JavaScript architecture** with separated concerns for UI and queue management
- **CSS custom properties system** for maintainable theming
- **Performance optimizations** for notification updates and queue processing

#### Changed
- **Storage structure** updated to support settings and enhanced webhook metadata
- **Notification system** redesigned with configurable update intervals
- **Code organization** improved with better separation of concerns

#### Removed
- **Legacy PureCSS dependencies** replaced with custom modern CSS
- **Redundant form elements** streamlined for better UX
- **Unused CSS classes** cleaned up for smaller footprint

### 📚 Documentation
#### Added
- **Comprehensive README update** with v2.0 feature documentation
- **Detailed changelog** with categorized changes
- **Enhanced code documentation** in CLAUDE.md with current file references
- **Architecture documentation** covering queue system and design patterns

#### Changed
- **Installation instructions** updated with current requirements
- **Usage examples** expanded with new features
- **Payload examples** updated with enhanced structure

---

## [1.0.0] - 2024-06-26

### Added
- **Initial release** of Webhook Manager Chrome Extension
- **Basic webhook management** with add, edit, delete functionality
- **Context menu integration** for pages, links, images, and selected text
- **Enhanced data collection** with page metadata extraction
- **Webhook testing** with response time feedback
- **Smart notifications** with success/error emoji feedback (✅/❌)
- **URL validation** ensuring only HTTP/HTTPS URLs
- **Retry mechanism** with up to 3 attempts for failed requests
- **Chrome storage integration** for persistent webhook management
- **Manifest V3 compatibility** for modern Chrome extension standards

### Technical Details
- Chrome Extension Manifest V3 implementation
- Service worker background script
- Chrome Storage API integration
- Context Menus API for right-click functionality
- Notifications API for user feedback
- Basic PureCSS styling with Font Awesome icons

---

## Release Notes

### Breaking Changes in v2.0
- **Storage structure** has been updated to include rate limiting and settings
- **UI completely redesigned** - existing users will see a new interface
- **Popup dimensions** changed from 300px to 400x600px

### Migration Notes
- Existing webhooks will be automatically migrated to the new structure
- No user action required for the upgrade
- New features (rate limiting, settings) will use default values

### Compatibility
- Requires Chrome browser with Manifest V3 support
- Compatible with all modern Chrome versions
- No breaking changes to webhook payload structure (fully backward compatible)