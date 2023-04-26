import { Route, Routes, Navigate } from "react-router-dom";
import LandingPage from "./pages/Login";
import RegisterDonor from "./pages/RegisterDonor";
import Administrator from "./pages/Administrator";
import Donor from "./pages/Donor";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/de";
import Doctor from "./pages/Doctor";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} localeText={"de"}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LandingPage />} />
        <Route path="/register-donor" element={<RegisterDonor />} />
        <Route path="/admin" element={<Administrator />} />
        <Route path="/donor" element={<Donor />} />
        <Route path="/doctor" element={<Doctor />} />
      </Routes>
    </LocalizationProvider>
  );
}

export default App;
