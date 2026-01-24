# My Neptune

A comprehensive app for swim coaches to log times, display training information, and plan workouts.

## Features

- **Time Logging** - Log swimmer times with stroke, distance, and effort level
- **Auto-calculations** - Best time and target time computed automatically
- **Training Data Display** - Comprehensive view of training data and historical information
- **Speech to Text** - Voice input for hands-free time entry
- **External Display Support** - Connect to external displays for team viewing
- **Training Planning** - Enter and organize training schedules
- **Local Persistence** - Data stored securely on device
- **Clean, dark-themed UI**

---

## 🚀 How to Build the APK

### Prerequisites

1. Install Node.js (v18 or higher): https://nodejs.org/
2. Install EAS CLI globally:
   ```bash
   npm install -g eas-cli
   ```
3. Create a free Expo account: https://expo.dev/signup

### Build Steps

1. **Open terminal in this folder** and install dependencies:
   ```bash
   npm install
   ```

2. **Login to Expo**:
   ```bash
   eas login
   ```

3. **Configure the project** (first time only):
   ```bash
   eas build:configure
   ```

4. **Build the APK**:
   ```bash
   eas build -p android --profile preview
   ```
   
   This will:
   - Upload your code to Expo's build servers
   - Build an APK file (takes ~10-15 minutes)
   - Give you a download link when complete

5. **Download the APK** from the link provided and send it to your users!

---

## 📱 Installing on Android

1. Transfer the APK file to the Android phone (email, Google Drive, USB, etc.)
2. On the phone, open the APK file
3. If prompted, enable "Install from unknown sources" in Settings
4. Tap "Install"
5. Done! The app will appear in the app drawer

---

## 🔧 Alternative: Test Locally First

If you want to test before building:

1. Install Expo Go app on your Android phone (from Play Store)
2. Run in this folder:
   ```bash
   npx expo start
   ```
3. Scan the QR code with Expo Go

---

## Need Help?

- Expo Docs: https://docs.expo.dev/
- EAS Build Docs: https://docs.expo.dev/build/introduction/
