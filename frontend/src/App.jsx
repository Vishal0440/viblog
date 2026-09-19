import React, { Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import WhyViBlog from "./pages/WhyViBlog";
import Footer from "./components/Footer";

const Feed = React.lazy(() => import("./pages/Feed"));
const Login = React.lazy(() => import("./pages/Login"));
const Signup = React.lazy(() => import("./pages/Signup"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const CreatePost = React.lazy(() => import("./pages/CreatePost"));
const PostView = React.lazy(() => import("./pages/PostView"));
const EditPost = React.lazy(() => import("./pages/EditPost"));
const ProtectedRoute = React.lazy(() => import("./components/ProtectedRoute"));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-slate-50">
      <p className="text-sm text-slate-500">Loading...</p>
    </div>
  );
}

function AppContent() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />

      <Suspense fallback={<Loading />}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Home />
                <WhyViBlog />
              </>
            }
          />
          <Route path="/feed" element={<Feed />} />
          <Route path="/post/:id" element={<PostView />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <EditPost />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <div className="flex min-h-[60vh] items-center justify-center bg-slate-50">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-slate-900">404</h1>
                  <p className="mt-2 text-slate-500">Page not found</p>
                </div>
              </div>
            }
          />
        </Routes>
      </Suspense>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
