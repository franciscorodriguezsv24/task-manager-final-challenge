# 📌 Task Manager App

Welcome to the **Task Manager Project**.  
The Task Manager is a productivity tool designed to support both individual users and teams in organizing their work efficiently.

This application provides core functionalities such as **creating, editing, and managing tasks**, enabling users to track their own progress as well as collaborate seamlessly with their teams. Its purpose is to improve task management, visibility, and overall workflow productivity.

## ⚙️ Installation & Setup

If you don't have Pnpm on your pc please follow this link

[Install pnpm](https://formulae.brew.sh/formula/pnpm)

```bash
# Clone the repository
git clone https://github.com/your-user/task-manager.git

# Navigate into the project
cd task-manager-final-challenge

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

---

## ✨ Features

- 🔹 List of columns and task fetched with Apolo
- 🔹 Drag & Drop with [dnd-kit](https://dndkit.com/)
- 🔹 Update state between columns using optimistic method to better UX
- 🔹 Global State using Zustand
- 🔹 styles with SCSS Modules
- 🔹 Optimization of queries with Apollo Client
- 🔹 Responsive desing adaptable to different views
- 🔹 Filters and debounce search

---

## 📂 Project Structure

```

┣ components/ # Reusable UI components
┣ hooks/ # Custom React hooks
┣ store/ # State management
┣ pages/ # Main views / screens
┣ styles/ # Global and module styles
┗ api/ # Queries, mutations and types

```

## ⚒️ Tecnologies Used

- Generic libraries
  - Eslintt
  - Prettier
  - Zod
  - React-hook-form
  - Husky

- Style libraries
  - React Aria
  - HeadlessUI
  - Scss Module

- Api management
  - Graphql
  - apolo

## 👷 Design Structure

# State Management Facade

I decide to use this pattern to manage some part of the logic inside of the state management, in this case i'm using zustand to manage the logic of filters, input search and fetch the data of the current card to make an edit or update.

# Slot

I take this pattern to make a main slot element where the page component is the unique element that will change but the elements that compound the slot (layout) is the sidebar and searchbar.

# Compound component

I taked this pattern to create 2 elements especific, the modal component and card component, and I decide to use this one to make more reusable these components, because simple I can decide what parts of the card I would like to use in specific part od the entire application

# Props Drilling

I use this pattern to make it simple the way to pass some atributes to child components of the tree.

# images
