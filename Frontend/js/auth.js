var API = "http://localhost:5000/api";

async function registerStudent() {
    const student = {
        fullName: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        college: document.getElementById("college").value,
        branch: document.getElementById("branch").value,
        password: document.getElementById("password").value
    };

    try {
        const response = await fetch(`${API}/student/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(student)
        });

        const result = await response.text();
        alert(result);

        if (response.ok) window.location.href = "studentlogin.html";
    } catch (error) {
        alert("Server Connection Failed");
        console.error(error);
    }
}

async function loginStudent() {
    const request = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    try {
        const response = await fetch(`${API}/student/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request)
        });

        if (response.ok) {
            const data = await response.json();
            sessionStorage.setItem("userId", data.studentId);
            sessionStorage.setItem("userName", data.fullName);
            sessionStorage.setItem("userRole", data.role);
            window.location.href = "studentdashboard.html";
        } else {
            const msg = await response.text();
            alert(msg || "Invalid Credentials");
        }
    } catch (error) {
        alert("Server Connection Failed");
        console.error(error);
    }
}

async function registerCompany() {
    const company = {
        companyName: document.getElementById("companyName").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        package: parseFloat(document.getElementById("package").value),
        eligibilityCriteria: "",
        jobDescription: ""
    };

    const response = await fetch("http://localhost:5000/api/company/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(company)
    });

    const result = await response.text();
    alert(result);

    if (response.ok) {
        window.location.href = "companylogin.html";
    }
}
async function loginCompany() {
    const request = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    try {
        const response = await fetch(`${API}/company/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request)
        });

        if (response.ok) {
            const data = await response.json();
            sessionStorage.setItem("userId", data.companyId);
            sessionStorage.setItem("userName", data.companyName);
            sessionStorage.setItem("userRole", data.role);
            window.location.href = "companydashboard.html";
        } else {
            const msg = await response.text();
            alert(msg || "Invalid Credentials");
        }
    } catch (error) {
        alert("Server Connection Failed");
        console.error(error);
    }
}

async function loginAdmin() {
    const request = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
    };

    try {
        const response = await fetch(`${API}/admin/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request)
        });

        if (response.ok) {
            const data = await response.json();
            sessionStorage.setItem("userId", data.adminId);
            sessionStorage.setItem("userName", data.username);
            sessionStorage.setItem("userRole", data.role);
            window.location.href = "admindashboard.html";
        } else {
            const msg = await response.text();
            alert(msg || "Invalid Credentials");
        }
    } catch (error) {
        alert("Server Connection Failed");
        console.error(error);
    }
}

function logout() {
    sessionStorage.clear();
    window.location.href = "index.html";
}


