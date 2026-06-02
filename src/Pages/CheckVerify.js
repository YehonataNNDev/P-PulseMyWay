import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";
import CircularProgress from "@mui/material/CircularProgress";
function CheckVerify({ admin }) {
  const [verified, setVerified] = useState(null);
  const [checked, setChecked] = useState(false);
  const cookies = new Cookies();

  const check = async () => {
    try {
      const response = await fetch("https://galmyway.xyz/api/checkJWT", {
        mode: "cors",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin: admin, token: cookies.get("tkn") }),
      });
      const result = await response.json();
      setVerified(result.status);
      setChecked(true);
    } catch (error) {
      setChecked(false);
    }
  };

  useEffect(() => {
    check();
  }, []);

  if (!checked) {
    return <div style={{height: '90%' , width: '100%' , display: 'flex' , justifyContent: 'center' , alignItems: 'center'}}><CircularProgress /></div>;
  }

  return verified ? <Outlet /> : <Navigate to="/login" replace={true} />;
}

export default CheckVerify;
