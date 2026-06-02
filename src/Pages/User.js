import { useEffect, useState } from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Chart, Line } from "react-chartjs-2";
import { Routes, Route, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import Button from "@mui/material/Button";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import AddIcon from "@mui/icons-material/Add";
import ScaleIcon from "@mui/icons-material/Scale";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import Cookies from "universal-cookie";

import {
  Select,
  MenuItem,
  RadioGroup,
  Radio,
  FormControl,
  InputLabel,
} from "@mui/material";

import FormControlLabel from "@mui/material/FormControlLabel";

function User() {


  const [selectedUser, setSelectedUser] = useState();
  const [openDialog, setOpen] = useState(false);
  const [openEdit, setEdit] = useState(false);

  const [openEditPass, setEditPass] = useState(false);

  
  const [weightEdit, setWeightEdit] = useState(false);

  const [loaded, setLoaded] = useState(false);
  const [userWeight, setWeightData] = useState([]);
  const [data, setData] = useState(null);
  const [admin, setAdmin] = useState(false);
  // Add weights inputs
  const [weight, setWeight] = useState();
  const [bodyFat, setBodyFat] = useState();
  const [muscleAmount, setmuscleAmount] = useState();
  const [chronologicAge, setchronologicAge] = useState();
  const [selectedDate, setSelectedDate] = useState("");


  // pass edit
  const [newPassword, setNewPass] = useState();


  // user edit

  const [fullName, setFullName] = useState();
  const [userEmai, setUserEmail] = useState();
  const [activityLevel, setActityLevel] = useState();
  const [userGender, setuserGender] = useState("male");
  const [UserAge, setUserAge] = useState();
  const [userHeight, setuserHeight] = useState();

  let { userId } = useParams();
  const cookies = new Cookies();

  function getLabels() {
    return userWeight.map((e) => {
      return e.date.split(", ")[0];
    });
  }

  function getWeight() {
    return userWeight.map((e) => {
      return e.weight;
    });
  }

  function getBodyPercentage() {
    return userWeight.map((e) => {
      return e.bodyFat;
    });
  }

  function getMuscle() {
    return userWeight.map((e) => {
      return e.muscle;
    });
  }

  function calculateCalories() {
    let weight = userWeight[userWeight.length - 1].weight;
    let birthOfDate = userWeight[0].age;
    let height = userWeight[0].height;
    let activity = userWeight[0].activity;
    let gender = userWeight[0].gender;
    let amount = 1;
    let userAge = Math.floor(
      (new Date() - new Date(birthOfDate).getTime()) / 3.15576e10
    );
    if (activity == "normal") {
      amount = 1.2;
    } else if (activity == "mid") {
      amount = 1.55;
    } else {
      amount = 1.9;
    }

    if (gender == "male") {
      let bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * userAge;
      return Math.floor(bmr * amount);
    } else {
      let bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * userAge;
      return Math.floor(bmr * amount);
    }
  }

  useEffect(() => {
    if(selectedDate !== '') {
      userWeight.forEach(e => {
        console.log(e)
        if(e.date === selectedDate) {
          let uWeight = e;
          setWeight(uWeight.weight);
          setBodyFat(uWeight.bodyFat);
          setmuscleAmount(uWeight.muscle);
          setchronologicAge(uWeight.chronologicAge);
        }
      })
    }
  } , [selectedDate])

  useEffect(() => {
    if (cookies.get("tkn") == undefined) {
      window.location.href = "/login";
    } else {
      if (jwtDecode(cookies.get("tkn")).id != userId) {
        if (jwtDecode(cookies.get("tkn")).isAdmin != "true") {
          window.location.href = "/login";
        }
      }

      if (jwtDecode(cookies.get("tkn")).isAdmin == "true") {
        setAdmin(true);
      }
    }

    // const [weight, setWeight] = useState();
    // const [bodyFat, setBodyFat] = useState();
    // const [muscleAmount, setmuscleAmount] = useState();
    // const [chronologicAge, setchronologicAge] = useState();

    fetch(`https://galmyway.xyz/api/users/${userId}`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Token: cookies.get("tkn"),
      },
    })
      .then((res) => res.json())
      .then((returned) => {
        setSelectedUser(returned[0]);
        setWeightData(JSON.parse(returned[0].weightList));
        setLoaded(true);

        setFullName(returned[0].userName);
        setUserEmail(returned[0].email);
        setuserHeight(JSON.parse(returned[0].weightList)[0].height);
        setActityLevel(JSON.parse(returned[0].weightList)[0].activity);
        setuserGender(JSON.parse(returned[0].weightList)[0].gender);
        setUserAge(JSON.parse(returned[0].weightList)[0].age);

        let uWeight = JSON.parse(returned[0].weightList);
        setWeight(uWeight[uWeight.length - 1].weight);
        setBodyFat(uWeight[uWeight.length - 1].bodyFat);
        setmuscleAmount(uWeight[uWeight.length - 1].muscle);
        setchronologicAge(uWeight[uWeight.length - 1].chronologicAge);
      })
      .catch((rejected) => {
        console.log(rejected);
      });
  }, []);

  useEffect(() => {
    let a = {
      labels: getLabels(),
      datasets: [
        {
          label: "משקל",
          data: getWeight(),
          borderColor: "rgba(75,192,192,1)",
          borderWidth: 2,
          fill: true,
        },
        {
          label: "אחוז שומן",
          data: getBodyPercentage(),
          borderColor: "pink",
          borderWidth: 2,
          fill: true,
        },
        {
          label: "מסת שריר",
          data: getMuscle(),
          borderColor: "purple",
          borderWidth: 2,
          fill: true,
        },
      ],
    };
    setData(a);
  }, [userWeight]);

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

  const actions = [
    { icon: <EditIcon />, name: "editPass", label: "שינוי סיסמה" },
    { icon: <EditIcon />, name: "editUser", label: "שינוי פרטים" },
    { icon: <ScaleIcon />, name: "addweight", label: "הוספת שקילה" },
    { icon: <ChangeCircleIcon />, name: "editWeight", label: "שינוי פרמטר" },

  ];

  function actionClicked(name) {
    if (name == "addweight") {
      let uWeight = userWeight;
      setWeight(uWeight[uWeight.length - 1].weight);
      setBodyFat(uWeight[uWeight.length - 1].bodyFat);
      setmuscleAmount(uWeight[uWeight.length - 1].muscle);
      setchronologicAge(uWeight[uWeight.length - 1].chronologicAge);
      setOpen(true);
    }

    if (name == "editUser") {
      setEdit(true);
    }

    if(name == "editPass") {
      setEditPass(true);
    }

    if (name == "editWeight") {
      setWeightEdit(true);
    }
  }

  function setNewPassword() {
    if(newPassword !== undefined) {
      fetch(`https://galmyway.xyz/api/users/${userId}/updateUserPass`, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pass: newPassword,
          token: cookies.get("tkn"),
        }),
      })
        .then((res) => res.json())
        .then((returned) => {
          if (returned == true) {
            setEdit(false);
            window.location.reload();
          } else {
            alert("TOKEN PROBLEM");
          }
        });
    }
  }

  function updateUserDetails() {
    if (
      fullName == undefined ||
      userEmai == undefined ||
      UserAge == undefined ||
      userHeight == undefined ||
      activityLevel == undefined ||
      userGender == undefined
    ) {
      return;
    } else {
      fetch(`https://galmyway.xyz/api/users/${userId}/updateUser`, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: fullName,
          email: userEmai,
          age: UserAge,
          height: userHeight,
          activity: activityLevel,
          gender: userGender,
          token: cookies.get("tkn"),
        }),
      })
        .then((res) => res.json())
        .then((returned) => {
          if (returned == true) {
            setEdit(false);
            window.location.reload();
          } else {
            alert("TOKEN PROBLEM");
          }
        });
    }
  }

  function addWeight() {
    if (
      weight == undefined ||
      bodyFat == undefined ||
      muscleAmount == undefined ||
      chronologicAge == undefined
    ) {
      return;
    } else {
      fetch(`https://galmyway.xyz/api/users/${userId}/addWeight`, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: new Date().toLocaleString("en-GB"),
          muscle: muscleAmount,
          bFat: bodyFat,
          chronologicAge: chronologicAge,
          weight: weight,
          token: cookies.get("tkn"),
        }),
      })
        .then((res) => res.json())
        .then((returned) => {
          if (returned == true) {
            setOpen(false);
            window.location.reload();
          }
        });
    }
  }
  function deleteWeight() {
    fetch(`https://galmyway.xyz/api/users/${userId}/deleteWeight`, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: selectedDate,
        token: cookies.get("tkn"),
      }),
    })
    .then((res) => res.json())
    .then((returned) => {
      if (returned == true) {
        setWeightEdit(false);
        window.location.reload();
      }
    });

  }


  function editWeight() {
    if (
      weight == undefined ||
      bodyFat == undefined ||
      muscleAmount == undefined ||
      chronologicAge == undefined
    ) {
      return;
    } else {
      fetch(`https://galmyway.xyz/api/users/${userId}/editWeight`, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate,
          muscle: muscleAmount,
          bFat: bodyFat,
          chronologicAge: chronologicAge,
          weight: weight,
          token: cookies.get("tkn"),
        }),
      })
        .then((res) => res.json())
        .then((returned) => {
          if (returned == true) {
            setWeightEdit(false);
            window.location.reload();
          }
        });
    }
  }
  return (
    <div className="USER">
      {loaded == true ? (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <h1 className="UserName">{selectedUser.userName}</h1>
          <hr></hr>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              gap: "4vh",
            }}
          >
            <div className="UserDetails">
              <h1>נתונים עדכניים</h1>
              <div className="DetailsPart">
                <p style={{ direction: "rtl" }}>
                  משקל:{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {userWeight[userWeight.length - 1].weight}kg
                  </span>
                </p>
                <p style={{ direction: "rtl" }}>
                  אחוז שומן:{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {userWeight[userWeight.length - 1].bodyFat}%
                  </span>
                </p>
                <p style={{ direction: "rtl" }}>
                  מסת שריר:{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {userWeight[userWeight.length - 1].muscle}kg
                  </span>
                </p>
                {admin == true ? (
                  <p style={{ direction: "rtl" }}>
                    גובה:{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {userWeight[0].height} סנטימטרים
                    </span>
                  </p>
                ) : (
                  ""
                )}
                {admin == true ? (
                  <p style={{ direction: "rtl" }}>
                    תאריך לידה:{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {userWeight[0].age} |{" "}
                      {Math.floor(
                        (new Date() - new Date(userWeight[0].age).getTime()) /
                          3.15576e10
                      )}
                    </span>
                  </p>
                ) : (
                  ""
                )}

                {/* let userAge = (Math.floor((new Date() - new Date(birthOfDate).getTime()) / 3.15576e+10)) */}

                <p style={{ direction: "rtl" }}>
                  גיל כרונולוגי:{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {userWeight[userWeight.length - 1].chronologicAge} שנים
                  </span>
                </p>
                <p style={{ direction: "rtl" }}>
                  קלוריות:{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {calculateCalories()}
                  </span>
                </p>
                <p style={{ direction: "rtl" }}>
                  עודכן לאחרונה:{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {CheckDays(selectedUser.lastUpdated)}
                  </span>
                </p>
              </div>
            </div>
            <div className="Graph">
              <h1>גרף מעקב</h1>
              <div className="GraphElement">
                {data !== null ? (
                  <Line
                    style={{ width: "100%", height: "100%" }}
                    data={data}
                    options={{
                      elements: { point: { hitRadius: 20 } },
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: { y: { beginAtZero: true } },
                    }}
                  />
                ) : (
                  ""
                )}
              </div>
              {/* <Button variant="contained" style={{backgroundColor: '#B4CDD8', color: '#2B2C2A'}}>הוספת שקילה</Button> */}
              {/* <Button size='sm' variant="primary" style={{backgroundColor: '#B4CDD8', border: '#D5EAEB', color: '#2B2C2A'}}>הוספת שקילה</Button> */}
            </div>
          </div>
          <Dialog
            onClose={() => {
              setEdit(false);
            }}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            open={openEdit}
          >
            <div className="InsideDialog">
              <DialogTitle>עריכת פרטים</DialogTitle>
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
                    ".uiSelect-iconOutlined": {
                      right: "150px",
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
                      right: "150px",
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
                    ".uiSelect-iconOutlined": {
                      right: "150px",
                    },
                    "& legend": { textAlign: "right" },
                  }}
                  style={{ width: "80%", direction: "rtl" }}
                  value={activityLevel}
                  onChange={(e) => setActityLevel(e.target.value)}
                  select // tell TextField to render select
                  label="רמת פעילות"
                >
                  <MenuItem key={"normal"} value="normal">
                    רגילה
                  </MenuItem>
                  <MenuItem key={"mid"} value="mid">
                    בינונית
                  </MenuItem>
                  <MenuItem key={"high"} value="high">
                    גבוהה
                  </MenuItem>
                </TextField>
                <RadioGroup
                  onChange={(e) => {
                    setuserGender(e.target.value);
                  }}
                  value={userGender}
                  defaultValue="female"
                  row={true}
                >
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="זכר"
                  />
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="נקבה"
                  />
                </RadioGroup>
                <Button
                  variant="contained"
                  onClick={() => {
                    updateUserDetails();
                  }}
                >
                  עדכן
                </Button>
              </div>
            </div>
          </Dialog>
          <Dialog
            onClose={() => {
              setEdit(false);
            }}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            open={openEditPass}
          >
            <div className="InsideDialog">
              <DialogTitle>עריכת פרטים</DialogTitle>
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
                  value={newPassword}
                  onChange={(e) => {
                    setNewPass(e.target.value);
                  }}
                  type="text"
                  style={{ width: "80%", direction: "rtl" }}
                  label="סיסמה חדשה"
                  variant="outlined"
                />
                <Button
                  variant="contained"
                  onClick={() => {
                    setNewPassword();
                  }}
                >
                  עדכן
                </Button>
              </div>
            </div>
          </Dialog>
          <Dialog
            onClose={() => {
              setOpen(false);
            }}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            open={openDialog}
          >
            <div className="InsideDialog">
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
                <Button
                  variant="contained"
                  onClick={() => {
                    addWeight();
                  }}
                >
                  הוסף
                </Button>
              </div>
            </div>
          </Dialog>
          <Dialog
            onClose={() => {
              setWeightEdit(false);
            }}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            open={weightEdit}
          >
            <div className="InsideDialog">
              <DialogTitle>עדכון שקילה</DialogTitle>
              <div className="DialogInputs">
                <TextField
                  sx={{
                    "& label": {
                      left: "unset",
                      right: "1.75rem",
                      transformOrigin: "right",
                    },
                    ".uiSelect-iconOutlined": {
                      right: "150px",
                    },
                    "& legend": { textAlign: "right" },
                  }}
                  style={{ width: "80%", direction: "rtl" }}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  select
                  label="תאריך שקילה"
                >
                  {userWeight.map((e) => {
                    return (
                      <MenuItem key={e.date} value={e.date}>
                        {e.date.split(',')[0]}
                      </MenuItem>
                    );
                  })}
                </TextField>
                {selectedDate !== "" ? (
                  <div className="SelectedDateInputs">
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
                    <div style={{width: '100%' , display: 'flex' , justifyContent: 'center' , alignItems: 'center' , gap: '2vw'}}>
                      <Button
                        variant="contained"
                        onClick={() => {
                          editWeight();
                        }}
                      >
                        עדכן
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => {
                          deleteWeight();
                        }}
                      >
                        מחק
                      </Button>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </Dialog>
          {admin == true ? (
            <SpeedDial
              FabProps={{
                style: { backgroundColor: "#D5EAEB", color: "#2B2C2A" },
              }}
              ariaLabel="menu"
              sx={{ position: "absolute", bottom: 16, right: 16 }}
              icon={<SpeedDialIcon />}
            >
              {actions.map((action) => (
                <SpeedDialAction
                  tooltipOpen
                  key={action.name}
                  icon={action.icon}
                  tooltipTitle={action.label}
                  onClick={(e) => {
                    e.stopPropagation();
                    actionClicked(action.name);
                  }}
                />
              ))}
            </SpeedDial>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default User;
