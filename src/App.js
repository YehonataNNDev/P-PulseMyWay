import logo from './logo.svg';
import './App.css';
import { createTheme , ThemeProvider } from '@mui/material/styles';


import Navbar from './Pages/Navbar';
import Workers from './Pages/Workers';
import Login from './Pages/Login';
import User from './Pages/User';
import CheckVerify from './Pages/CheckVerify';
import CheckLogged from './Pages/CheckLogged';


import { BrowserRouter, Routes, Route , Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs"
function App() {
console.log(process.env.REACT_APP_TARGET_URL);
  const theme = createTheme({
    palette: {
      primary: {
        light: '#757ce8',
        main: '#B4CDD8',
        dark: '#79afc7',
        contrastText: '#2B2C2A',
      },
      secondary: {
        light: '#ff7961',
        main: '#f44336',
        dark: '#ba000d',
        contrastText: '#000',
      },
    },

    typography: {
      fontFamily: 'Heebo'
    }
  })
  return (
    <ThemeProvider theme={theme}>
        <div className='WebContainer'>
          <LocalizationProvider dateAdapter={AdapterDayjs}>


          {/* <button onClick={() => {check()}}></button> */}
            {/* <Navbar/> */}
              <BrowserRouter>
                <Routes>
                    <Route path="/" element={<CheckLogged />} />
                    <Route path="/login" element={<Login />} />
                    <Route element={<><Navbar /><Outlet /></>}>
                      <Route element={<CheckVerify admin={true}/>}>
                        <Route path="/users" element={<Workers/>}/>
                      </Route>

                      <Route element={<CheckVerify admin={false}/>}>
                        <Route path="users">
                          <Route path=":userId" element={<User />} />
                        </Route>
                      </Route>

                   
                   
                    </Route>
                </Routes>
              </BrowserRouter>
              </LocalizationProvider>

        </div>
    </ThemeProvider>

  );
}

export default App;
