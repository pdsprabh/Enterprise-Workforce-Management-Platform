$baseDir = "C:\Users\pdspr\.gemini\antigravity\scratch\Enterprise-Workforce-Management-Platform"

# Frontend Structure
$frontendDirs = @(
    "api", "assets", "components", "context", "hooks", "layouts",
    "pages/auth", "pages/dashboard", "pages/employees", "pages/attendance",
    "pages/leave", "pages/payroll", "pages/recruitment", "pages/performance",
    "pages/projects", "pages/assets", "pages/helpdesk", "pages/documents",
    "pages/analytics", "pages/ai-assistant", "routes", "utils"
)

foreach ($dir in $frontendDirs) {
    New-Item -ItemType Directory -Force -Path "$baseDir\frontend\src\$dir"
}

# Backend Structure
$backendDirs = @(
    "config", "controllers", "middlewares", "models", "routes", "services",
    "utils", "sockets", "validations", "constants", "jobs"
)

foreach ($dir in $backendDirs) {
    New-Item -ItemType Directory -Force -Path "$baseDir\backend\src\$dir"
}

# Docs Structure
New-Item -ItemType Directory -Force -Path "$baseDir\docs"

# Backend Initialize & Install
Set-Location -Path "$baseDir\backend"
npm init -y
npm install express mongoose dotenv bcryptjs jsonwebtoken cookie-parser cors multer cloudinary socket.io nodemailer
