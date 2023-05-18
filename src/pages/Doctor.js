import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";

import classes from "./Doctor.module.css";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DoctorTodayAppointments from "../components/DoctorTodayAppointments";
import DoctorAllAppointments from "../components/DoctorAllAppointments";

function Doctor() {
  const pages = {
    today: 0,
    all: 1,
  };

  const { state } = useLocation();
  const { username } = state === null ? "" : state;

  const [pageDisplayed, setPageDisplayed] = useState(pages.today);
  const [data, setData] = useState({
    name: "Loading...",
  });
  const [location, setLocation] = useState({});

  const doctorURL = "http://localhost:8080/doctors";
  const locationURL = "http://localhost:8080/locations";

  function fetchData() {
    fetch(`${doctorURL}/${username}`)
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setData(data);
      });
    fetch(`${locationURL}/doctors/${username}`)
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setLocation(data);
      });
  }

  function todayAppSelectedHandler() {
    setPageDisplayed(pages.today);
  }

  function allAppSelectedHandler() {
    setPageDisplayed(pages.all);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={classes.mainDiv}>
      <AppBar position="sticky">
        <Toolbar>
          <Typography
            variant="h3"
            sx={{ flexGrow: 1 }}
          >{`Hi, ${data.name}`}</Typography>
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Button
              onClick={todayAppSelectedHandler}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Today's Appointments
            </Button>
            <Button
              onClick={allAppSelectedHandler}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              All Appointments
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <div className={classes.pageDiv}>
        {pageDisplayed === pages.today && (
          <DoctorTodayAppointments locationUuid={location.uuid} />
        )}
        {pageDisplayed === pages.all && (
          <DoctorAllAppointments locationUuid={location.uuid} />
        )}
      </div>
    </div>
  );
}

export default Doctor;
