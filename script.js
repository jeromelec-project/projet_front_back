


function checkRegisterForm() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log("console", username, email, password);
    
    let sauvegarde = localStorage.getItem("sauvegarde");
    console.log(sauvegarde);
    if (sauvegarde == null) {
        sauvegarde = [];
    } else {
        sauvegarde = JSON.parse(sauvegarde);
    }
    sauvegarde.push({"username": username, "email": email, "password": password});
    localStorage.setItem("sauvegarde", JSON.stringify(sauvegarde));

}













const errorMessage = document.getElementsByClassName("errorSignin");


function checkLoginForm() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("pass").value;
    console.log(email, password);
    if (email === "jerome@gmail.com" && password === "12345678") {
        window.location.href = "form.html";
        console.log("ok");
    } else {
        errorMessage[0].style.display = "inline-block";
        console.log("pas ok");

    }
    
}