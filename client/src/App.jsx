import "./App.css";
import Map from "./components/Map";
import Prompt from "./components/Prompt";

function App() {
  return (
    <div className="app">
      <div className="map">
        <Map />
      </div>
      <div className="prompt">
        <Prompt />
      </div>
    </div>
  );
}

export default App;
