import Adblocker from "./Components/AdBlocker";
import "./App.css";
import TabManger from "./Components/TabManger";
import ProductivityTracker from "./Components/ProductivityTracker";

function App() {
  return (
    <div className="popup_container">
      <h1>My Extension</h1>
      <TabManger />
      <Adblocker />
      <ProductivityTracker />
    </div>
  );
}

export default App;
