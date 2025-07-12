# video explanation 
https://drive.google.com/drive/folders/1iuWzWnL8ic4i6K-rGUhy2wDidd8RPi1q?usp=sharing

# CONDuit - Skill Exchange Platform

A modern, responsive front-end application for a peer-to-peer skill exchange platform that connects users who want to trade skills and knowledge.

## 🚀 Features

### Core Functionality
- **User Authentication & Registration**: Secure login and registration with form validation
- **Profile Management**: Create and manage user profiles with optional elements like location and profile photos
- **Skill Management**: Add, edit, and manage skills you offer for exchange
- **Skill Discovery**: Browse and search for skills available from other users
- **Swap Request System**: Send, accept, reject, and manage skill swap requests
- **Feedback & Ratings**: Rate and provide feedback after completed skill exchanges
- **Public/Private Profiles**: Control profile visibility settings

### Technical Features
- **Responsive Design**: Mobile-first approach with desktop compatibility
- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **State Management**: Redux Toolkit for complex state management
- **Form Validation**: React Hook Form for robust form handling
- **Type Safety**: Full TypeScript implementation
- **Accessibility**: WCAG compliant components and navigation

## 🛠 Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **HTTP Client**: Axios (configured for future API integration)

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout/         # Layout components (Header, Sidebar, etc.)
├── pages/              # Page components
│   ├── Auth/           # Authentication pages
│   ├── Dashboard/      # Dashboard and overview
│   ├── Profile/        # User profile management
│   ├── Skills/         # Skill management
│   ├── Browse/         # Skill discovery
│   └── Swaps/          # Swap request management
├── store/              # Redux store configuration
│   └── slices/         # Redux slices for state management
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd conduit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6) - Main brand color
- **Secondary**: Green (#22C55E) - Success states
- **Accent**: Orange (#F3771E) - Call-to-action elements
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Components
- **Buttons**: Primary, secondary, success, and danger variants
- **Cards**: Consistent card layouts with shadows
- **Forms**: Styled input fields with validation states
- **Navigation**: Responsive sidebar and header

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=CONDuit
```

### Tailwind Configuration
Custom theme configuration in `tailwind.config.js` includes:
- Custom color palette
- Custom animations
- Responsive breakpoints
- Component utilities

## 📱 Responsive Design

The application is built with a mobile-first approach:

- **Mobile**: < 768px - Single column layout, collapsible sidebar
- **Tablet**: 768px - 1024px - Two column layout
- **Desktop**: > 1024px - Full sidebar layout with enhanced features

## 🔐 Authentication Flow

1. **Registration**: Users create accounts with email, password, and basic info
2. **Login**: Secure authentication with JWT tokens
3. **Profile Setup**: Optional profile completion with bio, location, and photo
4. **Session Management**: Persistent login state with localStorage

## 🎯 Key Features Implementation

### User Registration & Profile Creation
- Multi-step registration form with validation
- Profile photo upload capability
- Location and bio information
- Public/private profile settings

### Skill Listing & Management
- Add skills with categories and proficiency levels
- Edit and delete existing skills
- Skill availability toggles
- Rich skill descriptions

### Search & Browse Functionality
- Category-based filtering
- Location-based search
- Proficiency level filtering
- Real-time search results

### Swap Request System
- Send swap requests with custom messages
- Accept/reject incoming requests
- Track request status
- Delete pending requests

### User Interaction & Feedback
- Rating system (1-5 stars)
- Written feedback and comments
- User reputation tracking
- Feedback history

## 🔄 State Management

### Redux Store Structure
- **Auth Slice**: User authentication and profile data
- **Skills Slice**: User skills and skill listings
- **Swaps Slice**: Swap requests and history
- **UI Slice**: Loading states, modals, and notifications

### Async Operations
- API calls using Redux Toolkit's `createAsyncThunk`
- Loading states for better UX
- Error handling with user-friendly messages
- Optimistic updates for better performance

## 🎨 UI/UX Features

### Modern Design Elements
- Smooth animations and transitions
- Hover effects and micro-interactions
- Consistent spacing and typography
- Accessible color contrast ratios

### User Experience
- Intuitive navigation flow
- Clear call-to-action buttons
- Progressive disclosure of information
- Responsive feedback for user actions

## 🔧 Development Guidelines

### Code Style
- Use TypeScript for all components
- Follow React functional component patterns
- Implement proper error boundaries
- Use meaningful component and variable names

### Performance
- Lazy load components where appropriate
- Optimize bundle size with code splitting
- Use React.memo for expensive components
- Implement proper loading states

### Accessibility
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Environment Variables
Set the following environment variables in your deployment platform:
- `VITE_API_URL` - Backend API URL
- `VITE_APP_NAME` - Application name

## 🔮 Future Enhancements

### Planned Features
- Real-time messaging between users
- Video call integration for skill exchanges
- Advanced search filters
- Skill verification system
- Community features and forums
- Mobile app development

### Technical Improvements
- Service Worker for offline functionality
- Advanced caching strategies
- Performance monitoring
- A/B testing framework
- Advanced analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation

---

**CONDuit** - Connecting people through skill exchange 🚀 
