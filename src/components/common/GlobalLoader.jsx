import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoader } from '../../store/hooks';
import logo2 from '../../assets/images/logo2.jpeg';

export default function GlobalLoader() {
  const { isLoading, loadingMessage, notification } = useLoader();

  return (
    <>
      {/* Global Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 right-6 z-[9999] max-w-md shadow-2xl rounded-2xl overflow-hidden border border-white/20"
          >
            <div
              className={`px-4 py-3 text-white flex items-center gap-3 backdrop-blur-md ${
                notification.type === 'success'
                  ? 'bg-emerald-600/90'
                  : notification.type === 'error'
                  ? 'bg-rose-600/90'
                  : 'bg-primary/90'
              }`}
            >
              <span className="material-symbols-outlined text-xl">
                {notification.type === 'success'
                  ? 'check_circle'
                  : notification.type === 'error'
                  ? 'error'
                  : 'info'}
              </span>
              <p className="text-xs sm:text-sm font-semibold">{notification.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Full-Screen Glassmorphic Loader Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9998] flex items-center justify-center bg-slate-950/75 backdrop-blur-md"
            role="status"
            aria-live="polite"
          >
            {/* Top indeterminate progress line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary-container overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-secondary-fixed via-tertiary-container to-secondary-fixed w-1/3"
                animate={{
                  x: ['-100%', '300%'],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.4,
                  ease: 'easeInOut',
                }}
              />
            </div>

            {/* Central Spinner & Card */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative flex flex-col items-center bg-surface-container-lowest/95 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.35)] max-w-sm w-[90%] text-center"
            >
              {/* Outer pulsing ring */}
              <div className="relative w-24 h-24 mb-5 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping opacity-40"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-secondary border-r-primary animate-spin"></div>
                
                {/* Brand Seal Centerpiece */}
                <div className="w-16 h-16 rounded-full overflow-hidden bg-white shadow-md p-1 border-2 border-primary/10 flex items-center justify-center z-10">
                  <img
                    src={logo2}
                    alt="HIT Foundation Emblem"
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
              </div>

              {/* Title & Brand */}
              <h3 className="font-headline text-base font-bold text-primary tracking-tight">
                HIT COMPUTER EDUCATION
              </h3>
              <p className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider mt-0.5">
                Central Academic Ledger
              </p>

              {/* Contextual Status Message */}
              <div className="mt-4 px-4 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 w-full flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-semibold text-primary truncate">
                  {loadingMessage || 'Processing request...'}
                </span>
              </div>

              {/* Security watermark */}
              <span className="text-[10px] text-outline font-medium mt-4 flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px] text-secondary">verified_user</span>
                Govt. Registered • NITI Aayog Verified
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
