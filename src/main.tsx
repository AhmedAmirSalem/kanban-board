import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./theme";

const client = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={client}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StrictMode>
        <App />
      </StrictMode>
    </ThemeProvider>
  </QueryClientProvider>
);
