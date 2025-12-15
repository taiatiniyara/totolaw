/**
 * Passwordless Authentication Help Page (Dashboard)
 * 
 * Dashboard help page explaining magic link login
 */

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import {
  Mail,
  Lock,
  Key,
  CheckCircle,
  XCircle,
  AlertCircle,
  Shield,
  Clock,
  Zap,
  UserCheck,
  ArrowLeft,
} from "lucide-react";

export default function AuthenticationHelpPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      {/* Back Button */}
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/help">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Help
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-full">
            <Key className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <Heading as="h1" className="text-3xl md:text-4xl">
              Passwordless Authentication
            </Heading>
            <p className="text-muted-foreground">
              How magic link login works in Totolaw - secure, simple, and password-free
            </p>
          </div>
        </div>
      </div>

      {/* What is Passwordless Auth */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Lock className="h-6 w-6 text-blue-600" />
          </div>
          <Heading as="h2" className="text-2xl">What is Passwordless Authentication?</Heading>
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
          <Heading as="h2" className="text-2xl">How Magic Link Login Works</Heading>
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
                      <span>Is securely protected on our servers</span>
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
                    We verify the magic link is valid and log you in automatically. 
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
          <Heading as="h2" className="text-2xl">Benefits of Magic Link Login</Heading>
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
                  <p className="font-semibold">No Passwords to Steal</p>
                  <p className="text-xs text-muted-foreground">
                    We don't use passwords, so there's nothing to steal or leak in data breaches
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
                  <p className="font-semibold">Single-Use Links</p>
                  <p className="text-xs text-muted-foreground">
                    Each link can only be used once, preventing unauthorized reuse
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
          <Heading as="h2" className="text-2xl">Security Features</Heading>
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
              <CardTitle className="text-base">Secure Codes</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>
                Each magic link contains a unique secure code that's impossible to guess or forge, 
                ensuring only you can use it.
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
              <CardTitle className="text-base">Secure Connection</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>
                All magic links use secure, encrypted connections to prevent interception when you click them.
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
          <Heading as="h2" className="text-2xl">Common Questions</Heading>
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
              Yes! Magic links use secure encryption, so they're safe to use even on public WiFi. 
              However, for maximum security, always ensure you're clicking the link from a trusted device.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">How long do I stay logged in?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              You'll stay logged in for 7 days of inactivity. After that, you'll need to log in again with 
              a new magic link. Your login is automatically extended every 24 hours while you're actively 
              using the system.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Best Practices */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-100 rounded-lg">
            <CheckCircle className="h-6 w-6 text-teal-600" />
          </div>
          <Heading as="h2" className="text-2xl">Best Practices</Heading>
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
        <Heading as="h2" className="text-2xl">Related Topics</Heading>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <Link href="/dashboard/help/security">
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
            <Link href="/dashboard/help/rbac">
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
            <Link href="/dashboard/help">
              <CardHeader>
                <ArrowLeft className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle className="text-base">Help Home</CardTitle>
                <CardDescription>
                  Browse all help topics
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </div>
      </section>
    </div>
  );
}
