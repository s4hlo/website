import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import NavigationBar from "./components/NavigationBar";
import Home from "./pages/Home";
import ThreeDWorld from "./pages/ThreeDWorld";
import GitHubRepos from "./pages/GitHubRepos";
import InteractiveResume from "./pages/InteractiveResume";
import ThreeDPlayground from "./pages/ThreeDPlayground";
import ThreeDCubes from "./pages/ThreeDCubes";

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
            paddingTop: "var(--navbar-height)", 
            minHeight: 'calc(100vh - var(--navbar-height))',
            width: '100%',
            backgroundColor: 'transparent'
          }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/3d-world" element={<ThreeDWorld />} />
              <Route path="/github" element={<GitHubRepos />} />
              <Route path="/resume" element={<InteractiveResume />} />
              <Route path="/3d-playground" element={<ThreeDPlayground />} />
              <Route path="/3d-cubes" element={<ThreeDCubes />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
