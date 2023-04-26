/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CustomTable from "../components/CustomTable";

import classes from "./Administrator.module.css";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

function Donor() {
  const navigate = useNavigate();

  const { state } = useLocation();
  const { username } = state === null ? "" : state;

  const [data, setData] = useState({
    appointmentList: [],
    locationList: [],
  });
  const [fullDates, setFullDates] = useState([]);
  const [repeatPasswordError, setRepeatPasswordError] = useState(" ");
  const [isLocationUuidSelected, setIsLocationUuidSelected] = useState(false);
  const [isAppointmentUuidSelected, setIsAppointmentUuidSelected] =
    useState(false);
  const [updateDialog, setUpdateDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState();

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const repeatPasswordRef = useRef(null);
  const nameRef = useRef(null);
  const surnameRef = useRef(null);
  const locationUuidRef = useRef(null);
  const appointmentUuidRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const donorURL = "http://localhost:8080/donors";
  const locationURL = "http://localhost:8080/locations";
  const appointmentURL = "http://localhost:8080/appointments";
  const repeatPasswordErrorString = "Repeated password doesn't match";

  const maxDayAppointment = dayjs().add(14 - 1, "day"); //today is also considered

  const columnsAppointments = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
    {
      field: "locationName",
      headerName: "Location Name",
      flex: 1,
      valueGetter: (params) => `${params.row.location.name}`,
    },
    {
      field: "locationAddress",
      headerName: "Location Address",
      flex: 1,
      valueGetter: (params) => `${params.row.location.address}`,
    },
    {
      field: "locationOpeningTime",
      headerName: "Location Opening Time",
      flex: 1,
      valueGetter: (params) => `${params.row.location.openingTime}`,
    },
    {
      field: "locationClosingTime",
      headerName: "Location Closing Time",
      flex: 1,
      valueGetter: (params) => `${params.row.location.closingTime}`,
    },
  ];
  const columnsLocations = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "openingTime", headerName: "Opening Time", flex: 1 },
    { field: "closingTime", headerName: "Closing Time", flex: 1 },
  ];

  function fetchData() {
    fetch(`${donorURL}?username=${username}`)
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        data.appointmentList = data.appointmentList.map(
          (appointment, index) => ({
            ...appointment,
            id: index + 1,
          })
        );
        data.locationList = data.locationList.map((location, index) => ({
          ...location,
          id: index,
        }));

        console.log(data);

        setData(data);
        usernameRef.current.value = data.username;
        nameRef.current.value = data.name;
        surnameRef.current.value = data.surname;
      });
  }

  function isRepeatedPasswordValid(password, repeatedPassword) {
    setRepeatPasswordError(" ");
    if (password !== "" && password !== repeatedPassword) {
      setRepeatPasswordError(repeatPasswordErrorString);
      return false;
    }
    return true;
  }

  function updateOpenDialog() {
    setUpdateDialog(true);
  }

  function updateDialogClose() {
    setUpdateDialog(false);
  }

  function isWeekend(date) {
    const day = date.day();

    return day === 0 || day === 6;
  }

  function isFullDate(date) {
    return fullDates.includes(date.format("YYYY-MM-DD"));
    // var isFull = false;
    // for (const fullDate in fullDates) {
    //   if (dayjs(fullDate()).isSame(date)) {
    //     isFull = true;
    //     break;
    //   }
    // }

    // return isFull;
  }

  function isForbiddenDate(date) {
    return isWeekend(date) || isFullDate(date);
  }

  function calendarUpdater(uuid) {
    fetch(`${locationURL}?uuid=${uuid}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);

        const appointmentDays = data.appointmentList.map(
          (appointment) => appointment.date
        );
        console.log(appointmentDays);

        const appCountPerDay = appointmentDays.reduce((acc, curr) => {
          if (curr in acc) {
            acc[curr]++;
          } else {
            acc[curr] = 1;
          }
          return acc;
        }, {});
        console.log(appCountPerDay);

        const resultingFullDates = [];
        for (const key in appCountPerDay) {
          if (appCountPerDay[key] >= data.maximumDailyDonations) {
            resultingFullDates.push(key);
          }
        }
        console.log(resultingFullDates);

        setFullDates(resultingFullDates);
        if (selectedDate !== null) {
          if (resultingFullDates.includes(selectedDate.format("YYYY-MM-DD"))) {
            setSelectedDate(null);
          }
        }
      });
  }

  function locationRowHandler(params) {
    console.log(params);

    locationUuidRef.current.value = params.row.uuid;
    calendarUpdater(params.row.uuid);
    setIsLocationUuidSelected(true);
  }

  function updateAppointmentField(uuid) {
    appointmentUuidRef.current.value = uuid;
    setIsAppointmentUuidSelected(true);
  }

  function appointmentRowHandler(params) {
    console.log(params);

    updateAppointmentField(params.row.uuid);
  }

  function updateHandler() {
    const formData = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
      name: nameRef.current.value,
      surname: surnameRef.current.value,
    };
    const password = formData.password;
    const repeatedPassword = repeatPasswordRef.current.value;

    if (isRepeatedPasswordValid(password, repeatedPassword)) {
      fetch(donorURL, {
        method: "PATCH",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
          fetchData();
        });
    }
  }

  function deleteHandler() {
    const username = usernameRef.current.value;
    fetch(`${donorURL}?username=${username}`, {
      method: "DELETE",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        fetchData();
        updateDialogClose();
        navigate("/login");
      });
  }

  function createAppointmentHandler() {
    const appointmentData = {
      date: dayjs(selectedDate).format("YYYY-MM-DD"),
      location: locationUuidRef.current.value,
      donor: data.username,
    };

    console.log(appointmentData);

    fetch(`${appointmentURL}`, {
      method: "POST",
      body: JSON.stringify(appointmentData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response);
      })
      .then(
        (data) => {
          console.log(data);
          fetchData();
          calendarUpdater(locationUuidRef.current.value);
          updateAppointmentField(data.uuid);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  function deleteAppointmentHandler() {
    fetch(`${appointmentURL}?uuid=${appointmentUuidRef.current.value}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response);
      })
      .then(
        (data) => {
          console.log(data);
          fetchData();
          updateAppointmentField(null);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  return (
    <div className={classes.mainDiv}>
      <div className={classes.tableDiv}>
        <Typography
          variant="h3"
          marginBottom={1}
        >{`Hi, ${data.name}`}</Typography>
        <CustomTable
          title="Appointments"
          height="50%"
          rows={data.appointmentList}
          columns={columnsAppointments}
          onRowClick={appointmentRowHandler}
        />
        <CustomTable
          title="Locations"
          height="50%"
          rows={data.locationList}
          columns={columnsLocations}
          onRowClick={locationRowHandler}
        />
      </div>
      <Divider orientation="vertical" />
      <div className={classes.sidebarDiv}>
        <div className={classes.fieldsDiv}>
          <TextField
            label="Username"
            id="username"
            type="text"
            margin="dense"
            disabled
            inputRef={usernameRef}
            helperText={" "}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Password"
            id="password"
            type="password"
            margin="dense"
            inputRef={passwordRef}
            helperText={" "}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Repeat Password"
            id="repeatPassword"
            type="password"
            margin="dense"
            inputRef={repeatPasswordRef}
            helperText={repeatPasswordError}
            error={repeatPasswordError !== " "}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Name"
            id="name"
            type="text"
            margin="dense"
            inputRef={nameRef}
            helperText={" "}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Surname"
            id="surname"
            type="text"
            margin="dense"
            inputRef={surnameRef}
            helperText={" "}
            InputLabelProps={{ shrink: true }}
          />
          <div className={classes.buttonsDiv}>
            <Button
              variant="contained"
              size="small"
              sx={{ margin: 1, flex: 1 }}
              onClick={updateHandler}
            >
              Update Data
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{ margin: 1, flex: 1 }}
              onClick={updateOpenDialog}
            >
              Delete Account
            </Button>
          </div>
        </div>
        <div className={classes.appointmentDiv}>
          <TextField
            label="Select appointment from table"
            id="appointmentUuid"
            type="text"
            margin="dense"
            inputRef={appointmentUuidRef}
            helperText={" "}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Select location from table"
            id="locationUuid"
            type="text"
            margin="dense"
            inputRef={locationUuidRef}
            helperText={" "}
            InputLabelProps={{ shrink: true }}
          />
          <DatePicker
            label="Appointment date"
            value={selectedDate}
            helperText={"da"}
            onChange={setSelectedDate}
            disablePast
            maxDate={maxDayAppointment}
            shouldDisableDate={isForbiddenDate}
            disabled={!isLocationUuidSelected}
          />

          <div className={classes.buttonsDiv}>
            <Button
              variant="contained"
              size="small"
              sx={{ margin: 1, flex: 1 }}
              disabled={!isLocationUuidSelected}
              onClick={createAppointmentHandler}
            >
              Create Appointment
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{ margin: 1, flex: 1 }}
              disabled={!isAppointmentUuidSelected}
              onClick={deleteAppointmentHandler}
            >
              Delete Appointment
            </Button>
          </div>
        </div>
      </div>
      <Dialog open={updateDialog} onClose={updateDialogClose}>
        <DialogTitle id="update-dialog-title">{"Delete account?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="update-dialog-description">
            Are you sure you want to delete you account? This action is
            IRREVERSIBLE!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={updateDialogClose}>Cancel</Button>
          <Button onClick={deleteHandler} autoFocus>
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Donor;
