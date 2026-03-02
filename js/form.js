
const logout = document.getElementsByClassName("logout")[0];
logout.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "index.html";
});

const token = localStorage.getItem("token");
if(token === null) {
    window.location.href = "index.html";
}

const user = localStorage.getItem("user");
// console.log("user", user);
// console.log("user", JSON.parse(user).userName);
const userWelcome = document.getElementsByClassName("userWelcome")[0];
userWelcome.textContent = "Bienvenue " + JSON.parse(user).username;


const errorSigninMessage = document.getElementsByClassName("errorFormAjout")[0];
const tableau = document.querySelector(".tableau");
const cardsContainer = document.querySelector(".cardsContainer");


async function getJob() {
    const response = await fetch(`http://localhost:3000/api/job` + `?token=${token}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // renseigner le token pour accéder aux routes protégées
        },
    });

    const data = await response.json();
        console.log("data get job :",data);

    if( data.jobs.length === 0 ) {
        console.log("Aucun job n'a encore ete ajoutee !");
        console.log(data);
        tableau.innerHTML = "<p class='noJob'>Veuillez ajouter une entreprise et un Poste.</p>";
        cardsContainer.innerHTML = "<p class='noJob'>Veuillez ajouter une entreprise et un Poste.</p>";
        return data;

    } else {
        console.log("jobs chargées avec success !");
        console.log(data);
        //debut tableau
        tableau.innerHTML = "";
        var table = document.createElement('table');
        table.innerHTML = `<tr><th>Name</th><th>Post</th><th>Statut</th><th>Date</tSh><th>Address</th><th>Type</th><th>Contact</th><th>Notes</th><th>Action</th></tr>`;

        for (let i = 0; i < data.jobs.length; i++) {
            const entreprise = data.jobs[i];
            const eName = String(entreprise.entreprise.name);
            const tr = document.createElement("tr");
            tr.innerHTML = `
            <td>${entreprise.entreprise.name}</td>
            <td>${entreprise.job}</td>
            <td>${entreprise.status.status}</td>
            <td>${entreprise.sendDate}</td>
            <td>${entreprise.entreprise.address}</td>
            <td>${entreprise.offerType.offer}</td>
            <td>${entreprise.entreprise.contact}</td>
            <td>${entreprise.notes}</td>
            <td><div class="buttonContainerTable"><button onclick="deleteJob(${entreprise.idJob}, '${eName}')">Supprimer</button></div></td>
            `;
            console.log("id entreprise",entreprise);
            table.appendChild(tr);
        }
        tableau.appendChild(table);
        //fin tableau

        //debut cartes
        cardsContainer.innerHTML = "";
        var cards = document.createElement('div');
        cards.classList.add("cards");
        for (let i = 0; i < data.jobs.length; i++) {
            const entreprise = data.jobs[i];
            console.log("entreprise", entreprise);
            const eName = String(entreprise.entreprise.name);
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
            <div class="cardHeader">
            <p><h2>${entreprise.entreprise.name}</h2></p>
            <p>${entreprise.status.status}</p>
            </div>
            <p><span>Poste : </span>${entreprise.job}</p>
            <p><span>Date d'envoi : </span>${entreprise.sendDate}</p>
            <p><span>Addresse :</span>${entreprise.entreprise.address}</p>
            <p><span>Type de poste : </span>${entreprise.offerType.offer}</p>
            <p><span>Contact : </span>${entreprise.entreprise.contact}</p>
            <p><span>Notes : </span>${entreprise.notes}</p>
            <div class="buttonContainer"><button onclick="deleteJob(${entreprise.idJob}, '${eName}')">Supprimer</button></div>
            `;
            cards.appendChild(card);
        }
        cardsContainer.appendChild(cards);
        //fin cartes

        return data;
    }

}

getJob();

async function deleteJob(id, entrepriseName) {
    var EntrepriseId = 0;
    console.log(entrepriseName);

    await fetch(`http://localhost:3000/api/job/${id}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });


    const responseget = await fetch(`http://localhost:3000/api/entreprise`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    const dataget = await responseget.json();
    console.log("dataget get toutes les entreprise :",dataget);


    for (let i = 0; i < dataget.entreprises.length; i++) {
        const Entreprise = dataget.entreprises[i];
        console.log("entreprise delete entreprise :",Entreprise);
        if (Entreprise.name === entrepriseName) {
            EntrepriseId = Entreprise.idEntreprise;
            console.log("entrepriseId delete entreprise :",EntrepriseId);
            break;
        }
    }

    const response = await fetch(`http://localhost:3000/api/entreprise/${EntrepriseId}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    const data = await response.json();
    console.log("data delete entreprise :",data);

    getJob();
}


async function addJob( job, sendDate, offerTypeId, name, address, contact, statusId, notes ) {

// if( name !== "" || address !== "" || contact !== "" ) {
    var entrepriseId = await addEntreprise(name, address, contact);
    console.log("entrepriseId addjob addentreprise :",entrepriseId);
// } else {
//     checkEntreprise();
//     var entrepriseId = localStorage.getItem("varEntrepriseId");
//     console.log("entrepriseId addjob checkentreprises :",entrepriseId);
// }



        const responseForm = await fetch(`http://localhost:3000/api/job`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            "job": job,
            "sendDate": sendDate,
            "offerTypeId": offerTypeId,
            "entrepriseId": entrepriseId,
            "statusId": statusId,
            "notes": notes
        }),
    });

    const dataForm = await responseForm.json();

        console.log("log dataForm addjob :",dataForm);

    if(dataForm.status === "ERROR" || dataForm.status === "CONFLICT") {
        errorSigninMessage.style.display = "block";
        errorSigninMessage.textContent = dataForm.message;
    }

        getJob();

        return dataForm;

}




async function addEntreprise( name, address, contact ) {
    const responseForm = await fetch(`http://localhost:3000/api/entreprise`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            "name": name,
            "address": address,
            "contact": contact
        }),
    });

    const dataFormu = await responseForm.json();
    console.log("dataFormu addEntreprise:",dataFormu.entreprise.idEntreprise);

    return dataFormu.entreprise.idEntreprise;
    
}


const entrepriseForm = document.querySelector(".FormAjout");


const eNameInput = document.getElementById('entreprise_name');
const eAddressInput = document.getElementById('address');
const eContactInput = document.getElementById('contact');

const eJobInput = document.getElementById('poste');
const eDateInput = document.getElementById('date');

const eStatutInput = document.getElementById('statut');
const eTypeInput = document.getElementById('type');

const eNotesInput = document.getElementById('notes');

entrepriseForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const job = eJobInput.value;
    const sendDate = eDateInput.value;
    const typeId = eTypeInput.value;
    const statusId = eStatutInput.value;
    const notes = eNotesInput.value;
    const name = eNameInput.value;  
    const address = eAddressInput.value;
    const contact = eContactInput.value;
    console.log(job, sendDate, typeId, statusId, notes, name, address, contact);

    await addJob(job, sendDate, typeId, name, address, contact, statusId, notes);
});





