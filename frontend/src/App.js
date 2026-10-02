import React, { useEffect } from "react";
import Lenis from "lenis";
import { MessageCircle } from "lucide-react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import UploadSection from "./components/UploadSection";
import AdminPage from "./components/AdminPage";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TickerMarquee from "./components/TickerMarquee";
import AboutSection from "./components/AboutSection";
import ServicesCatalog from "./components/ServicesCatalog";
import SchemesBento from "./components/SchemesBento";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import { CONTACT } from "./data/content";
import "@/App.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-ink px-6 text-center">
          <div>
            <p className="font-display text-2xl font-bold text-white">
              Something went wrong
            </p>
            <p className="mt-3 font-body text-sm text-slate-400">
              Please refresh the page — or call us on {CONTACT.phoneDisplay}.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
};

const FloatingWhatsApp = () => (
  <a
    href={CONTACT.whatsapp}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat on WhatsApp"
    data-testid="floating-whatsapp-button"
    className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-ink shadow-card transition-transform duration-300 hover:scale-110"
  >
    <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-whatsapp" />
    <MessageCircle className="relative h-6 w-6" />
  </a>
);

function App() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    window.__lenis = lenis;
    let raf;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const hash = a.getAttribute("href");
      if (!hash || hash === "#") return;
      e.preventDefault();
      if (hash === "#home") {
        lenis.scrollTo(0);
      } else {
        lenis.scrollTo(hash, { offset: -76 });
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <Toaster theme="dark" position="bottom-center" />
    </BrowserRouter>
  );
}

const LandingPage = () => (
  <div className="relative min-h-screen overflow-x-clip bg-ink font-body text-slate-100">
    <div className="grain" aria-hidden="true" />
    <Navbar />
    <main>
      <Hero />
      <TickerMarquee />
      <AboutSection />
      <ServicesCatalog />
      <SchemesBento />
      <UploadSection />
      <ContactSection />
    </main>
    <Footer />
    <FloatingWhatsApp />
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function AppWrapper() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
