import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [itemsInPersonCart, setitemsInPersonCart] = useState(0);
  const [lanes, setLanes] = useState([[6], [2], [5], [4], [5]]);

  function addPersonToLane(e) {
    e.preventDefault();
    if (itemsInPersonCart === undefined || itemsInPersonCart <= 0) return;

    let laneWithLeast;
    let leastItemsAmount = 1e9;

    //fine line with least items
    for (let lane of lanes) {
      const totalInLane = lane.reduce((sum, value) => sum + value, 0);
      if (totalInLane < leastItemsAmount) {
        laneWithLeast = lane;
        leastItemsAmount = totalInLane;
      }
    }
    //push the itemsInPersonCart to lane
    setLanes((prevLanes) =>
      prevLanes.map((lane) =>
        lane === laneWithLeast ? [...lane, itemsInPersonCart] : lane
      )
    );
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setLanes((prevLanes) => {
        return prevLanes.map((lane) => {
          return [lane[0] - 1, ...lane.slice(1)].filter((value) => value > 0);
        });
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <main className="App">
      <form onSubmit={addPersonToLane}>
        <input
          id="itemsInPersonCart"
          name="itemsInPersonCart"
          type="number"
          defaultValue={0}
          required
          value={itemsInPersonCart}
          onChange={(e) => setitemsInPersonCart(e.currentTarget.valueAsNumber)}
        ></input>
        <button type="Submit" value={"Submit"} className="checkout">
          Checkout
        </button>
      </form>

      <div className="lanes-container">
        {lanes.map((lane, idx) => (
          <div className="lanes-item" key={idx}>
            {lane.map((numberOfItems, laneIdx) => (
              <div key={laneIdx}>{numberOfItems}</div>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
