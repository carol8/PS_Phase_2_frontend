import { Button, TextField } from "@mui/material";
import classes from "./DoctorSidebar.module.css";
import { DatePicker } from "@mui/x-date-pickers";

export default function DoctorSidebar(props) {
  return (
    <div className={classes.sidebarDiv}>
      <div>
        <TextField
          fullWidth
          required
          label="Appointment ID (Select from table)"
          id="appointmentUuid"
          type="text"
          margin="dense"
          inputRef={props.appointmentUuidRef}
          helperText={" "}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          label="Cod Numeric Personal (CNP)"
          id="cnp"
          type="text"
          margin="dense"
          disabled
          inputRef={props.cnpRef}
          helperText={" "}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          label="Blood Type"
          id="bloodType"
          type="text"
          margin="dense"
          disabled
          inputRef={props.bloodTypeRef}
          helperText={" "}
          InputLabelProps={{ shrink: true }}
        />
        <DatePicker
          label="Soonest donation date"
          slotProps={{
            textField: {
              helperText: " ",
              fullWidth: true,
            },
          }}
          value={props.selectedDate}
          onChange={props.setSelectedDate}
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
          inputRef={props.riskFactorsRef}
          helperText={" "}
          InputLabelProps={{ shrink: true }}
        />
        <Button
          fullWidth
          variant="contained"
          onClick={props.confirmAppointmentHandler}
          disabled={!props.enableConfirmAppointment}
        >
          Confirm Appointment
        </Button>
      </div>
      <div>
        <TextField
          label="Appointment Result"
          id="appointmentResult"
          type="text"
          margin="dense"
          fullWidth
          multiline
          minRows={5}
          inputRef={props.appointmentResultRef}
          helperText={" "}
          InputLabelProps={{ shrink: true }}
        />
        <Button
          fullWidth
          variant="contained"
          onClick={props.updateAppointmentResultHandler}
          disabled={!props.enableAppointmentResult}
        >
          Update Appointment Result
        </Button>
      </div>
    </div>
  );
}
