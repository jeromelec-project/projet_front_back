const errorSigninMessage = document.getElementsByClassName("errorSignin")[0];


async function login(email, password) {
  try {
    const response = await fetch(`http://localhost:3000/api/sign`, {
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
        window.location.href = "home.html";
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

const form = document.querySelector('.signinForm');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = emailInput.value;
  const password = passwordInput.value;
  await login(email, password);
});

