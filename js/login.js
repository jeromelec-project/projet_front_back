
//  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOjMsImlzQWRtaW4iOnRydWUsImlhdCI6MTc3MTgzNjY4MywiZXhwIjoxNzcxODQwMjgzfQ.OcXzpHGKbprgjlUoRkW4NeHvLdFde3WRt77wb7IkGmg";
const errorLoginMessage = document.getElementsByClassName("errorSignin")[0];


async function login(email, password) {
  try {
    const response = await fetch(`http://localhost:3000/api/login`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        
            "email": email,
            "password": password
        
      }),
    });

    const data = await response.json();
    console.log(data);

    if(data.status === "SUCCESS") {
        localStorage.setItem("token", data.connected.token);
        localStorage.setItem("user", JSON.stringify(data.connected.user));
        window.location.href = "form.html";
    } 

    if(data.status === "FAILED") {
        errorLoginMessage.style.display = "block";
        errorLoginMessage.textContent = data.message;
    }

    return data;

  } catch (error) {
    console.error(error);

    return null;
  }
}



const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

const form = document.querySelector('.loginForm');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = emailInput.value;
  const password = passwordInput.value;
  await login(email, password);
});






// vieux truc a suprimer

// function checkRegisterForm() {
//     const username = document.getElementById("username").value;
//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;
//     console.log("console", username, email, password);
    
//     let sauvegarde = localStorage.getItem("sauvegarde");
//     console.log(sauvegarde);
//     if (sauvegarde == null) {
//         sauvegarde = [];
//     } else {
//         sauvegarde = JSON.parse(sauvegarde);
//     }
//     sauvegarde.push({"username": username, "email": email, "password": password});
//     localStorage.setItem("sauvegarde", JSON.stringify(sauvegarde));

// }













// const errorMessage = document.getElementsByClassName("errorSignin");


// function checkLoginForm() {
//     const email = document.getElementById("email").value;
//     const password = document.getElementById("pass").value;
//     console.log(email, password);
//     if (email === "jerome@gmail.com" && password === "12345678") {
//         window.location.href = "form.html";
//         console.log("ok");
//     } else {
//         errorMessage[0].style.display = "inline-block";
//         console.log("pas ok");

//     }
    
// }