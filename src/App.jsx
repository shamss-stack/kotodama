import { useState } from "react";
import Landing from "./Landing";
import Login from "./Login";
import Quiz from "./Quiz";
import VerbBlitz from "./VerbBlitz";

export default function App() {
  const [page, setPage] = useState("landing");

  function navigate(dest) {
    setPage(dest);
    window.scrollTo(0, 0);
  }

  if (page === "landing") return <Landing onNavigate={navigate} />;
  if (page === "login")   return <Login onNavigate={navigate} />;
  if (page === "quiz")    return <Quiz onNavigate={navigate} />;
  if (page === "blitz")   return <VerbBlitz onNavigate={navigate} />;
  return <Landing onNavigate={navigate} />;
}
