'use client'

import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PrivacyPolicyPage() {
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
              <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
              <p className="text-muted-foreground">Last Updated: February 28, 2026</p>
            </div>

            <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
              <section>
                <h2 className="text-xl font-semibold text-foreground">1. Introduction</h2>
                <p>
                  EyeSOS ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy 
                  explains how we collect, use, disclose, and safeguard your information when you use our 
                  emergency response and disaster management platform. Please read this policy carefully to 
                  understand our practices regarding your personal information.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">2. Information We Collect</h2>
                
                <h3 className="text-lg font-medium text-foreground mt-4">2.1 Personal Information</h3>
                <p>
                  As an authorized user, we collect the following personal information:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><strong>Account Information:</strong> Name, email address, mobile number, user type (LGU/BLGU/Admin/Responder)</li>
                  <li><strong>Profile Information:</strong> Job title, department, organization, profile photo</li>
                  <li><strong>Authentication Data:</strong> Encrypted password, session tokens</li>
                  <li><strong>Contact Information:</strong> Emergency contact details, office address</li>
                </ul>

                <h3 className="text-lg font-medium text-foreground mt-4">2.2 Operational Data</h3>
                <p>
                  When using the Platform, we collect:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><strong>Incident Reports:</strong> Location, type, severity, descriptions, photos, and timestamps</li>
                  <li><strong>Response Data:</strong> Response times, actions taken, resource deployment</li>
                  <li><strong>Location Data:</strong> GPS coordinates for incident mapping and responder tracking</li>
                  <li><strong>Communication Logs:</strong> Messages, dispatches, and coordination records</li>
                </ul>

                <h3 className="text-lg font-medium text-foreground mt-4">2.3 Automatically Collected Information</h3>
                <p>
                  We automatically collect certain information when you access the Platform:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Device information (type, operating system, browser)</li>
                  <li>IP address and network information</li>
                  <li>Usage patterns and feature access</li>
                  <li>Login timestamps and session duration</li>
                  <li>Audit logs for security and compliance</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">3. How We Use Your Information</h2>
                <p>We use the collected information for the following purposes:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><strong>Service Delivery:</strong> To provide emergency response coordination and disaster management features</li>
                  <li><strong>Authentication:</strong> To verify your identity and authorize access to the Platform</li>
                  <li><strong>Communication:</strong> To send dispatches, alerts, and important notifications</li>
                  <li><strong>Coordination:</strong> To facilitate communication between LGUs, BLGUs, and responders</li>
                  <li><strong>Analytics:</strong> To analyze response times, incident patterns, and platform usage</li>
                  <li><strong>Reporting:</strong> To generate reports for government agencies and stakeholders</li>
                  <li><strong>Security:</strong> To detect and prevent fraud, abuse, and unauthorized access</li>
                  <li><strong>Improvement:</strong> To enhance platform features and user experience</li>
                  <li><strong>Compliance:</strong> To meet legal and regulatory requirements</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">4. Information Sharing and Disclosure</h2>
                <p>
                  We may share your information with the following parties:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><strong>Authorized Personnel:</strong> Other LGU/BLGU officials and responders involved in emergency response</li>
                  <li><strong>Government Agencies:</strong> Relevant local and national government agencies for coordination purposes</li>
                  <li><strong>Emergency Services:</strong> Police, fire, medical, and rescue teams when dispatching responses</li>
                  <li><strong>Service Providers:</strong> Third-party vendors who provide hosting, maintenance, and support services</li>
                  <li><strong>Legal Requirements:</strong> When required by law, court order, or government regulation</li>
                </ul>
                <p className="mt-2">
                  We do not sell, trade, or rent your personal information to third parties for commercial purposes.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">5. Data Security</h2>
                <p>
                  We implement appropriate technical and organizational measures to protect your information:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><strong>Encryption:</strong> Data transmitted between your device and our servers is encrypted using SSL/TLS</li>
                  <li><strong>Access Controls:</strong> Role-based access controls limit data access to authorized users only</li>
                  <li><strong>Authentication:</strong> Secure authentication mechanisms protect user accounts</li>
                  <li><strong>Audit Trails:</strong> All access and modifications are logged for security monitoring</li>
                  <li><strong>Regular Assessments:</strong> Security assessments and updates are conducted regularly</li>
                  <li><strong>Data Backup:</strong> Regular backups prevent data loss</li>
                </ul>
                <p className="mt-2">
                  However, no method of transmission over the internet or electronic storage is 100% secure. 
                  While we strive to protect your information, we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">6. Data Retention</h2>
                <p>
                  We retain your information for as long as necessary to:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Provide services and maintain your account</li>
                  <li>Comply with legal and regulatory requirements</li>
                  <li>Resolve disputes and enforce agreements</li>
                  <li>Maintain historical records for disaster management analysis</li>
                </ul>
                <p className="mt-2">
                  Incident reports and response data may be retained indefinitely as part of the official 
                  emergency response record. Account information is retained while your account is active 
                  and for a reasonable period thereafter.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">7. Your Rights and Choices</h2>
                <p>Depending on your role and jurisdiction, you may have the following rights:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><strong>Access:</strong> Request access to your personal information</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                  <li><strong>Deletion:</strong> Request deletion of your account (subject to legal retention requirements)</li>
                  <li><strong>Export:</strong> Request a copy of your data in a portable format</li>
                  <li><strong>Opt-out:</strong> Manage notification preferences and communication settings</li>
                </ul>
                <p className="mt-2">
                  To exercise these rights, please contact your system administrator or the EyeSOS development team.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">8. Location Services</h2>
                <p>
                  The Platform uses location services for:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Mapping incident locations</li>
                  <li>Tracking responder deployment</li>
                  <li>Providing location-based alerts and notifications</li>
                  <li>Analyzing geographic patterns of emergencies</li>
                </ul>
                <p className="mt-2">
                  You can control location permissions through your device settings, but disabling location 
                  services may limit certain Platform features.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">9. Cookies and Tracking</h2>
                <p>
                  We use cookies and similar tracking technologies to:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Maintain your session and authentication</li>
                  <li>Remember your preferences</li>
                  <li>Analyze platform usage and performance</li>
                  <li>Improve user experience</li>
                </ul>
                <p className="mt-2">
                  Most browsers allow you to control cookies through their settings. However, disabling 
                  cookies may affect your ability to use certain features of the Platform.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">10. Third-Party Services</h2>
                <p>
                  The Platform may integrate with third-party services such as:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Map services (e.g., Google Maps, OpenStreetMap)</li>
                  <li>Cloud hosting providers (e.g., Supabase, AWS)</li>
                  <li>Communication services (e.g., SMS, email providers)</li>
                  <li>Analytics tools</li>
                </ul>
                <p className="mt-2">
                  These third parties have their own privacy policies. We encourage you to review them 
                  to understand how they handle your information.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">11. Children's Privacy</h2>
                <p>
                  The Platform is not intended for users under 18 years of age. We do not knowingly collect 
                  personal information from children. If you believe a child has provided us with personal 
                  information, please contact us immediately.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">12. International Data Transfers</h2>
                <p>
                  Your information may be processed and stored in countries outside your jurisdiction. 
                  We ensure appropriate safeguards are in place to protect your information in accordance 
                  with applicable data protection laws.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">13. Changes to This Privacy Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Posting the new Privacy Policy on the Platform</li>
                  <li>Updating the "Last Updated" date</li>
                  <li>Sending email notifications for significant changes</li>
                </ul>
                <p className="mt-2">
                  Your continued use of the Platform after changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">14. Data Protection Officer</h2>
                <p>
                  For questions, concerns, or requests regarding this Privacy Policy or your personal data, 
                  please contact:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Your organization's system administrator</li>
                  <li>The EyeSOS development team</li>
                  <li>Your organization's Data Protection Officer (if applicable)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">15. Legal Basis for Processing</h2>
                <p>
                  We process your personal information based on:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><strong>Contract:</strong> To fulfill our obligations under the service agreement</li>
                  <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations</li>
                  <li><strong>Legitimate Interests:</strong> For platform improvement, security, and analytics</li>
                  <li><strong>Public Interest:</strong> For emergency response and disaster management purposes</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">16. Academic Research Notice</h2>
                <p>
                  As this Platform is part of an academic thesis project, anonymized and aggregated data 
                  may be used for research purposes. No personally identifiable information will be included 
                  in academic publications without explicit consent.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">17. Consent</h2>
                <p>
                  By using EyeSOS, you consent to the collection, use, and disclosure of your information 
                  as described in this Privacy Policy. If you do not agree with this policy, please do not 
                  use the Platform.
                </p>
              </section>
            </div>

            <div className="pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                This Privacy Policy is designed to comply with the Data Privacy Act of 2012 (Republic Act No. 10173) 
                of the Philippines and other applicable data protection regulations.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
