# University HRMS - Two-Portal Frontend

Modern, responsive HR Management System for universities with separate Employee and HR portals.

## Features

### Employee Portal

- **Dashboard** - Quick links to all services
- **Entry** - New employee registration form
- **Attendance** - Interactive calendar with clock-in/out times
- **Leave Management** - Apply for leave and track status
- **Salary** - View salary breakdown with deductions

### HR Portal

- **Dashboard** - KPI overview (total employees, attendance stats, pending leaves)
- **Employees** - Manage employee records with CSV export
- **Attendance** - View all employee attendance with export
- **Leave Management** - Approve/reject/forward leave requests

## Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS 4 + Heroicons
- **Routing**: React Router DOM
- **State**: Zustand (global store)
- **Forms**: React Hook Form + Zod
- **Calendar**: React Day Picker
- **Tables**: TanStack React Table (prepared)
- **Export**: PapaParse (CSV)

## Getting Started

### Install Dependencies

Already done! If needed:

```powershell
npm install
```

### Run Development Server

```powershell
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build for Production

```powershell
npm run build
```

## Docker Deployment

### Production Build with Docker

Build and run the production container:

```powershell
docker-compose up -d hrms-app
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Development Mode with Docker

Run the development server with hot reload:

```powershell
docker-compose --profile dev up hrms-dev
```

Development server will be available at [http://localhost:5173](http://localhost:5173)

### Docker Commands

**Build the image:**

```powershell
docker-compose build
```

**Stop containers:**

```powershell
docker-compose down
```

**View logs:**

```powershell
docker-compose logs -f hrms-app
```

**Rebuild and restart:**

```powershell
docker-compose up -d --build
```

### Manual Docker Build

If you prefer not to use docker-compose:

```powershell
# Build the image
docker build -t hrms-app .

# Run the container
docker run -d -p 3000:80 --name hrms-frontend hrms-app
```

## Default Login Credentials

**Employee Portal** (`/employee/login`)

- Email: `demo@employee.com`
- Password: `password`

**HR Portal** (`/hr/login`)

- Email: `hr@university.com`
- Password: `password`

> Single demo user can access both portals and switch between roles.

## Folder Structure

```
src/
├── app/                    # App-level layouts and providers
│   ├── EmployeeLayout.jsx  # Employee portal layout with nav
│   ├── HRLayout.jsx        # HR portal layout with nav
│   └── NotFound.jsx        # 404 page
├── portals/
│   ├── employee/           # Employee portal
│   │   ├── pages/          # Employee pages
│   │   └── components/     # Employee-specific components
│   └── hr/                 # HR portal
│       ├── pages/          # HR pages
│       └── components/     # HR-specific components
├── components/             # Shared UI primitives
├── state/                  # Zustand stores
│   ├── auth.js            # Auth & role switching
│   └── data.js            # Mock data (employees, attendance, leaves)
├── styles/
│   └── globals.css        # Tailwind + CSS variables for themes
├── App.jsx                # Main router
└── main.jsx               # React entry point
```

## Portal Theming

- **Employee Portal**: Indigo/Blue color scheme
- **HR Portal**: Rose/Pink color scheme
- Themes applied via `data-portal` attribute on layouts
- CSS variables enable easy future customization

## Mock Data

Currently uses in-memory mock data with Zustand. Structure aligns with future SQL schema:

- `employees` - Employee records
- `attendance` - Daily clock-in/out records
- `leaves` - Leave requests with status
- Payroll calculated on-the-fly from attendance

## Future Enhancements

- Connect to backend API (MySQL/PostgreSQL)
- Advanced filtering and search
- Role-based authentication
- Email notifications
- Document uploads
- Performance analytics
- Mobile app (React Native)

## Responsive Design

- Desktop: Full sidebar navigation
- Tablet: Optimized layouts
- Mobile: Bottom navigation bar, responsive tables

## Accessibility

- Semantic HTML
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus indicators
- Color contrast AA compliant

---

Built with ❤️ for University HR Management
