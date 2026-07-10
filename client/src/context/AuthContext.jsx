import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { USER_DB } from "../data/mockDb";
import {
  detectLocation,
  detectDevice,
  needsOTPVerification,
  getUserProfile,
  saveUserProfile,
  addLoginHistory,
  getAutoTheme,
  getLoginHistory,
} from "../utils/helpers";
import { useToast } from "./ToastContext";
import { useTheme } from "./ThemeContext";
import { api } from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [pendingLoginData, setPendingLoginData] = useState(null);
  const [activeView, setActiveView] = useState("login"); // 'login' | 'otp' | 'app'
  const [activeSection, setActiveSection] = useState("overview");
  const [otpReason, setOtpReason] = useState("");
  const [currentOTP, setCurrentOTP] = useState("");
  const [userProfile, setUserProfileState] = useState(null);

  const { showToast } = useToast();
  const { setThemePref } = useTheme();

  const completeLogin = useCallback(
    (email, user, location, device, isOtpVerified, backendProfile = null) => {
      const fullUser = { email, ...user };
      setCurrentUser(fullUser);

      let profile = backendProfile || getUserProfile(email) || {};
      profile.name = user.name;
      profile.phone = user.phone;
      profile.avatar = user.avatar;
      profile.otpMethod = user.otpMethod || "email";
      profile.securitySettings = profile.securitySettings || {
        locationCheck: true,
        deviceCheck: true,
      };

      const themePref = profile.themePreference || "auto";
      setThemePref(themePref);

      profile.lastCity = location.city;
      profile.lastState = location.state;
      profile.lastDeviceFingerprint = device.fingerprint;
      profile.lastDeviceName = device.full;
      profile.lastLoginTime = new Date().toISOString();

      saveUserProfile(email, profile);
      setUserProfileState(profile);

      // Save history locally and to MongoDB
      const historyEntry = {
        time: new Date().toISOString(),
        city: location.city,
        state: location.state,
        country: location.country,
        device: device.full,
        browser: device.browser,
        os: device.os,
        otpVerified: isOtpVerified,
        themeAtLogin: getAutoTheme(),
      };
      addLoginHistory(email, historyEntry);
      api.post(`/auth/history/${email}`, historyEntry);

      setActiveView("app");
      setActiveSection("overview");
      showToast(`Welcome, ${user.name.split(" ")[0]}!`, "success");
    },
    [setThemePref, showToast],
  );

  // Sign In — No OTP required as requested by user
  const handleLogin = useCallback(
    async (emailInput, passwordInput, setLoading) => {
      const email = emailInput.trim().toLowerCase();
      const password = passwordInput;

      if (!email || !password) {
        showToast("Please enter both email and password", "warning");
        return;
      }

      setLoading(true);
      const location = detectLocation();
      const device = detectDevice();

      // ── Try MongoDB Backend API First ──
      const res = await api.post("/auth/login", {
        email,
        password,
        location,
        device,
      });
      setLoading(false);

      if (res) {
        if (res.status === "error") {
          showToast(res.message || "Invalid email or password", "error");
          return;
        }
        if (res.status === "otp_required") {
          setPendingLoginData({
            email: res.email || email,
            user: res.user,
            location,
            device,
            isSignup: false,
            signupData: null,
          });
          setOtpReason(
            res.reason ||
              "A 6-digit verification code has been sent to your registered email and phone number.",
          );
          setCurrentOTP("");
          setActiveView("otp");
          return;
        }
        if (res.status === "success") {
          completeLogin(email, res.user, location, device, false, res.user);
          return;
        }
      }

      // ── Fallback to Local Mock DB if Backend Offline ──
      const user = USER_DB[email];
      if (!user || user.password !== password) {
        showToast("Invalid email or password", "error");
        return;
      }

      // Direct login without OTP as requested
      completeLogin(email, user, location, device, false, user);
    },
    [showToast, completeLogin],
  );

  // Sign Up — First-time user registration triggers OTP sent to email & phone (Never shown on screen)
  const handleSignup = useCallback(
    async (signupData, setLoading) => {
      const { name, emailInput, passwordInput, phone, otpMethod } = signupData;
      const email = emailInput.trim().toLowerCase();

      if (!name || !email || !passwordInput) {
        showToast("Please fill in all required fields", "warning");
        return;
      }

      setLoading(true);
      const location = detectLocation();
      const device = detectDevice();

      // Try MongoDB Backend API
      const res = await api.post("/auth/signup", {
        name,
        email,
        password: passwordInput,
        phone,
        otpMethod,
        location,
        device,
      });
      setLoading(false);

      if (res) {
        if (res.status === "error") {
          showToast(res.message || "Error creating account", "error");
          return;
        }
        if (res.status === "otp_required") {
          setPendingLoginData({
            email,
            user: res.user,
            location,
            device,
            isSignup: true,
            signupData: res.user,
          });
          setOtpReason(
            res.reason ||
              "A 6-digit verification code has been sent to your registered email and phone number.",
          );
          setCurrentOTP("");
          setActiveView("otp");
          return;
        }
      }

      // Fallback if offline
      if (USER_DB[email]) {
        showToast("Account already exists. Please sign in.", "error");
        return;
      }

      const demoOtp = String(Math.floor(100000 + Math.random() * 900000));
      const newUser = {
        name,
        email,
        password: passwordInput,
        phone: phone || "",
        otpMethod: otpMethod || "email",
        avatar: `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 30 + 1)}`,
      };

      setPendingLoginData({
        email,
        user: newUser,
        location,
        device,
        isSignup: true,
        signupData: newUser,
        offlineOtp: demoOtp, // stored in memory for offline verification only, never displayed on screen
      });
      setOtpReason(
        "A 6-digit verification code has been sent to your registered email and phone number.",
      );
      setCurrentOTP("");
      setActiveView("otp");
    },
    [showToast],
  );

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setPendingLoginData(null);
    setCurrentOTP("");
    setUserProfileState(null);
    setThemePref("dark");
    document.documentElement.setAttribute("data-theme", "dark");
    setActiveView("login");
    showToast("You have been signed out", "info");
  }, [setThemePref, showToast]);

  const updateProfile = useCallback(
    async (newName, newPhone, newOtpMethod) => {
      if (!currentUser) return;
      if (!newName) {
        showToast("Name cannot be empty", "warning");
        return;
      }

      const updatedUser = {
        ...currentUser,
        name: newName,
        phone: newPhone,
        otpMethod: newOtpMethod,
      };
      setCurrentUser(updatedUser);

      // Try MongoDB
      const res = await api.put(`/auth/profile/${currentUser.email}`, {
        name: newName,
        phone: newPhone,
        otpMethod: newOtpMethod,
      });

      if (USER_DB[currentUser.email]) {
        USER_DB[currentUser.email].name = newName;
        USER_DB[currentUser.email].phone = newPhone;
        USER_DB[currentUser.email].otpMethod = newOtpMethod;
      }

      const profile = res?.profile || getUserProfile(currentUser.email) || {};
      profile.name = newName;
      profile.phone = newPhone;
      profile.otpMethod = newOtpMethod;
      saveUserProfile(currentUser.email, profile);
      setUserProfileState(profile);
      showToast("Profile updated successfully", "success");
    },
    [currentUser, showToast],
  );

  const toggleSecuritySetting = useCallback(
    async (setting) => {
      if (!currentUser) return;
      const profile = getUserProfile(currentUser.email) || {};
      profile.securitySettings = profile.securitySettings || {
        locationCheck: true,
        deviceCheck: true,
      };
      const currentVal = profile.securitySettings[setting + "Check"];
      const newVal = !currentVal;
      profile.securitySettings[setting + "Check"] = newVal;

      saveUserProfile(currentUser.email, profile);
      setUserProfileState({ ...profile });

      // Sync with MongoDB
      api.put(`/auth/profile/${currentUser.email}`, {
        securitySettings: profile.securitySettings,
      });

      const label =
        setting === "location"
          ? "Location verification"
          : "Device verification";
      showToast(
        `${label} ${newVal ? "enabled" : "disabled"}`,
        newVal ? "success" : "warning",
      );
    },
    [currentUser, showToast],
  );

  const updateThemePreference = useCallback(
    async (pref) => {
      if (!currentUser) return;
      const profile = getUserProfile(currentUser.email) || {};
      profile.themePreference = pref;
      saveUserProfile(currentUser.email, profile);
      setUserProfileState({ ...profile });
      setThemePref(pref);

      // Sync with MongoDB
      api.put(`/auth/profile/${currentUser.email}`, {
        themePreference: pref,
      });
    },
    [currentUser, setThemePref],
  );

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        pendingLoginData,
        setPendingLoginData,
        activeView,
        setActiveView,
        activeSection,
        setActiveSection,
        otpReason,
        currentOTP,
        setCurrentOTP,
        userProfile,
        setUserProfileState,
        handleLogin,
        handleSignup,
        completeLogin,
        handleLogout,
        updateProfile,
        toggleSecuritySetting,
        updateThemePreference,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
