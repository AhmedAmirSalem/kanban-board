import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  shape: { borderRadius: 12 },
  palette: { mode: "light" },
  components: {
    MuiPaper: { styleOverrides: { root: { boxShadow: "0 1px 3px rgba(0,0,0,.06)" } } },
    MuiCard:  { styleOverrides: { root: { boxShadow: "0 1px 3px rgba(0,0,0,.08)" } } },
    MuiDivider: { styleOverrides: { root: { opacity: .6 } } },
  },
});
