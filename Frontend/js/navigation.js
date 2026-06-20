function goToLogin()
{
    let role =
        document.getElementById("role").value;

    if(role == "1")
        location.href="student-login.html";

    else if(role == "2")
        location.href="company-login.html";

    else
        location.href="admin-login.html";
}

function goToRegister()
{
    let role =
        document.getElementById("role").value;

    if(role == "1")
        location.href="student-register.html";

    else if(role == "2")
        location.href="company-register.html";

    else
        alert("Admin Registration Not Allowed");
}