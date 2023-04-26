import { Button, TextField, Typography } from "@mui/material";
import { useRef, useState } from "react";

import classes from "./RegisterDonor.module.css";
import { useNavigate } from "react-router-dom";

function RegisterDonor() {
  const navigate = useNavigate();

  const [usernameError, setUsernameError] = useState(" ");
  const [passwordError, setPasswordError] = useState(" ");
  const [repeatPasswordError, setRepeatPasswordError] = useState(" ");
  const [nameError, setNameError] = useState(" ");
  const [surnameError, setSurnameError] = useState(" ");

  const usernameRef = useRef();
  const passwordRef = useRef();
  const repeatPasswordRef = useRef();
  const nameRef = useRef();
  const surnameRef = useRef();

  function signUpHandler() {
    const donorData = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
      name: nameRef.current.value,
      surname: surnameRef.current.value,
    };

    const createUrl = "http://localhost:8080/donors";

    setUsernameError(" ");
    setPasswordError(" ");
    setRepeatPasswordError(" ");
    setNameError(" ");
    setSurnameError(" ");

    var dataValid = true;
    if (donorData.username === "") {
      setUsernameError("Username cannot be empty");
      dataValid = false;
    }
    if (donorData.password === "") {
      setPasswordError("Password cannot be empty");
      dataValid = false;
    }
    if (repeatPasswordRef.current.value !== donorData.password) {
      setRepeatPasswordError("Repeated password doesn't match");
      dataValid = false;
    }
    if (donorData.name === "") {
      setNameError("Name cannot be empty");
      dataValid = false;
    }
    if (donorData.surname === "") {
      setSurnameError("Surname cannot be empty");
      dataValid = false;
    }
    if (dataValid) {
      fetch(createUrl, {
        method: "POST",
        body: JSON.stringify(donorData),
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
            navigate("/login", {
              state: {
                isRegistrationSuccesful: true,
              },
            });
          },
          (error) => {
            setUsernameError("Username already exists");
            console.log(error);
          }
        );
    }
  }

  return (
    <div className={classes.mainDiv}>
      <div className={classes.formDiv}>
        <Typography variant="h3" marginBottom={3}>
          Register new Donor
        </Typography>
        <TextField
          label="Username"
          type="text"
          margin="dense"
          required
          inputRef={usernameRef}
          helperText={usernameError}
          error={usernameError !== " "}
        />
        <TextField
          label="Password"
          type="password"
          margin="dense"
          required
          inputRef={passwordRef}
          helperText={passwordError}
          error={passwordError !== " "}
        />
        <TextField
          label="Repeat Password"
          type="password"
          margin="dense"
          required
          inputRef={repeatPasswordRef}
          helperText={repeatPasswordError}
          error={repeatPasswordError !== " "}
        />
        <TextField
          label="Name"
          type="text"
          margin="dense"
          required
          inputRef={nameRef}
          helperText={nameError}
          error={nameError !== " "}
        />
        <TextField
          label="Surname"
          type="text"
          margin="dense"
          required
          inputRef={surnameRef}
          helperText={surnameError}
          error={surnameError !== " "}
        />
        <Button variant="contained" size="small" onClick={signUpHandler}>
          Sign Up
        </Button>
      </div>
    </div>
  );
}

export default RegisterDonor;
