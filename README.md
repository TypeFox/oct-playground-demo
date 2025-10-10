# OCT Playground Demo

> Demonstration application for Eclipse Open Collaboration Tools (OCT) showcasing real-time collaborative editing between IDEs and browser-based environments.

## What is this?

This repository contains a demonstration scenario designed to showcase the collaborative capabilities of the [Eclipse Open Collaboration Tools (OCT)](https://www.open-collab.tools/). It demonstrates how developers using desktop IDEs (like Eclipse Theia or VS Code) can collaborate in real-time with stakeholders accessing the same codebase through the [OCT Playground](https://www.open-collab.tools/playground/) in their web browser.

The demo uses a realistic e-commerce discount system as its subject matter, making it easy to understand how technical and non-technical team members can work together on code, documentation, and configuration files simultaneously.

## Key Features

- **Cross-platform collaboration**: IDE users and browser users working on the same files in real-time
- **Synchronized navigation**: When one participant switches files, all participants follow
- **Multi-file editing**: Demonstrates collaboration across TypeScript code, Markdown documentation, and JSON configuration
- **Real-world scenario**: Business stakeholder and developer aligning on a new feature together

## Repository Structure

- **`app/`** — Full-stack TypeScript application (React frontend + Express backend) with detailed setup instructions
- **`documentation/`** — Background materials including blog post content and conference presentation scenario
- **`LICENSE`** — MIT license

## Getting Started

To run the demo application locally:

```bash
cd app
npm install
npm run dev
```

See [`app/README.md`](app/README.md) for detailed installation instructions, API documentation, and the complete demo scenario walkthrough.

## Use Cases

This demo is designed for:

- **Conference presentations** demonstrating OCT capabilities
- **Internal workshops** on collaborative development workflows
- **Stakeholder demonstrations** showing how non-developers can participate in technical discussions
- **Blueprint reference** for integrating OCT into your own web applications

## Learn More

- [OCT Playground](https://www.open-collab.tools/playground/) — Try collaborative editing in your browser
- [open-collaboration-monaco](https://www.npmjs.com/package/open-collaboration-monaco) — NPM package for integrating OCT with Monaco Editor
- [Blog post](https://www.typefox.io/blog/collaborative-coding-in-the-browser/) — Motivation for this demo project

## License

MIT

