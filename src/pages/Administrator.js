/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import CustomTable from "../components/CustomTable";

import classes from "./Administrator.module.css";
import { useLocation } from "react-router-dom";
import { Button, Divider, TextField, Typography } from "@mui/material";

function Administrator() {
  const { state } = useLocation();
  const { username } = state === null ? "" : state;

  // const [data, setData] = useState({
  //   doctorList: [],
  //   locationList: [],
  // });
  const [adminData, setAdminData] = useState({
    name: "Loading...",
  });
  const [doctorList, setDoctorList] = useState([]);
  const [locationList, setlocationList] = useState([]);
  const [usernameError, setUsernameError] = useState(" ");
  const [passwordError, setPasswordError] = useState(" ");
  const [repeatPasswordError, setRepeatPasswordError] = useState(" ");
  const [nameError, setNameError] = useState(" ");
  const [surnameError, setSurnameError] = useState(" ");
  const [emailError, setEmailError] = useState(" ");
  const [cnpError, setCnpError] = useState(" ");
  const [locationUuidError, setLocationUuidError] = useState(" ");

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const repeatPasswordRef = useRef(null);
  const nameRef = useRef(null);
  const surnameRef = useRef(null);
  const emailRef = useRef(null);
  const cnpRef = useRef(null);
  const locationUuidRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const adminURL = "http://localhost:8080/admins";
  const doctorURL = "http://localhost:8080/doctors";
  const locationURL = "http://localhost:8080/locations";
  const usernameEmptyErrorString = "Username cannot be empty";
  const usernameExistsErrorString = "Username already exists";
  const usernameNotExistErrorString = "Username does not exist";
  const passwordErrorString = "Password cannot be empty";
  const repeatPasswordErrorString = "Repeated password doesn't match";
  const nameErrorString = "Name cannot be empty";
  const surnameErrorString = "Surname cannot be empty";
  const emailErrorString = "Email cannot be empty";
  const cnpErrorString = "CNP cannot be empty";
  const locationUuidErrorString = "Location UUID cannot be empty";

  const columnsDoctors = [
    { field: "username", headerName: "Username", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "surname", headerName: "Surname", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "cnp", headerName: "CNP", flex: 1 },
    {
      field: "locationUUID",
      headerName: "Location UUID",
      flex: 2,
      valueGetter: (params) => `${params.row.location.uuid}`,
    },
    {
      field: "locationName",
      headerName: "Location Name",
      flex: 1,
      valueGetter: (params) => `${params.row.location.name}`,
    },
  ];
  const columnsLocations = [
    { field: "uuid", headerName: "UUID", flex: 2 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "openingTime", headerName: "Opening Time", flex: 1 },
    { field: "closingTime", headerName: "Closing Time", flex: 1 },
    {
      field: "maximumDailyDonations",
      headerName: "Maximum daily donations",
      type: "number",
      flex: 1,
    },
  ];

  function fetchData() {
    fetch(`${adminURL}/${username}`)
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setAdminData(data);
      });

    fetch(`${doctorURL}`)
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        data.doctorList = data.doctorList.map((doctor, index) => ({
          ...doctor,
          id: index,
        }));

        console.log(data);
        setDoctorList(data.doctorList);
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

  function isUsernameValid(username) {
    setUsernameError(" ");
    setPasswordError(" ");
    setRepeatPasswordError(" ");
    setNameError(" ");
    setSurnameError(" ");
    setEmailError(" ");
    setCnpError(" ");
    setLocationUuidError(" ");

    if (username === "") {
      setUsernameError(usernameEmptyErrorString);
      return false;
    }
    return true;
  }

  function isFormValid(formData) {
    setUsernameError(" ");
    setPasswordError(" ");
    setRepeatPasswordError(" ");
    setNameError(" ");
    setSurnameError(" ");
    setEmailError(" ");
    setCnpError(" ");
    setLocationUuidError(" ");

    var dataValid = true;

    if (formData.username === "") {
      setUsernameError(usernameEmptyErrorString);
      dataValid = false;
    }
    if (formData.password === "") {
      setPasswordError(passwordErrorString);
      dataValid = false;
    }
    if (repeatPasswordRef.current.value !== formData.password) {
      setRepeatPasswordError(repeatPasswordErrorString);
      dataValid = false;
    }
    if (formData.name === "") {
      setNameError(nameErrorString);
      dataValid = false;
    }
    if (formData.surname === "") {
      setSurnameError(surnameErrorString);
      dataValid = false;
    }
    if (formData.email === "") {
      setEmailError(emailErrorString);
      dataValid = false;
    }
    if (formData.cnp === "") {
      setCnpError(cnpErrorString);
      dataValid = false;
    }
    if (formData.locationUuid === "") {
      setLocationUuidError(locationUuidErrorString);
      dataValid = false;
    }

    return dataValid;
  }

  function doctorRowHandler(params) {
    console.log(params);

    usernameRef.current.value = params.row.username;
    nameRef.current.value = params.row.name;
    surnameRef.current.value = params.row.surname;
    emailRef.current.value = params.row.email;
    cnpRef.current.value = params.row.cnp;
    locationUuidRef.current.value = params.row.location.uuid;
  }

  function locationRowHandler(params) {
    console.log(params);

    locationUuidRef.current.value = params.row.uuid;
  }

  function createHandler() {
    const formData = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
      name: nameRef.current.value,
      surname: surnameRef.current.value,
      email: emailRef.current.value,
      cnp: cnpRef.current.value,
      locationUuid: locationUuidRef.current.value,
    };
    if (isFormValid(formData)) {
      fetch(doctorURL, {
        method: "POST",
        body: JSON.stringify(formData),
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
          },
          (error) => {
            setUsernameError(usernameExistsErrorString);
            console.log(error);
          }
        );
    }
  }

  function updateHandler() {
    const formData = {
      password: passwordRef.current.value,
      name: nameRef.current.value,
      surname: surnameRef.current.value,
      email: emailRef.current.value,
      cnp: cnpRef.current.value,
      locationUuid: locationUuidRef.current.value,
    };

    const username = usernameRef.current.value;

    if (isUsernameValid(username)) {
      fetch(`${doctorURL}/${username}`, {
        method: "PATCH",
        body: JSON.stringify(formData),
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
          },
          (error) => {
            setUsernameError(usernameNotExistErrorString);
            console.log(error);
          }
        );
    }
  }

  function deleteHandler() {
    const username = usernameRef.current.value;
    if (isUsernameValid(username)) {
      fetch(`${doctorURL}/${username}`, {
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
          },
          (error) => {
            console.log(error);
            setUsernameError(usernameNotExistErrorString);
          }
        );
    }
  }

  return (
    <div className={classes.mainDiv}>
      <div className={classes.tableDiv}>
        <Typography
          variant="h3"
          marginBottom={1}
        >{`Hi, ${adminData.name}`}</Typography>
        <CustomTable
          title="Doctors"
          height="50%"
          rows={doctorList}
          columns={columnsDoctors}
          onRowClick={doctorRowHandler}
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
            required
            inputRef={usernameRef}
            helperText={usernameError}
            error={usernameError !== " "}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Password"
            id="password"
            type="password"
            margin="dense"
            inputRef={passwordRef}
            helperText={passwordError}
            error={passwordError !== " "}
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
            helperText={nameError}
            error={nameError !== " "}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Surname"
            id="surname"
            type="text"
            margin="dense"
            inputRef={surnameRef}
            helperText={surnameError}
            error={surnameError !== " "}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Email"
            id="email"
            type="text"
            margin="dense"
            inputRef={emailRef}
            helperText={emailError}
            error={emailError !== " "}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="CNP"
            id="surname"
            type="text"
            margin="dense"
            inputRef={cnpRef}
            helperText={cnpError}
            error={cnpError !== " "}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Location UUID (Select from table)"
            id="locationUuid"
            type="text"
            margin="dense"
            inputRef={locationUuidRef}
            helperText={locationUuidError}
            error={locationUuidError !== " "}
            InputLabelProps={{ shrink: true }}
          />
        </div>
        <div className={classes.buttonsDiv}>
          <Button
            variant="contained"
            size="small"
            sx={{ margin: 1, flex: 1 }}
            onClick={createHandler}
          >
            Create
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{ margin: 1, flex: 1 }}
            onClick={updateHandler}
          >
            Update
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{ margin: 1, flex: 1 }}
            onClick={deleteHandler}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Administrator;
