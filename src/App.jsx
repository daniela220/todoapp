import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NewTodoForm } from "./components/NewTodoForm";
import { TodoList } from "./components/TodoList";
import { Login2 } from "./components/Login2";
import { PrivateRoute } from "./components/PrivateRoute";
import { Signup } from "./components/Signup";
import { Profile } from "./components/Profile";
import { MembersList } from "./components/MembersList";
import { MemberForm } from "./components/MemberForm";
import "./App.css";

export default function App() {
  const [todos, setTodos] = useState(() => {
    const localValue = localStorage.getItem("ITEMS");
    if (localValue == null) return [];
    return JSON.parse(localValue);
  });

  useEffect(() => {
    localStorage.setItem("ITEMS", JSON.stringify(todos));
  }, [todos]);

  function addTodo(title) {
    setTodos(currentTodos => [
      ...currentTodos,
      { id: crypto.randomUUID(), title, completed: false },
    ]);
  }

  function toggleTodo(id, completed) {
    setTodos(currentTodos =>
      currentTodos.map(todo => (todo.id === id ? { ...todo, completed } : todo))
    );
  }

  function deleteTodo(id) {
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <h1 className="titulo">Bienvenido</h1>
              <NewTodoForm onSubmit={addTodo} />
              <h2 className="header">Lista de Tareas</h2>
              <TodoList
                todos={todos}
                toggleTodo={toggleTodo}
                deleteTodo={deleteTodo}
              />
            </>
          }
        />
        <Route path="/login" element={<Login2 />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        <Route path="/members" element={<MembersList />} />
        <Route path="/members/new" element={<MemberForm />} />
        <Route path="/members/edit/:id" element={<MemberForm />} />
      </Routes>
    </Router>
  );
}

