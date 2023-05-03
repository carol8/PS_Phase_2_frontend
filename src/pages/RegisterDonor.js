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
  const [emailError, setEmailError] = useState(" ");
  const [phoneError, setPhoneError] = useState(" ");

  const usernameRef = useRef();
  const passwordRef = useRef();
  const repeatPasswordRef = useRef();
  const nameRef = useRef();
  const surnameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();

  const createUrl = "http://localhost:8080/donors";
  const usernameEmptyErrorString = "Username cannot be empty";
  const usernameExistsErrorString = "Username already exists";
  const passwordErrorString = "Password cannot be empty";
  const repeatPasswordErrorString = "Repeated password doesn't match";
  const nameErrorString = "Name cannot be empty";
  const surnameErrorString = "Surname cannot be empty";
  const emailErrorString = "Email cannot be empty";
  const phoneErrorString = "Phone number cannot be empty";

  function isFormValid(formData) {
    setUsernameError(" ");
    setPasswordError(" ");
    setRepeatPasswordError(" ");
    setNameError(" ");
    setSurnameError(" ");
    setEmailError(" ");
    setPhoneError(" ");

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
    if (formData.phone === "") {
      setPhoneError(phoneErrorString);
      dataValid = false;
    }

    return dataValid;
  }

  function signUpHandler() {
    const formData = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
      name: nameRef.current.value,
      surname: surnameRef.current.value,
      email: emailRef.current.value,
      phone: phoneRef.current.value,
    };

    if (isFormValid(formData)) {
      fetch(createUrl, {
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
            navigate("/login", {
              state: {
                isRegistrationSuccesful: true,
              },
            });
          },
          (error) => {
            setUsernameError(usernameExistsErrorString);
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
        <TextField
          label="Email"
          type="email"
          margin="dense"
          required
          inputRef={emailRef}
          helperText={emailError}
          error={emailError !== " "}
        />
        <TextField
          label="Phone Number"
          type="tel"
          margin="dense"
          required
          inputRef={phoneRef}
          helperText={phoneError}
          error={phoneError !== " "}
        />
        <Button variant="contained" size="small" onClick={signUpHandler}>
          Sign Up
        </Button>
      </div>
    </div>
  );
}

export default RegisterDonor;
