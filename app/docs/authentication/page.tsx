/**
 * Passwordless Authentication User Manual
 * 
 * Public documentation page explaining magic link login
 */

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { LandingHeader } from "@/components/landing-header";
import {
  Mail,
  Lock,
  Key,
  CheckCircle,
  XCircle,
  ArrowRight,
  BookOpen,
  Home,
  AlertCircle,
  Shield,
  Clock,
  Zap,
  UserCheck,
} from "lucide-react";

export default function AuthenticationDocumentationPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader variant="docs" />
      
      <div className="flex-1 py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-green-100 rounded-full">
                  <Key className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <Heading as="h1" className="text-4xl md:text-5xl">
                Passwordless Authentication
              </Heading>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                How magic link login works in Totolaw - secure, simple, and password-free
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" asChild size="sm">
                  <Link href="/docs">
                    <BookOpen className="mr-2 h-4 w-4" />
                    All Docs
                  </Link>
                </Button>
                <Button variant="outline" asChild size="sm">
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </Link>
                </Button>
              </div>
            </div>

            {/* What is Passwordless Auth */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Lock className="h-6 w-6 text-blue-600" />
                </div>
                <Heading as="h2" className="text-3xl">What is Passwordless Authentication?</Heading>
              </div>
              
              <Card>
                <CardContent className="pt-6">
                  <p className="text-lg mb-4">
                    <strong>Passwordless authentication</strong> means you can log in to Totolaw <strong>without creating 
                    or remembering a password</strong>. Instead, we send you a secure "magic link" to your email. 
                    Click the link, and you're instantly logged in.
                  </p>
                  
                  <div className="bg-muted p-6 rounded-lg space-y-4 mt-6">
                    <p className="font-semibold text-lg">Why No Passwords?</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">More Secure</p>
                          <p className="text-xs text-muted-foreground">
                            No passwords to steal, guess, or leak in data breaches
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">Easier to Use</p>
                          <p className="text-xs text-muted-foreground">
                            No need to remember complex passwords or reset them
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">Always Fresh</p>
                          <p className="text-xs text-muted-foreground">
                            Each login uses a new, unique link that expires quickly
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">Phishing Resistant</p>
                          <p className="text-xs text-muted-foreground">
                            Links expire and can only be used once
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* How It Works */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Mail className="h-6 w-6 text-purple-600" />
                </div>
                <Heading as="h2" className="text-3xl">How Magic Link Login Works</Heading>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {/* Step 1 */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-700 font-bold text-lg">
                          1
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-lg mb-2">Enter Your Email</p>
                        <p className="text-sm text-muted-foreground mb-3">
                          Go to the login page and enter your email address. That's it - no password field!
                        </p>
                        <div className="bg-muted p-4 rounded-lg">
                          <div className="max-w-md">
                            <div className="border border-input rounded-lg p-3 bg-background">
                              <label className="text-xs text-muted-foreground mb-1 block">Email Address</label>
                              <input 
                                type="text" 
                                placeholder="judge@court.gov.fj" 
                                className="w-full bg-transparent border-0 outline-none text-sm"
                                disabled
                              />
                            </div>
                            <button className="w-full mt-3 bg-primary text-primary-foreground rounded-lg py-2 text-sm font-semibold">
                              Send Magic Link
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-l-2 border-dashed border-muted-foreground/30 ml-5 h-8"></div>

                    {/* Step 2 */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-100 text-purple-700 font-bold text-lg">
                          2
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-lg mb-2">We Generate a Secure Link</p>
                        <p className="text-sm text-muted-foreground mb-3">
                          Our system creates a unique, time-limited magic link just for you. This link:
                        </p>
                        <div className="bg-muted p-4 rounded-lg space-y-2">
                          <div className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>Is completely random and impossible to guess</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>Expires after 15 minutes</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>Can only be used once</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>Is securely stored in our database</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-l-2 border-dashed border-muted-foreground/30 ml-5 h-8"></div>

                    {/* Step 3 */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100 text-green-700 font-bold text-lg">
                          3
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-lg mb-2">Check Your Email</p>
                        <p className="text-sm text-muted-foreground mb-3">
                          We send the magic link to your email address. Look for an email from Totolaw.
                        </p>
                        <div className="bg-muted p-4 rounded-lg">
                          <div className="bg-white p-4 rounded border shadow-sm max-w-md">
                            <div className="flex items-center gap-2 mb-3">
                              <Mail className="h-5 w-5 text-blue-600" />
                              <div>
                                <p className="font-semibold text-sm">Your Login Link - Totolaw</p>
                                <p className="text-xs text-muted-foreground">from: noreply@totolaw.org</p>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">
                              You requested a magic login link.
                            </p>
                            <button className="w-full bg-blue-600 text-white rounded py-2 text-sm font-semibold">
                              Click here to login
                            </button>
                            <p className="text-xs text-muted-foreground mt-3">
                              This link expires in 15 minutes.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-l-2 border-dashed border-muted-foreground/30 ml-5 h-8"></div>

                    {/* Step 4 */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-amber-100 text-amber-700 font-bold text-lg">
                          4
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-lg mb-2">Click the Magic Link</p>
                        <p className="text-sm text-muted-foreground mb-3">
                          Click the button or link in the email. It will open Totolaw in your browser.
                        </p>
                        <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-amber-900">
                              <strong>Tip:</strong> Click the link on the same device where you requested it. 
                              If you're on a phone, the link will work best in your mobile browser.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-l-2 border-dashed border-muted-foreground/30 ml-5 h-8"></div>

                    {/* Step 5 */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-teal-100 text-teal-700 font-bold text-lg">
                          5
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-lg mb-2">You're Logged In!</p>
                        <p className="text-sm text-muted-foreground mb-3">
                          We verify the magic link is valid, create your session, and log you in automatically. 
                          You're redirected to your dashboard.
                        </p>
                        <div className="bg-teal-50 border border-teal-200 p-4 rounded-lg">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="h-8 w-8 text-teal-600" />
                            <div>
                              <p className="font-semibold text-sm text-teal-900">Success!</p>
                              <p className="text-xs text-teal-700">
                                You're now logged in and can access all features.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Benefits */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <Heading as="h2" className="text-3xl">Benefits of Magic Link Login</Heading>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-6 w-6 text-blue-600" />
                      <CardTitle className="text-xl">Enhanced Security</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">No Password Database</p>
                        <p className="text-xs text-muted-foreground">
                          We don't store passwords, so they can't be stolen or leaked
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Email Verification Built-In</p>
                        <p className="text-xs text-muted-foreground">
                          Only someone with access to your email can log in
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Time-Limited Access</p>
                        <p className="text-xs text-muted-foreground">
                          Links expire after 15 minutes, limiting exposure
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Single-Use Tokens</p>
                        <p className="text-xs text-muted-foreground">
                          Each link can only be used once, preventing replay attacks
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <UserCheck className="h-6 w-6 text-purple-600" />
                      <CardTitle className="text-xl">Better User Experience</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Nothing to Remember</p>
                        <p className="text-xs text-muted-foreground">
                          No passwords to create, remember, or manage
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">No Password Resets</p>
                        <p className="text-xs text-muted-foreground">
                          Never need to reset a forgotten password
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Quick Login</p>
                        <p className="text-xs text-muted-foreground">
                          Just one click from your email and you're in
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Works Everywhere</p>
                        <p className="text-xs text-muted-foreground">
                          Access from desktop, tablet, or mobile device
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Security Features */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Lock className="h-6 w-6 text-red-600" />
                </div>
                <Heading as="h2" className="text-3xl">Security Features</Heading>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <Clock className="h-8 w-8 text-blue-600 mb-2" />
                    <CardTitle className="text-base">15-Minute Expiration</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p>
                      Magic links automatically expire after 15 minutes. If you don't click the link in time, 
                      simply request a new one.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Key className="h-8 w-8 text-purple-600 mb-2" />
                    <CardTitle className="text-base">Cryptographic Tokens</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p>
                      Each magic link contains a cryptographically secure random token that's impossible to 
                      guess or forge.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Shield className="h-8 w-8 text-green-600 mb-2" />
                    <CardTitle className="text-base">Rate Limiting</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p>
                      You can only request 5 magic links per 15-minute window, preventing abuse and spam.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Mail className="h-8 w-8 text-orange-600 mb-2" />
                    <CardTitle className="text-base">Email Verification</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p>
                      Only the owner of the email address can receive and click the magic link, providing 
                      inherent verification.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CheckCircle className="h-8 w-8 text-teal-600 mb-2" />
                    <CardTitle className="text-base">Single-Use Links</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p>
                      Once you click a magic link and log in, that link is immediately invalidated and 
                      cannot be used again.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Lock className="h-8 w-8 text-red-600 mb-2" />
                    <CardTitle className="text-base">HTTPS Only</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p>
                      All magic links use HTTPS encryption to prevent interception during transmission.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Common Questions */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-amber-600" />
                </div>
                <Heading as="h2" className="text-3xl">Common Questions</Heading>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">What if I don't receive the email?</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>If you don't receive the magic link email within a few minutes:</p>
                    <ul className="ml-6 space-y-1">
                      <li>• Check your spam/junk folder</li>
                      <li>• Verify you entered the correct email address</li>
                      <li>• Wait a moment and try requesting a new link</li>
                      <li>• Contact your administrator if the problem persists</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Can I use the same magic link multiple times?</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <strong>No.</strong> Each magic link can only be used once. After you click it and log in, 
                    it's immediately invalidated. If you need to log in again later, request a new magic link.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">What happens if the magic link expires?</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    If you click an expired link (older than 15 minutes), you'll see an error message. 
                    Simply go back to the login page and request a new magic link. The process takes just seconds.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Is it safe to click the link on public WiFi?</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Yes! Magic links use HTTPS encryption, so they're safe to use even on public WiFi. 
                    However, for maximum security, always ensure you're clicking the link from a trusted device 
                    and that the URL starts with "https://".
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Can someone else use my magic link if they get access to my email?</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Yes - this is why email security is crucial. If someone has access to your email, they can 
                    use the magic link. Always:
                    <ul className="ml-6 space-y-1 mt-2">
                      <li>• Keep your email account secure with a strong password</li>
                      <li>• Enable two-factor authentication on your email</li>
                      <li>• Log out of email on shared devices</li>
                      <li>• Report suspicious activity immediately</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">How long does my session last after logging in?</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Your session lasts for 7 days of inactivity. After that, you'll need to log in again with 
                    a new magic link. The session is automatically refreshed every 24 hours while you're actively 
                    using the system.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Can I request multiple magic links at once?</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Yes, but be aware that only the most recent magic link will work - previous links are 
                    automatically invalidated when you request a new one. Also, you're limited to 5 requests 
                    per 15-minute window to prevent abuse.
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">What if I click the magic link on a different device?</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    That's fine! You can request a magic link on one device (like your phone) and click it on 
                    another device (like your desktop). The link will work on any device with a web browser.
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Troubleshooting */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                </div>
                <Heading as="h2" className="text-3xl">Troubleshooting</Heading>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Common Issues and Solutions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-red-500 pl-4 py-2">
                      <p className="font-semibold text-sm mb-1">Error: "Invalid or expired token"</p>
                      <p className="text-xs text-muted-foreground mb-2">
                        The magic link has expired or been used already.
                      </p>
                      <p className="text-xs">
                        <strong>Solution:</strong> Request a new magic link from the login page.
                      </p>
                    </div>

                    <div className="border-l-4 border-amber-500 pl-4 py-2">
                      <p className="font-semibold text-sm mb-1">Email not arriving</p>
                      <p className="text-xs text-muted-foreground mb-2">
                        The magic link email isn't showing up in your inbox.
                      </p>
                      <p className="text-xs">
                        <strong>Solution:</strong> Check spam folder, verify email address, wait 2-3 minutes, or request a new link.
                      </p>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-4 py-2">
                      <p className="font-semibold text-sm mb-1">Link doesn't work when clicked</p>
                      <p className="text-xs text-muted-foreground mb-2">
                        Clicking the link does nothing or shows an error.
                      </p>
                      <p className="text-xs">
                        <strong>Solution:</strong> Copy the full URL from the email and paste it into your browser's address bar.
                      </p>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-4 py-2">
                      <p className="font-semibold text-sm mb-1">Rate limit exceeded</p>
                      <p className="text-xs text-muted-foreground mb-2">
                        Message saying you've requested too many magic links.
                      </p>
                      <p className="text-xs">
                        <strong>Solution:</strong> Wait 15 minutes before requesting a new link. Check your recent emails for an existing valid link.
                      </p>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4 py-2">
                      <p className="font-semibold text-sm mb-1">Logged out unexpectedly</p>
                      <p className="text-xs text-muted-foreground mb-2">
                        Your session ended before the 7-day expiration.
                      </p>
                      <p className="text-xs">
                        <strong>Solution:</strong> This is normal if you cleared cookies, logged out, or the session expired. Simply log in again with a new magic link.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Best Practices */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-teal-600" />
                </div>
                <Heading as="h2" className="text-3xl">Best Practices</Heading>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Do This
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>Keep your email account secure with a strong password</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>Enable two-factor authentication on your email</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>Click magic links promptly (within 15 minutes)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>Verify the email is from Totolaw before clicking</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>Log out when finished on shared computers</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-600" />
                      Don't Do This
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">✗</span>
                        <span>Share your magic links with anyone</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">✗</span>
                        <span>Click links from suspicious or unexpected emails</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">✗</span>
                        <span>Leave your email logged in on public devices</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">✗</span>
                        <span>Request magic links excessively</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">✗</span>
                        <span>Forward magic link emails to others</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Summary */}
            <section className="space-y-6">
              <Card className="border-green-200 bg-green-50/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Key className="h-8 w-8 text-green-600" />
                    <CardTitle className="text-xl">Why Magic Links are Better</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <p>
                      Traditional passwords are the #1 cause of security breaches. By using passwordless 
                      authentication, Totolaw provides:
                    </p>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Better Security</strong> - No passwords to steal or crack</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Easier Access</strong> - One click from your email</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span><strong>No Maintenance</strong> - Never reset forgotten passwords</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Modern Approach</strong> - Same system used by major platforms</span>
                      </div>
                    </div>
                    <p className="mt-4 text-muted-foreground italic">
                      Focus on your work, not on remembering passwords. Totolaw's magic link system 
                      makes login secure, simple, and stress-free.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Related Topics */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-gray-600" />
                </div>
                <Heading as="h2" className="text-3xl">Related Topics</Heading>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Card className="hover:bg-accent cursor-pointer transition-colors">
                  <Link href="/docs/security">
                    <CardHeader>
                      <Shield className="h-8 w-8 text-blue-600 mb-2" />
                      <CardTitle className="text-base">Multi-Tenant Security</CardTitle>
                      <CardDescription>
                        How your data is kept isolated and secure
                      </CardDescription>
                    </CardHeader>
                  </Link>
                </Card>

                <Card className="hover:bg-accent cursor-pointer transition-colors">
                  <Link href="/docs/rbac">
                    <CardHeader>
                      <Shield className="h-8 w-8 text-purple-600 mb-2" />
                      <CardTitle className="text-base">RBAC</CardTitle>
                      <CardDescription>
                        Understanding roles and permissions
                      </CardDescription>
                    </CardHeader>
                  </Link>
                </Card>

                <Card className="hover:bg-accent cursor-pointer transition-colors">
                  <Link href="/docs/getting-started">
                    <CardHeader>
                      <BookOpen className="h-8 w-8 text-green-600 mb-2" />
                      <CardTitle className="text-base">Getting Started</CardTitle>
                      <CardDescription>
                        New to Totolaw? Start here
                      </CardDescription>
                    </CardHeader>
                  </Link>
                </Card>
              </div>
            </section>

            {/* CTA */}
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-8 text-center space-y-4">
                <Heading as="h2" className="text-2xl md:text-3xl">
                  Ready to Try It?
                </Heading>
                <p className="text-lg opacity-90 max-w-2xl mx-auto">
                  Experience the simplicity and security of passwordless login. Enter your email and we'll 
                  send you a magic link.
                </p>
                <Button 
                  size="lg" 
                  variant="secondary"
                  asChild
                  className="text-lg px-8"
                >
                  <Link href="/auth/login">
                    Login with Magic Link
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8 bg-muted/50 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>Made with ❤️ for Pacific Island Court Systems</p>
          <p className="mt-2">© 2025 Totolaw. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
