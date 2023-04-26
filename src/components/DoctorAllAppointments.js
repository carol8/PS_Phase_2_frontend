/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Divider, TextField } from "@mui/material";
import classes from "./DoctorAllAppointments.module.css";
import { useEffect, useRef, useState } from "react";
import CustomTable from "./CustomTable";

function DoctorAllAppointments(props) {
  const pageSize = 13;

  const [data, setData] = useState({
    appointmentList: [],
  });
  const [isAppointmentUuidSelected, setIsAppointmentUuidSelected] =
    useState(false);
  const [appointmentsPaginationModel, setAppointmentsPaginationModel] =
    useState({
      pageSize: pageSize,
      page: 0,
    });
  const [rowCount, setRowCount] = useState(0);
  const [rowCountState, setRowCountState] = useState(rowCount);

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

  function fetchData(paginationModel) {
    if (props.locationUuid !== undefined) {
      console.log(appointmentsPaginationModel);
      fetch(
        `${appointmentURL}/all?locationUuid=${props.locationUuid}&pageNumber=${paginationModel.page}&pageSize=${paginationModel.pageSize}`
      )
        .then((response) => {
          console.log(response);
          return response.json();
        })
        .then((data) => {
          data.appointmentList = data.appointmentList.map(
            (appointment, index) => ({
              ...appointment,
              id: paginationModel.page * paginationModel.pageSize + index + 1,
            })
          );

          console.log(data);

          setData(data);
          setRowCount(data.rowCount);
        });
    }
  }

  useEffect(() => {
    fetchData(appointmentsPaginationModel);
  }, [props.locationUuid]);

  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      rowCount !== undefined ? rowCount : prevRowCountState
    );
  }, [rowCount, setRowCountState]);

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
          fetchData(appointmentsPaginationModel);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  function pageChangedHandler(model) {
    setAppointmentsPaginationModel(model);
    // console.log(model);
    fetchData(model);
  }

  return (
    <div className={classes.mainDiv}>
      <div className={classes.tableDiv}>
        <CustomTable
          title="All Appointments"
          height="100%"
          rows={data.appointmentList}
          columns={columnsAppointments}
          initialState={{
            sorting: {
              sortModel: [{ field: "date", sort: "asc" }],
            },
          }}
          autoPageSize={false}
          rowCount={rowCountState}
          pageSizeOptions={[pageSize]}
          paginationMode="server"
          paginationModel={appointmentsPaginationModel}
          onRowClick={appointmentRowHandler}
          onPaginationModelChange={pageChangedHandler}
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
export default DoctorAllAppointments;
