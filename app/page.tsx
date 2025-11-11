"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { LandingHeader } from "@/components/landing-header";
import Logo from "@/components/logo";
import { 
  Shield, 
  Users, 
  FileText, 
  Calendar, 
  Search, 
  Lock, 
  Zap,
  CheckCircle,
  Building2,
  Mail,
  Globe,
  ArrowRight
} from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <LandingHeader />

      {/* Hero Section */}
      <section className="w-full py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center space-y-8">
          <Badge variant="outline" className="px-4 py-1">
            <Globe className="h-3 w-3 mr-2 inline" />
            Built for Pacific Island Court Systems
          </Badge>
          
          <Heading as="h1" className="text-4xl md:text-6xl lg:text-7xl max-w-4xl">
            Modern Case Management for Pacific Courts
          </Heading>
          
          <p className="text-xl md:text-2xl font-semibold text-primary max-w-3xl">
            Totolo - Fast, Efficient Justice for the Pacific
          </p>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            From the Fijian word "Totolo" meaning "fast" or "quick", Totolaw helps the Pacific 
            achieve more efficient execution of justice with secure, streamlined case management.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button 
              size="lg" 
              onClick={() => router.push("/auth/login")}
              className="text-lg px-8"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-lg px-8"
            >
              Learn More
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 w-full max-w-3xl">
            <div className="text-center">
              <Heading as="h3">Multi-Tenant</Heading>
              <div className="text-sm text-muted-foreground">Architecture</div>
            </div>
            <div className="text-center">
              <Heading as="h3">Secure</Heading>
              <div className="text-sm text-muted-foreground">Passwordless Auth</div>
            </div>
            <div className="text-center">
              <Heading as="h3">RBAC</Heading>
              <div className="text-sm text-muted-foreground">Access Control</div>
            </div>
            <div className="text-center">
              <Heading as="h3">Cloud-Ready</Heading>
              <div className="text-sm text-muted-foreground">Deployment</div>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-20 bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
          <Heading as="h2" className="text-3xl md:text-5xl">
            Everything You Need to Manage Court Cases
          </Heading>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive features designed for the unique needs of Pacific Island judicial systems
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <FileText className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Case Management</CardTitle>
              <CardDescription>
                Complete case lifecycle tracking with status workflows, assignments, and comprehensive documentation
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Calendar className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Hearing Scheduler</CardTitle>
              <CardDescription>
                Schedule and track court hearings with calendar views, reminders, and outcome recording
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Evidence Management</CardTitle>
              <CardDescription>
                Secure storage and tracking of case evidence with chain of custody and submission records
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Building2 className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Multi-Organization</CardTitle>
              <CardDescription>
                Separate organizations for each court system with complete data isolation and security
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Role-Based Access</CardTitle>
              <CardDescription>
                Granular permissions for judges, magistrates, clerks, prosecutors, and administrators
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Search className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Global Search</CardTitle>
              <CardDescription>
                Fast, powerful search across cases, hearings, evidence, and documents organization-wide
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Mail className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Magic Link Auth</CardTitle>
              <CardDescription>
                Passwordless authentication via email for secure, easy access without password management
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Lock className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Enterprise Security</CardTitle>
              <CardDescription>
                CSRF protection, rate limiting, audit trails, and database-level data isolation
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Modern Interface</CardTitle>
              <CardDescription>
                Fast, responsive dashboard built with Next.js 16 and mobile-friendly design
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="w-full py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Heading as="h2" className="text-3xl md:text-5xl">
              Built for Pacific Island Courts
            </Heading>
            <p className="text-lg text-muted-foreground">
              <strong>Totolaw</strong> comes from the Fijian word <strong>"Totolo"</strong> meaning "fast" or "quick". 
              The platform is purpose-built to serve the unique needs of Pacific Island court systems, 
              enabling faster, more efficient justice delivery.
            </p>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <Heading as="h3" className="mb-1">Culturally Appropriate</Heading>
                  <p className="text-muted-foreground">
                    Designed with Pacific Island judicial processes and workflows in mind
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <Heading as="h3" className="mb-1">Scalable & Reliable</Heading>
                  <p className="text-muted-foreground">
                    Built on modern technology stack that grows with your organization
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <Heading as="h3" className="mb-1">Secure by Default</Heading>
                  <p className="text-muted-foreground">
                    Enterprise-grade security with complete data isolation between organizations
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <Heading as="h3" className="mb-1">Easy to Use</Heading>
                  <p className="text-muted-foreground">
                    Intuitive interface that requires minimal training for court staff
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Card className="p-8">
            <CardHeader>
              <CardTitle className="text-2xl">Supported Organizations</CardTitle>
              <CardDescription>
                Currently supporting multiple Pacific Island court systems
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Globe className="h-8 w-8 text-primary" />
                <div>
                  <div className="font-semibold">Fiji Courts</div>
                  <div className="text-sm text-muted-foreground">Republic of Fiji</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Globe className="h-8 w-8 text-primary" />
                <div>
                  <div className="font-semibold">Samoa Courts</div>
                  <div className="text-sm text-muted-foreground">Independent State of Samoa</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Globe className="h-8 w-8 text-primary" />
                <div>
                  <div className="font-semibold">Tonga Courts</div>
                  <div className="text-sm text-muted-foreground">Kingdom of Tonga</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Globe className="h-8 w-8 text-primary" />
                <div>
                  <div className="font-semibold">Vanuatu Courts</div>
                  <div className="text-sm text-muted-foreground">Republic of Vanuatu</div>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="w-full py-20 bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
          <Heading as="h2" className="text-3xl md:text-5xl">
            Built with Modern Technology
          </Heading>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Leveraging the latest web technologies for performance, security, and reliability
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <div className="font-bold text-lg mb-2">Next.js 16</div>
              <div className="text-sm text-muted-foreground">React Framework</div>
            </CardContent>
          </Card>
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <div className="font-bold text-lg mb-2">TypeScript</div>
              <div className="text-sm text-muted-foreground">Type Safety</div>
            </CardContent>
          </Card>
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <div className="font-bold text-lg mb-2">PostgreSQL</div>
              <div className="text-sm text-muted-foreground">Database</div>
            </CardContent>
          </Card>
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <div className="font-bold text-lg mb-2">Better Auth</div>
              <div className="text-sm text-muted-foreground">Authentication</div>
            </CardContent>
          </Card>
        </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="about" className="w-full py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-12 text-center space-y-6">
            <Heading as="h2" className="text-3xl md:text-5xl">
              Ready to Modernize Your Court System?
            </Heading>
            <p className="text-lg max-w-2xl mx-auto opacity-90">
              Join Pacific Island courts using Totolaw to streamline case management, 
              improve efficiency, and enhance judicial workflows.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => router.push("/auth/login")}
                className="text-lg px-8"
              >
                Sign In Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Logo width={140} height={45} className="h-10" />
              <p className="text-sm text-muted-foreground">
                <strong>Totolo</strong> - Fast, efficient justice for the Pacific
              </p>
              <p className="text-xs text-muted-foreground">
                From the Fijian word meaning "fast" or "quick"
              </p>
            </div>
            
            <div>
              <Heading as="h3" className="mb-4">Product</Heading>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#benefits" className="hover:text-primary transition-colors">Benefits</a></li>
                <li><a href="#about" className="hover:text-primary transition-colors">About</a></li>
              </ul>
            </div>
            
            <div>
              <Heading as="h3" className="mb-4">Resources</Heading>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/docs" className="hover:text-primary transition-colors">Documentation</a></li>
                <li><a target="_blank" href="https://github.com/taiatiniyara/totolaw" className="hover:text-primary transition-colors">GitHub</a></li>
              </ul>
            </div>
            
            <div>
              <Heading as="h3" className="mb-4">Support</Heading>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="mailto:support@totolaw.org" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="https://github.com/taiatiniyara/totolaw/issues" className="hover:text-primary transition-colors">Issues</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>Made with ❤️ for Pacific Island Court Systems</p>
            <p className="mt-2">© 2025 Totolaw. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
