# Timely - Smart Calendar & Productivity App

A modern, feature-rich calendar and productivity application built with React. Timely helps you manage events, track time with Pomodoro technique, and view world times across different timezones.

![React](https://img.shields.io/badge/React-19.2.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.8-38bdf8)
![dayjs](https://img.shields.io/badge/dayjs-1.11.9-orange)

## ✨ Features

### 📅 Calendar Management
- **Multiple Views**: Month, Week, Work Week (Mon-Fri), and Year views
- **Smart Navigation**: Seamlessly navigate between views (Year → Month → Week)
- **Persistent State**: Remembers your last viewed date and calendar view
- **Dark Mode**: Full dark mode support across the entire application
- **Customizable Week Start**: Choose between Sunday or Monday as the first day of the week

### 📝 Event Management
- **Create Events**: Add single or recurring events (daily, weekly, monthly)
- **Edit & Delete**: Full CRUD operations for all events
- **Conflict Detection**: Warns you about overlapping events
- **Search**: Quickly find events with built-in search functionality
- **Recurring Events**: Smart handling of recurring event series

### ⏰ Pomodoro Timer
- **Focus Time**: 25-minute work sessions
- **Breaks**: Automatic 5-minute short breaks and 15-minute long breaks
- **Persistent Timer**: Timer continues running even when navigating to other pages
- **Live Sidebar**: See countdown in the sidebar from anywhere in the app
- **Session Tracking**: Tracks completed Pomodoro sessions
- **Audio Notifications**: Sound alerts when timer completes

### 🌍 World Clock
- **Multiple Timezones**: Track time across different cities worldwide
- **Add Custom Timezones**: Support for all major timezones including:
  - New York (EST)
  - London (GMT)
  - Tokyo (JST)
  - Mumbai (IST)
  - Sydney (AEDT)
  - And many more...
- **Real-time Updates**: All clocks update automatically

### ⚙️ Settings & Customization
- **Theme Toggle**: Switch between light and dark modes
- **Time Format**: Choose 12-hour (AM/PM) or 24-hour format
- **Date Format**: Select from MM/DD/YYYY, DD/MM/YYYY, or YYYY-MM-DD
- **Week Start**: Configure week to start on Sunday or Monday
- **Notifications**: Enable browser notifications for reminders
- **Data Management**:
  - Export all data (events, settings, world clocks) as JSON
  - Import data from backup file
  - Clear all data option

### 🎨 User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Intuitive UI**: Clean, modern interface with Heroicons
- **Collapsible Sidebar**: Space-efficient navigation
- **Format Persistence**: All time/date format preferences apply throughout the app
- **Input Adaptation**: Time input switches between 24-hour picker and 12-hour dropdowns based on settings

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sireesha2203/timely.git
cd timely
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
```

Builds the app for production to the `build` folder. The build is optimized and minified.

## 🛠️ Tech Stack

- **React 19.2.0** - UI framework
- **React Router DOM 6.14.1** - Navigation and routing
- **dayjs 1.11.9** - Date/time manipulation
- **Tailwind CSS 3.4.8** - Styling and responsive design
- **Heroicons** - Beautiful icon library
- **Context API** - Global state management

## 📁 Project Structure

```
src/
├── calendar/          # Calendar views and components
│   ├── CalendarPage.js
│   ├── MonthView.js
│   ├── WeekView.js
│   ├── WorkWeekView.js
│   └── YearView.js
├── components/        # Reusable UI components
│   ├── PageHeader.js
│   ├── Sidebar.js
│   └── Table.js
├── context/          # React Context providers
│   ├── EventContext.js
│   └── PomodoroContext.js
├── modals/           # Modal dialogs
│   ├── AddEventModal.js
│   └── EditEventModal.js
├── pages/            # Main application pages
│   ├── Dashboard.js
│   ├── EventsPage.js
│   ├── PomodoroPage.js
│   ├── SettingsPage.js
│   └── WorldClockPage.js
├── utils/            # Utility functions
│   ├── conflicts.js
│   └── formatters.js
├── App.js            # Main app component
└── index.js          # Entry point
```

## 💾 Data Persistence

Timely uses browser localStorage to persist:
- Events and recurring event series
- User settings (theme, formats, preferences)
- World clocks configuration
- Pomodoro timer state
- Calendar view and selected date

## 🎯 Key Features Explained

### Time Format Customization
When you select 12-hour format in Settings:
- Events display times with AM/PM (e.g., "2:30 PM")
- Time input changes to hour/minute/AM-PM dropdowns
- All calendar views show formatted times

### Smart Week Calculation
When "Start week on Monday" is enabled:
- Week view shows Monday through Sunday
- Work week shows Monday through Friday
- All navigation and date calculations adjust accordingly

### Pomodoro Integration
- Timer runs globally using Context API
- Persists across page navigation
- Shows live countdown in sidebar
- Automatically advances through work/break cycles
- Tracks session completion

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🐛 Known Issues

None currently reported. Please file an issue if you encounter any problems.

## 📮 Contact

For questions or feedback, please open an issue on GitHub.

---

Built with ❤️ using React and Tailwind CSS

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
