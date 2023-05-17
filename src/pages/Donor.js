/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormGroup,
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
    name: "Loading...",
  });
  const [appointmentList, setAppointmentList] = useState([]);
  const [locationList, setlocationList] = useState([]);

  const [fullDates, setFullDates] = useState([]);
  const [repeatPasswordError, setRepeatPasswordError] = useState(" ");
  const [isLocationUuidSelected, setIsLocationUuidSelected] = useState(false);
  const [isAppointmentUuidSelected, setIsAppointmentUuidSelected] =
    useState(false);
  const [updateDialog, setUpdateDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] =
    useState(false);
  const [smsNotificationsEnabled, setSmsNotificationsEnabled] = useState(false);

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const repeatPasswordRef = useRef(null);
  const nameRef = useRef(null);
  const surnameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const locationUuidRef = useRef(null);
  const appointmentUuidRef = useRef(null);

  const donorURL = "http://localhost:8080/donors";
  const locationURL = "http://localhost:8080/locations";
  const appointmentURL = "http://localhost:8080/appointments";
  const repeatPasswordErrorString = "Repeated password doesn't match";

  const maxDayAppointment = dayjs().add(14 - 1, "day"); //today is also considered

  const columnsAppointments = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
    {
      field: "emailNotificationsEnabled",
      headerName: "Email notifications",
      flex: 1,
      valueGetter: (params) =>
        params.row.emailNotificationsEnabled ? "Enabled" : "Disabled",
    },
    {
      field: "smsNotificationsEnabled",
      headerName: "SMS notifications",
      flex: 1,
      valueGetter: (params) =>
        params.row.smsNotificationsEnabled ? "Enabled" : "Disabled",
    },
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
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "openingTime", headerName: "Opening Time", flex: 1 },
    { field: "closingTime", headerName: "Closing Time", flex: 1 },
  ];

  function fetchData() {
    fetch(`${donorURL}/${username}`)
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log(data);

        setData(data);
        usernameRef.current.value = data.username;
        nameRef.current.value = data.name;
        surnameRef.current.value = data.surname;
        emailRef.current.value = data.email;
        phoneRef.current.value = data.phone;
      });
    fetch(`${appointmentURL}/donors/${username}`)
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

        console.log(data);

        setAppointmentList(data.appointmentList);
      });
    fetch(`${locationURL}`)
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        data.locationList = data.locationList.map((location, index) => ({
          ...location,
          id: index,
        }));

        console.log(data);
        setlocationList(data.locationList);
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

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
    fetch(`${appointmentURL}/locations/${uuid}`)
      .then((response) => {
        return response.json();
      })
      .then((appointmentData) => {
        console.log(appointmentData);
        fetch(`${locationURL}/${uuid}`)
          .then((response) => {
            return response.json();
          })
          .then((locationData) => {
            console.log(locationData);

            const appointmentDays = appointmentData.appointmentList.map(
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
              if (appCountPerDay[key] >= locationData.maximumDailyDonations) {
                resultingFullDates.push(key);
              }
            }
            console.log(resultingFullDates);

            setFullDates(resultingFullDates);
            if (selectedDate !== null) {
              if (
                resultingFullDates.includes(selectedDate.format("YYYY-MM-DD"))
              ) {
                setSelectedDate(null);
              }
            }
          });
      });
  }

  function locationRowHandler(params) {
    console.log(params);

    locationUuidRef.current.value = params.row.uuid;
    calendarUpdater(params.row.uuid);
    setIsLocationUuidSelected(true);
  }

  function updateAppointmentFields(data) {
    appointmentUuidRef.current.value = data.uuid;
    setEmailNotificationsEnabled(data.emailNotificationsEnabled);
    setSmsNotificationsEnabled(data.smsNotificationsEnabled);
    setIsAppointmentUuidSelected(true);
  }

  function appointmentRowHandler(params) {
    console.log(params);

    updateAppointmentFields(params.row);
  }

  function updateHandler() {
    const formData = {
      password: passwordRef.current.value,
      name: nameRef.current.value,
      surname: surnameRef.current.value,
      email: emailRef.current.value,
      phone: phoneRef.current.value,
    };
    const username = usernameRef.current.value;
    const password = formData.password;
    const repeatedPassword = repeatPasswordRef.current.value;

    if (isRepeatedPasswordValid(password, repeatedPassword)) {
      fetch(`${donorURL}/${username}`, {
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
    fetch(`${donorURL}/${username}`, {
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
      emailNotificationsEnabled: emailNotificationsEnabled,
      smsNotificationsEnabled: smsNotificationsEnabled,
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
          console.log("Fetching");
          fetchData();
          calendarUpdater(locationUuidRef.current.value);
          updateAppointmentFields(data);
        },
        (error) => {
          console.log("Error");
          console.log(error);
        }
      );
  }

  function deleteAppointmentHandler() {
    fetch(`${appointmentURL}/${appointmentUuidRef.current.value}`, {
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
          const dummyData = {
            uuid: null,
            emailNotificationsEnabled: false,
            smsNotificationsEnabled: false,
          };
          updateAppointmentFields(dummyData);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  function handleEmailCheckedChanged(event) {
    setEmailNotificationsEnabled(event.target.checked);
  }

  function handleSmsCheckedChanged(event) {
    setSmsNotificationsEnabled(event.target.checked);
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
          rows={appointmentList}
          columns={columnsAppointments}
          onRowClick={appointmentRowHandler}
          pageSizeOptions={[5]}
        />
        <CustomTable
          title="Locations"
          height="50%"
          rows={locationList}
          columns={columnsLocations}
          onRowClick={locationRowHandler}
          pageSizeOptions={[5]}
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
            size="small"
            inputRef={usernameRef}
            helperText={" "}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Password"
            id="password"
            type="password"
            margin="dense"
            size="small"
            inputRef={passwordRef}
            helperText={" "}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Repeat Password"
            id="repeatPassword"
            type="password"
            margin="dense"
            size="small"
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
            size="small"
            inputRef={nameRef}
            helperText={" "}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Surname"
            id="surname"
            type="text"
            margin="dense"
            size="small"
            inputRef={surnameRef}
            helperText={" "}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Email"
            type="email"
            margin="dense"
            size="small"
            inputRef={emailRef}
            helperText={" "}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Phone Number"
            type="tel"
            margin="dense"
            size="small"
            inputRef={phoneRef}
            helperText={""}
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
            label="Appointment ID (Select from table)"
            id="appointmentUuid"
            type="text"
            margin="dense"
            size="small"
            inputRef={appointmentUuidRef}
            helperText={" "}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Location ID (Select from table)"
            id="locationUuid"
            type="text"
            margin="dense"
            size="small"
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

          <div className={classes.checkboxDiv}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={emailNotificationsEnabled}
                    onChange={handleEmailCheckedChanged}
                  />
                }
                label="Send notifications via email"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={smsNotificationsEnabled}
                    onChange={handleSmsCheckedChanged}
                  />
                }
                label="Send notifications via sms"
              />
            </FormGroup>
          </div>

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
