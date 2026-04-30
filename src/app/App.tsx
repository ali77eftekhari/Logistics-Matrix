import { ThemeProvider } from "next-themes";

import { Dashboard } from "./Dashboard";

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Dashboard />
    </ThemeProvider>
  );
}
