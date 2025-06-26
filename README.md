# Webhook Manager Chrome Extension

This extension was born out of an irresistible drive to solve a specific problem: the need to send URLs of elements on a webpage directly to my N8N workflow for automating my tech watch. In the world of software development, finding no existing solutions that support the latest Chrome Manifest V3 was not just a challenge—it was an unavoidable call to action. For someone with ADHD, the impulse to dive deep into a problem and craft a solution isn't just a choice; it's often an innate response that cannot be ignored.

The rapid creation of the first prototype within an hour and the additional enhancements over the next two hours are reflections of how ADHD can fuel intense periods of focus and productivity, known as hyperfocus. This intense engagement with tasks that capture our interest is a common trait among those with ADHD, leading us to achieve remarkable feats in bursts of passion and creativity.

This project isn't merely a functional tool; it's a personal statement and a beacon for others in the tech industry who might find themselves similarly driven by their neurodivergent traits. It serves as a reminder that our unique wiring can lead to powerful bursts of innovation and that embracing this can lead to practical, impactful solutions. Here's to all the software developers living with ADHD: Your intense need to solve problems, create solutions, or improve systems is not just a challenge—it's also your superpower.

## Features

- **Register and Manage Webhooks**: Users can add, edit, and delete webhooks with a friendly name and URL.
- **Context Menu Integration**: Right-click on any page, link, image, or selected text to send data to a registered webhook.
- **Enhanced Data Collection**: Automatically extracts page metadata, timestamps, and context-specific information.
- **Webhook Testing**: Test webhooks directly from the popup with response time and status feedback.
- **Smart Notifications**: Desktop notifications with emoji feedback (✅/❌) for webhook status.
- **URL Validation**: Built-in validation ensures only valid HTTP/HTTPS URLs are accepted.
- **Retry Mechanism**: Automatic retry (up to 3 attempts) for failed webhook calls.
- **Secure Storage**: All webhook information is securely stored using Chrome's local storage.

## Installation

1. Clone the repository or download the ZIP file.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable Developer Mode at the top right.
4. Click on "Load unpacked" and select the extension directory where the `manifest.json` file is located.

## Usage

- **Adding a Webhook**: Click on the extension icon, fill in the URL and a friendly name, and click "Save".
- **Testing a Webhook**: Click the test tube icon (🧪) next to any webhook to verify it's working.
- **Editing a Webhook**: Click the "Edit" icon next to the webhook you want to change.
- **Deleting a Webhook**: Click the "Delete" button next to the webhook you want to remove, then click again when it changes to "Confirm?".
- **Using a Webhook**: Right-click on a page, link, image, or selected text, hover over "Send to Webhook", and select the desired webhook.

## Webhook Payload Examples

The extension sends different payload structures depending on the context:

### Page Context (right-click on page)
```json
{
  "url": "https://example.com/article",
  "timestamp": "2024-06-26T15:30:45.123Z",
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
  "timestamp": "2024-06-26T15:30:45.123Z",
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
  "timestamp": "2024-06-26T15:30:45.123Z",
  "type": "link",
  "title": "Link title attribute",
  "linkTitle": "Link title attribute"
}
```

### Image Context (right-click on an image)
```json
{
  "url": "https://example.com/image.jpg",
  "timestamp": "2024-06-26T15:30:45.123Z",
  "type": "image",
  "title": "Image alt text",
  "altText": "Image alt text"
}
```

### Test Webhook Payload
```json
{
  "url": "https://example.com/test",
  "title": "Test webhook from Chrome Extension"
}
```

## Configuration

No additional configuration is required.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Author

- Thibault Milan (hello@thibaultmilan.com)

## Acknowledgments

- Font Awesome for icons used in the popup UI and the project's icon.
- Pure CSS for styling.
- OpenAI's ChatGPT for assisting in the development of this Chrome extension, providing coding guidance, error handling strategies, and documentation.
