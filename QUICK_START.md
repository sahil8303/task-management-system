# Quick Start Guide - Task Management System

## Prerequisites Check
- [ ] Node.js v18+ installed
- [ ] PostgreSQL v14+ installed and running
- [ ] Git installed (optional)

## 🚀 Quick Setup (5 Minutes)

### Step 1: Install Dependencies

Open **PowerShell** or **Command Prompt**:

```powershell
# Navigate to project
cd "c:\Users\SAHIL\OneDrive - vit.ac.in\PROJECT INTERN"

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ..\frontend
npm install
```

### Step 2: Setup PostgreSQL Database

```powershell
# Open PostgreSQL command line (psql)
psql -U postgres

# In psql, run:
CREATE DATABASE taskmanagement;
\q
```

### Step 3: Configure Environment Variables

**Backend (.env):**
```powershell
cd ..\backend
notepad .env
```

Update the `DATABASE_URL` with your PostgreSQL password:
```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/taskmanagement?schema=public"
```

**Frontend (.env.local):**
Already configured! No changes needed.

### Step 4: Initialize Database

```powershell
# Still in backend folder
npm run prisma:generate
npm run prisma:migrate
```

### Step 5: Start the Application

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

### Step 6: Access the Application

Open your browser:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

## 🎯 First Steps

1. **Register an Account**
   - Click "Sign up"
   - Complete the 3-step registration
   - Name: Your Name
   - Email: your@email.com
   - Password: Must have 8+ chars, 1 uppercase, 1 number

2. **Login**
   - Use your credentials to login
   - You'll see the dashboard

3. **Create Your First Task**
   - Click "New Task"
   - Title: "Complete project setup"
   - Priority: High
   - Click "Create Task"

4. **Explore Features**
   - Toggle task completion with checkbox
   - Edit tasks using the menu
   - Filter by status and priority
   - Search tasks in real-time
   - Export tasks to CSV/JSON
   - Toggle dark mode

## ⚡ Common Issues & Solutions

### Issue: "Port 5000 already in use"
```powershell
# Find and kill the process
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Issue: "Port 3000 already in use"
```powershell
# Find and kill the process
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: "Database connection failed"
```powershell
# Check if PostgreSQL is running
services.msc
# Look for "postgresql-x64-14" service and start it
```

### Issue: "Prisma Client not found"
```powershell
cd backend
npm run prisma:generate
```

## 📊 Project Status

✅ Backend API (Node.js + Express + Prisma)
✅ Frontend (Next.js 14 + TypeScript)
✅ Authentication (JWT + Refresh Tokens)
✅ Task Management (CRUD + Filters)
✅ Real-time Search
✅ Dark Mode
✅ Responsive Design
✅ Animations (Framer Motion)
✅ Form Validation (React Hook Form + Zod)
✅ State Management (Zustand + React Query)
✅ Export (CSV/JSON)

## 🎨 Tech Stack

**Backend:**
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcrypt Password Hashing
- Zod Validation

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui Components
- Framer Motion
- React Hook Form
- Zustand (State)
- React Query (Data)

## 📚 Useful Commands

```powershell
# Backend Commands (run from /backend)
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run prisma:studio # Open database GUI

# Frontend Commands (run from /frontend)
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint

# Database Commands (run from /backend)
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio
```

## 🔐 Security Notes

Before deploying to production:
1. Generate secure JWT secrets (32+ random characters)
2. Use strong PostgreSQL password
3. Set NODE_ENV=production
4. Enable HTTPS
5. Configure proper CORS settings
6. Review rate limiting settings

## 🎯 What's Next?

After successful setup, explore:
- Create multiple tasks with different priorities
- Test search and filtering
- Try dark mode toggle
- Export tasks to CSV/JSON
- Test the responsive design on mobile
- Check the smooth animations

## 💡 Tips

- Use Ctrl+K for quick search (future feature)
- Press Esc to close modals quickly
- Drag tasks to reorder (future feature)
- Tasks turn red when overdue
- Completed tasks appear slightly faded

## 🆘 Need Help?

1. Check the main [README.md](README.md) for detailed documentation
2. Review error messages in terminal
3. Check browser console (F12 → Console)
4. Verify all environment variables are set correctly
5. Ensure PostgreSQL service is running

---

**Happy Task Managing! 🚀**

If everything works, you should see:
- ✅ Beautiful login/register pages with gradients
- ✅ Dashboard with statistics cards
- ✅ Task cards with smooth animations
- ✅ Real-time search and filtering
- ✅ Toast notifications for actions
- ✅ Responsive design on all devices
