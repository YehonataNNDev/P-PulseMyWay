import { useEffect, useState } from "react";
import Logo from "../assets/Logo.png";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";

function Login() {
  const [userEmail, setEmail] = useState();
  const [userPassword, setPassword] = useState();
  const [showAlert, setShowAlert] = useState();

  const cookies = new Cookies();
  useEffect(() => {
    if(cookies.get('tkn') !== undefined) {
        
      if (jwtDecode(cookies.get("tkn")).isAdmin == "true") {
        window.location.href = '/users';
      } else {
        window.location.href = `/users/${jwtDecode(cookies.get("tkn")).id}`;
      }
    }
  }, [])

  function LogIN() {
    fetch("https://galmyway.xyz/api/checkLoginUser", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: userEmail, password: userPassword }),
    })
      .then((response) => response.json())
      .then((returnedCB) => {
        if (JSON.parse(returnedCB).status !== false) {
          
          cookies.set("tkn", JSON.parse(returnedCB).token, {
            path: "/",
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          });
          setShowAlert(false);
          if (JSON.parse(returnedCB).admin === "true") {
            window.location.href = "/users";
          } else {
            window.location.href = `/users/${JSON.parse(returnedCB).id}`;
          }
          return
        } else {
          setShowAlert(true);
          cookies.remove("tkn");
        }
      });
  }
  return (
    <div className="LoginPage">
      <div className="LoginCard">
        <div className="LoginLogo">
          <img src={Logo}></img>
        </div>
        <div className="LoginText">
          <h1>התחברות</h1>
        </div>
        <div className="LoginInputs">
          <TextField
            sx={{
              "& label": {
                left: "unset",
                right: "1.75rem",
                transformOrigin: "right",
              },
              "& legend": { textAlign: "right" },
            }}
            value={userEmail}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            required
            type="email"
            style={{ width: "80%", direction: "rtl" }}
            label="אימייל"
            variant="outlined"
          />
          <TextField
            sx={{
              "& label": {
                left: "unset",
                right: "1.75rem",
                transformOrigin: "right",
              },
              "& legend": { textAlign: "right" },
            }}
            value={userPassword}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
            type="password"
            style={{ width: "80%", direction: "rtl" }}
            label="סיסמה"
            variant="outlined"
          />
        </div>
        {showAlert == true ? (
          <p style={{ margin: 0, color: "red" }}>!אימייל או סיסמה לא נכונים</p>
        ) : (
          ""
        )}
        <Button
          variant="contained"
          onClick={() => {
            LogIN();
          }}
        >
          התחבר
        </Button>
      </div>
    </div>
  );
}

export default Login;
