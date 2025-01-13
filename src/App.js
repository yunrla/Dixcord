import Display from './Components/Display/Display';
import { createContext, useState } from 'react';
import { GlobalStyle } from './util/global';
import { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from './util/theme';

export const MyContext = createContext();


function App() {

  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    setTheme(() => {
      return theme === "dark" ? "light" : "dark";
    });
  };


  return (
    <div>
    <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
      <GlobalStyle />
      <Display getTheme={theme} theme={toggleTheme}/>
    </ThemeProvider>
    </div>
  );
}

export default App;
