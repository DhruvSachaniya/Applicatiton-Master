import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { HomeRoute } from "./controller/home.js";
import {
  GetApplicationData,
  SaveApplicationData,
  getApplicationModuleData,
  getApplicationInternalData,
  GetApplicationMasterData,
  EditApplicationData,
  UpdateApplicationStatus,
} from "./controller/applicationmaster.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//routes
app.get("/home", HomeRoute);
app.post("/saveApplicationData", SaveApplicationData);
app.get("/getApplicationData", GetApplicationData);
app.get("/application-module/:APPMD_ApplicationId", getApplicationModuleData);
app.get("/application-internal/:APPVM_APPM_ID", getApplicationInternalData);
app.get("/application-master/:APPM_ID", GetApplicationMasterData);
app.put("/editApplicationData", EditApplicationData);
app.put("/application-status/:APPM_ID", UpdateApplicationStatus);

app.listen(3333, () => {
  console.log("connected to backend!");
});
