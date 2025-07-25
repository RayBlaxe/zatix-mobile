# ZaTix Crew Mobile App

A React Native mobile application for event crew members to validate tickets via QR code scanning.

## 🎯 Project Overview

ZaTix Crew is part of the larger ZaTix event management ecosystem, serving event crew members with focused ticket validation functionality. The app provides a simple, efficient interface for scanning QR codes and validating event tickets in real-time.

## 🚀 Features

- **QR Code Scanning**: Fast and accurate QR code detection using device camera
- **Manual Entry**: Fallback option for manual ticket code entry
- **Real-time Validation**: Instant ticket validation with server integration
- **Offline Support**: Queue system for offline validations
- **Authentication**: Secure crew member login system
- **Event Management**: Support for multiple events and crew assignments

## 📋 Prerequisites

- Node.js >= 18.0.0
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device (for development)
- EAS CLI (`npm install -g @expo/eas-cli`) for building
- Android Studio (for Android development/emulator)
- Xcode (for iOS development/simulator)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RayBlaxe/zatix-mobile.git
   cd zatix-mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Configure your API endpoints and keys
   ```

4. **Start Expo development server**
   ```bash
   npm start
   ```

## 🏗️ Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── ui/            # Basic UI components
│   └── common/        # Common app components
├── screens/           # Screen components
│   ├── auth/         # Authentication screens
│   ├── scanner/      # Scanner related screens
│   └── settings/     # Settings screens
├── navigation/        # Navigation configuration
├── services/         # API and business logic
│   ├── api/          # API services
│   ├── auth/         # Authentication service
│   └── validation/   # Validation service
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── types/            # TypeScript type definitions
├── constants/        # App constants and config
└── assets/           # Images, fonts, and other assets
```

## 🔧 Development

### Running the App

**Development (Expo Go)**
```bash
npm start                # Start Expo development server
npm run android         # Open on Android device/emulator
npm run ios            # Open on iOS device/simulator
npm run web            # Open in web browser
```

**Building for Production**
```bash
npm run build:android   # Build Android APK/AAB with EAS
npm run build:ios      # Build iOS IPA with EAS
npm run build:all      # Build for both platforms
```

### Available Scripts

```bash
npm start                 # Start Expo development server
npm run android          # Run on Android device/emulator
npm run ios             # Run on iOS device/simulator
npm run web             # Run in web browser
npm run lint            # Run ESLint
npm run type-check      # Run TypeScript compiler
npm test               # Run Jest tests with Expo preset
npm run build:android   # Build Android app with EAS
npm run build:ios      # Build iOS app with EAS
npm run submit:android  # Submit to Google Play Store
npm run submit:ios     # Submit to Apple App Store
```

## 🔌 API Integration

### Authentication
```typescript
POST /auth/login
{
  "email": "crew.keren@zatix.id",
  "password": "password123"
}
```

### Ticket Validation
```typescript
POST /e-tickets/validate
{
  "ticket_code": "ZTX-LIRGSH9MMAUZ"
}
```

## 🧪 Testing

### Default Test Credentials
```
Email: crew.keren@zatix.id
Password: password123
```

### Running Tests
```bash
npm test                 # Unit tests
npm run test:e2e        # End-to-end tests
npm run test:coverage   # Coverage report
```

## 📱 Supported Platforms

- **Android**: API level 21+ (Android 5.0+)
- **iOS**: iOS 12.0+

## 🔐 Security Features

- Secure token storage using Keychain (iOS) / Keystore (Android)
- Input validation and sanitization
- Network request encryption
- Biometric authentication support (future enhancement)

## 📊 Performance Targets

- App startup time: < 2 seconds
- QR scan recognition: < 1 second
- Memory usage: < 50MB
- Validation accuracy: 99.5%

## 🚀 Deployment

### Android
```bash
npm run build:android
```

### iOS
```bash
npm run build:ios
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions, contact the development team or create an issue in the repository.

---

**Built with ❤️ for ZaTix Event Management System**