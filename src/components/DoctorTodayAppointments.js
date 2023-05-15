/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Divider, TextField } from "@mui/material";
import classes from "./DoctorTodayAppointments.module.css";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import CustomTable from "./CustomTable";

function DoctorTodayAppointments(props) {
  const [data, setData] = useState({
    appointmentList: [],
  });
  const [isAppointmentUuidSelected, setIsAppointmentUuidSelected] =
    useState(false);

  const appointmentUuidRef = useRef(null);

  const appointmentURL = "http://localhost:8080/appointments";

  const columnsAppointments = [
    { field: "id", headerName: "ID", flex: 1 },
    {
      field: "donorName",
      headerName: "Donor Name",
      flex: 1,
      valueGetter: (params) => `${params.row.donor.name}`,
    },
    {
      field: "donorSurname",
      headerName: "Donor Surname",
      flex: 1,
      valueGetter: (params) => `${params.row.donor.surname}`,
    },
    { field: "date", headerName: "Date", flex: 1 },
    {
      field: "isValid",
      headerName: "Appointment Status",
      flex: 1,
      valueGetter: (params) =>
        params.row.isValid ? "Confirmed" : "Not confirmed",
    },
  ];

  function fetchData() {
    if (props.locationUuid !== undefined) {
      fetch(
        `${appointmentURL}/locations/${
          props.locationUuid
        }?date=${dayjs().format("YYYY-MM-DD")}`
      )
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

          setData(data);
        });
    }
  }

  useEffect(() => {
    fetchData();
  }, [props.locationUuid]);

  function updateAppointmentField(uuid) {
    appointmentUuidRef.current.value = uuid;
    setIsAppointmentUuidSelected(true);
  }

  function appointmentRowHandler(params) {
    console.log(params);

    updateAppointmentField(params.row.uuid);
  }

  function confirmAppointmentHandler() {
    const appointmentData = {
      uuid: appointmentUuidRef.current.value,
      isValid: true,
    };

    fetch(`${appointmentURL}`, {
      method: "PATCH",
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
        },
        (error) => {
          console.log(error);
        }
      );
  }

  return (
    <div className={classes.mainDiv}>
      <div className={classes.tableDiv}>
        <CustomTable
          title="Today's Appointments"
          height="100%"
          rows={data.appointmentList}
          columns={columnsAppointments}
          onRowClick={appointmentRowHandler}
          pageSizeOptions={[13]}
        />
      </div>
      <Divider orientation="vertical" />
      <div className={classes.sidebarDiv}>
        <TextField
          label="Appointment ID (Select from table)"
          id="appointmentUuid"
          type="text"
          margin="dense"
          inputRef={appointmentUuidRef}
          helperText={" "}
          InputLabelProps={{ shrink: true }}
        />
        <Button
          variant="contained"
          disabled={!isAppointmentUuidSelected}
          onClick={confirmAppointmentHandler}
        >
          Confirm Appointment
        </Button>
      </div>
    </div>
  );
}
export default DoctorTodayAppointments;
