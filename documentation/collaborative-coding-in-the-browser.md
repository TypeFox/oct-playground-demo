# Collaborative coding in the browser: The OCT Playground

Browser-based tools play a central role in software development workflows today.
However, enabling seamless real-time code collaboration across different environments remains a technical challenge.
Many teams still find themselves limited by fragmented toolchains.
In particular, there is hardly any interoperability between developer-focused IDEs and web applications with embedded editors.
How can we bridge these gaps to make collaborative programming more accessible and efficient?

This article explores the Eclipse Open Collaboration Tools (OCT) Playground and demonstrates how we combine the Monaco Editor with OCT to enable cross-platform real-time code collaboration directly in your web browser.

## Why the browser changes everything

In our [previous announcement](https://www.typefox.io/blog/open-collaboration-tools-announcement/), we introduced the Open Collaboration Tools (OCT)—an open source framework designed to bring real-time collaboration to a broad spectrum of IDEs and editors, including VS Code, Eclipse Theia, and more. OCT solves deep-rooted problems of interoperability, customizability, and vendor lock-in in a way that’s platform-agnostic and enterprise-ready.

But today’s spotlight is on something even more powerful:
*Real-time code collaboration—natively in your web browser.*

This is not just a technical convenience. For project leads, CTOs, and product managers, it’s a competitive advantage:

- No waiting: Spin up a live session for pair programming, code review, or onboarding—no plugins, no installs, no “it works on my machine”.
- Everyone can join: Whether your team prefers VS Code, Eclipse IDE, or just the browser—OCT bridges the gap.
- Product-ready building block: Want to add real-time sharing to your SaaS or internal tool? OCT gives you a drop-in framework with encryption, flexibility, and no vendor lock-in.

And here’s the key point:
**OCT is the first open source framework to support live collaboration directly between IDEs and browser-based applications.**

This unlocks entirely new use cases: collaborative modeling sessions that include business stakeholders, hands-on technical interviews with no environment prep, or product walk-throughs where everyone sees—and edits—the same code or logic in real time.
All with no local setup. Just open a link.

## The OCT Playground: bringing collaboration to your browser

The OCT Playground serves as both a demonstration and a practical example of how collaborative coding can be integrated into web applications.
It showcases the integration of the Monaco Editor (the editor component of VS Code) with OCT's real-time collaboration features.
This is more than a demo—it’s a fully functional blueprint for what you can build.

The playground demonstrates key capabilities through practical scenarios that highlight the value of browser-based collaborative editing:

**Cross-platform integration for mixed teams.** The playground enables seamless collaboration across different development environments.
Participants can join sessions from the browser while others connect using IDEs that support OCT integration—like VS Code, Eclipse Theia, and future IntelliJ IDEA support.
This bidirectional compatibility is enabled by the underlying Open Collaboration Protocol, which serves as a common communication standard for all OCT clients and ensures interoperability regardless of the tool used.
This allows teams to work together fluidly across their preferred editors.
Team members can join shared sessions for immediate, interactive code reviews where questions are answered in context and improvements can be implemented collaboratively.

**Real-time collaboration for pair programming.** Multiple developers can work simultaneously on the same codebase, whether they're using VS Code or accessing the playground through their browser.
Changes appear instantly, cursor positions are synchronized, and the development flow remains uninterrupted.
For example, when a developer using the OCT extension in VS Code switches between different files or editors, the playground client automatically follows these changes, keeping all participants on the same file and in the same context.
This seamless file navigation synchronization makes the platform ideal for live coding sessions where everyone stays synchronized with the session host's workflow.

## From playground to your own applications

If you want to build something similar to the public OCT Playground within your own web application, you have complete control over the Monaco Editor configuration.
You can enable syntax highlighting, error detection, and other features according to your needs.
For advanced features like intelligent code completion, you can integrate Language Server Protocol (LSP) support, giving you the flexibility to create exactly the editing experience you want.
And of course you decide how users authenticate and get access to collaboration sessions—OCT aims for for the same deep integration as other parts of your web app.

The flexibility of OCT’s Monaco integration opens up a wide range of use cases that go far beyond traditional developer-to-developer pair programming. Browser-based collaboration makes it easier to involve project leads, stakeholders, and domain experts—without forcing anyone to install or learn a new IDE:

**Interactive code and configuration reviews.**
Make it easy for tech leads, DevOps engineers, or occasional contributors to jump into live discussions of code, infrastructure, or CI/CD pipelines—without needing to install an IDE or sync local projects. Participants can join from the browser and follow along instantly. Everyone sees the same context, and contributions happen in real time.

**Domain-specific tooling with shared understanding.**
Have a custom editor for workflows, product rules, or system design models? OCT supports real-time collaboration even in these tailored environments. Engineers and business experts can work together directly—on shared diagrams or DSLs—inside your web application, using the same language and visual context.

**Technical interview and onboarding platforms.**
Create smooth, low-friction experiences for evaluating or training new developers. Interviewers or mentors can lead sessions from their IDE or browser, while candidates or new hires interact via the web—no local setup required. You control the environment, they bring their skills.

**Stakeholder demos and hands-on product walk-throughs.**
Use collaborative editing to demonstrate new features, onboard customers, or align with project sponsors. Everyone joins the same session—one link, no prep—and you can walk them through code, configurations, or domain logic interactively and in sync.

## Technical implementation: The open-collaboration-monaco package

The [open-collaboration-monaco](https://www.npmjs.com/package/open-collaboration-monaco) package makes it straightforward to add collaborative coding capabilities to any web application. Here's how it works.

### Integration architecture

The package handles three critical aspects.

**Monaco Editor collaboration layer**: Rather than bundling the Monaco Editor directly, the package provides a sophisticated collaboration layer that integrates with your existing Monaco Editor instance. This approach gives you complete control over your editor configuration while adding powerful live sharing capabilities.

**OCT collaboration features**: Real-time collaboration and synchronization between participants with robust conflict resolution and state management.

**Flexible configuration**: An API designed for easy configuration and adaptation to different use cases and requirements.

### Getting started with the package

The integration process is designed to work with your existing Monaco Editor setup as shown in the following code example:

```ts
import { monacoCollab } from '@typefox/open-collaboration-monaco';
import { editor } from 'monaco-editor';

// Create your Monaco Editor instance with your preferred configuration
const monacoEditor = editor.create(document.getElementById('editor'), {
  value: 'function hello() {\n    console.log("Hello, collaborative world!");\n}',
  language: 'typescript',
  theme: 'vs-dark',
  // All your custom Monaco Editor options...
});

// Initialize OCT collaboration features
const collab = monacoCollab({
    serverUrl: "the/url/to/your/server";
    callbacks: {...};
  // Additional collaboration options...
});

// Connect your editor with collaboration features
collab.setEditor(monacoEditor);
```

This approach ensures you maintain complete flexibility over your Monaco Editor configuration—from syntax highlighting and themes to advanced features like programming language or DSL support—while seamlessly adding collaborative capabilities.

### Handling real-time synchronization

Behind the scenes, the package manages the complex aspects of collaborative editing that developers typically struggle with.

**Proven conflict resolution with Yjs**: OCT is built on [Yjs](https://yjs.dev/), a proven library for Conflict-free Replicated Data Types (CRDTs).
This technology is already used by established tools like Figma and Notion for collaborative features.
Yjs ensures that changes from multiple users are automatically and mathematically correctly merged without data loss or inconsistent states.

**Cursor and selection tracking**: The system tracks and displays each participant's cursor position and text selection, providing visual cues about where team members are working.

**Connection management**: Robust handling of network interruptions, reconnections, and participant management ensures a smooth collaborative experience.

## Get started today

Ready to experience collaborative coding in action? Visit the [OCT Playground](https://www.open-collab.tools/playground/) to see how it works.
Whether you’re building domain-specific tooling, exciting product features, or internal dev tools, the combination of Monaco Editor and OCT provides a solid foundation for live sharing—directly in the browser.

The playground serves as both a demonstration and a starting point.
Explore its capabilities, experiment with the collaboration features, and imagine how similar functionality could enhance your own applications.

For developers interested in implementing similar functionality, the [open-collaboration-monaco](https://www.npmjs.com/package/open-collaboration-monaco) package is available as an open source solution.
This embodies our commitment to advancing the developer ecosystem through accessible, high-quality tools.

**We're here to support you.** If you have questions about implementing collaborative features in your applications or need assistance with OCT integration, our team is ready to help you succeed.
