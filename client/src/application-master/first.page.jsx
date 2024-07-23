import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export function ApplicationMaster() {
  const [values, setvalue] = useState({
    APPName: "",
    VersionNum: "",
    ModuleName: "",
    InternalVersionNum: "",
    Status: "",
  });

  const [internalverlist, setinternalverlist] = useState([]);
  const [moudlenamelist, setmoudlenamelist] = useState([]);

  const [fromedit, setFromEdit] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.id) {
      const app_Id = location.state.id;
      setFromEdit(true);

      fetchData(app_Id);
    }
  }, [location.state]);

  async function fetchData(app_Id) {
    try {
      const response = await axios.get(
        `http://localhost:3333/application-master/${app_Id}`
      );

      const response2 = await axios.get(
        `http://localhost:3333/application-internal/${app_Id}`
      );

      const response3 = await axios.get(
        `http://localhost:3333/application-module/${app_Id}`
      );

      if (
        response.status === 200 &&
        response2.status === 200 &&
        response3.status === 200
      ) {
        setvalue({
          APPName: response.data[0].APPM_Name,
          Status: response.data[0].APPM_Status === 1 ? "Active" : "Inactive",
          VersionNum: response.data[0].APPM_GA_Release_No,
        });

        const internalverWithNumbers = response2.data.map((ver, index) => ({
          ...ver,
          no: index + 1,
        }));
        setinternalverlist(internalverWithNumbers);

        const moudleWithNumbers = response3.data.map((module, index) => ({
          ...module,
          no: index + 1,
          VersionNumber: response.data[0].APPM_GA_Release_No,
        }));

        setmoudlenamelist(moudleWithNumbers);
      }
    } catch (err) {
      console.log("error to get master data!", err);
    }
  }

  function handlechange(e) {
    const { name, value } = e.target;
    setvalue({
      ...values,
      [name]: value,
    });
  }

  function handleAddInternalVersion() {
    if (values.InternalVersionNum && values.VersionNum) {
      setinternalverlist([
        ...internalverlist,
        {
          no: internalverlist.length + 1,
          APPVM_Internal_VersionNo: values.InternalVersionNum,
        },
      ]);
      setvalue({ ...values, InternalVersionNum: "" });
    }
  }

  function handleAddMoudleName() {
    if (values.ModuleName && values.VersionNum) {
      setmoudlenamelist([
        ...moudlenamelist,
        {
          no: moudlenamelist.length + 1,
          VersionNumber: values.VersionNum,
          APPMD_Module_Name: values.ModuleName,
        },
      ]);
      setvalue({ ...values, ModuleName: "" });
    }
  }

  function handleclick() {
    let url;
    const method = fromedit ? "put" : "post";
    const payload = {
      ...values,
      internalverlist: internalverlist.map(
        (item) => item.APPVM_Internal_VersionNo
      ),
      versionnumlist: moudlenamelist.map((item) => item.VersionNumber),
      moudlenamelist: moudlenamelist.map((item) => item.APPMD_Module_Name),
    };
    if (fromedit) {
      payload.APPId = location.state.id;
      url = "http://localhost:3333/editApplicationData";
    } else {
      url = "http://localhost:3333/saveApplicationData";
    }
    axios({
      url,
      method,
      data: payload,
    })
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          setvalue({
            APPName: "",
            VersionNum: "",
            ModuleName: "",
            InternalVersionNum: "",
            Status: "",
          });

          setinternalverlist([]);
          setmoudlenamelist([]);
        }
      })
      .catch((error) => {
        console.error("There was an error saving the data!", error);
      });
  }

  function handleReset() {
    setvalue({
      APPName: "",
      VersionNum: "",
      ModuleName: "",
      InternalVersionNum: "",
      Status: "",
    });

    setinternalverlist([]);
    setmoudlenamelist([]);

    window.history.replaceState({}, "");
  }

  return (
    <div>
      <div>
        <div>
          <label>Application Name </label>
          <input
            type="text"
            name="APPName"
            value={values.APPName}
            onChange={handlechange}
          />
        </div>
        <div>
          <label>Application Status </label>
          <select name="Status" value={values.Status} onChange={handlechange}>
            <option value="">--select--</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div>
        <label>Version Number </label>
        <input
          type="number"
          name="VersionNum"
          value={values.VersionNum}
          onChange={handlechange}
        />
      </div>
      <div>
        <label>Internal Version Number </label>
        <input
          type="text"
          name="InternalVersionNum"
          value={values.InternalVersionNum}
          onChange={handlechange}
        />
        <button onClick={handleAddInternalVersion} className="first-buttons">
          ADD
        </button>
      </div>
      {internalverlist.length > 0 && (
        <div>
          <table className="list-table">
            <thead>
              <tr>
                <th>Sr.No</th>
                <th>Internal Version Number</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {internalverlist.map((item, key) => (
                <tr key={key}>
                  <td>{item.no}</td>
                  <td>{item.APPVM_Internal_VersionNo}</td>
                  <td>
                    <button
                      onClick={() =>
                        setinternalverlist(
                          internalverlist.filter((_, index) => index !== key)
                        )
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div>
        <label>Module Name </label>
        <input
          type="text"
          name="ModuleName"
          value={values.ModuleName}
          onChange={handlechange}
        />
        <button onClick={handleAddMoudleName} className="first-buttons">
          ADD
        </button>
      </div>
      {moudlenamelist.length > 0 && (
        <div>
          <table className="list-table">
            <thead>
              <tr>
                <th>Sr.No</th>
                <th>Version Number</th>
                <th>Module Name</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {moudlenamelist.map((item, key) => (
                <tr key={key}>
                  <td>{item.no}</td>
                  <td>{item.VersionNumber}</td>
                  <td>{item.APPMD_Module_Name}</td>
                  <td>
                    <button
                      onClick={() =>
                        setmoudlenamelist(
                          moudlenamelist.filter((_, index) => index !== key)
                        )
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button onClick={handleclick} type="submit" className="first-buttons">
        Save
      </button>
      <button onClick={handleReset} className="first-buttons">
        Reset
      </button>
      <button
        onClick={() => {
          navigate("/second");
        }}
        type="submit"
        className="first-buttons"
      >
        List
      </button>
    </div>
  );
}
