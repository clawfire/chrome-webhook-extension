# Webhook Manager Chrome Extension

## Features

- **Register and Manage Webhooks**: Users can add, edit, and delete webhooks with a friendly name and URL.
- **Context Menu Integration**: Right-click on any page, link, or image to send the current URL to a registered webhook. Additional context-specific attributes like page titles or image alt text are also sent.
- **Secure Storage**: All webhook information is securely stored using Chrome's local storage.
- **User Confirmation for Deletion**: Ensures that deletions are intentional with a two-click confirmation process on the delete button.

## Installation

1. Clone the repository or download the ZIP file.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable Developer Mode at the top right.
4. Click on "Load unpacked" and select the extension directory where the `manifest.json` file is located.

## Usage

- **Adding a Webhook**: Click on the extension icon, fill in the URL and a friendly name, and click "Save".
- **Editing a Webhook**: Click the "Edit" icon next to the webhook you want to change.
- **Deleting a Webhook**: Click the "Delete" button next to the webhook you want to remove, then click again when it changes to "Confirm?".
- **Using a Webhook**: Right-click on a page, link, or image, hover over "Send to Webhook", and select the desired webhook.

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