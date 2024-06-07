import React from "react";
import { useSupabaseAuth, SupabaseAuthUI } from "./integrations/supabase/auth.jsx";
import { Button } from "@/components/ui/button";

function App() {
  const { session, logout } = useSupabaseAuth();

  return (
    <div>
      <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <h1 className="text-xl">My App</h1>
        {session ? (
          <Button variant="outline" onClick={logout}>Logout</Button>
        ) : (
          <Button variant="outline" asChild>
            <a href="/login">Login</a>
          </Button>
        )}
      </nav>
      <main className="p-4">
        {session ? (
          <div>
            <h2>Welcome, {session.user.email}</h2>
            <p>This is your dashboard.</p>
          </div>
        ) : (
          <div>
            <h2>Welcome to My App</h2>
            <p>Please log in to access your dashboard.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;