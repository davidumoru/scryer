"use client";

import { useState } from "react";
import { Login } from "../../components/login";
import { Signup } from "../../components/signup";

export default function Home() {
  const [showLogin, setShowLogin] = useState(true);

  const handleToggleForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <main className="flex min-h-screen flex-col justify-between lg:p-24 lg:items-center">
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px]"></div>
      <div className="max-w-md mx-auto p-6">
        {showLogin ? <Login /> : <Signup />}
      </div>  
      <button className="p-16" onClick={handleToggleForm}>
          {showLogin ? "Switch to Signup" : "Switch to Login"}
        </button>
    </main>
  );
}
