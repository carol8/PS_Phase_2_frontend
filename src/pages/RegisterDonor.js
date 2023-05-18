import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";

import classes from "./RegisterDonor.module.css";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

function RegisterDonor() {
  const navigate = useNavigate();

  const [usernameError, setUsernameError] = useState(" ");
  const [passwordError, setPasswordError] = useState(" ");
  const [repeatPasswordError, setRepeatPasswordError] = useState(" ");
  const [nameError, setNameError] = useState(" ");
  const [surnameError, setSurnameError] = useState(" ");
  const [emailError, setEmailError] = useState(" ");
  const [phoneError, setPhoneError] = useState(" ");
  const [cnpError, setCnpError] = useState(" ");
  const [bloodTypeError, setBloodTypeError] = useState(" ");

  const usernameRef = useRef();
  const passwordRef = useRef();
  const repeatPasswordRef = useRef();
  const nameRef = useRef();
  const surnameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const cnpRef = useRef();
  const bloodTypeRef = useRef();

  const donorURL = "http://localhost:8080/donors";
  const extendedDataURL = "http://localhost:8080/donors/extended";
  const usernameEmptyErrorString = "Username cannot be empty";
  const usernameExistsErrorString = "Username already exists";
  const passwordErrorString = "Password cannot be empty";
  const repeatPasswordErrorString = "Repeated password doesn't match";
  const nameErrorString = "Name cannot be empty";
  const surnameErrorString = "Surname cannot be empty";
  const emailErrorString = "Email cannot be empty";
  const phoneErrorString = "Phone number cannot be empty";
  const cnpErrorString = "CNP cannot be empty";
  const bloodTypeErrorString = "Blood Type cannot be empty";

  function isDonorDataValid(formData) {
    setUsernameError(" ");
    setPasswordError(" ");
    setRepeatPasswordError(" ");
    setNameError(" ");
    setSurnameError(" ");
    setEmailError(" ");
    setPhoneError(" ");
    setCnpError(" ");

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
    if (formData.cnp === "") {
      setCnpError(cnpErrorString);
      dataValid = false;
    }

    return dataValid;
  }

  function isExtendedDataValid(extendedData) {
    setBloodTypeError(undefined);

    var dataValid = true;

    if (extendedData.bloodType === undefined) {
      setBloodTypeError(bloodTypeErrorString);
      dataValid = false;
    }

    return dataValid;
  }

  function signUpHandler() {
    const donorData = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
      name: nameRef.current.value,
      surname: surnameRef.current.value,
      email: emailRef.current.value,
      phone: phoneRef.current.value,
      cnp: cnpRef.current.value,
    };

    const extendedData = {
      cnp: cnpRef.current.value,
      soonestDonationDate: dayjs().format("YYYY-MM-DD"),
      bloodType: bloodTypeRef.current.value,
      riskFactors: "",
    };

    console.log(donorData);
    console.log(extendedData);

    if (isDonorDataValid(donorData) && isExtendedDataValid(extendedData)) {
      fetch(donorURL, {
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
            fetch(extendedDataURL, {
              method: "POST",
              body: JSON.stringify(extendedData),
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
                  console.log(error);
                }
              );
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
          fullWidth
          label="Username"
          type="text"
          margin="dense"
          required
          inputRef={usernameRef}
          helperText={usernameError}
          error={usernameError !== " "}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="dense"
          required
          inputRef={passwordRef}
          helperText={passwordError}
          error={passwordError !== " "}
        />
        <TextField
          fullWidth
          label="Repeat Password"
          type="password"
          margin="dense"
          required
          inputRef={repeatPasswordRef}
          helperText={repeatPasswordError}
          error={repeatPasswordError !== " "}
        />
        <TextField
          fullWidth
          label="Name"
          type="text"
          margin="dense"
          required
          inputRef={nameRef}
          helperText={nameError}
          error={nameError !== " "}
        />
        <TextField
          fullWidth
          label="Surname"
          type="text"
          margin="dense"
          required
          inputRef={surnameRef}
          helperText={surnameError}
          error={surnameError !== " "}
        />
        <TextField
          fullWidth
          label="Email"
          type="email"
          margin="dense"
          required
          inputRef={emailRef}
          helperText={emailError}
          error={emailError !== " "}
        />
        <TextField
          fullWidth
          label="Phone Number"
          type="tel"
          margin="dense"
          required
          inputRef={phoneRef}
          helperText={phoneError}
          error={phoneError !== " "}
        />
        <TextField
          fullWidth
          label="Cod Numeric Personal (CNP)"
          type="text"
          margin="dense"
          required
          inputRef={cnpRef}
          helperText={cnpError}
          error={cnpError !== " "}
        />
        <FormControl fullWidth error={bloodTypeError !== undefined}>
          <InputLabel id="bloodTypeLabel">Blood Type</InputLabel>
          <Select
            required
            labelId="bloodTypeLabel"
            id="bloodType"
            inputRef={bloodTypeRef}
            label="Blood Type"
            InputLabelProps={{ shrink: true }}
          >
            <MenuItem value="O+">O+</MenuItem>
            <MenuItem value="O-">O-</MenuItem>
            <MenuItem value="A+">A+</MenuItem>
            <MenuItem value="A-">A-</MenuItem>
            <MenuItem value="B+">B+</MenuItem>
            <MenuItem value="B-">B-</MenuItem>
            <MenuItem value="AB+">AB+</MenuItem>
            <MenuItem value="AB-">AB-</MenuItem>
          </Select>
          <FormHelperText>{bloodTypeError}</FormHelperText>
        </FormControl>
        <Button variant="contained" size="small" onClick={signUpHandler}>
          Sign Up
        </Button>
      </div>
    </div>
  );
}

export default RegisterDonor;
