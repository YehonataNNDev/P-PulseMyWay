import GroupIcon from "@mui/icons-material/Group";
import HomeIcon from "@mui/icons-material/Home";
import Logout from "@mui/icons-material/Logout";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

import Cookies from "universal-cookie";

function Navbar() {
  const cookies = new Cookies();
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    if(cookies.get("tkn") == undefined) {
        window.location.href = "/login";
      } else {
        if (jwtDecode(cookies.get("tkn")).isAdmin == "true") {
            setAdmin(true);
        }
    }
  }, []);
  return (
    <div className="PageNavbar" style={{ position: "relative" }}>
      {/* {admin == true ? (
        <a>
          <HomeIcon />
        </a>
      ) : (
        ""
      )} */}
      {admin == true ? (
        <a
          onClick={() => {
            window.location.href = "/users";
          }}
        >
          <GroupIcon />
        </a>
      ) : (
        ""
      )}
      <a
        onClick={() => {
          cookies.remove('tkn', { path: '/' });
          window.location.href = "/login";
        }}
      >
        <Logout />
      </a>
    </div>
  );
}

export default Navbar;
