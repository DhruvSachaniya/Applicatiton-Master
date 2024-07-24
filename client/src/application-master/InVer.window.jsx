export function InternalVerWindow({ Data }) {
  return (
    <>
      {Data.length > 0 && (
        <div>
          <table>
            <thead>
              <tr>
                <th>Sr.No</th>
                <th>Internal Version Number</th>
              </tr>
            </thead>
            <tbody>
              {Data.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.APPVM_Internal_VersionNo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
