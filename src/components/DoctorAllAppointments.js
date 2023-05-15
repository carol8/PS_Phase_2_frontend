/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import classes from "./DoctorAllAppointments.module.css";
import { useEffect, useRef, useState } from "react";
import CustomTable from "./CustomTable";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

function DoctorAllAppointments(props) {
  const pageSize = 13;

  const [data, setData] = useState({
    appointmentList: [],
  });
  const [bloodType, setBloodType] = useState("");
  const [selectedDate, setSelectedDate] = useState();
  const [appointmentsPaginationModel, setAppointmentsPaginationModel] =
    useState({
      pageSize: pageSize,
      page: 0,
    });
  const [rowCount, setRowCount] = useState(0);
  const [rowCountState, setRowCountState] = useState(rowCount);
  const [donor, setDonor] = useState(null);

  const appointmentUuidRef = useRef(null);
  const riskFactorsRef = useRef(null);

  const appointmentURL = "http://localhost:8080/appointments";
  const donorExtendedDataURL = "http://localhost:8080/donors/extendedData";

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
        `${appointmentURL}/locations/${props.locationUuid}?pageNumber=${paginationModel.page}&pageSize=${paginationModel.pageSize}`
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

  function appointmentRowHandler(params) {
    console.log(params);

    appointmentUuidRef.current.value = params.row.uuid;

    const donor = params.row.donor;
    setDonor(donor);

    fetch(`${donorExtendedDataURL}?cnp=${donor.cnp}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response);
      })
      .then(
        (data) => {
          console.log(data);
          setBloodType(data.bloodType);
          setSelectedDate(dayjs(data.soonestDonationDate).add(3, "month"));
          riskFactorsRef.current.value = data.riskFactors;
        },
        (error) => {
          console.log("Error: ");
          console.log(error);
        }
      );
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

    const extendedData = {
      cnp: donor.cnp,
      soonestDonationDate: dayjs(selectedDate).format("YYYY-MM-DD"),
      bloodType: bloodType,
      riskFactors: riskFactorsRef.current.value,
    };

    fetch(`${donorExtendedDataURL}`, {
      method: "PUT",
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
        <div>
          <TextField
            fullWidth
            required
            label="Appointment ID (Select from table)"
            id="appointmentUuid"
            type="text"
            margin="dense"
            inputRef={appointmentUuidRef}
            helperText={" "}
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth>
            <InputLabel id="bloodTypeLabel">Blood Type</InputLabel>
            <Select
              disabled
              required
              value={bloodType}
              labelId="bloodTypeLabel"
              id="bloodType"
              // inputRef={}
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
            <FormHelperText> </FormHelperText>
          </FormControl>
          <DatePicker
            label="Soonest donation date"
            slotProps={{
              textField: {
                helperText: " ",
                fullWidth: true,
              },
            }}
            value={selectedDate}
            onChange={setSelectedDate}
            disablePast
            required
          />
          <TextField
            label="Risk factors"
            id="riskFactors"
            type="text"
            margin="dense"
            fullWidth
            multiline
            minRows={5}
            inputRef={riskFactorsRef}
            helperText={" "}
            InputLabelProps={{ shrink: true }}
          />
        </div>
        <Button
          variant="contained"
          onClick={confirmAppointmentHandler}
          disabled={selectedDate == null}
        >
          Confirm Appointment
        </Button>
      </div>
    </div>
  );
}
export default DoctorAllAppointments;
