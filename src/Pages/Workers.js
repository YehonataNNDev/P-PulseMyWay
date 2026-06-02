import { useEffect, useState } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";


import { Select , MenuItem  , RadioGroup , Radio , FormControl , InputLabel } from "@mui/material";
import Cookies from "universal-cookie";


function Workers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setfilteredUsers] = useState([]);

  const [showUser, setShowUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState([]);
  const [searchField, setsearchField] = useState('');

  
  // Add user inputs
  const [addUserModal, setAddUser] = useState(false);
  const [fullName, setFullName] = useState();
  const [userEmai, setUserEmail] = useState();
  const [weight, setWeight] = useState();
  const [bodyFat, setBodyFat] = useState();
  const [muscleAmount, setmuscleAmount] = useState();
  const [chronologicAge, setchronologicAge] = useState();
  const [activityLevel, setActityLevel] = useState();
  const [userGender, setuserGender] = useState('male');
  const [UserAge, setUserAge] = useState();
  const [userHeight, setuserHeight] = useState();

  
  
  const cookies = new Cookies();
  useEffect(() => {
    fetch(`https://galmyway.xyz/api/users`, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: cookies.get("tkn") }),
    })
      .then((res) => res.json())
      .then((returned) => {
        if (returned.status == true) {
          setUsers(JSON.parse(returned.data));
          setfilteredUsers(JSON.parse(returned.data))
        } else {
          window.location.href = "/login";
        }
      })
      .catch((rejected) => {
        console.log(rejected);
      });
  }, []);
  function ViewUser(e) {
    window.location.href = `/users/${e.id}`;
    setSelectedUser(e);
    setShowUser(true);
  }

  useEffect(() => {
    setfilteredUsers(users.filter((e) => e.userName.includes(searchField)))
  } , [searchField])

  const styles = {
    formControl: {
      width: '80%',
      textAlign: 'right',
      direction: 'rtl',
    },
    inputLabel: {
      textAlign: 'right',
      direction: 'rtl',
      left: 'unset', // Ensure left is unset
      transform: 'none', // Ensure the label doesn't have a transform
    },
  };
  
  function addUser() {
    if (
      weight == undefined ||
      bodyFat == undefined ||
      muscleAmount == undefined ||
      chronologicAge == undefined ||
      fullName == undefined ||
      userEmai == undefined || 
      userHeight == undefined ||
      activityLevel == undefined ||
      UserAge == undefined
    ) {
      return;
    } else {
      fetch(`https://galmyway.xyz/api/users/addUser`, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: new Date().toLocaleString("en-GB"),
          muscle: muscleAmount,
          bFat: bodyFat,
          chronologicAge: chronologicAge,
          weight: weight,
          name: fullName,
          activity: activityLevel,
          email: userEmai,
          gender: userGender,
          height: userHeight,
          age: UserAge,

        }),
      })
        .then((res) => res.json())
        .then((returned) => {
          if (returned == true) {
            setAddUser(false);
            window.location.reload();
            setWeight();
            setBodyFat();
            setmuscleAmount();
            setchronologicAge();
            setUserEmail();
            setFullName();
            setActityLevel();
            setuserGender('male')
          }
        });
    }
  }

  function CheckDays(inputDateTime) {
    const [dateString, timeString] = inputDateTime.split(", ");
    const [day, month, year] = dateString.split("/");
    const [hours, minutes, seconds] = timeString.split(":");
    const inputDate = new Date(year, month - 1, day, hours, minutes, seconds);
    const timeDifference = new Date() - inputDate;
  
    if (isNaN(timeDifference)) {
      return "Invalid date format";
    }
  
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hoursDiff = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutesDiff = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
  
    if (days > 0) {
      return `לפני ${days} ימים`;
    } else if (hoursDiff > 0) {
      return `לפני ${hoursDiff} שעות`;
    } else {
      return `לפני ${minutesDiff} דקות`;
    }
  }
  return (
    <div className="WorkersTable">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "92%",
          }}
        >
          <h1
            className="myWorkersH1"
            style={{ textAlign: "center", marginTop: "1vh" }}
          >
            המתאמנים שלי
          </h1>
          <Button
            variant="contained"
            style={{ textAlign: "center" }}
            onClick={() => {
              setAddUser(true);
            }}
          >
            הוספת מתאמן
          </Button>
        </div>
        <div className="Search" style={{width: '100%' , display: 'flex' , justifyContent: 'center' , alignItems: 'center', marginTop: '1vh', marginBottom: '1vh'}}>
            <TextField
              sx={{
                "& label": {
                  left: "unset",
                  right: "1.75rem",
                  transformOrigin: "right",
                },
                "& legend": { textAlign: "right" },
              }}
              value={searchField}

              onChange={(e) => {
                setsearchField(e.target.value);
              }}
              size="small"
              type="search"

              style={{ width: "95%", direction: "rtl"}}
              label="חיפוש"
              variant="outlined"
            />
        </div>

        <TableContainer component={Paper}>
          <Table aria-label="simple table" style={{ direction: "rtl" }}>
            <TableHead>
              <TableRow>
                <TableCell align="center">#</TableCell>
                <TableCell align="center">שם</TableCell>
                <TableCell align="center">נערך לאחרונה</TableCell>
                <TableCell align="center">סטטוס</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(0)
                .reverse()
                .map((e) => {
                  return (
                    <TableRow
                      key={e.id}
                      onClick={() => {
                        ViewUser(e);
                      }}
                    >
                      <TableCell align="center">{e.id}</TableCell>
                      <TableCell align="center">{e.userName}</TableCell>
                      <TableCell align="center">
                        {CheckDays(e.lastUpdated)}
                      </TableCell>
                      <TableCell align="center">
                        {e.status == "active" ? (
                          <span style={{ color: "green" }}>פעיל</span>
                        ) : (
                          <span style={{ color: "red" }}>לא פעיל</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Dialog
        onClose={() => {
          setAddUser(false);
        }}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        open={addUserModal}
      >
        <div className="InsideDialog" style={{ paddingTop: "5vh" }}>
          <DialogTitle>הוספת שקילה</DialogTitle>
          <div className="DialogInputs">
            <TextField
              sx={{
                "& label": {
                  left: "unset",
                  right: "1.75rem",
                  transformOrigin: "right",
                },
                "& legend": { textAlign: "right" },
              }}
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
              }}
              type="text"
              style={{ width: "80%", direction: "rtl" }}
              label="שם מלא"
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
              value={userEmai}
              onChange={(e) => {
                setUserEmail(e.target.value);
              }}
              type="email"
              style={{ width: "80%", direction: "rtl" }}
              label="כתובת מייל"
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
              value={weight}
              onChange={(e) => {
                setWeight(e.target.value);
              }}
              type="number"
              style={{ width: "80%", direction: "rtl" }}
              label="משקל"
              variant="outlined"
            />
             <TextField
              sx={{
                "& label": {
                  left: "unset",
                  right: "1.75rem",
                  transformOrigin: "right",
                },
                ".uiSelect-iconOutlined": {
                  right: '150px',
                },
                "& legend": { textAlign: "right" },
              }}
              value={UserAge}
              onChange={(e) => {
                setUserAge(e.target.value);
              }}
              InputLabelProps={{
                shrink: true,
              }}
              type="date"
              style={{ width: "80%", direction: "rtl" }}
              label="תאריך לידה"
              variant="outlined"
            />
            <TextField
              sx={{
                "& label": {
                  left: "unset",
                  right: "1.75rem",
                  transformOrigin: "right",
                },
                ".uiSelect-iconOutlined": {
                  right: '150px',
                },
                "& legend": { textAlign: "right" },
              }}
              value={userHeight}
              onChange={(e) => {
                setuserHeight(e.target.value);
              }}
              type="number"
              style={{ width: "80%", direction: "rtl" }}
              label="גובה"
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
              value={bodyFat}
              onChange={(e) => {
                setBodyFat(e.target.value);
              }}
              type="number"
              style={{ width: "80%", direction: "rtl" }}
              label="אחוז שומן"
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
              value={muscleAmount}
              onChange={(e) => {
                setmuscleAmount(e.target.value);
              }}
              type="number"
              style={{ width: "80%", direction: "rtl" }}
              label="מסת שריר"
              variant="outlined"
            />
      
            <TextField
              sx={{
                "& label": {
                  left: "unset",
                  right: "1.75rem",
                  transformOrigin: "right",
                },
                ".uiSelect-iconOutlined": {
                  right: '150px',
                },
                "& legend": { textAlign: "right" },
              }}
              value={chronologicAge}
              onChange={(e) => {
                setchronologicAge(e.target.value);
              }}
              type="number"
              style={{ width: "80%", direction: "rtl" }}
              label="גיל כרונולוגי"
              variant="outlined"
            />
            
            <TextField
              sx={{
                "& label": {
                  left: "unset",
                  right: "1.75rem",
                  transformOrigin: "right",
                },
                ".uiSelect-iconOutlined": {
                  right: '150px',
                },
                "& legend": { textAlign: "right" },
              }}
              style={{ width: "80%", direction: "rtl" }}
              value={activityLevel}
              onChange={(e) => setActityLevel(e.target.value)}
              select // tell TextField to render select
              label="רמת פעילות"
            >
              <MenuItem key={'normal'} value="normal">
                רגילה
              </MenuItem>
              <MenuItem key={'mid'} value="mid">
                בינונית
              </MenuItem>
              <MenuItem key={'high'} value="high">
                גבוהה
              </MenuItem>
            </TextField>
            <RadioGroup onChange={(e) => {setuserGender(e.target.value)}} value={userGender} defaultValue="female" row={true}>
              <FormControlLabel value="male" control={<Radio />} label="זכר" />
              <FormControlLabel value="female" control={<Radio />} label="נקבה" />
            </RadioGroup>
            <Button
              variant="contained"
              onClick={() => {
                addUser();
              }}
            >
              הוסף
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default Workers;
