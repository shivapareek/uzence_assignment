<div align="center">

# 🎨 React Components Library

### **Professional UI Components Built with Modern Stack**

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3+-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Storybook](https://img.shields.io/badge/Storybook-8.0+-FF4785?style=for-the-badge&logo=storybook&logoColor=white)

**[📚 View Storybook](https://your-storybook-url.chromatic.com)** • **[🚀 Live Demo](https://your-demo-url.vercel.app)**

</div>

---

## 🌟 **Project Overview**

This project showcases **two production-ready React components** built with modern development practices, comprehensive testing, and detailed documentation. Perfect for demonstrating component-driven development skills and scalable architecture.

### **🎯 Key Highlights**

- ✨ **Modern React Patterns** - Hooks, TypeScript, functional components
- 🎨 **Pixel-Perfect Design** - TailwindCSS with responsive layouts
- ♿ **Accessibility First** - WCAG compliant with ARIA support
- 📚 **Comprehensive Docs** - Interactive Storybook documentation
- 🧪 **Tested & Reliable** - Jest + React Testing Library
- 🔧 **Developer Experience** - Hot reload, TypeScript intellisense

---

## 🎪 **Components Showcase**

<div align="center">

### **InputField Component**
*Flexible input with validation states & interactive features*

![InputField Demo](https://via.placeholder.com/600x300/3B82F6/FFFFFF?text=InputField+Component+Demo)

### **DataTable Component**  
*Feature-rich table with sorting, selection & loading states*

![DataTable Demo](https://via.placeholder.com/600x350/10B981/FFFFFF?text=DataTable+Component+Demo)

</div>

---

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Git

### **Installation**

```bash
# 1️⃣ Clone the repository
git clone https://github.com/yourusername/react-components-project.git
cd react-components-project

# 2️⃣ Install dependencies
npm install

# 3️⃣ Start Storybook (recommended)
npm run storybook
# Opens http://localhost:6006

# 🎯 Alternative: Run live demo
npm run dev
# Opens http://localhost:5173
```

### **Available Scripts**

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run storybook` | Launch Storybook documentation |


---

## 🏗️ **Project Architecture**

```
react-components-project/
├── 📁 src/
│   ├── 📁 components/
│   │   │   ├── 📄 InputField.tsx          # Main component
│   │   │   ├── 📚 InputField.stories.tsx  # Storybook stories
│   │   │   ├── 📄 DataTable.tsx
│   │   │   ├── 📚 DataTable.stories.tsx
│   ├── 📄 App.tsx                         # Demo application
│   └── 📄 main.tsx                        # Entry point
├── 📁 .storybook/                         # Storybook configuration
├── 📁 public/                             # Static assets
├── ⚙️ package.json                        # Dependencies & scripts
├── ⚙️ vite.config.ts                      # Vite configuration
└── 📖 README.md                           # This file
```

---

## 🎨 **Component Documentation**

### **🔧 InputField Component**

A highly flexible input component with multiple variants, states, and built-in validation.

#### **Features**
- 🎭 **3 Variants**: `outlined`, `filled`, `ghost`
- 📏 **3 Sizes**: `sm`, `md`, `lg` 
- 🚦 **States**: `disabled`, `loading`, `invalid`
- 🔐 **Password Toggle**: Show/hide password functionality
- 🧹 **Clear Button**: Optional clear input feature
- ♿ **Accessible**: Full ARIA support and keyboard navigation

#### **Props Interface**

```typescript
interface InputFieldProps {
  value?: string;
  onChange?: (e: React.ChangeEvent) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  disabled?: boolean;
  invalid?: boolean;
  loading?: boolean;
  variant?: 'filled' | 'outlined' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  type?: 'text' | 'password' | 'email';
  clearable?: boolean;
  onClear?: () => void;
}
```

#### **Usage Examples**

```tsx
// Basic input


// With validation


// Different variants



```

### **📊 DataTable Component**

A powerful data table with sorting, selection, and customizable rendering capabilities.

#### **Features**
- 🔄 **Column Sorting**: Click headers to sort ascending/descending
- ☑️ **Row Selection**: Single or multiple row selection
- 🔄 **Loading States**: Built-in loading and empty state handling
- 🎨 **Custom Rendering**: Flexible cell content rendering
- 📱 **Responsive**: Works seamlessly across all device sizes
- ♿ **Accessible**: Screen reader friendly with proper ARIA labels

#### **Props Interface**

```typescript
interface DataTableProps {
  data: T[];
  columns: Column[];
  loading?: boolean;
  selectable?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
  rowKey?: keyof T | ((record: T) => string | number);
  emptyStateText?: string;
  className?: string;
}

interface Column {
  key: string;
  title: string;
  dataIndex: keyof T;
  sortable?: boolean;
  width?: string;
  render?: (value: T[keyof T], record: T, index: number) => React.ReactNode;
}
```

#### **Usage Examples**

```tsx
// Basic table


// With selection and custom rendering
<DataTable
  data={products}
  columns={[
    {
      key: 'price',
      title: 'Price',
      dataIndex: 'price',
      sortable: true,
      render: (value) => `$${value.toFixed(2)}`
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      render: (status) => (
        <span className={`badge ${status === 'active' ? 'green' : 'red'}`}>
          {status}
        
      )
    }
  ]}
  selectable
  onRowSelect={(rows) => console.log('Selected:', rows)}
/>
```

## 🚀 **Deployment**

### **Build for Production**
```bash
npm run build
```

### **Contributing**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-component`)
3. Follow the component checklist above
4. Commit changes (`git commit -m 'Add amazing component'`)
5. Push to branch (`git push origin feature/amazing-component`)
6. Open a Pull Request

## 🤝 **Acknowledgments**

- **React Team** - For the amazing framework
- **Tailwind Labs** - For the utility-first CSS framework  
- **Storybook Team** - For the incredible documentation platform
- **Testing Library** - For user-centric testing approach

---

## 📞 **Support & Contact**

- 📧 **Email**: your.email@example.com
- 💼 **LinkedIn**: [Your LinkedIn Profile](https://linkedin.com/in/yourprofile)
- 🐙 **GitHub**: [Your GitHub Profile](https://github.com/yourusername)
- 🌐 **Portfolio**: [Your Portfolio Website](https://yourwebsite.com)

---

<div align="center">

### **⭐ If you found this project helpful, please give it a star!**

**Made with ❤️ for the React community**

![Visitor Count](https://visitor-badge.laobi.icu/badge?page_id=yourusername.react-components-project)

</div>
