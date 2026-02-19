"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ToastProps {
  message: string;
  type?: "error" | "success" | "info";
  onClose: () => void;
  duration?: number;
}

export const Toast = ({
  message,
  type = "error",
  onClose,
  duration = 5000,
}: ToastProps) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 350);
  };

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const styles = {
    error: {
      bg: "bg-ds-dark-background",
      icon: "text-red-500",
      text: "text-ds-dark-text-primary",
    },
    success: {
      bg: "bg-ds-dark-background",
      icon: "text-emerald-500",
      text: "text-ds-dark-text-primary",
    },
    info: {
      bg: "bg-ds-dark-background",
      icon: "text-blue-500",
      text: "text-ds-dark-text-primary",
    },
  };

  const style = styles[type];

  const icons = {
    error: (
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>
    ),
    success: (
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    info: (
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
        />
      </svg>
    ),
  };

  const toastContent = (
    <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none p-4">
      <style>{`
        @keyframes toast-in {
          from {
            transform: translateY(-100%) scale(0.9);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        @keyframes toast-out {
          from {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          to {
            transform: translateY(-20px) scale(0.95);
            opacity: 0;
          }
        }
      `}</style>
      <div
        className={`
          relative
          flex items-center gap-3 px-4 py-3 
          rounded-xl shadow-[0_4px_12px_-2px_rgba(0,0,0,0.5)]
          border border-white/5
          pointer-events-auto
          max-w-sm w-full md:w-auto md:min-w-[320px]
          backdrop-blur-md
          ${style.bg}
          ${style.text}
        `}
        style={{
          animation: isExiting 
            ? "toast-out 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards"
            : "toast-in 350ms cubic-bezier(0.16, 1, 0.3, 1) forwards"
        }}
      >
        <div className={`${style.icon} shrink-0`}>{icons[type]}</div>
        <p className="text-[13px] font-medium leading-tight flex-1">
          {message}
        </p>
        <button
          onClick={handleClose}
          className="shrink-0 text-zinc-500 hover:text-zinc-300 transition-colors p-1 -mr-1"
          aria-label="Close"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );

  if (typeof window === "undefined") return null;

  return createPortal(toastContent, document.body);
};
