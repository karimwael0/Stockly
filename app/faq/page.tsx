"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Navbar } from "@/components/navbar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Search, HelpCircle } from "lucide-react";
import { AuthDialog } from "@/components/auth-dialog";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    question: "How do I get started with Stockly?",
    answer:
      "Getting started is easy! Sign up for a free account, create your first location (like 'Kitchen Fridge'), add categories, and start adding items. The intuitive interface guides you through each step. No credit card required.",
    category: "getting-started",
  },
  {
    question: "Can I have multiple locations?",
    answer:
      "Yes! Stockly is designed to handle multiple locations. You can create as many locations as you need - from your kitchen fridge to your garage pantry, basement freezer, or any other storage area. There's no limit!",
    category: "features",
  },
  {
    question: "How does the shopping list feature work?",
    answer:
      "Simply mark items as 'To Buy' when you notice they're running low or out of stock. The shopping list automatically consolidates all marked items from all your locations into one convenient list, organized by location for easy shopping.",
    category: "features",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We use industry-standard encryption and security practices to protect your data. Your inventory information is private and only accessible to you. We never share your data with third parties.",
    category: "security",
  },
  {
    question: "Can I use Stockly on mobile devices?",
    answer:
      "Yes! Stockly is fully responsive and works great on smartphones and tablets. You can access your inventory and shopping lists from anywhere, anytime. The mobile interface is optimized for touch interactions.",
    category: "features",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes, we offer a free account with full access to all features. No credit card required to get started. You can use Stockly for free as long as you'd like!",
    category: "pricing",
  },
  {
    question: "How do I update item quantities?",
    answer:
      "You can easily update quantities by editing any item in your inventory. Simply click the edit button, change the quantity, and save. The status will automatically update based on the quantity you set.",
    category: "usage",
  },
  {
    question: "Can I export my data?",
    answer:
      "Yes, you can export your inventory data at any time. This feature is available in your account settings. You can export in various formats including CSV and JSON.",
    category: "features",
  },
  {
    question: "What happens if I delete a location?",
    answer:
      "When you delete a location, all categories and items within that location are also deleted. This action cannot be undone, so please be careful. We recommend exporting your data before deleting if you want to keep a backup.",
    category: "usage",
  },
  {
    question: "How do I mark items as low stock?",
    answer:
      "Items are automatically marked as 'Low Stock' based on their quantity. You can also manually set the status to 'Low Stock', 'In Stock', or 'Out of Stock' when editing an item. The system will help you track which items need attention.",
    category: "usage",
  },
  {
    question: "Can multiple people use the same account?",
    answer:
      "Currently, each account is designed for individual use. However, you can share your login credentials if you want multiple people to access the same inventory. We're working on team features for the future!",
    category: "features",
  },
  {
    question: "Do you offer customer support?",
    answer:
      "Yes! We offer customer support via email and phone during business hours. You can reach us at support@stockly.com or call us at +1 (555) 123-4567. We typically respond within 24 hours.",
    category: "support",
  },
];

export default function FAQPage() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

      // Accordion animation
      if (accordionRef.current) {
        gsap.from(accordionRef.current, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: accordionRef.current,
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

  const filteredFaqs = searchQuery.trim() === ""
    ? faqs
    : faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );

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
            Frequently Asked Questions
          </h1>
          <p
            ref={subtitleRef}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Everything you need to know about Stockly
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
            {searchQuery && (
              <p className="text-sm text-muted-foreground mt-2">
                Found {filteredFaqs.length} result{filteredFaqs.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* FAQ Accordion */}
          <div ref={accordionRef}>
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No results found</p>
                <p className="text-muted-foreground">
                  Try searching with different keywords
                </p>
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full space-y-2">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border rounded-lg px-4 hover:bg-muted/50 transition-colors"
                  >
                    <AccordionTrigger className="text-left font-semibold hover:no-underline py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>

          {/* Still Have Questions CTA */}
          <div className="mt-16 text-center">
            <div className="bg-muted/50 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
              <p className="text-muted-foreground mb-6">
                Can't find the answer you're looking for? Please reach out to our
                friendly team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/contact">
                  <Button size="lg">Contact Us</Button>
                </a>
                <AuthDialog
                  trigger={
                    <Button size="lg" variant="outline">
                      Get Started
                    </Button>
                  }
                  defaultMode="signup"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
