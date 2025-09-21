"use client";

import { Monitor, Smartphone, X } from "lucide-react";
import { useEffect, useState } from "react";

export function MobileModal() {
  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768; // Tailwind md breakpoint
      setIsMobile(mobile);

      // Show modal on mobile, but allow user to dismiss it
      if (mobile && !localStorage.getItem("mobile-modal-dismissed")) {
        setShowModal(true);
      }
    };

    // Check on mount
    checkScreenSize();

    // Listen for resize events
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const dismissModal = () => {
    setShowModal(false);
    localStorage.setItem("mobile-modal-dismissed", "true");
  };

  const dismissForSession = () => {
    setShowModal(false);
    // Don't set localStorage, so it shows again on page refresh
  };

  if (!showModal || !isMobile) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-base-100 rounded-2xl shadow-2xl max-w-md w-full mx-4 relative">
          {/* Close button */}
          <button
            type="button"
            onClick={dismissForSession}
            className="absolute top-4 right-4 btn btn-sm btn-circle btn-ghost"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-6 text-center">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Monitor className="w-16 h-16 text-primary" />
                <Smartphone className="w-8 h-8 text-warning absolute -bottom-2 -right-2" />
              </div>
            </div>

            {/* Content */}
            <h2 className="text-2xl font-bold text-base-content mb-3">
              Desktop Experience Only
            </h2>

            <p className="text-base-content/80 mb-6 leading-relaxed">
              Moviefy is currently optimized for desktop use. For the best
              experience organizing your entertainment collection, please visit
              us on a desktop or laptop computer.
            </p>

            <div className="bg-info/10 rounded-lg p-4 mb-6">
              <p className="text-info text-sm font-medium">
                📱 Mobile version coming soon!
              </p>
              <p className="text-info/80 text-sm mt-1">
                We're working on a mobile-friendly version that will be
                available in a future update.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={dismissModal}
                className="btn btn-primary"
              >
                I'll use desktop later
              </button>

              <button
                type="button"
                onClick={dismissForSession}
                className="btn btn-ghost btn-sm"
              >
                Continue anyway
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
