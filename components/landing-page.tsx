"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Trash2, Clock, Shield, Zap, Users, ArrowRight, Check } from "lucide-react"
import Link from "next/link"

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">CleanMail</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="#support" className="text-muted-foreground hover:text-foreground transition-colors">
              Support
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/login">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            <Zap className="h-3 w-3 mr-1" />
            Revolutionary Bulk Deletion
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
            Clean Your Inbox in <span className="text-primary">Seconds</span>
          </h1>
          <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto">
            The only webmail client designed for bulk email management. Delete thousands of emails with smart filters,
            custom selections, and one-click actions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8">
                Try Bulk Deletion Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
              Watch Demo
            </Button>
          </div>

          {/* Hero Visual */}
          <div className="relative max-w-3xl mx-auto">
            <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-destructive rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <div className="ml-4 text-sm text-muted-foreground">CleanMail Dashboard</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-muted rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">Promotional emails (2,847 selected)</span>
                  </div>
                  <Button size="sm" variant="destructive">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete All
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">Newsletters (1,203 selected)</span>
                  </div>
                  <Button size="sm" variant="destructive">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete All
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">Social notifications (892 selected)</span>
                  </div>
                  <Button size="sm" variant="destructive">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete All
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlight Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simplify Your Inbox with Smart Bulk Deletion</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stop wasting hours manually deleting emails. Our intelligent system helps you clean thousands of emails in
              minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Bulk Actions</h3>
                <p className="text-muted-foreground">
                  Delete all, read only, unread only, or create custom selections with advanced filters.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Time-Saving Filters</h3>
                <p className="text-muted-foreground">
                  Filter by sender, date range, subject keywords, and more to target exactly what you want to delete.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
                <p className="text-muted-foreground">
                  OAuth authentication with Gmail, Outlook, and Yahoo. Your credentials stay secure.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8">
                Start Cleaning Your Inbox
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose CleanMail?</h2>
            <p className="text-xl text-muted-foreground">
              Built specifically for people who receive hundreds of emails daily
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Delete 10,000+ Emails in Minutes</h3>
                  <p className="text-muted-foreground">
                    What takes hours manually can be done in minutes with our bulk deletion tools.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Works with All Major Providers</h3>
                  <p className="text-muted-foreground">
                    Gmail, Outlook, Yahoo Mail, and more. Connect securely with OAuth.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Clean, Intuitive Interface</h3>
                  <p className="text-muted-foreground">
                    No clutter, no confusion. Just the tools you need to manage your inbox efficiently.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="text-center mb-6">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold">Join 50,000+ Users</h3>
                <p className="text-muted-foreground">Who have already cleaned their inboxes</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Emails deleted this month</span>
                  <span className="font-semibold">2.4M+</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Average time saved per user</span>
                  <span className="font-semibold">4.2 hours</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>User satisfaction rate</span>
                  <span className="font-semibold">98.5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Reclaim Your Inbox?</h2>
          <p className="text-xl opacity-90 mb-8">
            Start with our free tier and experience the power of bulk email deletion.
          </p>
          <Link href="/login">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Mail className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">CleanMail</span>
              </div>
              <p className="text-muted-foreground text-sm">
                The smartest way to manage your email inbox with powerful bulk deletion tools.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-foreground transition-colors">
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#support" className="hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-foreground transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#status" className="hover:text-foreground transition-colors">
                    Status
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#privacy" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#terms" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#security" className="hover:text-foreground transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 CleanMail. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
