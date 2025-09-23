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
<img width="346" height="715" alt="Screenshot 2025-09-22 at 5 51 08 PM" src="https://github.com/user-attachments/assets/1afc59a2-b0f3-4710-9315-3cd3e6721064" />
<img width="346" height="715" alt="Screenshot 2025-09-22 at 5 51 31 PM" src="https://github.com/user-attachments/assets/c4222d22-2b0c-4084-887b-7f85efa0ac73" />
<img width="346" height="715" alt="Screenshot 2025-09-22 at 5 51 57 PM" src="https://github.com/user-attachments/assets/7b28b5f1-4695-4a11-86a6-cf01540d192b" />
<img width="346" height="715" alt="Screenshot 2025-09-22 at 5 53 13 PM" src="https://github.com/user-attachments/assets/7847311e-dc6b-4754-aa75-8544805fb08c" />
<img width="346" height="715" alt="Screenshot 2025-09-22 at 5 52 49 PM" src="https://github.com/user-attachments/assets/ad721544-b8f1-4003-ae53-0c8109f5f6a3" />
<img width="364" height="718" alt="Screenshot 2025-09-22 at 5 56 31 PM" src="https://github.com/user-attachments/assets/eaa89b26-f6de-4e27-a547-f28ebdca4072" />

# video
https://github.com/user-attachments/assets/d7c5d44c-fe34-4f33-ae01-8af63b21acf6




