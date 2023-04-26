import { TextField, Button, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import classes from "./Login.module.css";

function LandingPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { isRegistrationSuccesful } = state === null ? false : state;

  const [usernameError, setUsernameError] = useState(" ");
  const [passwordError, setPasswordError] = useState(" ");
  const [loginError, setLoginError] = useState(" ");

  const usernameEmptyErrorString = "Username cannot be empty";
  const passwordErrorString = "Password cannot be empty";
  const loginErrorString = "Username and/or password is incorrect!";

  const usernameRef = useRef();
  const passwordRef = useRef();

  function isFormValid(form) {
    var formValid = true;
    setUsernameError(" ");
    setPasswordError(" ");
    if (form.username === "") {
      setUsernameError(usernameEmptyErrorString);
      formValid = false;
    }
    if (form.password === "") {
      setPasswordError(passwordErrorString);
      formValid = false;
    }
    return formValid;
  }

  const signInHandler = (e) => {
    const userData = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };

    console.log(userData);

    if (isFormValid(userData)) {
      setLoginError(" ");
      fetch("http://localhost:8080/users", {
        method: "POST",
        body: JSON.stringify(userData),
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
            switch (data.userRole) {
              case "ADMIN":
                navigate("/admin", {
                  state: {
                    username: userData.username,
                  },
                });
                break;
              case "DONOR":
                navigate("/donor", {
                  state: {
                    username: userData.username,
                  },
                });
                break;
              case "DOCTOR":
                navigate("/doctor", {
                  state: {
                    username: userData.username,
                  },
                });
                break;
              default:
                console.log("Error while converting user to role!");
            }
          },
          (error) => {
            console.log(error);
            setLoginError(loginErrorString);
          }
        );
    }
  };

  return (
    <div className={classes.mainDiv}>
      <div className={classes.loginDiv}>
        <Typography variant="h3" marginBottom={5}>
          PS BloodBank
        </Typography>
        <TextField
          label="Username"
          id="username"
          type="text"
          margin="dense"
          required
          inputRef={usernameRef}
          helperText={usernameError}
          error={usernameError !== " "}
        />
        <TextField
          label="Password"
          id="password"
          type="password"
          margin="dense"
          required
          inputRef={passwordRef}
          helperText={passwordError}
          error={passwordError !== " "}
        />
        {isRegistrationSuccesful && (
          <h2 className={classes.registrationSuccesful}>
            Donor registration succesful!
          </h2>
        )}
        <div className={classes.errorDiv}>
          <Typography variant="p" style={{ color: "#FF0000" }}>
            {loginError}
          </Typography>
        </div>
        <div className={classes.buttonsDiv}>
          <Button variant="contained" onClick={signInHandler}>
            Sign In
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/register-donor")}
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
