import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./components/Login";
import { PrivateRoute } from "./components/PrivateRoute";
import { Signup } from "./components/Signup";
import { Profile } from "./components/Profile";
import { MembersList } from "./components/MembersList";
import { MemberForm } from "./components/MemberForm";
import { Bienvenida } from "./components/Bienvenida";
import { Tasks } from "./components/Tasks";
import { CreateTask } from "./components/CreateTask";
import { ProjectList } from "./components/ProjectList";
import { CreateProject } from "./components/CreateProject";

export default function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Routes>
      <Route
          path="/"
          element={<Bienvenida />} 
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        <Route path="/members/" element={<MembersList />} />
        <Route path="/members/new" element={<MemberForm />} />
        <Route path="/members/edit/:id" element={<MemberForm />} />
        <Route path="/members/edit/:id" element={<MemberForm />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/create-task" element={<CreateTask />} />
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/create-project" element={<CreateProject />} />

      </Routes>
    </Router>
  );
}

