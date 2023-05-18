/* eslint-disable react-hooks/exhaustive-deps */
import { Divider } from "@mui/material";
import classes from "./DoctorAllAppointments.module.css";
import { useEffect, useRef, useState } from "react";
import CustomTable from "./CustomTable";
import dayjs from "dayjs";
import DoctorSidebar from "./DoctorSidebar";

function DoctorAllAppointments(props) {
  const pageSize = 13;

  const [data, setData] = useState({
    appointmentList: [],
  });
  const [selectedDate, setSelectedDate] = useState();
  const [appointmentsPaginationModel, setAppointmentsPaginationModel] =
    useState({
      pageSize: pageSize,
      page: 0,
    });
  const [rowCount, setRowCount] = useState(0);
  const [rowCountState, setRowCountState] = useState(rowCount);
  const [donor, setDonor] = useState(null);
  const [enableConfirmAppointment, setEnableConfirmAppointment] =
    useState(false);
  const [enableAppointmentResult, setEnableAppointmentResult] = useState(false);

  const appointmentUuidRef = useRef(null);
  const cnpRef = useRef(null);
  const bloodTypeRef = useRef(null);
  const riskFactorsRef = useRef(null);
  const appointmentResultRef = useRef(null);

  const appointmentURL = "http://localhost:8080/appointments";
  const extendedDonorDataURL = "http://localhost:8080/donors/extended";

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

    const appointmentUuid = params.row.uuid;
    appointmentUuidRef.current.value = appointmentUuid;

    appointmentResultRef.current.value = data.appointmentList.find(
      (appointment) => appointment.uuid === appointmentUuid
    ).result;

    const donor = params.row.donor;
    setDonor(donor);

    fetch(`${extendedDonorDataURL}/${donor.cnp}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response);
      })
      .then(
        (data) => {
          console.log(data);
          cnpRef.current.value = donor.cnp;
          bloodTypeRef.current.value = data.bloodType;
          setSelectedDate(dayjs(data.soonestDonationDate).add(3, "month"));
          riskFactorsRef.current.value = data.riskFactors;

          setEnableAppointmentResult(true);
          setEnableConfirmAppointment(!params.row.isValid);
        },
        (error) => {
          console.log("Error: ");
          console.log(error);
        }
      );
  }

  function confirmAppointmentHandler() {
    const appointmentData = {
      isValid: true,
    };

    const uuid = appointmentUuidRef.current.value;

    fetch(`${appointmentURL}/${uuid}`, {
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
      bloodType: bloodTypeRef.current.value,
      riskFactors: riskFactorsRef.current.value,
    };

    fetch(`${extendedDonorDataURL}/${donor.cnp}`, {
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

  function updateAppointmentResultHandler() {
    const resultData = {
      result: appointmentResultRef.current.value,
    };

    const appointmentUuid = appointmentUuidRef.current.value;

    fetch(`${appointmentURL}/${appointmentUuid}`, {
      method: "PATCH",
      body: JSON.stringify(resultData),
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
      <DoctorSidebar
        appointmentUuidRef={appointmentUuidRef}
        cnpRef={cnpRef}
        bloodTypeRef={bloodTypeRef}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        riskFactorsRef={riskFactorsRef}
        confirmAppointmentHandler={confirmAppointmentHandler}
        enableConfirmAppointment={enableConfirmAppointment}
        appointmentResultRef={appointmentResultRef}
        updateAppointmentResultHandler={updateAppointmentResultHandler}
        enableAppointmentResult={enableAppointmentResult}
      />
    </div>
  );
}
export default DoctorAllAppointments;
