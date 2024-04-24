# Webhook Manager Chrome Extension

This extension was born out of an irresistible drive to solve a specific problem: the need to send URLs of elements on a webpage directly to my N8N workflow for automating my tech watch. In the world of software development, finding no existing solutions that support the latest Chrome Manifest V3 was not just a challenge—it was an unavoidable call to action. For someone with ADHD, the impulse to dive deep into a problem and craft a solution isn't just a choice; it's often an innate response that cannot be ignored.

The rapid creation of the first prototype within an hour and the additional enhancements over the next two hours are reflections of how ADHD can fuel intense periods of focus and productivity, known as hyperfocus. This intense engagement with tasks that capture our interest is a common trait among those with ADHD, leading us to achieve remarkable feats in bursts of passion and creativity.

This project isn't merely a functional tool; it's a personal statement and a beacon for others in the tech industry who might find themselves similarly driven by their neurodivergent traits. It serves as a reminder that our unique wiring can lead to powerful bursts of innovation and that embracing this can lead to practical, impactful solutions. Here's to all the software developers living with ADHD: Your intense need to solve problems, create solutions, or improve systems is not just a challenge—it's also your superpower.

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
- OpenAI's ChatGPT for assisting in the development of this Chrome extension, providing coding guidance, error handling strategies, and documentation.
