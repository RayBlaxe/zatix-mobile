# ZaTix Crew Mobile App - Development Context

## Project Overview
This is a React Native mobile application built with **Expo** for event crew members to validate tickets via QR code scanning. The app is part of the ZaTix event management ecosystem.

## Technology Stack
- **Framework**: React Native with Expo SDK 49
- **Language**: TypeScript
- **UI Library**: Gluestack UI (successor to NativeBase)
- **Navigation**: React Navigation 6
- **State Management**: Context API + AsyncStorage
- **Camera/QR**: Expo Camera + Expo Barcode Scanner
- **Build System**: EAS Build
- **Testing**: Jest with Expo preset

## Key Dependencies
```json
{
  "expo": "~49.0.15",
  "expo-camera": "~13.4.4",
  "expo-barcode-scanner": "~12.5.3",
  "@gluestack-ui/themed": "^1.1.15",
  "@react-navigation/native": "^6.1.9",
  "axios": "^1.6.2"
}
```

## Development Commands
- `npm start` - Start Expo development server  
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run build:android` - Build with EAS for Android
- `npm run build:ios` - Build with EAS for iOS

## API Endpoints
- **Login**: `POST /auth/login`
  - Test credentials: crew.keren@zatix.id / password123
- **Validation**: `POST /e-tickets/validate`
  - Format: `{"ticket_code": "ZTX-LIRGSH9MMAUZ"}`

## Architecture
Feature-based folder structure:
```
src/
├── components/    # Reusable UI components
├── screens/      # Screen components  
├── navigation/   # Navigation config
├── services/     # API & business logic
├── hooks/        # Custom React hooks
├── utils/        # Utility functions
├── types/        # TypeScript types
└── constants/    # App constants
```

## Key Features to Implement
1. Authentication with secure token storage
2. QR scanner using Expo Camera
3. Manual ticket entry fallback
4. Validation results display
5. Offline queue system
6. Real-time statistics

## Important Notes
- Use Expo APIs for camera/permissions instead of react-native libraries
- Leverage Gluestack UI components throughout the app
- Follow TypeScript strict mode
- Implement proper error handling and offline support
- Target both Android and iOS platforms

## GitHub Issues
30 atomic issues created covering full development lifecycle from setup to deployment, organized in 7 phases over 8 weeks.