# Frontend Directory

This directory contains the Next.js frontend implementation of the Blood Donation System.

## 📁 Directory Structure

```
frontend/
├── app/                # Next.js app router pages
│   ├── dashboard/     # Dashboard pages
│   ├── login/        # Login page
│   ├── signup/       # Registration page
│   ├── profile/      # User profile pages
│   ├── donations/    # Donation management
│   └── search/       # Search functionality
│
├── components/        # Reusable React components
│   ├── ui/           # UI components
│   └── blood-compatibility-checker.tsx
│
├── hooks/            # Custom React hooks
│   ├── use-auth.ts
│   ├── use-blood-donation.ts
│   ├── use-donors.ts
│   └── use-toast.ts
│
├── lib/              # Utility functions
│   ├── auth.ts
│   ├── api.ts
│   └── utils.ts
│
├── styles/           # CSS and styling
├── public/           # Static assets
└── package.json      # Dependencies and scripts
```

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   # or
   pnpm build
   ```

## 📚 Key Components

### Pages
- **Dashboard**: Main user interface
- **Login/Signup**: Authentication pages
- **Profile**: User profile management
- **Donations**: Blood donation management
- **Search**: Donor and request search

### Components
- **Blood Compatibility Checker**: Blood type compatibility verification
- **UI Components**: Reusable interface elements
- **Form Components**: Input and validation components

### Hooks
- **use-auth**: Authentication state management
- **use-blood-donation**: Donation request handling
- **use-donors**: Donor data management
- **use-toast**: Notification system

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### API Integration
The frontend communicates with the backend through:
- REST API calls
- WebSocket connections (if implemented)
- Authentication tokens

## 🎨 Styling

The project uses:
- Tailwind CSS for styling
- Custom CSS modules
- Responsive design principles

## 📱 Responsive Design

The application is designed to work on:
- Desktop browsers
- Tablets
- Mobile devices

## 🔒 Security

- JWT token authentication
- Secure password handling
- Protected routes
- Input validation

## 🧪 Testing

```bash
# Run tests
npm test
# or
pnpm test

# Run linting
npm run lint
# or
pnpm lint
``` 