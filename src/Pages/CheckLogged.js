import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";


function CheckLogged() {
    const cookies = new Cookies();
    useEffect(() => {
        if(cookies.get('tkn') !== undefined) {
            
            if (jwtDecode(cookies.get("tkn")).isAdmin == "true") {
                window.location.href = '/users';
            } else {
                window.location.href = `/users/${jwtDecode(cookies.get("tkn")).id}`;
            }
        } else {
            window.location.href = '/login';
        }
    } , [])
}

export default CheckLogged