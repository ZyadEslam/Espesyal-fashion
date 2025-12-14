'use client';

// Client-side workaround for Turbopack devtools HMR issue
if (typeof window !== 'undefined') {
  // Suppress devtools errors in console
  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    const message = args[0]?.toString() || '';
    // Suppress the specific Turbopack devtools error
    if (
      message.includes('next-devtools') ||
      message.includes('Module factory is not available') ||
      message.includes('factoryNotAvailable')
    ) {
      // Silently ignore this error
      return;
    }
    originalError.apply(console, args);
  };

  // Also catch unhandled promise rejections related to devtools
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    if (
      error?.message?.includes('next-devtools') ||
      error?.message?.includes('Module factory is not available') ||
      error?.message?.includes('factoryNotAvailable')
    ) {
      event.preventDefault();
      // Silently handle the error
    }
  });
}

