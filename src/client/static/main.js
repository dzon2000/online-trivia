const ws = new WebSocket('ws://localhost:3000/ws');
ws.onopen = (event) => {
    ws.send(JSON.stringify({
        action: "connect"
    }));
};

const 

ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    const listElement = document.getElementById("playersList");
    if ("fetch" === message.action) {
        let i = 0;
        children = [];
        [...message.data].forEach((player) => {
            const li = document.createElement("li");
            li.classList.add("list-group-item")
            if (i % 2 === 0) {
                li.classList.add("list-group-item-success")
            } else {
                li.classList.add("list-group-item-info")
            }
            const playerName = document.createTextNode(player.name);
            li.appendChild(playerName);

            children.push(li);
            i++;
        });
        listElement.replaceChildren(...children);
    } else if ("start" === message.action) {
        displayQuestion(message);
    } else if ("feedback" === message.action) {
        document.getElementById("score").innerText = message.score;
    } else if ("rank" === message.action) {
        document.getElementById("question").classList.add("d-none");
        document.getElementById("question").classList.remove("d-block");
        document.getElementById("standing").classList.add("d-block");
        document.getElementById("standing").classList.remove("d-none");

        const playersRank = document.getElementById("playersRank");
        let i = 0;
        children = [];
        [...message.rank].forEach((player) => {
            const li = document.createElement("li");
            li.classList.add("list-group-item")
            if (i % 2 === 0) {
                li.classList.add("list-group-item-success")
            } else {
                li.classList.add("list-group-item-info")
            }
            const playerName = document.createTextNode(player.name + " : " + player.score);
            li.appendChild(playerName);

            children.push(li);
            i++;
        });
        playersRank.replaceChildren(...children);
    }
};

function displayQuestion(message) {
    let i = 0;
    children = [];
    hideElement("lobby");
    
    showElement("question");

    document.getElementById("questionTitle").innerText = `Question ${message.q.id}`;
    document.getElementById("questionContent").innerText = message.q.q;
    const listElement = document.getElementById("answerList");
    for (answer of message.q.a) {
        const btn = document.createElement("button");
        btn.classList.add("btn", "btn-lg", "btn-block");
        btn.addEventListener('click', sendAnswer);
        if (i % 2 === 0) {
            btn.classList.add("btn-primary");
        } else {
            btn.classList.add("btn-success");
        }
        const playerName = document.createTextNode(answer);
        btn.appendChild(playerName);

        children.push(btn);
        i++;
    }
    listElement.replaceChildren(...children);

    let timer = document.getElementById("timer");
    timer.innerText = "10.0";
    gotAnswer = false;
    const id = setInterval(function () {
        let cur = timer.innerText;
        if (cur - 0.1 < 0) {
            timer.innerText = "Time's up!";
            clearInterval(id);
            sendAnswer({ target: { innerText: "-1" } });
        } else {
            timer.innerText = (cur - 0.1).toFixed(1);
        }
    }, 100);
}

function showElement() {
    document.getElementById(elem).classList.add("d-block");
    document.getElementById(elem).classList.remove("d-none");
}

function hideElement(elem) {
    document.getElementById(elem).classList.add("d-none");
    document.getElementById(elem).classList.remove("d-block");
}

function hideAllElementsBut(elem) {

}

function register(form) {
    ws.send(JSON.stringify({
        name: form.playerName.value,
        action: 'register',
    }));
    document.getElementById("registerForm").classList.add("d-none");
    document.getElementById("registerForm").classList.remove("d-block");
    document.getElementById("lobby").classList.add("d-block");
    document.getElementById("lobby").classList.remove("d-none");
    ws.send(JSON.stringify({
        action: "fetch"
    }));
}
let gotAnswer = false;
async function start() {
    gotAnswer = false;
    const response = await fetch("/start");
}

function sendAnswer(event) {
    if (gotAnswer === true) {
        console.log("Ignoring second answer...");
        return;
    }
    console.log("Sending answer...")
    gotAnswer = true;
    ws.send(JSON.stringify({
        action: "answer",
        answer: event.target.innerText
    }));
}