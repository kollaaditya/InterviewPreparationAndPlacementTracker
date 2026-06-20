# 🎯 Interview Preparation & Placement Tracker

<div align="center">
  
![Platform](https://img.shields.io/badge/Platform-Full%20Stack%20Web%20App-blue?style=for-the-badge)

![Backend](https://img.shields.io/badge/Backend-ASP.NET%20Core%20MVC-512BD4?style=for-the-badge&logo=dotnet)

![Frontend](https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JavaScript-F7DF1E?style=for-the-badge&logo=javascript)

![Database](https://img.shields.io/badge/Database-MySQL-4479A1?style=for-the-badge&logo=mysql)

![ORM](https://img.shields.io/badge/ORM-Entity%20Framework%20Core-512BD4?style=for-the-badge&logo=dotnet)

![Authentication](https://img.shields.io/badge/Auth-Session%20Based-success?style=for-the-badge)

![Architecture](https://img.shields.io/badge/Architecture-3%20Tier-orange?style=for-the-badge)

![Version Control](https://img.shields.io/badge/Git-GitHub-black?style=for-the-badge&logo=github)

![Status](https://img.shields.io/badge/Status-Completed-brightgreen?style=for-the-badge)

<br/>
</div>

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Module Descriptions](#-module-descriptions)
- [Database Design](#-database-design)
- [Technology Stack](#-technology-stack)
- [Folder Structure](#-folder-structure)
- [API Endpoints](#-api-endpoints)
- [Installation Guide](#-installation-guide)
- [Setup Instructions](#-setup-instructions)
- [Future Enhancements](#-future-enhancements)
- [Learning Outcomes](#-learning-outcomes)
- [Author](#-author)
- [License](#-license)

---

## 🌐 Project Overview

**Interview Preparation & Placement Tracker** is a multi-role, full-stack web application designed to bridge the gap between students seeking employment and companies looking for talent. The platform provides an end-to-end placement ecosystem that includes:

- 🎓 **Student Portal** — Registration, profile management, resume upload, job applications, and multi-domain assessments
- 🏢 **Company Portal** — Job posting, applicant management, resume viewing, and application status updates
- 🛡️ **Admin Panel** — Centralized management of students, companies, and the entire question bank
- 💻 **Coding Assessment** — Real-time code execution with Monaco Editor integration
- 🧮 **Aptitude Assessment** — Quantitative, logical, and data interpretation tests
- 🗣️ **Communication Assessment** — Grammar, vocabulary, and comprehension evaluation

The platform enforces **assessment security** through tab-switching detection, auto-submission, and anti-cheating mechanisms — simulating real-world placement examination environments.

---

## ✨ Key Features

### 👨‍🎓 Student Features
| Feature | Description |
|---|---|
| Registration & Login | Secure authentication with role-based access |
| Profile Management | Update personal, academic, and contact details |
| Resume Upload & View | PDF upload with server-side storage and preview |
| Job Search & Apply | Browse and apply to company-posted jobs |
| Application Tracking | Real-time application status monitoring |
| Coding Assessment | Solve coding problems with Monaco Editor |
| Aptitude Test | Timed quantitative and logical reasoning tests |
| Communication Test | Grammar, vocabulary, and comprehension evaluation |
| Submission History | Review past assessment attempts and scores |

### 🏢 Company Features
| Feature | Description |
|---|---|
| Registration & Login | Company-specific secure authentication |
| Dashboard | Overview of posted jobs and applicant activity |
| Post & Manage Jobs | Create, update, and manage job listings |
| View Applicants | Review all applicants for a specific job |
| View Student Resumes | Download and preview applicant resumes |
| Update Application Status | Approve, reject, or shortlist applicants |

### 🛡️ Admin Features
| Feature | Description |
|---|---|
| Admin Login | Secure admin-only authentication |
| Dashboard | Platform-wide statistics and overview |
| Manage Students | View, update, and remove student accounts |
| Manage Companies | View, update, and remove company accounts |
| Manage Coding Questions | Full CRUD on coding question bank |
| Manage Aptitude Questions | Full CRUD on aptitude question bank |
| Manage Communication Questions | Full CRUD on communication question bank |

### 🔒 Assessment Security
- ⏱️ Timer-based auto submission
- 🚫 Tab switching detection
- 📋 Copy/paste restriction
- 🖱️ Right-click disabled
- 🔐 Anti-cheating mechanisms

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│   HTML + CSS + JavaScript + Monaco Editor (Browser)            │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP/REST API (JSON)
┌────────────────────────────▼────────────────────────────────────┐
│                       PRESENTATION LAYER                        │
│              ASP.NET Core Web API Controllers                   │
│  StudentController | CompanyController | AdminController        │
│  JobsController | CodingController | AptitudeController         │
│  CommunicationController | ApplicationsController               │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                       BUSINESS LOGIC LAYER                      │
│                    Services (Interfaces + Impl)                 │
│  StudentService | CompanyService | AdminService                 │
│  JobService | CodingService | AptitudeService                   │
│  CommunicationService | JobApplicationService                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                       DATA ACCESS LAYER                         │
│                Repositories (Interfaces + Impl)                 │
│  StudentRepository | CompanyRepository | AdminRepository        │
│  JobRepository | CodingQuestionRepository | AptitudeRepository  │
│  CommunicationRepository | CodeSubmissionRepository             │
└────────────────────────────┬────────────────────────────────────┘
                             │ Entity Framework Core
┌────────────────────────────▼────────────────────────────────────┐
│                         DATABASE LAYER                          │
│                    MySQL via ApplicationDbContext               │
│           Students | Companies | Jobs | Applications            │
│    CodingQuestions | AptitudeQuestions | CommunicationQuestions │
└─────────────────────────────────────────────────────────────────┘
```

> **Design Pattern:** Controller → Service → Repository (Clean 3-Layer Architecture with Interface Abstraction)

---

## 📦 Module Descriptions

### 🎓 Student Module
The student module handles the complete lifecycle of a student user on the platform — from registration and login to job applications and assessment tracking. Students can manage their profiles, upload resumes in PDF format, search for jobs posted by companies, and track the status of their applications in real time.

### 🏢 Company Module
The company module provides recruiters with tools to manage the full hiring pipeline. Companies can register, post job openings with detailed descriptions, review applicants, view resumes, and update application statuses (Pending → Shortlisted → Rejected → Selected).

### 🛡️ Admin Module
The admin module offers centralized control over the entire platform. Administrators can monitor all registered students and companies, manage accounts, and maintain the assessment question banks across all three test domains (Coding, Aptitude, Communication).

### 💻 Coding Assessment Module
An integrated coding environment powered by **Monaco Editor** (the engine behind VS Code). Students solve timed coding challenges with an in-browser code execution environment. All submissions are persisted with timestamps and scores for review.

**Supported features:**
- Syntax-highlighted code editor
- Question bank managed by admin
- Timer-based auto-submission
- Submission history with results

### 🧮 Aptitude Assessment Module
A comprehensive aptitude testing module covering:
- **Quantitative Aptitude** — Arithmetic, algebra, percentages
- **Logical Reasoning** — Pattern recognition, syllogisms
- **Data Interpretation** — Charts and table-based questions
- Auto-scoring with timed test sessions

### 🗣️ Communication Assessment Module
Evaluates English language proficiency across:
- **Grammar** — Sentence structure and tense correction
- **Vocabulary** — Synonym, antonym, and word usage
- **Sentence Correction** — Error identification
- **Reading Comprehension** — Passage-based MCQs
- Auto-evaluation with instant results

---

## 🗄️ Database Design

### Entity Relationship Overview

```
Students ──────────────── Applications ──────────── Jobs
    │                          │                      │
    │                   CodeSubmissions           Companies
    │                   AptitudeResults               │
    │                   CommunicationResults      Admins
    │
CodingQuestions
AptitudeQuestions
CommunicationQuestions
```

### Database Tables

| Table | Primary Key | Description |
|---|---|---|
| `Students` | StudentId | Student profile, credentials, and resume path |
| `Companies` | CompanyId | Company profile and authentication details |
| `Admins` | AdminId | Admin credentials and role |
| `Jobs` | JobId | Job listings posted by companies |
| `Applications` | ApplicationId | Student-to-job application mapping with status |
| `CodingQuestions` | QuestionId | Problem statements, test cases, difficulty level |
| `CodeSubmissions` | SubmissionId | Student code, language, score, and timestamp |
| `AptitudeQuestions` | QuestionId | MCQ with options, correct answer, and category |
| `AptitudeResults` | ResultId | Student score, duration, and attempt date |
| `CommunicationQuestions` | QuestionId | MCQ with category (Grammar/Vocabulary/etc.) |
| `CommunicationResults` | ResultId | Student score and attempt details |

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|---|---|
| HTML5 | Page structure and semantic markup |
| CSS3 | Styling, layouts, and responsive design |
| JavaScript (ES6+) | Client-side logic, DOM manipulation, API calls |
| Monaco Editor | In-browser code editor for coding assessments |
| Fetch API | Asynchronous REST API communication |

### Backend
| Technology | Purpose |
|---|---|
| ASP.NET Core Web API (.NET 10) | RESTful API development |
| Entity Framework Core | ORM for database operations |
| C# | Primary programming language |
| Dependency Injection | Built-in .NET DI container |
| CORS Middleware | Cross-origin request handling |

### Database
| Technology | Purpose |
|---|---|
| MySQL | Relational database management |
| EF Core Migrations | Schema versioning and management |

### Architecture & Design Patterns
| Pattern | Application |
|---|---|
| Repository Pattern | Data access abstraction |
| Service Layer Pattern | Business logic separation |
| Interface Segregation | Loose coupling via interfaces |
| MVC/API Pattern | Controller-based routing |
| 3-Tier Architecture | Presentation → Business → Data |

---

## 📁 Folder Structure

```
InterviewprepTracker/
│
├── Backend/                          # ASP.NET Core Web API
│   ├── Controllers/                  # API route handlers
│   │   ├── AdminController.cs
│   │   ├── ApplicationsController.cs
│   │   ├── AptitudeController.cs
│   │   ├── CodingController.cs
│   │   ├── CommunicationController.cs
│   │   ├── CompanyController.cs
│   │   ├── DashboardController.cs
│   │   ├── JobsController.cs
│   │   └── StudentController.cs
│   │
│   ├── Models/                       # Entity and request models
│   │   ├── Student.cs
│   │   ├── Company.cs
│   │   ├── Admin.cs
│   │   ├── Job.cs
│   │   ├── Application.cs
│   │   ├── CodingQuestion.cs
│   │   ├── CodeSubmission.cs
│   │   ├── AptitudeQuestion.cs
│   │   ├── AptitudeResult.cs
│   │   ├── CommunicationQuestion.cs
│   │   ├── CommunicationResult.cs
│   │   └── ...RequestModels
│   │
│   ├── Services/                     # Business logic layer
│   │   ├── StudentService.cs / IStudentService.cs
│   │   ├── CompanyService.cs / ICompanyService.cs
│   │   ├── AdminService.cs / IAdminService.cs
│   │   ├── JobService.cs / IJobService.cs
│   │   ├── CodingService.cs / ICodingService.cs
│   │   ├── CodingExecutionService.cs
│   │   ├── AptitudeService.cs / IAptitudeService.cs
│   │   └── CommunicationService.cs / ICommunicationService.cs
│   │
│   ├── Repositories/                 # Data access layer
│   │   ├── StudentRepository.cs / IStudentRepository.cs
│   │   ├── CompanyRepository.cs / ICompanyRepository.cs
│   │   ├── AdminRepository.cs / IAdminRepository.cs
│   │   ├── JobRepository.cs / IJobRepository.cs
│   │   ├── CodingQuestionRepository.cs / ICodingQuestionRepository.cs
│   │   ├── CodeSubmissionRepository.cs / ICodeSubmissionRepository.cs
│   │   ├── AptitudeRepository.cs / IAptitudeRepository.cs
│   │   └── CommunicationRepository.cs / ICommunicationRepository.cs
│   │
│   ├── Data/
│   │   └── ApplicationDbContext.cs   # EF Core DbContext
│   │
│   ├── Migrations/                   # EF Core database migrations
│   ├── wwwroot/resumes/              # Uploaded student resume files
│   ├── appsettings.json              # App configuration & DB connection string
│   ├── program.cs                    # Application entry point & DI setup
│   └── Backend.csproj
│
└── Frontend/                         # Static HTML/CSS/JS client
    ├── css/
    │   └── style.css                 # Global stylesheet
    │
    ├── js/                           # Module-specific JavaScript
    │   ├── auth.js                   # Authentication logic
    │   ├── student.js                # Student portal logic
    │   ├── company.js                # Company portal logic
    │   ├── admin.js                  # Admin panel logic
    │   ├── jobs.js                   # Job listing & application logic
    │   ├── coding.js                 # Coding assessment logic
    │   ├── aptitude.js               # Aptitude test logic
    │   ├── communication.js          # Communication test logic
    │   ├── dashboard.js              # Dashboard statistics
    │   ├── navigation.js             # Page routing & navigation
    │   ├── timer.js                  # Assessment timer utility
    │   └── assessment-utils.js       # Shared assessment utilities
    │
    ├── index.html                    # Landing / Home page
    ├── studentlogin.html             # Student login
    ├── studentregister.html          # Student registration
    ├── studentdashboard.html         # Student dashboard
    ├── studentmanage.html            # Student profile management
    ├── companylogin.html             # Company login
    ├── companyregister.html          # Company registration
    ├── companydashboard.html         # Company dashboard
    ├── companymanage.html            # Company profile management
    ├── adminlogin.html               # Admin login
    ├── admindashboard.html           # Admin dashboard
    ├── adminquestions.html           # Question bank management
    ├── jobportal.html                # Job search & listings
    ├── codingeditor.html             # Monaco Editor coding environment
    ├── codingquestions.html          # Coding question list
    ├── coding-assessment.html        # Coding assessment entry
    ├── aptitudetest.html             # Aptitude test interface
    ├── aptitude-test.html            # Aptitude test runner
    ├── aptituderesults.html          # Aptitude test results
    ├── communicationtest.html        # Communication test interface
    ├── communication-test.html       # Communication test runner
    ├── communicationresults.html     # Communication test results
    └── submissions.html              # Submission history
```

---

## 🔌 API Endpoints

### 🎓 Student Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/student/register` | Register a new student |
| `POST` | `/api/student/login` | Student login |
| `GET` | `/api/student/{id}` | Get student profile |
| `PUT` | `/api/student/update/{id}` | Update student profile |
| `POST` | `/api/student/upload-resume/{id}` | Upload student resume (PDF) |
| `GET` | `/api/student/resume/{id}` | View/download student resume |

### 🏢 Company Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/company/register` | Register a new company |
| `POST` | `/api/company/login` | Company login |
| `GET` | `/api/company/{id}` | Get company profile |
| `PUT` | `/api/company/update/{id}` | Update company profile |

### 💼 Jobs Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/jobs` | Post a new job |
| `GET` | `/api/jobs` | Get all jobs |
| `GET` | `/api/jobs/{id}` | Get job by ID |
| `GET` | `/api/jobs/company/{companyId}` | Get jobs by company |
| `PUT` | `/api/jobs/{id}` | Update job listing |
| `DELETE` | `/api/jobs/{id}` | Delete job listing |

### 📄 Applications Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/applications/apply` | Apply for a job |
| `GET` | `/api/applications/student/{studentId}` | Get student's applications |
| `GET` | `/api/applications/job/{jobId}` | Get applicants for a job |
| `PUT` | `/api/applications/status/{id}` | Update application status |

### 💻 Coding Assessment Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/coding/questions` | Get all coding questions |
| `GET` | `/api/coding/questions/{id}` | Get question by ID |
| `POST` | `/api/coding/submit` | Submit code solution |
| `GET` | `/api/coding/submissions/{studentId}` | Get student submissions |
| `POST` | `/api/coding/run` | Execute code (run without submitting) |

### 🧮 Aptitude Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/aptitude/questions` | Get aptitude questions |
| `POST` | `/api/aptitude/submit` | Submit aptitude test answers |
| `GET` | `/api/aptitude/results/{studentId}` | Get student's aptitude results |

### 🗣️ Communication Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/communication/questions` | Get communication questions |
| `POST` | `/api/communication/submit` | Submit communication test |
| `GET` | `/api/communication/results/{studentId}` | Get student's communication results |

### 🛡️ Admin Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/admin/login` | Admin login |
| `GET` | `/api/admin/students` | Get all students |
| `GET` | `/api/admin/companies` | Get all companies |
| `DELETE` | `/api/admin/student/{id}` | Remove student account |
| `DELETE` | `/api/admin/company/{id}` | Remove company account |
| `POST` | `/api/admin/coding-question` | Add coding question |
| `POST` | `/api/admin/aptitude-question` | Add aptitude question |
| `POST` | `/api/admin/communication-question` | Add communication question |

### 📊 Dashboard Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard/student/{id}` | Student dashboard stats |
| `GET` | `/api/dashboard/company/{id}` | Company dashboard stats |
| `GET` | `/api/dashboard/admin` | Admin platform-wide stats |

---

## ⚙️ Installation Guide

### Prerequisites

Ensure the following are installed on your system:

| Tool | Version | Download |
|---|---|---|
| .NET SDK | 10.0+ | [dotnet.microsoft.com](https://dotnet.microsoft.com/download) |
| MySQL Server | 8.0+ | [mysql.com](https://dev.mysql.com/downloads/mysql/) |
| MySQL Workbench | Latest | [mysql.com](https://dev.mysql.com/downloads/workbench/) |
| Visual Studio / VS Code | Latest | [visualstudio.com](https://visualstudio.microsoft.com/) |
| Git | Latest | [git-scm.com](https://git-scm.com/) |
| Live Server Extension | Latest | VS Code Extension Marketplace |

---

## 🚀 Setup Instructions

### Step 1: Clone the Repository
```bash
git clone https://github.com/<your-username>/InterviewprepTracker.git
cd InterviewprepTracker
```

### Step 2: Configure the Database

1. Open **MySQL Workbench** and create a new database:
```sql
CREATE DATABASE InterviewPrepDB;
```

2. Open `Backend/appsettings.json` and update the connection string:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=InterviewPrepDB;User=root;Password=<your_password>;"
  }
}
```

### Step 3: Apply Database Migrations
```bash
cd Backend
dotnet ef database update
```

This will create all required tables using the existing EF Core migrations.

### Step 4: Run the Backend API
```bash
cd Backend
dotnet run
```

The API will be available at: `https://localhost:7000` or `http://localhost:5000`

> 📌 Note the port number from the console output and update API base URLs in frontend JS files if needed.

### Step 5: Run the Frontend

1. Open the `Frontend/` folder in **VS Code**
2. Right-click on `index.html` → **Open with Live Server**
3. The application will launch at `http://127.0.0.1:5500`

### Step 6: Update API Base URL (if required)

If your backend runs on a different port, update the base URL in the frontend JS files:

```javascript
// Example in auth.js or any JS file
const API_BASE_URL = "http://localhost:5000/api";
```

### Default Admin Access
```
Admin login can be seeded directly into the Admins table in MySQL:
INSERT INTO Admins (Name, Email, Password) VALUES ('Admin', 'admin@placement.com', 'Admin@123');
```




## 🔮 Future Enhancements

| Enhancement | Priority | Description |
|---|---|---|
| JWT Authentication | 🔴 High | Secure token-based auth with refresh tokens |
| Email Notifications | 🔴 High | Application status update emails via SMTP |
| Real-time Code Execution | 🟠 Medium | Integrate Judge0 API for multi-language support |
| Interview Scheduling | 🟠 Medium | Calendar-based interview slot booking system |
| AI Resume Scorer | 🟡 Low | ML-based resume analysis and ATS scoring |
| Video Interviews | 🟡 Low | WebRTC-powered in-platform video interviews |
| Analytics Dashboard | 🟠 Medium | Visual charts for placement statistics |
| Mobile Responsive UI | 🔴 High | Fully responsive design for all screen sizes |
| Docker Support | 🟡 Low | Containerized deployment with Docker Compose |
| Cloud Deployment | 🟠 Medium | Host on AWS EC2/Azure App Service with RDS |

---

## 📚 Learning Outcomes

Through the development of this project, the following industry-relevant skills were gained:

**Backend Development**
- Building RESTful APIs with ASP.NET Core Web API
- Implementing Clean Architecture with Controller → Service → Repository pattern
- Database design and management with Entity Framework Core and MySQL
- Interface-based programming for loose coupling and testability

**Frontend Development**
- DOM manipulation and event handling with Vanilla JavaScript
- Asynchronous API communication using Fetch API
- Monaco Editor integration for browser-based code editing
- Session-based authentication flow on the client side

**Software Engineering Practices**
- Multi-role system design (Student, Company, Admin)
- File handling — PDF upload, storage, and retrieval
- Assessment security implementation (anti-cheat, timers)
- End-to-end feature development across full stack

**Database Skills**
- Relational database schema design with proper relationships
- EF Core Migrations for versioned schema management
- Writing queries and managing data via ORM

---

## 👨‍💻 Author

<div align="center">

**Aditya Kolla**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/aditya-kolla-48a648322)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github)](https://github.com/kollaaditya)
[![Email](https://img.shields.io/badge/Email-Contact-D14836?style=for-the-badge&logo=gmail)](mailto:kollaaditya968@gmail.com)

*Full Stack Developer | .NET | JavaScript | MySQL*

</div>

---

## 📄 License

```
MIT License

Copyright (c) 2025 Venkat Sai Kolla

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

<div align="center">

⭐ **If this project helped you, please give it a star!** ⭐

*Built with ❤️ for placement preparation and career growth*

![Visitors](https://img.shields.io/badge/Visitors-Welcome-brightgreen?style=flat-square)
![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red?style=flat-square)
![Open Source](https://img.shields.io/badge/Open%20Source-Yes-blue?style=flat-square)

</div>
