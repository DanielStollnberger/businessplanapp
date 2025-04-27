const url = 'https://join-id-default-rtdb.europe-west1.firebasedatabase.app/';
let priorityData = [];
let subtaskElements = [];

function firstInit() {
    let overlay = document.getElementById('first-load');
    overlay.classList.remove('hidden');

    setTimeout(() => {
        overlay.classList.add('shrink');
    }, 1000);
    setTimeout(() => {
        overlay.classList.add('hidden');
    }, 2000);
}

async function signup() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    const confirm = document.getElementById('confirm-password').value;
    const checked = document.getElementById('checkmark').checked;
    if (name && email && pass && pass === confirm && checked && checkName(name)) {
        const newUser = { name, email, password: pass }; //shortform-object - das gleiche wie const newUser = {"name":name,"email":email,"password":pass}
        await fetch(url + 'user.json', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser)
        });
        setTimeout(() => newSignup(email, pass), 1000);
    }
}

async function login() {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    let response = await fetch(url + 'user.json');
    let data = await response.json();

    for (let key in data) {
        if (data[key].email === email && data[key].password === pass) {
            setTimeout(() => passedAuth(key), 1000);
            return;
        }
    }

    alert("Login fehlgeschlagen – überprüfe deine Eingaben.");
}

async function init(site) {
    if (site == 'summary') {
        summaryInit();
    } else if (site == 'dashboard') {
        dashboardInit();
    }
}

async function passedAuth(key) {
    await fetch(url + 'currentUser.json', {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(key)
    });
    window.location.href = "./summary.html";
}

async function newSignup(emaile, pass) {
    let response = await fetch(url + 'user.json');
    let data = await response.json();
    for (let key in data) {
        if (data[key].email === emaile && data[key].password === pass) {

            await fetch(url + 'currentUser.json', {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(key)
            });
        }
    }
    window.location.href = "./summary.html";
}

function guestLogin() {
    setTimeout(guest, 1000);
}

async function guest() {
    await fetch(url + 'currentUser.json', {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify('guest')
    });
    window.location.href = "./summary.html";
}

async function guestSummary() {
    let comma = document.getElementById('comma');
    let goodMorningH1 = document.getElementById('good-morning');
    goodMorningH1.style.fontWeight = '600';
    comma.innerHTML = '';
    userShort.innerHTML = 'G';
}

function toggleButton() {
    const checked = document.getElementById('checkmark').checked;
    let checkmarkButton = document.getElementById('signup-button');

    if (checked) {
        checkmarkButton.disabled = true;
    } else {
        checkmarkButton.disabled = false;
    }
}

async function summaryInit() {
    let user = document.getElementById('user');
    let userResponse = await fetch(url + 'currentUser.json');
    let userData = await userResponse.json();
    let currentUserResponse = await fetch(url + 'user/' + userData + '.json');
    let currentUser = await currentUserResponse.json();
    if (userData == 'guest') {
        guestSummary();
    } else {
        let fullName = currentUser.name;
        let [firstName, lastName] = fullName.split(" ");
        user.innerHTML = firstName[0].toUpperCase() + firstName.substring(1) + ' ' + lastName[0].toUpperCase() + lastName.substring(1);
    }
}

async function dashboardInit() {
    renderToDos();
}

async function renderToDos() {
    let toDoContent = document.getElementById('to-do');
    let responseToDo = await fetch(url + 'tasks/to-do.json');
    let dataToDo = await responseToDo.json();
    let tasks = Object.keys(dataToDo).map((key) => [key, dataToDo[key]]);

for (let i = 0; i < tasks.length; i++) {
   toDoContent.innerHTML += `<div class="tasks">
                                <h3 class="${tasks[i][1]['category']}">${tasks[i][1]['category'].replace('-',' ')}</h3>
                                <h4 class="mt-30 mb-10">${tasks[i][1].title}</h4>
                                <span class="task-span">${tasks[i][1].description}</span>
                                <div class="dashboard-subtask-div fs-14 ml-10" style='white-space: nowrap;'>
                                    <progress value="0" max="100"></progress>
                                    <span>0/${tasks[i][1].subtasks.length} Subtasks</span>
                                </div>
                                <div class="assigned-div">
                                    <div>DS</div>
                                    <img src="./assets/icons/priority-medium.png" alt="">
                                </div>
                            </div>`;
}

    console.log(dataToDo);
    console.log(tasks);
}

function checkName(name) {
    if (name.split(/\s+/).length == 2) {
        return true;
    } else {
        alert('Enter your full name please!');
        return false;
    }
}

async function userShort() {
    let userShort = document.getElementById('user-short');
    let userResponse = await fetch(url + 'currentUser.json');
    let userData = await userResponse.json();
    let currentUserResponse = await fetch(url + 'user/' + userData + '.json');
    let currentUser = await currentUserResponse.json();
    if (userData == 'guest') {
        userShort.innerHTML = 'G';
    } else {
        let fullName = currentUser.name;
        let [firstName, lastName] = fullName.split(" ");
        let initials = firstName[0] + lastName[0];
        userShort.innerHTML = initials.toUpperCase();
    }
}

async function createTask() {
    let taskTitle = document.getElementById('task-title').value;
    let dueDate = document.getElementById('due-date').value;
    let category = document.getElementById('category-selection').value;
    let description = document.getElementById('description').value;
    let assignedTo = document.getElementById('assigned-to').value;
    let taskData = { title: taskTitle, "due-date": dueDate, priority: priorityData.toString(), category, description, "assigned-to": assignedTo, subtasks: subtaskElements };
    await fetch(url + 'tasks/to-do.json', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData)
    });
    clearTask();
}

function enableCreateTaskButton() {
    let taskTitle = document.getElementById('task-title').value;
    let dueDate = document.getElementById('due-date').value;
    let createButton = document.getElementById('create-task-button');
    let category = document.getElementById('category-selection').value

    if (taskTitle.length > 0 && dueDate.length > 0 && priorityData.length > 0 && (category === 'technical-task' || category === 'user-story')) {
        createButton.disabled = false;
    } else {
        createButton.disabled = true;
    }
}

function addInfoToTask(priority) {
    priorityData.splice(0);
    priorityData.push(priority);
    enableCreateTaskButton();
}

function clearTask() {
    document.getElementById('task-title').value = '';
    document.getElementById('due-date').value = '';
    document.getElementById('category-selection').value = '';
    document.getElementById('description').value = '';
    document.getElementById('assigned-to').value = '';
    document.getElementById('subtask-content').innerHTML = '';
    document.getElementById('subtask-input').value = '';
    document.getElementById("urgent").checked = false;
    document.getElementById("medium").checked = false;
    document.getElementById("low").checked = false;
    priorityData = [];
    subtaskElements = [];
};

function addSubtask() {
    let subtaskInput = document.getElementById('subtask-input').value
    subtaskElements.push(subtaskInput);

    let subtaskContent = document.getElementById('subtask-content');
    subtaskContent.innerHTML = '';
    for (let j = 0; j < subtaskElements.length; j++) {

        subtaskContent.innerHTML += `<li class='added-subtask'>${subtaskElements[j]}</li>`;
    }
    document.getElementById('subtask-input').value = '';
}