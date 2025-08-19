import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import NavigationBar from "./components/NavigationBar";
import Home from "./pages/Home";
import Page1 from "./pages/Page1";
import Page2 from "./pages/Page2";

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: "#60a5fa",
    },
    secondary: {
      main: "#22d3ee",
    },
    background: {
      default: "#0f0f0f",
      paper: "#1a1a1a",
    },
    text: {
      primary: "#ffffff",
      secondary: "#a0a0a0",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App" style={{ minHeight: '100vh' }}>
          <NavigationBar />
          <main style={{ 
            paddingTop: "80px", 
            minHeight: 'calc(100vh - 80px)',
            width: '100%',
            backgroundColor: 'transparent'
          }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/page1" element={<Page1 />} />
              <Route path="/page2" element={<Page2 />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
