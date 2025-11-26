"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/auth-dialog";
import {
  CheckCircle2,
  Package,
  Layers,
  ShoppingCart,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function ServicesPage() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cleanup function
    const cleanup = () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };

    // Wait for next tick to ensure DOM is ready
    const timer = setTimeout(() => {
      // Title animation
      if (titleRef.current) {
        gsap.from(titleRef.current, {
          opacity: 0,
          y: 30,
          duration: 1,
          ease: "power3.out",
        });
      }

      // Subtitle animation
      if (subtitleRef.current) {
        gsap.from(subtitleRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.2,
        });
      }

      // Content sections animation
      if (contentRef.current) {
        const sections = contentRef.current.querySelectorAll(".service-section");

        sections.forEach((section, index) => {
          gsap.from(section, {
            opacity: 0,
            y: 60,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            delay: index * 0.1,
          });
        });
      }

      // CTA animation
      if (ctaRef.current) {
        gsap.from(ctaRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      cleanup();
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container mx-auto max-w-4xl text-center">
          <h1
            ref={titleRef}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
          >
            How Stockly Works
          </h1>
          <p
            ref={subtitleRef}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            A comprehensive solution for managing your home inventory with ease
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <div ref={contentRef} className="space-y-12">
            {/* Step 1 */}
            <Card className="service-section hover:shadow-lg hover:neon-glow transition-all duration-300 border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center neon-border">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl">1. Create Locations</CardTitle>
                    <CardDescription className="text-base mt-1">
                      Organize your storage spaces
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6 text-lg">
                  Start by creating locations where you store your items. This helps you
                  organize your inventory by physical location, making it easy to find
                  what you need.
                </p>
                <div className="bg-muted/50 rounded-lg p-6 mb-4">
                  <p className="font-medium mb-3">Example locations:</p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Kitchen Fridge</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Garage Pantry</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Basement Freezer</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Bathroom Cabinet</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Spice Rack</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="service-section hover:shadow-lg hover:neon-glow transition-all duration-300 border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center neon-border">
                    <Layers className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl">2. Organize with Categories</CardTitle>
                    <CardDescription className="text-base mt-1">
                      Group similar items together
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6 text-lg">
                  Within each location, create categories to organize your items. This
                  hierarchical structure makes it easy to find and manage your inventory.
                </p>
                <div className="bg-muted/50 rounded-lg p-6 mb-4">
                  <p className="font-medium mb-3">Example categories:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Dairy products in your fridge</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Canned goods in your pantry</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Frozen vegetables in your freezer</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Spices in your spice rack</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="service-section hover:shadow-lg hover:neon-glow transition-all duration-300 border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center neon-border">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl">3. Track Your Items</CardTitle>
                    <CardDescription className="text-base mt-1">
                      Monitor quantities and status
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6 text-lg">
                  Add items to categories and track their status. Stockly automatically
                  helps you stay on top of your inventory levels.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Zap className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Name</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Identify each item clearly for easy searching
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Quantity</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Monitor how much you have in stock
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Status</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      In Stock, Low Stock, or Out of Stock
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <ShoppingCart className="h-5 w-5 text-primary" />
                      <span className="font-semibold">To Buy</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Mark items for your shopping list
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 4 */}
            <Card className="service-section hover:shadow-lg hover:neon-glow transition-all duration-300 border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center neon-border">
                    <ShoppingCart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl">4. Generate Shopping Lists</CardTitle>
                    <CardDescription className="text-base mt-1">
                      Never forget essentials again
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6 text-lg">
                  Automatically generate shopping lists from all items marked as "To Buy"
                  across all your locations. Your shopping list is organized by location
                  for easy navigation at the store.
                </p>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-2">Smart Shopping Lists</p>
                      <p className="text-muted-foreground">
                        All items marked "To Buy" are automatically consolidated into one
                        convenient list, grouped by location. Check off items as you shop,
                        and they're automatically removed from your list.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={ctaRef}
        className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30"
      >
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of users managing their inventory with Stockly
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AuthDialog
              trigger={
                <Button size="lg" className="text-lg px-8 hover:neon-glow transition-all duration-300">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              }
              defaultMode="signup"
            />
            <Link href="/faq">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
