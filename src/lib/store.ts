// Shared localStorage-based store for prompts and registered users

export interface StoredPrompt {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  prompt: string;
  language: string;
  generatedCode: string;
  createdAt: string; // ISO string
}

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  plan: "free" | "pro";
  createdAt: string; // ISO string
}

const PROMPTS_KEY = "codegenie_prompts";
const USERS_KEY = "codegenie_users";

// ─── Prompts ────────────────────────────────────────────

export function getAllPrompts(): StoredPrompt[] {
  try {
    return JSON.parse(localStorage.getItem(PROMPTS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function getPromptsByUser(userId: string): StoredPrompt[] {
  return getAllPrompts().filter((p) => p.userId === userId);
}

export function savePrompt(prompt: StoredPrompt) {
  const all = getAllPrompts();
  all.unshift(prompt);
  localStorage.setItem(PROMPTS_KEY, JSON.stringify(all));
}

export function deletePrompt(id: string) {
  const all = getAllPrompts().filter((p) => p.id !== id);
  localStorage.setItem(PROMPTS_KEY, JSON.stringify(all));
}

// ─── Users ──────────────────────────────────────────────

export function getAllUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveUser(user: StoredUser) {
  const all = getAllUsers().filter((u) => u.email !== user.email);
  all.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(all));
}

export function deleteUser(id: string) {
  const all = getAllUsers().filter((u) => u.id !== id);
  localStorage.setItem(USERS_KEY, JSON.stringify(all));
}

export function updateUserRole(id: string, role: "user" | "admin") {
  const all = getAllUsers().map((u) => (u.id === id ? { ...u, role } : u));
  localStorage.setItem(USERS_KEY, JSON.stringify(all));
}

export function getTodayPromptCount(userId: string): number {
  const today = new Date().toDateString();
  return getAllPrompts().filter(
    (p) => p.userId === userId && new Date(p.createdAt).toDateString() === today
  ).length;
}

// ─── Dummy Data Initialization ──────────────────────────

/**
 * Initialize admin dashboard with sample data (3 users + multiple prompts)
 * Call this once to populate the dashboard for demonstration purposes
 */
export function initializeDummyData() {
  // Check if data already exists
  if (getAllUsers().length > 0 || getAllPrompts().length > 0) {
    console.log("Data already exists, skipping initialization");
    return;
  }

  // Sample Users
  const sampleUsers: StoredUser[] = [
    {
      id: "user-1",
      name: "Alice Johnson",
      email: "alice@example.com",
      role: "user",
      plan: "pro",
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
    },
    {
      id: "user-2",
      name: "Bob Smith",
      email: "bob@example.com",
      role: "user",
      plan: "free",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    },
    {
      id: "user-3",
      name: "Carol Martinez",
      email: "carol@example.com",
      role: "admin",
      plan: "pro",
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
    },
  ];

  // Sample Prompts - variety of languages and dates for chart diversity
  const samplePrompts: StoredPrompt[] = [
    // JavaScript prompts
    {
      id: "prompt-1",
      userId: "user-1",
      userEmail: "alice@example.com",
      userName: "Alice Johnson",
      prompt: "Create a React component for a todo list with add, delete, and mark complete features",
      language: "JavaScript",
      generatedCode: "import React, { useState } from 'react';\n\nfunction TodoList() {\n  const [todos, setTodos] = useState([]);\n  const [input, setInput] = useState('');\n\n  const addTodo = () => {\n    if (input.trim()) {\n      setTodos([...todos, { id: Date.now(), text: input, completed: false }]);\n      setInput('');\n    }\n  };\n\n  const toggleComplete = (id) => {\n    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));\n  };\n\n  const deleteTodo = (id) => {\n    setTodos(todos.filter(t => t.id !== id));\n  };\n\n  return (\n    <div className='p-4'>\n      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder='Add a task' />\n      <button onClick={addTodo}>Add</button>\n      <ul>{todos.map(t => (<li key={t.id}><input type='checkbox' onClick={() => toggleComplete(t.id)} /> {t.text} <button onClick={() => deleteTodo(t.id)}>Delete</button></li>))}</ul>\n    </div>\n  );\n}\n\nexport default TodoList;",
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
    },
    {
      id: "prompt-2",
      userId: "user-1",
      userEmail: "alice@example.com",
      userName: "Alice Johnson",
      prompt: "Implement debounce function to optimize performance",
      language: "JavaScript",
      generatedCode: "function debounce(func, delay) {\n  let timeoutId;\n  return function(...args) {\n    clearTimeout(timeoutId);\n    timeoutId = setTimeout(() => func(...args), delay);\n  };\n}\n\nconst debouncedSearch = debounce((query) => {\n  console.log('Searching for:', query);\n}, 300);\n\ndebouncedSearch('test');\ndebouncedSearch('testing');",
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
    },
    {
      id: "prompt-3",
      userId: "user-2",
      userEmail: "bob@example.com",
      userName: "Bob Smith",
      prompt: "Create a simple API endpoint for user authentication",
      language: "JavaScript",
      generatedCode: "const express = require('express');\nconst app = express();\n\napp.post('/auth/login', (req, res) => {\n  const { email, password } = req.body;\n  // Validate credentials\n  if (email === 'user@example.com' && password === 'password123') {\n    res.json({ token: 'jwt_token_here', user: { email } });\n  } else {\n    res.status(401).json({ error: 'Invalid credentials' });\n  }\n});\n\napp.listen(3000, () => console.log('Server running on port 3000'));",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    },
    // Python prompts
    {
      id: "prompt-4",
      userId: "user-1",
      userEmail: "alice@example.com",
      userName: "Alice Johnson",
      prompt: "Build a data processing pipeline that reads CSV and calculates statistics",
      language: "Python",
      generatedCode: "import pandas as pd\nimport numpy as np\n\ndef process_data(csv_file):\n    df = pd.read_csv(csv_file)\n    stats = {\n        'mean': df.mean(),\n        'median': df.median(),\n        'std': df.std(),\n        'min': df.min(),\n        'max': df.max()\n    }\n    return stats\n\nif __name__ == '__main__':\n    stats = process_data('data.csv')\n    print(stats)",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    },
    {
      id: "prompt-5",
      userId: "user-3",
      userEmail: "carol@example.com",
      userName: "Carol Martinez",
      prompt: "Create a Django model for a blog post with comments and tags",
      language: "Python",
      generatedCode: "from django.db import models\n\nclass BlogPost(models.Model):\n    title = models.CharField(max_length=200)\n    content = models.TextField()\n    author = models.CharField(max_length=100)\n    created_at = models.DateTimeField(auto_now_add=True)\n    tags = models.ManyToManyField('Tag')\n\nclass Comment(models.Model):\n    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE)\n    content = models.TextField()\n    author = models.CharField(max_length=100)\n    created_at = models.DateTimeField(auto_now_add=True)\n\nclass Tag(models.Model):\n    name = models.CharField(max_length=50)",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    },
    // Java prompts
    {
      id: "prompt-6",
      userId: "user-2",
      userEmail: "bob@example.com",
      userName: "Bob Smith",
      prompt: "Implement a thread-safe singleton pattern",
      language: "Java",
      generatedCode: "public class Singleton {\n    private static Singleton instance;\n    private Singleton() {}\n    \n    public static synchronized Singleton getInstance() {\n        if (instance == null) {\n            instance = new Singleton();\n        }\n        return instance;\n    }\n}\n\n// Or using eager initialization\npublic class SingletonEager {\n    private static final Singleton instance = new Singleton();\n    private Singleton() {}\n    \n    public static Singleton getInstance() {\n        return instance;\n    }\n}",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    },
    {
      id: "prompt-7",
      userId: "user-3",
      userEmail: "carol@example.com",
      userName: "Carol Martinez",
      prompt: "Build a generic linked list implementation with insertion and deletion",
      language: "Java",
      generatedCode: "public class LinkedList<T> {\n    private Node<T> head;\n    \n    private static class Node<T> {\n        T data;\n        Node<T> next;\n        Node(T data) { this.data = data; }\n    }\n    \n    public void insert(T data) {\n        if (head == null) {\n            head = new Node<>(data);\n        } else {\n            Node<T> current = head;\n            while (current.next != null) {\n                current = current.next;\n            }\n            current.next = new Node<>(data);\n        }\n    }\n    \n    public void delete(T data) {\n        if (head != null && head.data.equals(data)) {\n            head = head.next;\n        } else if (head != null) {\n            Node<T> current = head;\n            while (current.next != null && !current.next.data.equals(data)) {\n                current = current.next;\n            }\n            if (current.next != null) {\n                current.next = current.next.next;\n            }\n        }\n    }\n}",
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    },
    // C++ prompts
    {
      id: "prompt-8",
      userId: "user-1",
      userEmail: "alice@example.com",
      userName: "Alice Johnson",
      prompt: "Implement a binary search tree with traversal methods",
      language: "C++",
      generatedCode: "#include <iostream>\nusing namespace std;\n\nstruct Node {\n    int data;\n    Node* left;\n    Node* right;\n};\n\nclass BST {\npublic:\n    Node* root = nullptr;\n    \n    void insert(int data) {\n        root = insertNode(root, data);\n    }\n    \n    void inorder(Node* node) {\n        if (node == nullptr) return;\n        inorder(node->left);\n        cout << node->data << \" \";\n        inorder(node->right);\n    }\n    \nprivate:\n    Node* insertNode(Node* node, int data) {\n        if (node == nullptr) {\n            node = new Node();\n            node->data = data;\n            node->left = node->right = nullptr;\n        } else if (data < node->data) {\n            node->left = insertNode(node->left, data);\n        } else {\n            node->right = insertNode(node->right, data);\n        }\n        return node;\n    }\n};",
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
    },
    // C# prompts
    {
      id: "prompt-9",
      userId: "user-2",
      userEmail: "bob@example.com",
      userName: "Bob Smith",
      prompt: "Create a dependency injection container for .NET",
      language: "C#",
      generatedCode: "public interface IServiceProvider {\n    T GetService<T>();\n}\n\npublic class DIContainer : IServiceProvider {\n    private Dictionary<Type, object> _services = new();\n    \n    public void Register<T>(T service) where T : class {\n        _services[typeof(T)] = service;\n    }\n    \n    public T GetService<T>() where T : class {\n        if (_services.TryGetValue(typeof(T), out var service)) {\n            return (T)service;\n        }\n        throw new Exception($\"Service {typeof(T).Name} not registered\");\n    }\n}",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    },
    // Go prompts
    {
      id: "prompt-10",
      userId: "user-3",
      userEmail: "carol@example.com",
      userName: "Carol Martinez",
      prompt: "Implement concurrent worker pool pattern in Go",
      language: "Go",
      generatedCode: "package main\n\nimport (\n    \"fmt\"\n    \"sync\"\n)\n\ntype Job struct {\n    ID int\n}\n\nfunc worker(id int, jobs <-chan Job, wg *sync.WaitGroup) {\n    defer wg.Done()\n    for job := range jobs {\n        fmt.Printf(\"Worker %d processing job %d\\n\", id, job.ID)\n    }\n}\n\nfunc main() {\n    jobs := make(chan Job, 100)\n    var wg sync.WaitGroup\n    \n    for w := 1; w <= 3; w++ {\n        wg.Add(1)\n        go worker(w, jobs, &wg)\n    }\n    \n    for j := 1; j <= 10; j++ {\n        jobs <- Job{j}\n    }\n    close(jobs)\n    wg.Wait()\n}",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    },
    // Additional JAVASCRIPT prompts for better distribution
    {
      id: "prompt-11",
      userId: "user-1",
      userEmail: "alice@example.com",
      userName: "Alice Johnson",
      prompt: "Build a button UI component with multiple states and hover effects",
      language: "JavaScript",
      generatedCode: "function Button({ text, onClick, variant = 'primary', disabled = false }) {\n  const styles = {\n    primary: 'bg-blue-500 hover:bg-blue-600 text-white',\n    secondary: 'bg-gray-500 hover:bg-gray-600 text-white',\n    danger: 'bg-red-500 hover:bg-red-600 text-white'\n  };\n  \n  return (\n    <button \n      onClick={onClick} \n      disabled={disabled}\n      className={`px-4 py-2 rounded ${styles[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}\n    >\n      {text}\n    </button>\n  );\n}\n\nexport default Button;",
      createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), // 9 days ago
    },
  ];

  // Save all sample data
  sampleUsers.forEach(saveUser);
  samplePrompts.forEach(savePrompt);

  console.log("✅ Dummy data initialized:", {
    users: sampleUsers.length,
    prompts: samplePrompts.length,
  });
}
