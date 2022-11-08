import "./App.css";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const tmpMessages = [
  "Bones",
  "Psych",
  "Big Bang Theory",
  "Mad Men",
  "Breaking Bad",
  "Modern Family",
  "Game of Thrones",
  "Dexter",
];

const socketOptions = {
  transportOptions: {
    polling: {
      extraHeaders: {
        Authorization: "tGzv3JOkF0XG5Qx2TlKWIA", //'Bearer h93t4293t49jt34j9rferek...'
      },
    },
  },
};
const socket = io("http://localhost:3007/chat", socketOptions);

function App() {
  const [counter, setCounter] = useState(0);
  const [_userId, set_] = useState(0);
  const [tmp2, settmp2] = useState("");
  const [lastM, setLastM] = useState([]);

  useEffect(() => {
    const propId = prompt("Id");
    set_(propId);


    socket.emit("joinRoom", { id: propId, chatRoom: "Room125" }, (resp) => {
      console.log(resp);
    });

    socket.emit("getLastMessagesEvent", {userId: propId, room: "Room125" }, (resp) => {
      console.log(resp)
      setLastM(resp)
    })

    socket.on("usersAmountWasChanged", () => {
      console.log("Amount was changed");
    });
    socket.on("NewMessageEvent", (resp) => {
      setLastM(oldArray => [...oldArray, resp]);
    });
 
    var getNumber = getRandomInterval();
    setInterval(() => {
      const message = parseInt(propId) % tmpMessages.length;
      socket.emit(
        "createMessageEvent",
        {
          room: "Room125",
          message: tmpMessages[message],
          username: `Username ${propId}`,
          userId: propId,
          amountOfSwearWords: 0,
        },
        (resp) => {
          // const arr = Array.from(resp);
          // setLastM(arr);
        }
        );
      }, getNumber * 1000);


  }, []);



  const getRandomInterval = () => {
    return Math.floor(Math.random() * (10 - 0 + 1) + 0);
  };

  const emitttttttt = () => {
    socket.emit("pingUser", { socketId: tmp2, message: "tmoset" });
  };

  const sendMes = () => {
    socket.emit(
      "createMessageEvent",
      {
        room: "Room125",
        userId: _userId,
        message: "Hola Hola",
        username: "User No Id",
        amountOfSwearWords: counter,
      },
      (resp) => {
        console.log(resp);
        if (resp.containSwearWords === true) {
          setCounter(counter + 1);
        }
      }
    );
  };

  return (
    <div>
      <button onClick={() => sendMes()}>Send tmp message</button>
      {/* <button onClick={() => console.log(counter)}>Tmp2</button> */}
      <div>
        Messages
      </div>
      <div style={{ height: "600px", overflow: "auto" }}>
        {lastM.map((el, i) => {
          return (
            <div key={i}>
              {el.username} {el.message}
            </div>
          );
        })}
      </div>

      <input
        type="text"
        name=""
        id=""
        onChange={(e) => settmp2(e.target.value)}
      />
      <button onChange={() => emitttttttt()}>test ping</button>
    </div>
  );
}

export default App;
