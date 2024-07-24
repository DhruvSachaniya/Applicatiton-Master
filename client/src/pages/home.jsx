import { createContext, useContext } from "react";

const Themecon = createContext();

export function HomePage() {
  const plus = 1;
  return (
    <>
      <Themecon.Provider value={plus}>
        <Buttons />
      </Themecon.Provider>
    </>
  );
}

function Buttons() {
  const th = useContext(Themecon);
  function inqurement() {
    <Themecon.Provider value={th + 1}></Themecon.Provider>;
  }
  return (
    <>
      <h1>{th}</h1>

      <button onClick={() => inqurement()}></button>
      <button>-</button>
    </>
  );
}
