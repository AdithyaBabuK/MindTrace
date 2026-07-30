# 🧠 MindTrace — Personal Digital Journal & Mood Tracker

> **MindTrace** is a private, local-first, aesthetic digital journal and mood tracker built with **React 19**, **TypeScript**, **TanStack Start / TanStack Router**, **Tailwind CSS v4**, and **Vite**. 

All your entries, thoughts, and mood analytics remain 100% private and stored locally inside your browser (`localStorage`).

---

## 🎓 CODETECH INTERNSHIP DETAILS

- **Internship ID**: CITS4857
- **Task Name**: Digital Journal App
- **Domain**: Full-Stack Web Development

---

## ✨ Features

- 📝 **Markdown-Powered Writing & Formatting**: Write rich journal entries with full Markdown support including headings, bold/italic text, lists, and quotes.
- 🎭 **Mood & Emotion Analytics**: Tag entries with 5 distinct mood states (😊 Happy, 😌 Calm, 😰 Anxious, 😔 Sad, ⚡ Energetic) and track dominant mood trends over time.
- 🔥 **Writing Streak Counter**: Automatic consecutive writing streak counter calculated dynamically based on activity.
- 📊 **Quick Statistics Dashboard**: Live overview of total entries, current writing streak, and your most frequent mood state.
- 🔍 **Real-time Search & Filtering**: Instant full-text search across titles and body contents, plus multi-level filtering by Category (*Personal*, *Work*, *Ideas*, *Reflection*) and Mood.
- 📦 **Multi-Format Data Export**:
  - **JSON**: Machine-readable full data backup.
  - **Markdown (`.md`)**: Formatted document for obsidian or note-taking apps.
  - **Plain Text (`.txt`)**: Clean text archive.
  - **PDF (`.pdf`)**: Paginated document generated client-side using `jspdf`.
  - **PowerPoint (`.pptx`)**: Custom styled presentation deck generated using `pptxgenjs`.
- 📥 **Backup Restore & File Import**: Drag-and-drop or select `.json`, `.md`, or `.txt` backup files to merge or restore your journal history.
- 🌓 **Aesthetic Dark/Light Interface**: Glassmorphism UI components powered by Radix UI, custom ambient background lighting (`AuroraBackground`), dynamic visual effects (`PetalField`), and theme persistence.
- 🔒 **100% Offline & Private**: Zero backend, zero tracking, zero external database calls. Your data never leaves your device.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework & Router** | [TanStack Start](https://tanstack.com/router) (`@tanstack/react-start`) & [TanStack Router](https://tanstack.com/router) |
| **Core UI Library** | [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/) |
| **Build System** | [Vite 8](https://vitejs.dev/) with Nitro SSR entry wrapper |
| **Styling & Design** | [Tailwind CSS v4](https://tailwindcss.com/), Radix UI Primitives, Lucide Icons (`lucide-react`) |
| **Document Generation** | [jspdf](https://github.com/parallax/jsPDF) (PDF), [pptxgenjs](https://gitbrent.github.io/PptxGenJS/) (PowerPoint) |
| **State & Notifications** | React hooks with client `localStorage` sync, [Sonner](https://sonner.emilkowal.ski/) toast notifications |
| **Runtime & Package Manager** | [Bun](https://bun.sh/) / Node.js |

---

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AdithyaBabuK/MindTrace.git
   cd MindTrace
   ```

2. **Install dependencies**:
   ```bash
   bun install
   # or
   npm install
   ```

3. **Start the development server**:
   ```bash
   bun run dev
   # or
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000` (or the port specified in terminal output).

---

## 📜 Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Launches Vite dev server with Hot Module Replacement (HMR). |
| `npm run build` | Builds production-optimized bundle via Vite and Nitro server. |
| `npm run preview` | Previews the production build locally. |
| `npm run lint` | Runs ESLint to check for code style issues and errors. |
| `npm run format` | Runs Prettier to format source files across the workspace. |

---

## 🛡️ Privacy & Local-First Philosophy

MindTrace is designed around data ownership:
- **No Remote Servers**: Your entries live exclusively on your device.
- **No Analytics / Telemetry**: No third-party tracking scripts or user profiling.
- **Full Control**: Export or delete your data at any time with a single click.

---

## 📄 License

Distributed under the MIT License. Demo project developed for CodeTech Solutions Internship.
