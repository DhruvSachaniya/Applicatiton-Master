import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ModuleNameWindow } from "./module.window";
import { InternalVerWindow } from "./InVer.window";

export function SecondPage() {
  const [applicationData, setApplicationData] = useState([]);
  const [appmodulenameData, setAppModuleNameData] = useState([]);
  const [appinternalverData, setAppInternalVerData] = useState([]);

  const [activemoudle, setActiveModule] = useState(null);
  const [activeinternalver, setActiveInternalVer] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3333/getApplicationData"
      );
      setApplicationData(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  async function handleMoudleName(id) {
    try {
      if (activemoudle === id) {
        setActiveModule(null);
      } else {
        setActiveModule(id);
        const response = await axios.get(
          `http://localhost:3333/application-module/${id}`
        );
        setAppModuleNameData(response.data);
      }
    } catch (err) {
      console.log("error to get popup data!", err);
    }
  }

  async function handleInternalVer(id) {
    try {
      if (activeinternalver === id) {
        setActiveInternalVer(null);
      } else {
        setActiveInternalVer(id);
        const response = await axios.get(
          `http://localhost:3333/application-internal/${id}`
        );
        setAppInternalVerData(response.data);
      }
    } catch (err) {
      console.log("error to get popup data!", err);
    }
  }

  async function handleDelete(id) {
    try {
      if (window.confirm("do you want to delete it!")) {
        const response = await axios.put(
          `http://localhost:3333/application-status/${id}`
        );
        if (response.status === 200) {
          fetchData();
        }
      }
    } catch (err) {
      console.log("error to delete the data!", err);
    }
  }

  return (
    <div>
      <div className="second-div-1">
        <button
          onClick={() => {
            navigate("/first");
          }}
          className="first-buttons"
          type="submit"
        >
          Back
        </button>

        <select name="Status">
          <option value="">--select--</option>
          {applicationData.map((item, index) => (
            <option key={index} value={item.APPM_Name}>
              {item.APPM_Name}
            </option>
          ))}
          {applicationData.map((item, index) => (
            <option key={index} value={item.APPM_GA_Release_No}>
              {item.APPM_GA_Release_No}
            </option>
          ))}
        </select>

        <input type="text" />

        <select name="Status">
          <option value="">--select--</option>
          {applicationData.map((item, index) => (
            <option key={index} value={item.APPM_Name}>
              {item.APPM_Name}
            </option>
          ))}
          {applicationData.map((item, index) => (
            <option key={index} value={item.APPM_GA_Release_No}>
              {item.APPM_GA_Release_No}
            </option>
          ))}
        </select>

        <input type="text" />

        <select name="status">
          <option value="">--select--</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div>
        <table>
          <thead>
            <tr>
              <th>Sr.No</th>
              <th>Application Name</th>
              <th>Version Number</th>
              <th>Module Name</th>
              <th>Internal Version Number</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {applicationData.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.APPM_Name}</td>
                <td>{item.APPM_GA_Release_No}</td>
                <td>
                  <div>
                    <img
                      onClick={() => handleMoudleName(item.APPM_ID)}
                      style={{
                        width: "40px",
                        height: "40px",
                        cursor: "pointer",
                      }}
                      src="https://www.iconpacks.net/icons/2/free-file-icon-1453-thumb.png"
                      alt="modulename"
                    />
                  </div>
                  {activemoudle === item.APPM_ID && (
                    <div
                      style={{
                        background: "white",
                        position: "absolute",
                        left: "28%",
                      }}
                    >
                      <ModuleNameWindow Data={appmodulenameData} />
                    </div>
                  )}
                </td>
                <td>
                  <img
                    onClick={() => handleInternalVer(item.APPM_ID)}
                    style={{ width: "40px", height: "40px", cursor: "pointer" }}
                    src="https://www.iconpacks.net/icons/2/free-file-icon-1453-thumb.png"
                    alt="internal"
                  />
                  {activeinternalver === item.APPM_ID && (
                    <div
                      style={{
                        background: "white",
                        position: "absolute",
                        left: "38%",
                      }}
                    >
                      <InternalVerWindow Data={appinternalverData} />
                    </div>
                  )}
                </td>
                <td>
                  {item.APPM_Status === 1
                    ? "Active"
                    : item.APPM_Status === 0
                    ? "inactive"
                    : "suspended"}
                </td>
                <td>
                  {item.APPM_Status === 0 || item.APPM_Status === 1 ? (
                    <button type="submit">
                      <Link
                        to={{
                          pathname: "/first",
                          state: 3,
                        }}
                        state={{ id: item.APPM_ID }}
                        style={{
                          color: "black",
                          textDecoration: "auto",
                        }}
                      >
                        edit
                      </Link>
                    </button>
                  ) : null}
                  {item.APPM_Status === 0 || item.APPM_Status === 1 ? (
                    <button
                      onClick={() => handleDelete(item.APPM_ID)}
                      type="submit"
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* {appmodulenameData.length > 0 && (
        <div>
          <table>
            <thead>
              <tr>
                <th>Sr.No</th>
                <th>Module Name</th>
              </tr>
            </thead>
            <tbody>
              {appmodulenameData.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.APPMD_Module_Name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )} */}

      {/* {appinternalverData.length > 0 && (
        <div>
          <table>
            <thead>
              <tr>
                <th>Sr.No</th>
                <th>Internal Version Number</th>
              </tr>
            </thead>
            <tbody>
              {appinternalverData.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.APPVM_Internal_VersionNo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )} */}
    </div>
  );
}
