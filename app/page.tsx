"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";
import { AuthDialog } from "@/components/auth-dialog";
import {
  Package,
  Layers,
  ShoppingCart,
  TrendingUp,
  CheckCircle2,
  Zap,
  Shield,
  BarChart3,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Cleanup function
    const cleanup = () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };

    // Wait for next tick to ensure DOM is ready
    const timer = setTimeout(() => {
      // Hero animations
      if (titleRef.current && subtitleRef.current && ctaRef.current) {
        const tl = gsap.timeline();

        tl.from(titleRef.current, {
          opacity: 0,
          y: 50,
          duration: 1,
          ease: "power3.out",
        })
          .from(
            subtitleRef.current,
            {
              opacity: 0,
              y: 30,
              duration: 0.8,
              ease: "power3.out",
            },
            "-=0.5"
          )
          .from(
            ctaRef.current,
            {
              opacity: 0,
              y: 20,
              duration: 0.6,
              ease: "power3.out",
            },
            "-=0.4"
          );
      }

      // Features section scroll animations
      if (featuresRef.current) {
        const cards = featuresRef.current.querySelectorAll(".feature-card");

        cards.forEach((card, index) => {
          gsap.from(card, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              toggleActions: "play none none none",
            },
            delay: index * 0.1,
          });
        });
      }

      // Stats section animation
      if (statsRef.current) {
        const stats = statsRef.current.querySelectorAll(".stat-item");
        stats.forEach((stat, index) => {
          gsap.from(stat, {
            opacity: 0,
            scale: 0.8,
            duration: 0.6,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: stat,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            delay: index * 0.1,
          });
        });
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      cleanup();
    };
  }, [mounted]);

  const handleGetStarted = () => {
    if (session?.user) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16 overflow-hidden"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        
        <div className="container mx-auto text-center relative z-10">
          <h1
            ref={titleRef}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent leading-tight"
          >
            Track Your Home Inventory
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              Like Never Before
            </span>
          </h1>
          <p
            ref={subtitleRef}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Organize your pantry, fridge, and storage with intelligent tracking.
            Never run out of essentials again.
          </p>
          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {mounted && session?.user ? (
              <Button
                size="lg"
                className="text-lg px-8 hover:neon-glow transition-all duration-300"
                onClick={handleGetStarted}
              >
                Go to Dashboard
              </Button>
            ) : (
              <AuthDialog
                trigger={
                  <Button size="lg" className="text-lg px-8 hover:neon-glow transition-all duration-300">
                    Get Started Free
                  </Button>
                }
                defaultMode="signup"
              />
            )}
            <Link href="/services">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        ref={statsRef}
        className="py-16 px-4 sm:px-6 lg:px-8 border-y border-border"
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="stat-item text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2 neon-text">
                100%
              </div>
              <div className="text-sm md:text-base text-muted-foreground">
                Free to Start
              </div>
            </div>
            <div className="stat-item text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2 neon-text">
                24/7
              </div>
              <div className="text-sm md:text-base text-muted-foreground">
                Access Anywhere
              </div>
            </div>
            <div className="stat-item text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2 neon-text">
                ∞
              </div>
              <div className="text-sm md:text-base text-muted-foreground">
                Unlimited Items
              </div>
            </div>
            <div className="stat-item text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2 neon-text">
                0
              </div>
              <div className="text-sm md:text-base text-muted-foreground">
                Credit Card Required
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30"
      >
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage your home inventory efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <NeonGradientCard
              className="feature-card"
              neonColors={{
                firstColor: "#00ff88",
                secondColor: "#00ffcc",
              }}
              borderSize={2}
              borderRadius={12}
            >
              <div className="h-full flex flex-col">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Organized Locations</h3>
                <p className="text-sm text-muted-foreground">
                  Create multiple locations like Kitchen Fridge, Garage Pantry,
                  or Basement Freezer
                </p>
              </div>
            </NeonGradientCard>

            <NeonGradientCard
              className="feature-card"
              neonColors={{
                firstColor: "#39ff14",
                secondColor: "#00ff88",
              }}
              borderSize={2}
              borderRadius={12}
            >
              <div className="h-full flex flex-col">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Layers className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Smart Categories</h3>
                <p className="text-sm text-muted-foreground">
                  Organize items by categories within each location for easy
                  navigation
                </p>
              </div>
            </NeonGradientCard>

            <NeonGradientCard
              className="feature-card"
              neonColors={{
                firstColor: "#00ffcc",
                secondColor: "#39ff14",
              }}
              borderSize={2}
              borderRadius={12}
            >
              <div className="h-full flex flex-col">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Stock Monitoring</h3>
                <p className="text-sm text-muted-foreground">
                  Track quantities and get alerts when items are running low or
                  out of stock
                </p>
              </div>
            </NeonGradientCard>

            <NeonGradientCard
              className="feature-card"
              neonColors={{
                firstColor: "#00ff88",
                secondColor: "#39ff14",
              }}
              borderSize={2}
              borderRadius={12}
            >
              <div className="h-full flex flex-col">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Auto Shopping Lists</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically generate shopping lists from items marked as "To
                  Buy"
                </p>
              </div>
            </NeonGradientCard>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose Stockly?
            </h2>
            <p className="text-xl text-muted-foreground">
              The smart way to manage your home inventory
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center neon-border">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Quick access to your inventory from any device. Update items
                  in seconds.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center neon-border">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
                <p className="text-muted-foreground">
                  Your data is encrypted and stored securely. Your inventory
                  information is private.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center neon-border">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Smart Insights</h3>
                <p className="text-muted-foreground">
                  Get notified when items are running low. Never run out of
                  essentials again.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center neon-border">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
                <p className="text-muted-foreground">
                  Intuitive interface that anyone can use. No training
                  required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of users who are already managing their inventory
            with Stockly. Start organizing your home today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {mounted && session?.user ? (
              <Button
                size="lg"
                className="text-lg px-8 hover:neon-glow transition-all duration-300"
                onClick={handleGetStarted}
              >
                Go to Dashboard
              </Button>
            ) : (
              <AuthDialog
                trigger={
                  <Button size="lg" className="text-lg px-8 hover:neon-glow transition-all duration-300">
                    Start Free Trial
                  </Button>
                }
                defaultMode="signup"
              />
            )}
            <Link href="/contact">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
