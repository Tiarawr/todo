"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { auth, db } from "@/lib/Firebase";
import {
  updateEmail,
  onAuthStateChanged,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";

export default function Settings() {
  const [theme, setTheme] = useState(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [avatarURL, setAvatarURL] = useState(null);
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [maskedForgotEmail, setMaskedForgotEmail] = useState("");
  const [isForgotEmailSent, setIsForgotEmailSent] = useState(false);

  // Add localStorage mode flag (same as Dashboard)
  const USE_FIREBASE = false;

  const handleProfileSave = async () => {
    if (!USE_FIREBASE) {
      // LOCAL STORAGE MODE
      try {
        const profileData = {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim() || "user@todoapp.com", // Fallback jika email kosong
          avatarURL: avatarURL || null,
        };

        // Save to localStorage
        localStorage.setItem("userProfile", JSON.stringify(profileData));

        // Dispatch event to notify Dashboard
        window.dispatchEvent(
          new CustomEvent("profileChange", {
            detail: { profile: profileData },
          })
        );

        alert("Profile updated successfully");
        console.log("Profile saved to localStorage:", profileData);
      } catch (error) {
        console.error("Profile update error:", error);
        alert("Failed to update profile: " + error.message);
      }
      return;
    }

    // FIREBASE MODE (original code)
    if (!user) return;
    const displayName = `${firstName} ${lastName}`.trim();

    try {
      await updateProfile(user, {
        displayName: displayName,
        photoURL: avatarURL || null,
      });

      await setDoc(doc(db, "users", user.uid), {
        displayName,
        avatarURL,
        email: user.email,
        updatedAt: serverTimestamp(),
      });

      alert("Profile updated successfully");
    } catch (error) {
      console.error("Profile update error:", error);
      alert("Failed to update profile: " + error.message);
    }
  };

  // Forgot password functions
  const maskEmail = (email) => {
    if (!email) return "";
    const [localPart, domain] = email.split("@");
    if (!localPart || !domain) return email;

    const maskedLocal =
      localPart.length > 2
        ? localPart[0] +
          "*".repeat(localPart.length - 2) +
          localPart[localPart.length - 1]
        : localPart[0] + "*".repeat(localPart.length - 1);

    const [domainName, domainExt] = domain.split(".");
    const maskedDomain =
      domainName.length > 2
        ? domainName[0] +
          "*".repeat(domainName.length - 2) +
          domainName[domainName.length - 1]
        : domainName[0] + "*".repeat(domainName.length - 1);

    return `${maskedLocal}@${maskedDomain}.${domainExt}`;
  };

  const handleForgotPasswordClick = () => {
    setShowForgotModal(true);
    setIsForgotEmailSent(false);
    setForgotEmail(email || ""); // Pre-fill with current email if available
  };
  const handleSendResetEmail = async () => {
    if (forgotEmail) {
      try {
        // Import sendPasswordResetEmail from Firebase
        const { sendPasswordResetEmail } = await import("firebase/auth");
        const { auth } = await import("@/lib/Firebase");

        // Configure action code settings for password reset
        const actionCodeSettings = {
          url: "https://todoriko.xyz/forgot-password", // Redirect to forgot-password page
          handleCodeInApp: false,
        };

        await sendPasswordResetEmail(auth, forgotEmail, actionCodeSettings);
        setMaskedForgotEmail(maskEmail(forgotEmail));
        setIsForgotEmailSent(true);
      } catch (error) {
        alert(error.message);
        console.error("Reset error:", error);
      }
    } else {
      alert("Please enter your email address");
    }
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotEmail("");
    setMaskedForgotEmail("");
    setIsForgotEmailSent(false);
  };

  // Task categories untuk sidebar consistency
  const [taskCategories, setTaskCategories] = useState([
    { name: "Personal", color: "#FF5F57", isDefault: false },
    { name: "Freelance", color: "#FEBC2E", isDefault: false },
    { name: "Work", color: "#28C840", isDefault: false },
  ]);
  useEffect(() => {
    if (!USE_FIREBASE) {
      // LOCAL STORAGE MODE - Load profile from localStorage
      try {
        const savedProfile = localStorage.getItem("userProfile");
        console.log("🔍 Raw localStorage userProfile:", savedProfile);
        if (savedProfile) {
          const profileData = JSON.parse(savedProfile);
          console.log("✅ Parsed profile data:", profileData);
          console.log("📧 Email from profile:", profileData.email);

          setFirstName(profileData.firstName || "");
          setLastName(profileData.lastName || "");

          // Check if we have a real user email stored in localStorage
          const userEmail = localStorage.getItem("userEmail");
          console.log("🔍 userEmail from localStorage:", userEmail);

          if (userEmail && userEmail !== "user@todoapp.com") {
            // Use the real user email if available
            setEmail(userEmail);
            console.log("🔄 Set email state to real user email:", userEmail);

            // Update profile with real email if it's different
            if (profileData.email !== userEmail) {
              const updatedProfile = { ...profileData, email: userEmail };
              localStorage.setItem(
                "userProfile",
                JSON.stringify(updatedProfile)
              );
              console.log(
                "🔧 Updated profile email to match userEmail:",
                userEmail
              );
            }
          } else {
            // Use profile email or default
            setEmail(profileData.email || "user@todoapp.com");
            console.log(
              "🔄 Set email state to profile email:",
              profileData.email || "user@todoapp.com"
            );
          } // Handle avatar URL - only support base64 and external URLs
          if (profileData.avatarURL) {
            if (profileData.avatarURL.startsWith("data:")) {
              // Base64 image - use directly
              setAvatarURL(profileData.avatarURL);
              console.log("📸 Loaded base64 avatar from localStorage");
            } else if (profileData.avatarURL.startsWith("blob:")) {
              // Blob URLs are temporary and invalid after refresh - ignore and clean up
              console.log(
                "🗑️ Ignoring blob URL (temporary), cleaning up localStorage"
              );
              setAvatarURL(null);
              const updatedProfile = { ...profileData, avatarURL: null };
              localStorage.setItem(
                "userProfile",
                JSON.stringify(updatedProfile)
              );
            } else {
              // Other URL types (e.g., http/https) - use directly
              setAvatarURL(profileData.avatarURL);
              console.log("📸 Loaded external avatar URL");
            }
          } else {
            setAvatarURL(null);
          }

          // Don't auto-fix email to default if we have a real user email
          const realUserEmail = localStorage.getItem("userEmail");
          if (
            !profileData.email ||
            (profileData.email === "user@todoapp.com" && realUserEmail)
          ) {
            const updatedProfile = {
              ...profileData,
              email: realUserEmail || "user@todoapp.com",
            };
            localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
            console.log(
              "🔧 Updated email in localStorage with real user email"
            );
          }
        } else {
          console.log("❌ No profile found, creating default profile");

          // Check if we have user email from login
          const userEmail = localStorage.getItem("userEmail");
          const defaultProfile = {
            firstName: "Todoriko",
            lastName: "",
            email: userEmail || "user@todoapp.com", // Use real email if available
            avatarURL: null,
          };

          console.log("📝 Setting default profile:", defaultProfile);
          setFirstName(defaultProfile.firstName);
          setLastName(defaultProfile.lastName);
          setEmail(defaultProfile.email);
          setAvatarURL(defaultProfile.avatarURL);

          // Save default profile to localStorage for consistency
          localStorage.setItem("userProfile", JSON.stringify(defaultProfile));
          console.log("💾 Saved default profile to localStorage");
        }
      } catch (error) {
        console.error("❌ Error loading profile in Settings:", error);
        // Set fallback values on error
        const userEmail = localStorage.getItem("userEmail");
        const fallbackProfile = {
          firstName: "Todoriko",
          lastName: "",
          email: userEmail || "user@todoapp.com",
          avatarURL: null,
        };

        setFirstName(fallbackProfile.firstName);
        setLastName(fallbackProfile.lastName);
        setEmail(fallbackProfile.email);
        setAvatarURL(fallbackProfile.avatarURL);
      }
      return;
    }

    // FIREBASE MODE (original code)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setNewEmail(currentUser.email);
        setFirstName(currentUser.displayName?.split(" ")[0] || "");
        setLastName(currentUser.displayName?.split(" ")[1] || "");
        setAvatarURL(currentUser.photoURL || null);
        setEmail(currentUser.email || ""); // Make sure email is set for Firebase too
      }
    });
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);

    const handleThemeChange = (event) => {
      setTheme(event.detail.theme);
    };

    // Listen for profile changes from other components
    const handleProfileChange = (event) => {
      if (event.detail && event.detail.profile) {
        const profile = event.detail.profile;
        setFirstName(profile.firstName || "");
        setLastName(profile.lastName || "");
        setEmail(profile.email || "");
        setAvatarURL(profile.avatarURL || null);
        console.log("Profile updated from event in Settings:", profile);
      }
    };

    window.addEventListener("themeChange", handleThemeChange);
    window.addEventListener("profileChange", handleProfileChange);

    return () => {
      window.removeEventListener("themeChange", handleThemeChange);
      window.removeEventListener("profileChange", handleProfileChange);
    };
  }, []);

  const validateEmail = (email) => {
    const re = /[^@]+@[^.]+\..+/;
    return re.test(email);
  };
  const handleEmailChange = async () => {
    if (!validateEmail(newEmail)) {
      alert("Invalid email");
      return;
    }

    if (!USE_FIREBASE) {
      // LOCAL STORAGE MODE - Simulate email verification
      if (!emailVerificationSent) {
        // Generate random 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedCode(code);
        setEmailVerificationSent(true);

        // Simulate email sending
        alert(
          `Verification code sent to ${newEmail}!\n\nFor demo purposes, your code is: ${code}\n\n(In real app, this would be sent via email)`
        );
        console.log(`Demo verification code for ${newEmail}: ${code}`);
        return;
      } else {
        // Verify code
        if (verificationCode !== generatedCode) {
          alert("Invalid verification code. Please try again.");
          return;
        }

        // Update email after verification
        try {
          const savedProfile = localStorage.getItem("userProfile");
          const profileData = savedProfile ? JSON.parse(savedProfile) : {};

          const updatedProfile = {
            ...profileData,
            email: newEmail,
          };

          localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
          setEmail(newEmail);

          // Dispatch event to notify Dashboard
          window.dispatchEvent(
            new CustomEvent("profileChange", {
              detail: { profile: updatedProfile },
            })
          );

          alert("Email changed successfully!");
          setShowEmailModal(false);
          setEmailVerificationSent(false);
          setVerificationCode("");
          setGeneratedCode("");
          setNewEmail("");
        } catch (error) {
          console.error("Error updating email:", error);
          alert("Error updating email: " + error.message);
        }
        return;
      }
    }

    // FIREBASE MODE (original code)
    if (!currentPassword) {
      alert("Please enter your password");
      return;
    }

    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    try {
      await reauthenticateWithCredential(user, credential);
      await updateEmail(user, newEmail);
      await sendEmailVerification(user);
      alert("Email changed successfully! Please verify the new email.");
      setShowEmailModal(false);
    } catch (err) {
      console.error(err);
      alert("Error updating email: " + err.message);
    }
  };
  const handleNavigation = (path) => {
    router.push(path);
  };
  const removeFilter = (filterName) => {
    setTaskCategories((prev) =>
      prev.filter((cat) => cat.name.toLowerCase() !== filterName.toLowerCase())
    );
  };

  // Reset email modal when closed
  const closeEmailModal = () => {
    setShowEmailModal(false);
    setEmailVerificationSent(false);
    setVerificationCode("");
    setGeneratedCode("");
    setNewEmail("");
    setCurrentPassword("");
  };

  // Loading state
  if (!mounted || theme === null) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f67011] mx-auto mb-4"></div>
          <p className="text-gray-600 font-['Montserrat']">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-[#1E1E1E]" : "bg-white"
      }`}
    >
      <div className="flex flex-col lg:flex-row px-4 md:px-6 lg:px-24 gap-8">
        {/* Sidebar - Same as Dashboard */}{" "}
        <Sidebar
          theme={theme}
          onThemeChange={(newTheme) => {
            setTheme(newTheme);
            localStorage.setItem("theme", newTheme);
          }}
          onNavigation={handleNavigation}
          taskCategories={taskCategories}
          setTaskCategories={setTaskCategories}
          removeFilter={removeFilter}
          userProfile={{
            firstName: firstName,
            lastName: lastName,
            email: email,
            avatarURL: avatarURL,
          }}
        />
        {/* Main Content - Settings */}
        <main className="flex-1 space-y-6 md:space-y-8">
          {/* Page Header */}
          <div className="space-y-2">
            <h1
              className={`text-2xl md:text-4xl font-bold font-['Montserrat'] transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              Settings
            </h1>
            <p
              className={`text-base md:text-xl font-semibold font-['Montserrat'] transition-colors duration-300 ${
                theme === "dark" ? "text-gray-300" : "text-[#6f6a6a]"
              }`}
            >
              Manage your account settings and preferences
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 md:gap-4">
            <button className="px-4 py-2 md:px-6 md:py-3 bg-[#febc2e] rounded-[20px] text-white text-sm md:text-base font-semibold font-['Montserrat']">
              Profile
            </button>
            <button
              onClick={() =>
                handleNavigation("/dashboard/settings/notification")
              }
              className="px-4 py-2 md:px-6 md:py-3 bg-[#d9d9d9] rounded-[20px] text-[#6f6a6a] text-sm md:text-base font-semibold font-['Montserrat'] hover:bg-[#febc2e] hover:text-white transition-colors duration-200"
            >
              Notifications
            </button>
            <button
              onClick={() => handleNavigation("/dashboard/settings/help")}
              className="px-4 py-2 md:px-6 md:py-3 bg-[#d9d9d9] rounded-[20px] text-[#6f6a6a] text-sm md:text-base font-semibold font-['Montserrat'] hover:bg-[#febc2e] hover:text-white transition-colors duration-200"
            >
              Help
            </button>
          </div>

          {/* Profile Section */}
          <div
            className={`p-6 rounded-2xl border transition-colors duration-300 ${
              theme === "dark"
                ? "bg-[#2D2D2D] border-gray-600"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="space-y-6">
              {/* Section Header */}
              <div className="space-y-2">
                <h2
                  className={`text-xl md:text-2xl font-bold font-['Montserrat'] transition-colors duration-300 ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  Profile
                </h2>
                <p
                  className={`text-sm md:text-base font-semibold font-['Montserrat'] transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-300" : "text-[#6f6a6a]"
                  }`}
                >
                  Set your account details
                </p>
              </div>

              {/* Profile Content */}
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Form Fields */}
                <div className="flex-1 space-y-6">
                  {/* Name & Surname Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name Field */}
                    <div className="space-y-4">
                      <label
                        className={`text-sm font-medium font-['Montserrat'] transition-colors duration-300 ${
                          theme === "dark" ? "text-gray-300" : "text-[#6f6a6a]"
                        }`}
                      >
                        First name
                      </label>
                      <input
                        type="text"
                        placeholder="your first name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border text-base font-['Montserrat'] transition-colors duration-300 focus:outline-none focus:border-[#febc2e] ${
                          theme === "dark"
                            ? "bg-[#3D3D3D] border-gray-600 text-white placeholder-gray-400"
                            : "bg-white border-[#d9d9d9] text-black placeholder-gray-500"
                        }`}
                      />
                    </div>

                    {/* Surname Field */}
                    <div className="space-y-4">
                      <label
                        className={`text-sm font-medium font-['Montserrat'] transition-colors duration-300 ${
                          theme === "dark" ? "text-gray-300" : "text-[#6f6a6a]"
                        }`}
                      >
                        Last name
                      </label>
                      <input
                        type="text"
                        placeholder="your last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border text-base font-['Montserrat'] transition-colors duration-300 focus:outline-none focus:border-[#febc2e] ${
                          theme === "dark"
                            ? "bg-[#3D3D3D] border-gray-600 text-white placeholder-gray-400"
                            : "bg-white border-[#d9d9d9] text-black placeholder-gray-500"
                        }`}
                      />
                    </div>
                  </div>{" "}
                  {/* Email Field */}
                  <div className="space-y-4">
                    <label
                      className={`text-sm font-medium font-['Montserrat'] transition-colors duration-300 ${
                        theme === "dark" ? "text-gray-300" : "text-[#6f6a6a]"
                      }`}
                    >
                      Email
                    </label>{" "}
                    <input
                      type="email"
                      placeholder="your email"
                      value={USE_FIREBASE ? user?.email || "" : email}
                      readOnly={true} // Always readonly for security
                      className={`w-full px-3 py-2 rounded-lg border text-base font-['Montserrat'] transition-colors duration-300 focus:outline-none focus:border-[#febc2e] ${
                        theme === "dark"
                          ? "bg-[#3D3D3D] border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-[#d9d9d9] text-black placeholder-gray-500"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowEmailModal(true)}
                      className="mt-2 px-4 py-2 bg-[#4d6080] rounded-[20px] text-white font-medium font-['Montserrat'] hover:bg-[#3a4a63] transition-colors duration-200"
                    >
                      Change Email
                    </button>
                  </div>
                </div>

                {/* Avatar Section */}
                <div className="flex flex-col items-center lg:items-start space-y-4">
                  {/* Avatar Display */}
                  <div className="relative">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-[#febc2e] rounded-full overflow-hidden relative">
                      {avatarURL ? (
                        <img
                          src={avatarURL}
                          alt="Avatar preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-b from-[#FDA894] to-[#F49074] rounded-full relative">
                            <div className="absolute top-6 left-6 w-3 h-3 bg-[#7C3605] rounded-full"></div>
                            <div className="absolute top-6 right-6 w-3 h-3 bg-[#7C3605] rounded-full"></div>
                            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-6 h-3 bg-[#7C3605] rounded-full"></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Delete Button */}
                    {avatarURL && (
                      <button
                        onClick={() => setAvatarURL(null)}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-[#4d6080] rounded-full flex items-center justify-center hover:bg-[#3a4a63] transition-colors duration-200"
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M2 2L10 10M2 10L10 2"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* File input & button - Aligned with avatar */}
                  <div className="flex justify-center w-full">
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          if (!file.type.startsWith("image/")) {
                            alert("Only image files are allowed.");
                            return;
                          }
                          if (file.size > 2 * 1024 * 1024) {
                            alert("Image must be less than 2MB.");
                            return;
                          }

                          // Convert to base64 for persistent storage
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const base64String = event.target.result;
                            setAvatarURL(base64String);
                            console.log(
                              "📸 Converted image to base64 for storage"
                            );

                            // Auto-save profile when avatar is changed
                            const currentProfile = JSON.parse(
                              localStorage.getItem("userProfile") || "{}"
                            );
                            const updatedProfile = {
                              ...currentProfile,
                              avatarURL: base64String,
                            };
                            localStorage.setItem(
                              "userProfile",
                              JSON.stringify(updatedProfile)
                            );

                            // Dispatch profile change event
                            const profileChangeEvent = new CustomEvent(
                              "profileChange",
                              {
                                detail: { profile: updatedProfile },
                              }
                            );
                            window.dispatchEvent(profileChangeEvent);

                            console.log("💾 Auto-saved avatar to profile");
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />{" "}
                    <label htmlFor="photo-upload">
                      <button
                        type="button"
                        onClick={() =>
                          document.getElementById("photo-upload").click()
                        }
                        className="px-4 py-2 bg-[#4d6080] rounded-[20px] text-white text-sm md:text-base font-medium font-['Montserrat'] hover:bg-[#3a4a63] transition-colors duration-200"
                      >
                        Edit Photo
                      </button>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div
            className={`p-6 rounded-2xl border transition-colors duration-300 ${
              theme === "dark"
                ? "bg-[#2D2D2D] border-gray-600"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex flex-col md:flex-row md:space-x-10 space-y-8 md:space-y-0">
              {/* Section Header di kiri */}
              <div className="md:w-1/3">
                <h2
                  className={`text-xl md:text-2xl font-bold font-['Montserrat'] transition-colors duration-300 ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  Password
                </h2>
                <p
                  className={`text-sm md:text-base font-semibold font-['Montserrat'] transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-300" : "text-[#6f6a6a]"
                  }`}
                >
                  Set your password
                </p>
              </div>

              {/* Form Fields di kanan */}
              <div className="md:w-2/3 w-full space-y-6">
                {/* Current Password */}
                <div className="flex flex-col space-y-2 w-full max-w-md">
                  <label
                    className={`text-sm font-medium font-['Montserrat'] transition-colors duration-300 ${
                      theme === "dark" ? "text-gray-300" : "text-[#6f6a6a]"
                    }`}
                  >
                    Current password
                  </label>
                  <input
                    type="password"
                    className={`w-full max-w-md px-4 py-3 rounded-lg border text-base font-['Montserrat'] transition-colors duration-300 focus:outline-none focus:border-[#febc2e] ${
                      theme === "dark"
                        ? "bg-[#3D3D3D] border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-[#d9d9d9] text-black placeholder-gray-500"
                    }`}
                  />
                </div>
                {/* New Password */}
                <div className="flex flex-col space-y-2 w-full max-w-md">
                  <label
                    className={`text-sm font-medium font-['Montserrat'] transition-colors duration-300 ${
                      theme === "dark" ? "text-gray-300" : "text-[#6f6a6a]"
                    }`}
                  >
                    New password
                  </label>
                  <input
                    type="password"
                    className={`w-full max-w-md px-4 py-3 rounded-lg border text-base font-['Montserrat'] transition-colors duration-300 focus:outline-none focus:border-[#febc2e] ${
                      theme === "dark"
                        ? "bg-[#3D3D3D] border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-[#d9d9d9] text-black placeholder-gray-500"
                    }`}
                  />
                </div>
                {/* Repeat Password */}
                <div className="flex flex-col space-y-2 w-full max-w-md">
                  <label
                    className={`text-sm font-medium font-['Montserrat'] transition-colors duration-300 ${
                      theme === "dark" ? "text-gray-300" : "text-[#6f6a6a]"
                    }`}
                  >
                    Repeat password
                  </label>
                  <input
                    type="password"
                    className={`w-full max-w-md px-4 py-3 rounded-lg border text-base font-['Montserrat'] transition-colors duration-300 focus:outline-none focus:border-[#febc2e] ${
                      theme === "dark"
                        ? "bg-[#3D3D3D] border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-[#d9d9d9] text-black placeholder-gray-500"
                    }`}
                  />
                </div>{" "}
                {/* Forgot Password Link */}
                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleForgotPasswordClick}
                    className="text-[#febc2e] text-base font-light font-['Montserrat'] hover:text-[#e5a627] transition-colors duration-200"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Timezone & Preference Section */}
          <div
            className={`p-6 rounded-2xl border transition-colors duration-300 ${
              theme === "dark"
                ? "bg-[#2D2D2D] border-gray-600"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="space-y-6">
              {/* Section Header */}
              <div className="space-y-2">
                <h2
                  className={`text-xl md:text-2xl font-bold font-['Montserrat'] transition-colors duration-300 ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  Timezone & preference
                </h2>
                <p
                  className={`text-sm md:text-base font-semibold font-['Montserrat'] transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-300" : "text-[#6f6a6a]"
                  }`}
                >
                  Let us know the time zone and format
                </p>
              </div>

              {/* Timezone Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Region Field */}
                <div className="space-y-4">
                  <label
                    className={`text-sm font-medium font-['Montserrat'] transition-colors duration-300 ${
                      theme === "dark" ? "text-gray-300" : "text-[#6f6a6a]"
                    }`}
                  >
                    Region
                  </label>
                  <select
                    className={`w-full px-3 py-2 rounded-lg border text-base font-['Montserrat'] transition-colors duration-300 focus:outline-none focus:border-[#febc2e] ${
                      theme === "dark"
                        ? "bg-[#3D3D3D] border-gray-600 text-white"
                        : "bg-white border-[#d9d9d9] text-black"
                    }`}
                  >
                    <option value="">Select region</option>
                    <option value="asia-southeast">Asia - Southeast</option>
                    <option value="asia-east">Asia - East</option>
                    <option value="asia-south">Asia - South</option>
                    <option value="europe-west">Europe - West</option>
                    <option value="europe-east">Europe - East</option>
                    <option value="north-america-east">
                      North America - East
                    </option>
                    <option value="north-america-west">
                      North America - West
                    </option>
                    <option value="south-america">South America</option>
                    <option value="africa">Africa</option>
                    <option value="oceania">Oceania</option>
                  </select>
                </div>

                {/* Timezone Field */}
                <div className="space-y-4">
                  <label
                    className={`text-sm font-medium font-['Montserrat'] transition-colors duration-300 ${
                      theme === "dark" ? "text-gray-300" : "text-[#6f6a6a]"
                    }`}
                  >
                    Timezone
                  </label>
                  <select
                    className={`w-full px-3 py-2 rounded-lg border text-base font-['Montserrat'] transition-colors duration-300 focus:outline-none focus:border-[#febc2e] ${
                      theme === "dark"
                        ? "bg-[#3D3D3D] border-gray-600 text-white"
                        : "bg-white border-[#d9d9d9] text-black"
                    }`}
                  >
                    <option value="">Select timezone</option>
                    {/* Asia */}
                    <option value="UTC+7">UTC+7 (Jakarta, Bangkok)</option>
                    <option value="UTC+8">
                      UTC+8 (Singapore, Kuala Lumpur)
                    </option>
                    <option value="UTC+9">UTC+9 (Tokyo, Seoul)</option>
                    <option value="UTC+5:30">UTC+5:30 (Mumbai, Delhi)</option>
                    {/* Europe */}
                    <option value="UTC+0">UTC+0 (London, Dublin)</option>
                    <option value="UTC+1">UTC+1 (Paris, Berlin, Rome)</option>
                    <option value="UTC+2">UTC+2 (Helsinki, Athens)</option>
                    <option value="UTC+3">UTC+3 (Moscow, Istanbul)</option>
                    {/* Americas */}
                    <option value="UTC-5">UTC-5 (New York, Toronto)</option>
                    <option value="UTC-6">UTC-6 (Chicago, Mexico City)</option>
                    <option value="UTC-7">UTC-7 (Denver, Phoenix)</option>
                    <option value="UTC-8">
                      UTC-8 (Los Angeles, Vancouver)
                    </option>
                    <option value="UTC-3">
                      UTC-3 (São Paulo, Buenos Aires)
                    </option>
                    {/* Others */}
                    <option value="UTC+2">UTC+2 (Cairo, Johannesburg)</option>
                    <option value="UTC+10">UTC+10 (Sydney, Melbourne)</option>
                    <option value="UTC+12">UTC+12 (Auckland, Fiji)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Update Button */}
          <div className="flex justify-center">
            <button
              onClick={handleProfileSave}
              className="w-full sm:w-auto px-8 py-4 bg-[#febc2e] rounded-3xl text-white text-base font-bold font-['Montserrat'] hover:bg-[#e5a627] transition-colors duration-200"
            >
              Update Profile
            </button>
          </div>
        </main>
      </div>
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div
            className={`relative w-full max-w-sm sm:max-w-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto ${
              theme === "dark"
                ? "bg-gradient-to-br from-[#2a2a2a] to-[#1e1e1e] border border-gray-700"
                : "bg-gradient-to-br from-white to-gray-50 border border-gray-200"
            }`}
          >
            {" "}
            {/* Close Button */}
            <button
              onClick={closeEmailModal}
              className={`absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                theme === "dark"
                  ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                  : "hover:bg-gray-100 text-gray-500 hover:text-black"
              }`}
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>{" "}
            <h3
              className={`text-xl sm:text-2xl font-bold font-['Montserrat'] mb-4 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              Change Email
            </h3>
            <input
              type="email"
              placeholder="New Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              disabled={emailVerificationSent}
              className={`w-full h-12 px-4 mb-4 rounded-[21px] border placeholder:text-gray-400 text-sm font-['Montserrat'] ${
                emailVerificationSent ? "opacity-50 cursor-not-allowed" : ""
              } ${
                theme === "dark"
                  ? "bg-[#1e1e1e] border-[#4285f4] text-white"
                  : "bg-white border-[#4285f4] text-black"
              }`}
            />
            {!emailVerificationSent && USE_FIREBASE && (
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={`w-full h-12 px-4 mb-4 rounded-[21px] border placeholder:text-gray-400 text-sm font-['Montserrat'] ${
                  theme === "dark"
                    ? "bg-[#1e1e1e] border-[#4285f4] text-white"
                    : "bg-white border-[#4285f4] text-black"
                }`}
              />
            )}
            {emailVerificationSent && !USE_FIREBASE && (
              <>
                <p
                  className={`text-sm mb-4 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Verification code sent to {newEmail}
                </p>
                <input
                  type="text"
                  placeholder="Enter 6-digit verification code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  className={`w-full h-12 px-4 mb-4 rounded-[21px] border placeholder:text-gray-400 font-['Montserrat'] text-center text-lg tracking-wider ${
                    theme === "dark"
                      ? "bg-[#1e1e1e] border-[#4285f4] text-white"
                      : "bg-white border-[#4285f4] text-black"
                  }`}
                />
              </>
            )}
            <button
              onClick={handleEmailChange}
              className="w-full h-12 bg-[#f67011] hover:bg-[#e6651a] text-white rounded-[17px] font-semibold font-['Montserrat'] text-sm transition-all duration-300 mb-4"
            >
              {emailVerificationSent && !USE_FIREBASE
                ? "Verify Code"
                : "Send Verification"}
            </button>
            {emailVerificationSent && !USE_FIREBASE && (
              <button
                onClick={() => {
                  setEmailVerificationSent(false);
                  setVerificationCode("");
                  setGeneratedCode("");
                }}
                className="w-full h-12 bg-gray-500 hover:bg-gray-600 text-white rounded-[17px] font-semibold font-['Montserrat'] text-sm transition-all duration-300"
              >
                Cancel & Try Again
              </button>
            )}{" "}
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div
            className={`relative w-full max-w-sm sm:max-w-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto ${
              theme === "dark"
                ? "bg-gradient-to-br from-[#2a2a2a] to-[#1e1e1e] border border-gray-700"
                : "bg-gradient-to-br from-white to-gray-50 border border-gray-200"
            }`}
          >
            {/* Close Button */}
            <button
              onClick={closeForgotModal}
              className={`absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                theme === "dark"
                  ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                  : "hover:bg-gray-100 text-gray-500 hover:text-black"
              }`}
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {!isForgotEmailSent ? (
              // Step 1: Email Input
              <>
                {/* Icon */}
                <div className="text-center mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#f67011]/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-[#f67011]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </div>
                  <h3
                    className={`text-xl sm:text-2xl font-bold font-['Montserrat'] mb-2 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Forgot Password?
                  </h3>
                  <p
                    className={`text-sm sm:text-base font-normal font-['Montserrat'] px-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    No worries! Enter your email and we'll send you a reset
                    link.
                  </p>
                </div>

                {/* Email Input */}
                <div className="mb-4 sm:mb-6">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className={`w-full h-12 sm:h-14 px-4 sm:px-6 rounded-[21px] border transition-colors duration-300 placeholder:text-gray-400 text-sm sm:text-base ${
                      theme === "dark"
                        ? "border-[#4285f4] bg-[#1e1e1e] text-white"
                        : "border-[#4285f4] bg-white text-black"
                    }`}
                  />
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={handleSendResetEmail}
                    className="w-full h-12 sm:h-14 bg-[#f67011] hover:bg-[#e6651a] text-white rounded-[17px] font-semibold font-['Montserrat'] transition-all duration-300 text-sm sm:text-base"
                  >
                    Send Reset Link
                  </button>
                  <button
                    onClick={closeForgotModal}
                    className={`w-full h-12 sm:h-14 border-2 rounded-[17px] font-semibold font-['Montserrat'] transition-all duration-300 text-sm sm:text-base ${
                      theme === "dark"
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              // Step 2: Confirmation
              <>
                {/* Icon */}
                <div className="text-center mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3
                    className={`text-xl sm:text-2xl font-bold font-['Montserrat'] mb-2 ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Check Your Email
                  </h3>
                  <p
                    className={`text-sm sm:text-base font-normal font-['Montserrat'] px-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    We've sent a password reset link to
                  </p>
                </div>

                {/* Masked Email */}
                <div className="text-center mb-4 sm:mb-6">
                  <div
                    className={`inline-block px-3 py-2 sm:px-4 sm:py-2 rounded-full font-medium font-['Montserrat'] text-sm sm:text-base break-all ${
                      theme === "dark"
                        ? "bg-[#f67011]/20 text-[#f67011]"
                        : "bg-[#f67011]/10 text-[#f67011]"
                    }`}
                  >
                    {maskedForgotEmail}
                  </div>
                </div>

                {/* Instructions */}
                <div className="text-center mb-6 sm:mb-8">
                  <p
                    className={`text-xs sm:text-sm font-normal font-['Montserrat'] leading-relaxed px-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Click the link in the email to reset your password. If you
                    don't see the email, check your spam folder.
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={closeForgotModal}
                    className="w-full h-12 sm:h-14 bg-[#f67011] hover:bg-[#e6651a] text-white rounded-[17px] font-semibold font-['Montserrat'] transition-all duration-300 text-sm sm:text-base"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setIsForgotEmailSent(false);
                      setForgotEmail("");
                    }}
                    className={`w-full h-12 sm:h-14 border-2 rounded-[17px] font-semibold font-['Montserrat'] transition-all duration-300 text-sm sm:text-base ${
                      theme === "dark"
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Try Different Email
                  </button>
                </div>
              </>
            )}

            {/* Footer Note */}
            <div className="text-center mt-4 sm:mt-6">
              <p
                className={`text-xs font-light font-['Montserrat'] ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Need help? Contact our support team.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
