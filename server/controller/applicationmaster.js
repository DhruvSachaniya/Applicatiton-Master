import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "test",
});

export function SaveApplicationData(req, res) {
  const {
    APPName,
    Status,
    VersionNum,
    internalverlist,
    versionnumlist,
    moudlenamelist,
  } = req.body;

  if (APPName.length > 255 || APPName.length < 1) {
    return res.status(400).json({ message: "Error In Name Field!" });
  }

  const FindAppName = `
    SELECT
      *
    FROM
      applicationmaster
    WHERE
      APPM_Name = ?
  `;

  db.query(FindAppName, [APPName], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error updating data");
    }
    if (results.length > 0) {
      return res.status(400).send("Name already exists!");
    }

    // Start a transaction
    db.beginTransaction((err) => {
      if (err) {
        return res.status(500).json({ message: "Transaction error", err });
      }

      // Insert into applicationmaster
      const insertApplicationMaster = `
        INSERT INTO applicationmaster (APPM_Name, APPM_GA_Release_No, APPM_Status)
        VALUES (?, ?, ?)
      `;
      db.query(
        insertApplicationMaster,
        [APPName, VersionNum, Status === "Active" ? 1 : 0],
        (err, result) => {
          if (err) {
            return db.rollback(() => {
              res
                .status(500)
                .json({ message: "Error inserting application master", err });
            });
          }

          const applicationId = result.insertId;

          // Insert into applicationversionmaster for each version number
          const insertApplicationVersionMaster = `
            INSERT INTO applicationversionmaster (APPVM_APPM_ID, APPVM_GA_Release_No, APPVM_Internal_VersionNo, APPVM_Status)
            VALUES ?
          `;
          const versionValues = internalverlist.map((versionNum2) => [
            applicationId,
            VersionNum,
            versionNum2,
            Status === "Active" ? 1 : 0,
          ]);
          db.query(
            insertApplicationVersionMaster,
            [versionValues],
            (err, result) => {
              if (err) {
                return db.rollback(() => {
                  res.status(500).json({
                    message: "Error inserting application version master",
                    err,
                  });
                });
              }

              // Insert into applicationmodulemaster for each module name
              const insertApplicationModuleMaster = `
                INSERT INTO applicationmodulemaster (APPMD_ApplicationID, APPMD_Module_Name)
                VALUES ?
              `;
              const moduleValues = moudlenamelist.map((moduleName) => [
                applicationId,
                moduleName,
              ]);
              db.query(
                insertApplicationModuleMaster,
                [moduleValues],
                (err, result) => {
                  if (err) {
                    return db.rollback(() => {
                      res.status(500).json({
                        message: "Error inserting application module master",
                        err,
                      });
                    });
                  }

                  // Commit the transaction
                  db.commit((err) => {
                    if (err) {
                      return db.rollback(() => {
                        res
                          .status(500)
                          .json({ message: "Transaction commit error", err });
                      });
                    }
                    res
                      .status(200)
                      .json({ message: "Data saved successfully" });
                  });
                }
              );
            }
          );
        }
      );
    });
  });
}

export function GetApplicationData(req, res) {
  const query = `
    SELECT * FROM applicationmaster
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error retrieving data");
    } else {
      res.status(200).json(results);
    }
  });
}

export function getApplicationModuleData(req, res) {
  const { APPMD_ApplicationId } = req.params;

  if (!APPMD_ApplicationId) {
    return res.status(400).send("Application ID is required");
  }

  const query = `
    SELECT
      *
    FROM
      applicationmodulemaster
    WHERE
      APPMD_ApplicationId = ?
  `;

  db.query(query, [APPMD_ApplicationId], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error retrieving data");
    }
    res.status(200).json(results);
  });
}

export function getApplicationInternalData(req, res) {
  const { APPVM_APPM_ID } = req.params;

  if (!APPVM_APPM_ID) {
    return res.status(400).send("Application ID is required");
  }

  const query = `
    SELECT
      *
    FROM
      applicationversionmaster
    WHERE
      APPVM_APPM_ID = ?
  `;

  db.query(query, [APPVM_APPM_ID], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error retrieving data");
    }
    res.status(200).json(results);
  });
}

export function GetApplicationMasterData(req, res) {
  const { APPM_ID } = req.params;

  if (!APPM_ID) {
    return res.status(400).send("Application ID is required");
  }

  const query = `
    SELECT
      *
    FROM
      applicationmaster
    WHERE
      APPM_ID = ?
  `;

  db.query(query, [APPM_ID], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error retrieving data");
    }
    res.status(200).json(results);
  });
}

export function EditApplicationData(req, res) {
  const {
    APPId, // Make sure to pass the application ID in the request body
    APPName,
    Status,
    VersionNum,
    internalverlist,
    versionnumlist,
    moudlenamelist,
  } = req.body;

  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ message: "Transaction error", err });
    }

    // Update applicationmaster
    const updateApplicationMaster = `
      UPDATE applicationmaster
      SET APPM_Name = ?, APPM_GA_Release_No = ?, APPM_Status = ?
      WHERE APPM_ID = ?
    `;
    db.query(
      updateApplicationMaster,
      [APPName, VersionNum, Status === "Active" ? 1 : 0, APPId],
      (err, result) => {
        if (err) {
          return db.rollback(() => {
            res
              .status(500)
              .json({ message: "Error updating application master", err });
          });
        }

        // Delete from applicationmodulemaster
        const deleteApplicationModule = `
          DELETE FROM applicationmodulemaster WHERE APPMD_ApplicationId = ?
        `;
        db.query(deleteApplicationModule, [APPId], (err, result) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({
                message: "Error deleting application module master",
                err,
              });
            });
          }

          // Insert into applicationmodulemaster for each module name
          const insertApplicationModuleMaster = `
              INSERT INTO applicationmodulemaster (APPMD_ApplicationID, APPMD_Module_Name)
              VALUES ?
            `;
          const moduleValues = moudlenamelist.map((moduleName) => [
            APPId,
            moduleName,
          ]);
          db.query(
            insertApplicationModuleMaster,
            [moduleValues],
            (err, result) => {
              if (err) {
                return db.rollback(() => {
                  res.status(500).json({
                    message: "Error inserting application module master",
                    err,
                  });
                });
              }

              // Delete from applicationversionmaster
              const deleteAppInternalver = `
                  DELETE FROM applicationversionmaster WHERE APPVM_APPM_ID = ?
                `;
              db.query(deleteAppInternalver, [APPId], (err, result) => {
                if (err) {
                  return db.rollback(() => {
                    res.status(500).json({
                      message: "Error deleting application version master",
                      err,
                    });
                  });
                }

                // Insert into applicationversionmaster
                const insertApplicationVersionMaster = `
                      INSERT INTO applicationversionmaster (APPVM_APPM_ID, APPVM_GA_Release_No, APPVM_Internal_VersionNo, APPVM_Status)
                      VALUES ?
                    `;
                const versionValues = internalverlist.map((internalVersion) => [
                  APPId,
                  VersionNum,
                  internalVersion,
                  Status === "Active" ? 1 : 0,
                ]);
                db.query(
                  insertApplicationVersionMaster,
                  [versionValues],
                  (err, result) => {
                    if (err) {
                      return db.rollback(() => {
                        res.status(500).json({
                          message: "Error inserting application version master",
                          err,
                        });
                      });
                    }

                    // Commit the transaction
                    db.commit((err) => {
                      if (err) {
                        return db.rollback(() => {
                          res
                            .status(500)
                            .json({ message: "Transaction commit error", err });
                        });
                      }
                      res
                        .status(200)
                        .json({ message: "Data updated successfully" });
                    });
                  }
                );
              });
            }
          );
        });
      }
    );
  });
}

export function UpdateApplicationStatus(req, res) {
  const { APPM_ID } = req.params;

  if (!APPM_ID) {
    return res.status(400).send("Application ID is required");
  }

  const query = `
    UPDATE applicationmaster
    SET APPM_Status = 2
    WHERE APPM_ID = ?
  `;

  db.query(query, [APPM_ID], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error updating data");
    }
    res.status(200).json({ message: "Status updated successfully", results });
  });
}
