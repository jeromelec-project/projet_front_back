const errorSigninMessage = document.getElementsByClassName("errorSignin")[0];


async function login(email, password, username) {
  try {
    const response = await fetch(`http://localhost:3000/api/sign`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        
            "email": email,
            "password": password,
            "username": username

      }),
    });

    const data = await response.json();
    console.log(data);
    if(data.status === "SUCCESS") {
        window.location.href = "index.html";
    } 

    if(data.status === "FAILED" || data.status === "CONFLICT") {
        errorSigninMessage.style.display = "block";
        errorSigninMessage.textContent = data.message;
    }

    return data;

} catch (error) {
    console.error(error);

    return null;
  }
}



const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const usernameInput = document.getElementById('username');

const form = document.querySelector('.signinForm');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = emailInput.value;
  const password = passwordInput.value;
  const username = usernameInput.value;
  await login(email, password, username);
});

