# Swim Time Logger - Android App

A simple app for swim coaches to log swimmer times.

## Features
- Select swimmer, stroke, distance, and effort level
- Auto-calculates best time and target time
- Logs entries with timestamps
- Data persists locally on device
- Clean, dark-themed UI

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

## 📝 Customizing

### Add/Edit Swimmers
Edit the `swimmers` array in `App.js`:
```javascript
const swimmers = ['Nicholas', 'Emma', 'Lucas', 'Sofia', 'Marcus', 'Aiko', 'Victor'];
```

### Add/Edit Reference Times
Edit the `referenceTimes` object in `App.js`:
```javascript
const referenceTimes = {
  'Nicholas-Freestyle-50m': 24.87,
  // Add more...
};
```

### Change App Name/Icon
Edit `app.json` and replace images in the `assets` folder.

---

## 📦 Project Structure

```
SwimTimeLogger/
├── App.js              # Main app code
├── app.json            # Expo configuration
├── eas.json            # Build configuration
├── package.json        # Dependencies
├── babel.config.js     # Babel configuration
├── assets/
│   ├── icon.png        # App icon (1024x1024)
│   ├── adaptive-icon.png
│   ├── splash.png      # Splash screen
│   └── favicon.png
└── README.md           # This file
```

---

## Need Help?

- Expo Docs: https://docs.expo.dev/
- EAS Build Docs: https://docs.expo.dev/build/introduction/
