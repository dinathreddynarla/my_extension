import Adblocker from "./Components/AdBlocker";
import "./App.css";
import TabManger from "./Components/TabManger";

function App() {
  return (
    <div className="popup_container">
      <h1>My Extension</h1>
      <TabManger />
      <Adblocker />
    </div>
  );
}

export default App;
