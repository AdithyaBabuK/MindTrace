# Mindful Moments

Build a modern, fully functional, responsive Digital Journal Web Application using React, Tailwind CSS, and local browser storage (LocalStorage).

Key Requirements & Features:

1. Header & Navigation:

   - App title ("MindTrace - Personal Journal") with clean typography.

   - Quick stats counter showing total entries, writing streak (in days), and mood summary.

2. Create/Edit Journal Entry Form:

   - Input fields for: Entry Title, Date (defaults to today), Category (e.g., Personal, Work, Ideas, Reflection), Mood Selector (5 emoji options: Happy, Calm, Anxious, Sad, Energetic), and Content (Markdown-supported rich text area).

   - "Save Entry" and "Clear Form" buttons.

3. Journal Entries List View:

   - Grid or card view showing saved entries ordered by date (newest first).

   - Each entry card displays Title, Date, Category tag, Mood emoji, and a preview snippet.

   - Search bar to search entries by title or text.

   - Filter dropdowns to filter entries by Category and Mood.

4. Entry Detail Modal/View:

   - Clicking an entry card opens a full view displaying complete entry details.

   - Actions to "Edit" or "Delete" the entry with confirmation prompts.

5. Visual Extras:

   - Toggle switch for Dark Mode / Light Mode.

   - "Export Entries" button that downloads saved journal entries as a JSON or text file.

Ensure the UI is clean, modern, fully functional out of the box with zero errors, and includes 3 pre-populated sample journal entries so it looks complete immediately.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3e221584-e7f0-4897-b49c-eb98c4dc07dc).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
