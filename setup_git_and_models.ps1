$baseDir = "C:\Users\pdspr\.gemini\antigravity\scratch\Enterprise-Workforce-Management-Platform"
$modelsDir = "$baseDir\backend\src\models"

$models = @(
    "User", "Organization", "Department", "Employee", "Attendance",
    "Leave", "Payroll", "Candidate", "Performance", "Project",
    "Task", "Asset", "HelpDeskTicket", "Document", "Notification"
)

foreach ($model in $models) {
    $content = @"
const mongoose = require('mongoose');

const ${model}Schema = new mongoose.Schema({
    // Define schema fields here
}, { timestamps: true });

module.exports = mongoose.model('${model}', ${model}Schema);
"@
    Set-Content -Path "$modelsDir\$model.js" -Value $content
}

# Git Setup
Set-Location -Path $baseDir
git add .
git commit -m "Initial enterprise workforce platform setup"

# Create and push branches
git branch dev
git branch nimar-backend
git branch ayush-frontend
git branch rohan-features
git branch prabh-debug

git push -u origin main
git push -u origin dev
git push -u origin nimar-backend
git push -u origin ayush-frontend
git push -u origin rohan-features
git push -u origin prabh-debug
