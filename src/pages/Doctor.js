import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";

import classes from "./Doctor.module.css";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DoctorTodayAppointments from "../components/DoctorTodayAppointments";
import DoctorAllAppointments from "../components/DoctorAllAppointments";

function Doctor() {
  const pages = {
    today: 0,
    all: 1,
  };
  const navigate = useNavigate();

  const { state } = useLocation();
  const { username } = state === null ? "" : state;

  const [pageDisplayed, setPageDisplayed] = useState(pages.today);
  const [data, setData] = useState({
    name: "Loading...",
    location: { uuid: undefined },
  });

  const doctorURL = "http://localhost:8080/doctors";

  function fetchData() {
    fetch(`${doctorURL}?username=${username}`)
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setData(data);
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
          <DoctorTodayAppointments locationUuid={data.location.uuid} />
        )}
        {pageDisplayed === pages.all && (
          <DoctorAllAppointments locationUuid={data.location.uuid} />
        )}
      </div>
    </div>
  );
}

export default Doctor;
