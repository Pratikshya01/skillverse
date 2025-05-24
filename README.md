# SkillVerse - E-Learning Platform

A comprehensive e-learning platform built with React, featuring separate interfaces for students and instructors. The platform allows students to browse and enroll in courses while enabling instructors to create and manage their course content.

## Features

### Student Features

- Browse and search courses by category
- Course enrollment system
- Video lesson playback
- Quiz attempts and tracking
- Progress tracking for enrolled courses
- Shopping cart functionality
- Secure payment integration with Razorpay
- Personal dashboard
- Profile management

### Instructor Features

- Course creation and management
- Lesson management system
- Student progress tracking
- Profile management
- Course analytics

## Tech Stack

- React.js with Vite
- Redux Toolkit for state management
- Redux Persist for state persistence
- React Router DOM for routing
- Tailwind CSS for styling
- Lucide React for icons
- React Hot Toast for notifications

## Login Credentials

### Student Access

```
Email: souravdasss1963@gmail.com
Password: 916390D@s
```

### Instructor Access

```
Email: 9163905324das@gmail.com
Password: 916390D@s
```

## Project Structure

```
src/
├── app/            # Redux store configuration
├── components/     # Reusable UI components
├── features/       # Redux slices and features
│   ├── auth/
│   ├── courses/
│   ├── user/
│   ├── categories/
│   ├── cart/
│   └── payment/
├── hooks/          # Custom React hooks
├── lib/           # Utility libraries
├── pages/         # Page components
│   ├── instructor/  # Instructor-specific pages
│   └── [other pages]
└── utils/         # Utility functions
```

## Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone [repository-url]
   cd skillverse-react
   ```

2. **Install Frontend Dependencies**

   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## Main Routes

### Public Routes

- `/login` - User login
- `/register` - User registration

### Student Routes

- `/` - Home page
- `/dashboard` - Student dashboard
- `/courses` - Course listing
- `/enrolled-courses` - Enrolled courses
- `/cart` - Shopping cart
- `/my-quiz-attempts` - Quiz attempts history

### Instructor Routes

- `/instructor/courses` - Instructor's courses
- `/instructor/create-course` - Course creation
- `/instructor/course/:courseId/lessons` - Lesson management
- `/instructor/profile` - Instructor profile

## Author

- **Pratikshya Gochhayat**

## Acknowledgments

- Built with React + Vite
- Styled with Tailwind CSS
- Payment integration by Razorpay

## Contact

For any queries or support, please contact:

- Project Link: [[https://github.com/Pratikshya01/skillverse](https://github.com/Pratikshya01/skillverse)]
