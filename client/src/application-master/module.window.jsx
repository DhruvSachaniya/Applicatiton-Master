export function ModuleNameWindow({ Data }) {
  return (
    <>
      {Data.length > 0 && (
        <div>
          <table>
            <thead>
              <tr>
                <th>Sr.No</th>
                <th>Module Name</th>
              </tr>
            </thead>
            <tbody>
              {Data.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.APPMD_Module_Name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
