(function connect() {
  let socket = io.connect("http://localhost:3000");

  socket.on("connect", () => {
    console.log("Connected to server");
  });

  let username = document.querySelector("#username");
  let usernameBtn = document.querySelector("#usernameBtn");
  let curUsername = document.querySelector(".card-header");

  usernameBtn.addEventListener("click", (e) => {
    changeUsername();
  });

  username.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      changeUsername();
    }
  });

  function changeUsername() {
    console.log(username.value);
    socket.emit("change_username", { username: username.value });
    curUsername.textContent = username.value;
    username.value = "";
  }

  let message = document.querySelector("#message");
  let messageBtn = document.querySelector("#messageBtn");
  let messageList = document.querySelector("#message-list");

  messageBtn.addEventListener("click", () => {
    sendMessage();
  });

  message.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  function sendMessage() {
    let messageInput = message.value.trim();
    if (messageInput !== "") {
      socket.emit("new_message", { message: messageInput });
      message.value = "";
    }
  }

  socket.on("receive_message", (data) => {
    console.log(data);
    let listItem = document.createElement("li");

    if (data.username === curUsername.textContent) {
      listItem.classList.add("list-group-item", "text-end");
    } else {
      
      listItem.classList.add("list-group-item", "text-start"); 
    }

    listItem.textContent = data.username + ": " + data.message;
    messageList.appendChild(listItem);
  });

  let info = document.querySelector('.info');

  message.addEventListener('keypress', e => {
    socket.emit('typing')
  })

  socket.on('typing', data => {
    info.textContent = data.username + " is typing..."
    setTimeout(() => { info.textContent = ''}, 3000)
  })
})();