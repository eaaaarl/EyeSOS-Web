'use client'

import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TermsOfServicePage() {
  return (
    <div className="bg-muted flex min-h-svh items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Button>
        </Link>

        <Card>
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
              <p className="text-muted-foreground">Last Updated: February 28, 2026</p>
            </div>

            <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
              <section>
                <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
                <p>
                  By accessing and using EyeSOS ("the Platform"), you accept and agree to be bound by the terms 
                  and provision of this agreement. If you do not agree to abide by these terms, please do not 
                  use this service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">2. Description of Service</h2>
                <p>
                  EyeSOS is an emergency response and disaster management platform designed to facilitate 
                  coordination between Local Government Units (LGUs), Barangay Local Government Units (BLGUs), 
                  emergency responders, and administrators. The Platform provides:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Real-time accident and incident reporting</li>
                  <li>Emergency response coordination and dispatch</li>
                  <li>Resource management and tracking</li>
                  <li>Communication tools for emergency personnel</li>
                  <li>Data analytics and reporting for disaster management</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">3. User Accounts</h2>
                <p>
                  Access to EyeSOS is restricted to authorized personnel only. You are responsible for:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Maintaining the confidentiality of your login credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying administrators immediately of any unauthorized access</li>
                  <li>Ensuring your account information is accurate and up-to-date</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">4. Authorized Users</h2>
                <p>
                  The Platform is exclusively available to:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Local Government Unit (LGU) personnel</li>
                  <li>Barangay Local Government Unit (BLGU) officials</li>
                  <li>Authorized emergency responders</li>
                  <li>System administrators</li>
                </ul>
                <p className="mt-2">
                  Any use by unauthorized individuals is strictly prohibited and may result in account 
                  termination and legal action.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">5. User Responsibilities</h2>
                <p>
                  As a user of EyeSOS, you agree to:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Use the Platform only for legitimate emergency response and disaster management purposes</li>
                  <li>Provide accurate and timely information when reporting incidents</li>
                  <li>Respond promptly to emergency dispatches and requests for assistance</li>
                  <li>Maintain professional conduct in all Platform communications</li>
                  <li>Comply with all applicable laws, regulations, and emergency response protocols</li>
                  <li>Not misuse or abuse the emergency reporting system</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">6. Data and Reporting</h2>
                <p>
                  Users acknowledge that:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>All incident reports and data entered become part of the official emergency response record</li>
                  <li>Information submitted through the Platform may be shared with authorized agencies</li>
                  <li>False or misleading reports may result in disciplinary action</li>
                  <li>The Platform maintains audit logs of all user activities</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">7. Prohibited Conduct</h2>
                <p>
                  You agree not to:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Submit false, fraudulent, or misleading emergency reports</li>
                  <li>Use the Platform for personal or non-official purposes</li>
                  <li>Attempt to access other users' accounts or data without authorization</li>
                  <li>Interfere with or disrupt the Platform's servers or networks</li>
                  <li>Use the Platform to harass, threaten, or harm others</li>
                  <li>Circumvent any security measures or access controls</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">8. Intellectual Property</h2>
                <p>
                  The EyeSOS Platform, including its design, features, and content, is protected by intellectual 
                  property laws. Users are granted a limited, non-exclusive, non-transferable license to use the 
                  Platform for authorized emergency response purposes only.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">9. Disclaimer of Warranties</h2>
                <p>
                  The Platform is provided "as is" and "as available" without warranties of any kind, either 
                  express or implied. While we strive to maintain uninterrupted service, we do not guarantee that:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>The Platform will be available at all times, especially during emergency situations</li>
                  <li>All features will function without errors or interruptions</li>
                  <li>Communication through the Platform will reach all intended recipients</li>
                </ul>
                <p className="mt-2">
                  Users should maintain alternative communication methods for emergency coordination.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">10. Limitation of Liability</h2>
                <p>
                  To the maximum extent permitted by law, EyeSOS and its developers shall not be liable for any 
                  indirect, incidental, special, consequential, or punitive damages resulting from your use of 
                  the Platform, including but not limited to:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Delays or failures in emergency response coordination</li>
                  <li>Technical failures or service interruptions</li>
                  <li>Unauthorized access to or alteration of data</li>
                  <li>Any other matter relating to the Platform</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">11. Account Termination</h2>
                <p>
                  We reserve the right to suspend or terminate your access to the Platform at our sole discretion, 
                  without notice, for conduct that we believe violates these Terms or is harmful to other users, 
                  or for any other reason we deem appropriate.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">12. Changes to Terms</h2>
                <p>
                  We may modify these Terms of Service at any time. Continued use of the Platform after changes 
                  constitutes acceptance of the new terms. Users will be notified of significant changes through 
                  the Platform or via registered email.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">13. Governing Law</h2>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the Republic 
                  of the Philippines. Any disputes arising from these Terms shall be subject to the exclusive 
                  jurisdiction of the appropriate courts.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">14. Contact Information</h2>
                <p>
                  For questions or concerns regarding these Terms of Service, please contact your system 
                  administrator or the EyeSOS development team.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">15. Academic Use Notice</h2>
                <p>
                  This Platform is developed as part of an academic thesis project. Users acknowledge that 
                  certain features may be under development and that the system is subject to changes based 
                  on research requirements and feedback.
                </p>
              </section>
            </div>

            <div className="pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                By using EyeSOS, you acknowledge that you have read, understood, and agree to be bound by 
                these Terms of Service.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
