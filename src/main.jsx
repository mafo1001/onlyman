import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Initialize Capacitor plugins when running as native app
async function initCapacitor() {
  try {
    const { Capacitor } = await import('@capacitor/core');
    if (Capacitor.isNativePlatform()) {
      // Set status bar style
      const { StatusBar, Style } = await import('@capacitor/status-bar');
      StatusBar.setStyle({ style: Style.Dark });
      StatusBar.setBackgroundColor({ color: '#0a0a0a' });

      // Handle hardware back button
      const { App: CapApp } = await import('@capacitor/app');
      CapApp.addListener('backButton', ({ canGoBack }) => {
        if (canGoBack) {
          window.history.back();
        } else {
          CapApp.exitApp();
        }
      });

      // Hide splash screen
      const { SplashScreen } = await import('@capacitor/splash-screen');
      SplashScreen.hide();

      // Keyboard push-up mode
      const { Keyboard } = await import('@capacitor/keyboard');
      Keyboard.setScroll({ isDisabled: false });
    }
  } catch (e) {
    // Not running in Capacitor (web browser) — ignore
  }
}

initCapacitor();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
