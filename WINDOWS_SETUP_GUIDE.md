# UniHub - Windows Setup Guide (IntelliJ + VS Code)

This guide is specifically for Windows users who want to run:
- **Backend** in IntelliJ IDEA
- **Frontend** in VS Code

---

## 📋 Prerequisites for Windows

### 1. Install Java 17 (or higher)

**Download:**
- Go to https://www.oracle.com/java/technologies/downloads/
- Download Java 17 (Windows x64 Installer)
- Run installer and follow instructions

**Verify Installation:**
```cmd
java -version
```
Should show: `java version "17"` or higher

### 2. Install Node.js

**Download:**
- Go to https://nodejs.org/
- Download LTS version (Windows Installer .msi)
- Run installer (includes npm)

**Verify Installation:**
```cmd
node -v
npm -v
```

### 3. Install PostgreSQL

**Download:**
- Go to https://www.postgresql.org/download/windows/
- Download PostgreSQL 14 or higher
- Run installer
- **Remember the password you set for 'postgres' user!**

**Verify Installation:**
```cmd
psql --version
```

### 4. Install IntelliJ IDEA

**Download:**
- Go to https://www.jetbrains.com/idea/download/
- Download Community Edition (free) or Ultimate
- Run installer

### 5. Install VS Code

**Download:**
- Go to https://code.visualstudio.com/
- Download Windows installer
- Run installer

---

## 🗄️ Database Setup (PostgreSQL)

### Step 1: Open Command Prompt as Administrator

```cmd
# Open Command Prompt or PowerShell as Administrator
```

### Step 2: Create Database

**Option A: Using psql command line**
```cmd
# Connect to PostgreSQL (enter password when prompted)
psql -U postgres

# Once connected, create database
CREATE DATABASE unihub_db;

# Verify database created
\l

# Exit
\q
```

**Option B: Using pgAdmin (GUI)**
1. Open pgAdmin (installed with PostgreSQL)
2. Connect to PostgreSQL server (localhost)
3. Right-click "Databases"
4. Select "Create" → "Database"
5. Name: `unihub_db`
6. Click "Save"

### Step 3: Note Your PostgreSQL Credentials

You'll need:
- **Host:** `localhost`
- **Port:** `5432`
- **Database:** `unihub_db`
- **Username:** `postgres`
- **Password:** (the one you set during installation)

---

## 🔧 Backend Setup (IntelliJ IDEA)

### Step 1: Open Project in IntelliJ

1. Open IntelliJ IDEA
2. Click **"Open"** or **"File" → "Open"**
3. Navigate to your `unihub` folder
4. Select the folder and click "OK"
5. IntelliJ will detect it as a Maven project

### Step 2: Wait for Maven Import

- IntelliJ will automatically import Maven dependencies
- **Wait for indexing to complete** (bottom right corner)
- You'll see a progress bar - this may take 2-5 minutes

### Step 3: Configure Database Connection

1. Open `src/main/resources/application.properties`
2. Update these lines if your PostgreSQL settings are different:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/unihub_db
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD_HERE
```

**Replace `YOUR_PASSWORD_HERE` with your actual PostgreSQL password!**

### Step 4: Set Up Run Configuration

IntelliJ should auto-detect the Spring Boot application:

1. Look for a green play button next to `UnihubApplication.java`
2. Or go to **"Run" → "Edit Configurations"**
3. Click **"+"** → **"Spring Boot"**
4. Name: `UniHub Backend`
5. Main class: `com.example.unihub.UnihubApplication`
6. Click "OK"

### Step 5: Run Backend

**Method 1: Using Green Play Button**
- Open `src/main/java/com/example/unihub/UnihubApplication.java`
- Click the green play button (▶️) next to the class name
- Select "Run 'UnihubApplication'"

**Method 2: Using Run Menu**
- Go to **"Run" → "Run 'UniHub Backend'"**

**Method 3: Using Maven**
- Open Maven tool window (right side)
- Expand **"unihub" → "Plugins" → "spring-boot"**
- Double-click **"spring-boot:run"**

### Step 6: Verify Backend is Running

**In IntelliJ Console, you should see:**
```
Started UnihubApplication in X.XXX seconds (JVM running for X.XXX)
```

**Test the backend:**
1. Open browser
2. Go to: `http://localhost:8080/api/gamification/badges`
3. You should see JSON with 6 badges

**Backend is running! ✅**

---

## 💻 Frontend Setup (VS Code)

### Step 1: Open Frontend in VS Code

1. Open VS Code
2. Click **"File" → "Open Folder"**
3. Navigate to `unihub/frontend` folder
4. Click "Select Folder"

### Step 2: Open Integrated Terminal

1. In VS Code, go to **"Terminal" → "New Terminal"**
2. Or press `` Ctrl + ` `` (backtick)
3. Terminal opens at bottom of VS Code

### Step 3: Install Dependencies

In the VS Code terminal, run:

```cmd
npm install
```

**This will:**
- Install all required packages
- Download dependencies (103 packages)
- Takes 2-3 minutes depending on internet speed

**You should see:**
```
added 103 packages, and audited 261 packages in Xs

found 0 vulnerabilities
```

✅ **0 vulnerabilities is good!**

### Step 4: Run Frontend

In the VS Code terminal, run:

```cmd
npm run dev
```

**You should see:**
```
  VITE v7.2.2  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Step 5: Open Application

1. Hold `Ctrl` and click the URL in terminal: `http://localhost:5173/`
2. Or manually open browser and go to: `http://localhost:5173`

**You should see the UniHub landing page! ✅**

---

## 🎮 Using the Application

### First Time Setup

#### 1. Register a Student

1. Click "Register" button
2. Fill the form:
   - **Name:** Test Student
   - **Email:** student@test.edu
   - **University:** Select "Example University"
   - **Role:** Select "Student"
   - **Password:** password123
   - **Confirm Password:** password123
3. Click "Register"
4. You'll be redirected to Dashboard
5. Your starting points: **0**, Badge: **Newcomer**

#### 2. Create an Event

1. From Dashboard, click "📅 Create Event"
2. Fill the form:
   - **Title:** React Workshop 2025
   - **Description:** Learn React from scratch
   - **Location:** Computer Lab 101
   - **Type:** Workshop
   - **Start Date:** Select tomorrow's date, 2:00 PM
   - **End Date:** Select tomorrow's date, 4:00 PM
3. Click "Create Event"
4. Event status will be **PENDING** (needs supervisor approval)

#### 3. Register a Supervisor

1. Click user dropdown (top right) → Logout
2. Click "Register"
3. Fill form with:
   - **Email:** supervisor@test.edu
   - **Role:** Select "Supervisor"
   - Other fields as before
4. Register and login

#### 4. Approve the Event (as Supervisor)

1. From navbar, click dropdown → "Event Approvals"
2. You'll see "React Workshop 2025" in the list
3. Click "Approve" button
4. Event is now APPROVED!

#### 5. Join Event and Earn Points (as Student)

1. Logout from supervisor account
2. Login as `student@test.edu` with `password123`
3. Check Notifications - you should see "Your event has been approved!"
4. Go to "Events" from navbar
5. Click on "React Workshop 2025"
6. Click "Volunteer (20 pts)" button
7. Click "Confirm" in the modal
8. **Success! You earned 20 points!** 🎉
9. Go to Dashboard - Points: **20**, Badge: still **Newcomer**

#### 6. Create and Approve Blog (to earn more points)

**As Student:**
1. Click "📝 Create Blog" from dashboard
2. Fill form:
   - **Title:** Top 10 Programming Tips
   - **Category:** Article
   - **Content:** Write some content here...
3. Click "Create Post"
4. Blog status: PENDING

**As Supervisor:**
1. Logout and login as supervisor
2. Go to "Blog Approvals" from navbar
3. Click "Approve" for the blog
4. Blog is approved, student earns **30 points**

**Back to Student:**
1. Logout and login as student
2. Check Dashboard - Points: **50** (20 + 30)
3. Check Notifications - "Your blog has been approved!"

#### 7. Earn Explorer Badge (100 points)

To reach 100 points and unlock Explorer badge:

**Create more events (as supervisor):**
1. Login as supervisor
2. Create 3 more events and approve them

**Join events (as student):**
1. Login as student
2. Join one event as VOLUNTEER → 20 pts (Total: 70)
3. Join another event as VOLUNTEER → 20 pts (Total: 90)
4. Join another event as ATTENDEE → 10 pts (Total: 100)

**🎉 BADGE POP-UP APPEARS!**

When you hit 100 points, you'll instantly see a modal:
```
🎉 Congratulations!

🏆 Explorer

You've earned the Explorer badge!
Points Required: 100

[Awesome! 🎊]
```

5. Click "Awesome!" to close
6. Check Dashboard - Badge is now **Explorer**
7. Check Notifications - "Congratulations! You've earned the Explorer badge!"
8. Go to Badges page - Explorer badge shows "✓ Earned"

---

## 🎯 Quick Tips for Windows

### Running Both Backend and Frontend

**Option 1: Two Separate Windows**
- Run IntelliJ for backend
- Run VS Code for frontend
- Keep both open side by side

**Option 2: Windows Terminal (Recommended)**
1. Install Windows Terminal from Microsoft Store
2. Open Windows Terminal
3. Split into two panes:
   - Pane 1: Backend → `cd C:\path\to\unihub` → Run in IntelliJ
   - Pane 2: Frontend → `cd C:\path\to\unihub\frontend` → `npm run dev`

### Stopping the Servers

**Stop Backend (IntelliJ):**
- Click the red stop button (⬛) in the Run toolbar
- Or close IntelliJ

**Stop Frontend (VS Code):**
- In terminal, press `Ctrl + C`
- Type `Y` when asked "Terminate batch job"
- Or close VS Code terminal

### Port Already in Use

**If backend port 8080 is busy:**
1. Open Task Manager (`Ctrl + Shift + Esc`)
2. Find Java process using port 8080
3. End task
4. Or change port in `application.properties`:
   ```properties
   server.port=8081
   ```
5. Update frontend `constants.js` to match new port

**If frontend port 5173 is busy:**
- Vite will automatically use next available port (5174, 5175, etc.)
- Check terminal for actual port used

---

## 🔧 IntelliJ IDEA Specific Tips

### Enable Auto-Import

1. Go to **"File" → "Settings"**
2. Search for "Auto Import"
3. Check "Add unambiguous imports on the fly"
4. Check "Optimize imports on the fly"

### Maven Tool Window

- View → Tool Windows → Maven
- Use this to:
  - Reload project (`⟳` button)
  - Run Maven goals
  - View dependencies

### View Database

1. Go to **"View" → "Tool Windows" → "Database"**
2. Click **"+"** → "Data Source" → "PostgreSQL"
3. Enter connection details:
   - Host: `localhost`
   - Port: `5432`
   - Database: `unihub_db`
   - User: `postgres`
   - Password: (your password)
4. Click "Test Connection"
5. If successful, click "OK"
6. Now you can browse tables, run SQL queries

### Hot Reload

- Spring Boot DevTools is included
- Changes to Java files auto-restart the application
- Check console for restart messages

---

## 💻 VS Code Specific Tips

### Recommended Extensions

1. **ES7+ React/Redux/React-Native snippets** - Code snippets
2. **Prettier** - Code formatter
3. **ESLint** - Code linting
4. **Auto Rename Tag** - Rename paired tags
5. **Path Intellisense** - Autocomplete file paths

**To Install:**
1. Click Extensions icon (left sidebar)
2. Search for extension name
3. Click "Install"

### Terminal Tips

**Open multiple terminals:**
- Click `+` icon in terminal panel
- Or use split terminal feature

**Change terminal type:**
- Click dropdown in terminal (default: PowerShell)
- Can switch to Command Prompt or Git Bash

### Format on Save

1. **"File" → "Preferences" → "Settings"**
2. Search "format on save"
3. Check "Editor: Format On Save"

---

## 🔍 Troubleshooting Windows-Specific Issues

### Issue: "java" command not found

**Solution:**
1. Add Java to PATH:
   - Search "Environment Variables" in Windows
   - Edit "Path" in System variables
   - Add Java bin directory: `C:\Program Files\Java\jdk-17\bin`
2. Restart Command Prompt
3. Test: `java -version`

### Issue: PostgreSQL not starting

**Solution:**
1. Open "Services" (search in Windows)
2. Find "postgresql-x64-14" service
3. Right-click → Start
4. Or set to "Automatic" startup

### Issue: Port 8080 already in use

**Solution:**
```cmd
# Find process using port 8080
netstat -ano | findstr :8080

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

### Issue: npm install fails

**Solution:**
```cmd
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock
rmdir /s node_modules
del package-lock.json

# Reinstall
npm install
```

### Issue: Permission denied errors

**Solution:**
- Run Command Prompt or PowerShell as Administrator
- Or change folder permissions (right-click folder → Properties → Security)

---

## 📝 Step-by-Step Running Guide

### 🎯 Complete Workflow

#### Step 1: Start PostgreSQL

1. Open Services (Win + R → type `services.msc`)
2. Find `postgresql-x64-14`
3. Ensure status is "Running"
4. If not, right-click → Start

#### Step 2: Open Backend in IntelliJ

1. **Open IntelliJ IDEA**
2. Click **"Open"** on welcome screen
3. Navigate to `C:\path\to\unihub` folder
4. Click "OK"
5. **Wait for Maven import** (bottom right shows progress)
6. Look for "Build" to complete

#### Step 3: Configure Database Password

1. In IntelliJ, open `src/main/resources/application.properties`
2. Update password line:
   ```properties
   spring.datasource.password=YOUR_POSTGRES_PASSWORD
   ```
3. Save file (`Ctrl + S`)

#### Step 4: Run Backend

1. Open `src/main/java/com/example/unihub/UnihubApplication.java`
2. Right-click on the file
3. Select **"Run 'UnihubApplication'"**
4. Or click green play button (▶️) next to class name

**Console Output:**
```
Started UnihubApplication in X.XXX seconds
```

**Backend is now running on port 8080! ✅**

#### Step 5: Open Frontend in VS Code

1. **Open VS Code**
2. Click **"File" → "Open Folder"**
3. Navigate to `C:\path\to\unihub\frontend`
4. Click "Select Folder"

#### Step 6: Open Terminal in VS Code

1. Go to **"Terminal" → "New Terminal"**
2. Or press `` Ctrl + ` ``
3. Terminal opens at bottom

**Make sure you're in the frontend folder:**
```cmd
# You should see: PS C:\path\to\unihub\frontend>
```

#### Step 7: Install Frontend Dependencies

```cmd
npm install
```

**Wait for completion:**
```
added 103 packages, and audited 261 packages in Xs
found 0 vulnerabilities
```

**This step only needs to be done once!**

#### Step 8: Run Frontend

```cmd
npm run dev
```

**You'll see:**
```
  VITE v7.2.2  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

**Frontend is now running! ✅**

#### Step 9: Open Application

1. Open your browser (Chrome, Edge, Firefox)
2. Go to: `http://localhost:5173`
3. You should see UniHub landing page!

**Both backend and frontend are running! 🎉**

---

## 🖥️ Your Setup Should Look Like

```
┌─────────────────────────────────┐
│       IntelliJ IDEA             │
│  (Backend - Spring Boot)        │
│  Running on Port 8080           │
│  Console shows: Started...      │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│         VS Code                 │
│  (Frontend - React/Vite)        │
│  Terminal running: npm run dev  │
│  Running on Port 5173           │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│         Browser                 │
│  http://localhost:5173          │
│  UniHub Application             │
└─────────────────────────────────┘
```

---

## 🧪 Testing the Setup

### Quick Test Checklist

1. ✅ Backend console shows "Started UnihubApplication"
2. ✅ Can access: `http://localhost:8080/api/gamification/badges`
3. ✅ Returns JSON with badges
4. ✅ VS Code terminal shows "VITE ready"
5. ✅ Can access: `http://localhost:5173`
6. ✅ See UniHub landing page
7. ✅ Click "Register" - form appears
8. ✅ Can select university from dropdown
9. ✅ Register a user
10. ✅ Redirected to Dashboard
11. ✅ Dashboard shows points and badge

**All working? Perfect! Start using UniHub! 🎊**

---

## 🔄 Daily Development Workflow

### Starting Your Work Session

1. **Start PostgreSQL** (if not running automatically)
   - Check Services or start manually

2. **Open IntelliJ**
   - Open project
   - Click green play button
   - Wait for "Started UnihubApplication"

3. **Open VS Code**
   - Open frontend folder
   - Open terminal
   - Run: `npm run dev`

4. **Open Browser**
   - Go to `http://localhost:5173`
   - Start developing!

### Ending Your Work Session

1. **Stop Frontend** (VS Code)
   - Press `Ctrl + C` in terminal
   - Confirm with `Y`

2. **Stop Backend** (IntelliJ)
   - Click red stop button (⬛) in Run toolbar

3. **Optional: Stop PostgreSQL**
   - Usually can leave it running
   - Or stop via Services if needed

---

## 💡 Development Tips

### IntelliJ Tips

**Rebuild Project:**
- Build → Rebuild Project

**Clean and Rebuild:**
- Right-click `pom.xml` → Maven → Reload Project

**View Logs:**
- Console tab shows all output
- Can search logs with `Ctrl + F`

**Database Tool:**
- View → Tool Windows → Database
- Run SQL queries directly

### VS Code Tips

**Auto-format code:**
- Press `Shift + Alt + F`
- Or right-click → Format Document

**Search in files:**
- Press `Ctrl + Shift + F`

**Find file:**
- Press `Ctrl + P`
- Type filename

**Multiple cursors:**
- Hold `Alt` and click
- Or `Ctrl + Alt + Down/Up`

---

## 🐛 Common Windows Issues

### Issue: "The term 'npm' is not recognized"

**Solution:**
1. Close and reopen VS Code/terminal
2. Or add Node.js to PATH:
   - Environment Variables → Path
   - Add: `C:\Program Files\nodejs\`
3. Restart terminal

### Issue: Long path names in node_modules

**Solution:**
- Enable long paths in Windows:
  ```cmd
  # Run as Administrator
  reg add HKLM\SYSTEM\CurrentControlSet\Control\FileSystem /v LongPathsEnabled /t REG_DWORD /d 1 /f
  ```
- Restart computer

### Issue: Antivirus blocking npm install

**Solution:**
- Temporarily disable antivirus
- Or add exclusion for `node_modules` folder

### Issue: ECONNREFUSED when calling API

**Solution:**
1. Verify backend is running in IntelliJ
2. Check console for errors
3. Test backend directly: `http://localhost:8080/api/gamification/badges`
4. Check firewall settings

---

## 📂 Folder Structure on Windows

```
C:\Users\YourName\Downloads\unihub\
├── src\                          # Backend Java code
│   └── main\
│       ├── java\
│       └── resources\
├── frontend\                     # Frontend React code
│   ├── src\
│   ├── public\
│   └── package.json
├── pom.xml                       # Maven config
├── BACKEND_README.md             # Backend docs
├── FRONTEND_README.md            # In frontend folder
└── FULL_PROJECT_SETUP.md         # Complete guide
```

---

## ✅ Final Checklist

Before starting development, ensure:

- [ ] Java 17+ installed and in PATH
- [ ] Node.js 18+ installed
- [ ] PostgreSQL 14+ installed and running
- [ ] Database `unihub_db` created
- [ ] IntelliJ IDEA installed
- [ ] VS Code installed
- [ ] Project opened in IntelliJ
- [ ] Maven dependencies downloaded
- [ ] application.properties configured with correct password
- [ ] Backend runs successfully (port 8080)
- [ ] Frontend folder opened in VS Code
- [ ] npm install completed (103 packages)
- [ ] Frontend runs successfully (port 5173)
- [ ] Can register and login users
- [ ] Can see landing page

**All checked? You're ready to develop! 🚀**

---

## 📚 Additional Resources

### Documentation

| File | Location | Purpose |
|------|----------|---------|
| Backend Technical | `BACKEND_README.md` | Backend architecture |
| Backend Setup | `SETUP.md` | Backend-specific setup |
| Frontend Technical | `frontend/FRONTEND_README.md` | Frontend architecture |
| Complete Setup | `FULL_PROJECT_SETUP.md` | Full setup guide |
| This Guide | `WINDOWS_SETUP_GUIDE.md` | Windows + IntelliJ + VS Code |

### Testing

- **API Testing:** `API_TESTING_GUIDE.md`
- **Backend Changes:** `CHANGES.md`
- **Frontend Changes:** `frontend/FRONTEND_CHANGES.md`

---

## 🎉 Success!

You now have:
- ✅ Backend running in IntelliJ IDEA on Windows
- ✅ Frontend running in VS Code on Windows
- ✅ PostgreSQL database configured
- ✅ Complete UniHub platform ready to use

**Open http://localhost:5173 and start using UniHub!** 🎊

For detailed features and API documentation, see the README files listed above.

---

## 💬 Need Help?

1. **Check logs:**
   - IntelliJ console for backend errors
   - VS Code terminal for frontend errors
   - Browser console (F12) for client errors

2. **Common commands:**
   ```cmd
   # Backend (IntelliJ terminal)
   mvnw clean install

   # Frontend (VS Code terminal)
   npm install
   npm run dev

   # Database
   psql -U postgres -d unihub_db
   ```

3. **Review documentation:**
   - All guides are in markdown format
   - Open in VS Code or any text editor
   - Follow step-by-step instructions

Happy coding! 🚀
