# Scenario: Aligning on a New Feature with Stakeholder and Developer

## Context

### Conference presentation

Title: **Collaborative Editing Across Web Applications and Theia-based IDEs**

Collaboration in software projects shouldn't be limited to developers inside an IDE. With Eclipse Theia as the foundation and Eclipse Open Collaboration Tools (OCT) providing shared editing, we can now connect Theia-based IDEs with arbitrary web applications—making live collaboration a first-class experience for everyone involved in a project.

This talk will highlight how Theia enables real-time collaboration not only between developers, but also with project leads, stakeholders, and domain experts directly in their domain-specific tools. Key themes include:

- Why extending live sharing beyond IDEs to custom web applications changes team dynamics and accelerates feedback
- How OCT's Monaco integration enables shared editing and cross-application synchronization
- The OCT Playground as a lightweight environment to experiment with collaborative features
- Forward-looking opportunities for building truly collaborative development environments on top of Theia

Attendees will leave with a clear picture of how Theia can power collaborative development environments that bridge the gap between traditional IDE workflows and domain-specific web applications.

### Goals

During the presentation, I want to give a demo together with my colleague. I will share my screen and act like a stakeholder in a software development project. I don't have any IDE installed, but would like to collaborate on specific content with one of the senior engineers in the project.

- The scenario should make the advantages of OCT's web integration (as explained in the blog post) obvious.
- It should be realistic and closely related to how communication takes place in modern software projects.
- Ideally, the scenario also involves multiple files so we can show how changing the active editor is synchronized during the session.

Important: If the scenario is just about communication, a regular meeting without shared editing is sufficient. If it's just about editing something, it can be done independently. So we need a scenario where both communication and editing by both sides is crucial.

### Roles

 - You: Project stakeholder (no IDE, just browser). You care about business rules and documentation clarity.
 - Jan: Senior engineer (working in Theia IDE with OCT integration). He owns the technical implementation.

### Scene Setup

You call Jan to clarify requirements for a new feature—a configurable “discount rule” for an e-commerce system. You don’t have an IDE installed, but you want to ensure that both the code implementation and the user-facing documentation/configuration reflect the business logic correctly.

Jan starts an OCT session from Theia and sends you a room ID. You join via the OCT Playground in your browser.

## Act 1 – Reviewing the Business Logic

 - Jan opens a discount-rules.ts file in Theia. You see it instantly in the Playground.
 - The file contains logic like:

```
export function calculateDiscount(customerType: string, amount: number): number {
    if (customerType === 'VIP') {
        return amount * 0.9; // 10% discount
    }
    return amount;
}
```

 - You (stakeholder) type into the file directly via the browser:
“What about customers with a loyalty card? Shouldn’t they also get a 5% discount?”
 - 	Jan replies in voice/chat and updates the code with you:

```
if (customerType === 'LOYALTY') {
    return amount * 0.95; // 5% discount
}
```

 - Both of you see changes live, with cursor highlights showing who edits what.

Value shown: Business person and developer collaborate in real time on actual code logic, no IDE setup needed on your side.

## Act 2 – Synchronizing Across Multiple Files

 - Jan switches to README.md in Theia. Instantly, your Playground view follows.
 - The file contains feature documentation for non-technical stakeholders.
 - You edit a sentence directly:
“Loyalty card holders now automatically get 5% off all purchases.”
 - Jan refines the wording together with you, demonstrating joint editing.

Value shown: Cross-file navigation is synchronized; both sides always see the same active editor.

## Act 3 – Configuration Alignment

 - To make the rule configurable, Jan switches to config.json.
 - You suggest adding a "loyaltyDiscount": 0.05 entry, and type it directly in the Playground.
 - Jan validates the syntax and explains how the system will pick it up.

Value shown: Collaboration is not limited to code—extends to docs, configs, DSLs, etc.

## Act 4 – Wrap-Up

 - You both step back and recap: within a 10-minute session, a stakeholder without IDE setup shaped actual implementation, documentation, and configuration.
 - No file sharing, no screen-sharing-only limitations—real collaboration happened in code and text simultaneously.
