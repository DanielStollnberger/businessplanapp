const url = 'https://join-id-default-rtdb.europe-west1.firebasedatabase.app/';

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

    if (name && email && pass && pass === confirm && checked) {
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

async function init() {
    let userShort = document.getElementById('user-short');
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
        let initials = firstName[0] + lastName[0];
        user.innerHTML = currentUser.name;
        userShort.innerHTML = initials;
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
    let userShort = document.getElementById('user-short');
    let comma = document.getElementById('comma');
    let goodMorningH1 = document.getElementById('good-morning');

    goodMorningH1.style.fontWeight = '600';
    userShort.innerHTML = 'G';
    comma.innerHTML = '';
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