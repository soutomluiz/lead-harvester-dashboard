import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'
import { LanguageProvider } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

// Set session timeout to 30 minutes
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

// Configure session persistence
supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    // Set session expiry time
    const expiryTime = new Date().getTime() + SESSION_TIMEOUT;
    localStorage.setItem('sessionExpiryTime', expiryTime.toString());
  }
});

// Check session validity on page load/refresh
const checkSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    const expiryTime = localStorage.getItem('sessionExpiryTime');
    if (expiryTime && new Date().getTime() > parseInt(expiryTime)) {
      console.log("Session expired, signing out...");
      await supabase.auth.signOut();
      window.location.href = '/login';
    } else {
      // Refresh expiry time if session is still valid
      const newExpiryTime = new Date().getTime() + SESSION_TIMEOUT;
      localStorage.setItem('sessionExpiryTime', newExpiryTime.toString());
    }
  }
};

// Check session on page visibility change (tab focus)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    checkSession();
  }
});

// Initial session check
checkSession();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      gcTime: 1000 * 60 * 5, // 5 minutes
      staleTime: 1000 * 60, // 1 minute
    },
  },
})

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </QueryClientProvider>
);