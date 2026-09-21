const windows = [
    "computer",
    "browser",
    "notes",
    "calculator",
    "terminal",
    "about"
];

let highestZ = 20;

function openWindow(name) {
    const win = document.getElementById(name);

    win.style.display = "block";
    win.style.zIndex = ++highestZ;

    updateTasks();
}

function closeWindow(name) {
    document.getElementById(name).style.display = "none";
    updateTasks();
}

function minimizeWindow(name) {
    document.getElementById(name).style.display = "none";
    updateTasks();
}

function focusWindow(name) {
    const win = document.getElementById(name);

    if (win.style.display === "block") {
        win.style.zIndex = ++highestZ;
    }
}

function updateTasks() {
    const taskItems = document.getElementById("taskItems");

    taskItems.innerHTML = "";

    windows.forEach(function(name) {
        const win = document.getElementById(name);

        if (win.style.display === "block") {
            const button = document.createElement("button");

            button.className = "task-button";
            button.innerText = name.toUpperCase();

            button.onclick = function() {
                if (win.style.display === "none") {
                    win.style.display = "block";
                }

                focusWindow(name);
            };

            taskItems.appendChild(button);
        }
    });
}

function toggleStart() {
    const menu = document.getElementById("startMenu");

    if (menu.style.display === "block") {
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
    }
}

function updateClock() {
    const now = new Date();

    let hours = String(now.getHours()).padStart(2, "0");
    let minutes = String(now.getMinutes()).padStart(2, "0");
    let seconds = String(now.getSeconds()).padStart(2, "0");

    document.getElementById("clock").innerText =
        hours + ":" + minutes + ":" + seconds;

    document.getElementById("taskClock").innerText =
        hours + ":" + minutes;
}

setInterval(updateClock, 1000);
updateClock();

document.querySelectorAll(".window").forEach(function(win) {
    win.addEventListener("mousedown", function() {
        focusWindow(win.id);
    });
});

document.querySelectorAll(".title-bar").forEach(function(bar) {
    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    bar.addEventListener("mousedown", function(event) {
        if (event.target.tagName === "BUTTON") {
            return;
        }

        const win = bar.parentElement;

        dragging = true;

        focusWindow(win.id);

        const rect = win.getBoundingClientRect();

        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;

        event.preventDefault();
    });

    document.addEventListener("mousemove", function(event) {
        if (!dragging) {
            return;
        }

        const win = bar.parentElement;
        const desktop = document.querySelector(".desktop");

        const desktopRect = desktop.getBoundingClientRect();

        let newLeft = event.clientX - desktopRect.left - offsetX;
        let newTop = event.clientY - desktopRect.top - offsetY;

        const maxLeft = desktop.clientWidth - win.offsetWidth;
        const maxTop = desktop.clientHeight - win.offsetHeight;

        if (newLeft < 0) {
            newLeft = 0;
        }

        if (newTop < 0) {
            newTop = 0;
        }

        if (newLeft > maxLeft) {
            newLeft = maxLeft;
        }

        if (newTop > maxTop) {
            newTop = maxTop;
        }

        win.style.left = newLeft + "px";
        win.style.top = newTop + "px";
    });

    document.addEventListener("mouseup", function() {
        dragging = false;
    });
});

const commandInput = document.getElementById("commandInput");
const commandOutput = document.getElementById("commandOutput");

commandInput.addEventListener("keydown", function(event) {
    if (event.key !== "Enter") {
        return;
    }

    const command = commandInput.value.toLowerCase().trim();
    let result = "";

    if (command === "help") {
        result =
            "help   - show commands\n" +
            "date   - show date\n" +
            "time   - show time\n" +
            "clear  - clear screen\n" +
            "hello  - say hello\n" +
            "apps   - show installed apps\n" +
            "exit   - close terminal";
    } else if (command === "date") {
        result = new Date().toLocaleDateString();
    } else if (command === "time") {
        result = new Date().toLocaleTimeString();
    } else if (command === "hello") {
        result = "HELLO FROM RETRO OS!";
    } else if (command === "apps") {
        result =
            "INSTALLED APPS:\n" +
            "MY COMPUTER\n" +
            "WEB BROWSER\n" +
            "NOTEPAD\n" +
            "CALCULATOR\n" +
            "COMMAND.COM";
    } else if (command === "clear") {
        commandOutput.innerText = "";
        commandInput.value = "";
        return;
    } else if (command === "exit") {
        closeWindow("terminal");
        commandInput.value = "";
        return;
    } else if (command === "") {
        result = "";
    } else {
        result = "BAD COMMAND OR FILE NAME";
    }

    if (result) {
        commandOutput.innerText += "\n" + result;
    }

    commandInput.value = "";
});

let calcValue = "";

function calcInput(value) {
    calcValue += value;
    document.getElementById("calcDisplay").value = calcValue;
}

function calculate() {
    try {
        calcValue = String(Function("return " + calcValue)());
        document.getElementById("calcDisplay").value = calcValue;
    } catch {
        document.getElementById("calcDisplay").value = "ERROR";
        calcValue = "";
    }
}

function clearCalc() {
    calcValue = "";
    document.getElementById("calcDisplay").value = "";
}

const browserFrame = document.getElementById("browserFrame");
const addressBar = document.getElementById("addressBar");
const browserStatus = document.getElementById("browserStatus");

function goToSite(url) {
    addressBar.value = url;
    browserFrame.src = url;
    browserStatus.innerText = "LOADING " + url;
}

function goToAddress() {
    let address = addressBar.value.trim();

    if (!address) {
        return;
    }

    if (!address.startsWith("http://") && !address.startsWith("https://")) {
        if (address.includes(" ")) {
            address =
                "https://www.google.com/search?q=" +
                encodeURIComponent(address);
        } else {
            address = "https://" + address;
        }
    }

    addressBar.value = address;
    browserFrame.src = address;
    browserStatus.innerText = "LOADING";
}

function browserEnter(event) {
    if (event.key === "Enter") {
        goToAddress();
    }
}

function browserReload() {
    browserFrame.src = browserFrame.src;
    browserStatus.innerText = "RELOADING";
}

function browserBack() {
    try {
        browserFrame.contentWindow.history.back();
    } catch {
        browserStatus.innerText = "BACK";
    }
}

function browserForward() {
    try {
        browserFrame.contentWindow.history.forward();
    } catch {
        browserStatus.innerText = "FORWARD";
    }
}

browserFrame.addEventListener("load", function() {
    browserStatus.innerText = "DONE";
});

function shutdown() {
    document.querySelector(".desktop").style.display = "none";
    document.querySelector(".taskbar").style.display = "none";
    document.getElementById("startMenu").style.display = "none";

    const message = document.createElement("div");

    message.style.position = "absolute";
    message.style.inset = "0";
    message.style.background = "#000";
    message.style.color = "#aaa";
    message.style.display = "flex";
    message.style.justifyContent = "center";
    message.style.alignItems = "center";
    message.style.fontFamily = "Courier New, monospace";
    message.style.fontSize = "20px";
    message.innerText =
        "IT IS NOW SAFE TO TURN OFF YOUR COMPUTER.";

    document.querySelector(".screen").appendChild(message);
}

document.addEventListener("click", function(event) {
    const menu = document.getElementById("startMenu");
    const button = document.querySelector(".start-button");

    if (
        menu.style.display === "block" &&
        !menu.contains(event.target) &&
        event.target !== button
    ) {
        menu.style.display = "none";
    }
});