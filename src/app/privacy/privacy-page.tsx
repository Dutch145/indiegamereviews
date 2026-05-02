import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for IndieScout — how we collect, use, and protect your data.",
}

export default function PrivacyPage() {
  const section = (title: string, children: React.ReactNode) => (
    <div style={{ marginBottom: "36px" }}>
      <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#fff", marginBottom: "12px", letterSpacing: "-0.3px" }}>{title}</h2>
      <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.8 }}>{children}</div>
    </div>
  )

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", paddingTop: "48px", paddingBottom: "64px" }}>
      <div style={{ marginBottom: "40px" }}>
        <Link href="/" style={{ fontSize: "13px", fontWeight: 600, color: "rgba(167,139,250,0.6)", textDecoration: "none" }}>← Back to IndieScout</Link>
        <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#fff", letterSpacing: "-1px", marginTop: "16px", marginBottom: "8px" }}>Privacy Policy</h1>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.25)" }}>Last updated: May 2, 2026</p>
      </div>

      <div style={{ background: "rgba(167,139,250,0.05)", border: "1px solid rgba(167,139,250,0.15)", borderRadius: "12px", padding: "16px 20px", marginBottom: "36px" }}>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
          This Privacy Policy explains how IndieScout (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, and protects information about you when you use our website at <a href="https://indiescout.xyz" style={{ color: "#a78bfa", textDecoration: "none" }}>indiescout.xyz</a>. By using IndieScout, you agree to the practices described in this policy.
        </p>
      </div>

      {section("1. Information We Collect", <>
        <p style={{ marginBottom: "12px" }}>We collect the following types of information:</p>
        <p style={{ marginBottom: "8px" }}><strong style={{ color: "rgba(255,255,255,0.7)" }}>Account information:</strong> When you create an account, we collect your email address and username. This information is required to provide you with an account and is stored securely.</p>
        <p style={{ marginBottom: "8px" }}><strong style={{ color: "rgba(255,255,255,0.7)" }}>User-generated content:</strong> Reviews, scores, pros and cons, and game suggestions you submit are stored and displayed publicly on the site.</p>
        <p style={{ marginBottom: "8px" }}><strong style={{ color: "rgba(255,255,255,0.7)" }}>Usage data:</strong> We may collect standard web server logs including IP addresses, browser type, pages visited, and timestamps. This data is used to maintain and improve the site.</p>
        <p><strong style={{ color: "rgba(255,255,255,0.7)" }}>Cookies:</strong> We use cookies and similar technologies to maintain your login session. We do not use third-party advertising cookies.</p>
      </>)}

      {section("2. How We Use Your Information", <>
        <p style={{ marginBottom: "8px" }}>We use the information we collect to:</p>
        <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <li>Provide and operate the IndieScout website and services</li>
          <li>Maintain and authenticate your account</li>
          <li>Display your reviews and community contributions</li>
          <li>Send transactional emails such as account confirmation and password resets</li>
          <li>Respond to your requests or questions</li>
          <li>Monitor and improve site performance and security</li>
          <li>Comply with legal obligations</li>
        </ul>
        <p style={{ marginTop: "12px" }}>We do not sell, rent, or trade your personal information to third parties. We do not use your information for advertising purposes.</p>
      </>)}

      {section("3. Email Communications", <>
        <p style={{ marginBottom: "8px" }}>We send transactional emails only, including:</p>
        <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <li>Account confirmation emails when you sign up</li>
          <li>Password reset emails when requested</li>
          <li>Account-related security notifications</li>
        </ul>
        <p style={{ marginTop: "12px" }}>We use Amazon Web Services Simple Email Service (AWS SES) to send emails. We do not send marketing or promotional emails without your explicit consent.</p>
      </>)}

      {section("4. Data Storage and Security", <>
        <p style={{ marginBottom: "8px" }}>Your data is stored securely using Supabase, a cloud database provider. We take reasonable technical and organisational measures to protect your personal information from unauthorised access, loss, or misuse.</p>
        <p>However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.</p>
      </>)}

      {section("5. Third-Party Services", <>
        <p style={{ marginBottom: "8px" }}>IndieScout uses the following third-party services to operate:</p>
        <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <li><strong style={{ color: "rgba(255,255,255,0.7)" }}>Supabase</strong> — database, authentication, and user management</li>
          <li><strong style={{ color: "rgba(255,255,255,0.7)" }}>Vercel</strong> — website hosting and deployment</li>
          <li><strong style={{ color: "rgba(255,255,255,0.7)" }}>Amazon Web Services (AWS SES)</strong> — transactional email delivery</li>
        </ul>
        <p style={{ marginTop: "12px" }}>Each of these providers has their own privacy policies and data handling practices. We encourage you to review their policies for more information.</p>
      </>)}

      {section("6. User Content and Public Information", <>
        <p style={{ marginBottom: "8px" }}>Reviews, scores, and game suggestions you submit are publicly visible to all visitors of IndieScout. Your username is displayed alongside your reviews. Please do not include personal information in your reviews or usernames that you would not want to be publicly visible.</p>
        <p>You may delete your reviews at any time from your profile page.</p>
      </>)}

      {section("7. Data Retention", <>
        <p style={{ marginBottom: "8px" }}>We retain your account information for as long as your account is active. If you wish to delete your account and associated data, please contact us at the email address below.</p>
        <p>Deleted reviews are removed from public display immediately. Server logs may be retained for up to 90 days for security purposes.</p>
      </>)}

      {section("8. Children's Privacy", <>
        <p>IndieScout is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe a child under 13 has provided us with personal information, please contact us and we will delete it promptly.</p>
      </>)}

      {section("9. Your Rights", <>
        <p style={{ marginBottom: "8px" }}>Depending on your location, you may have the following rights regarding your personal data:</p>
        <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <li>The right to access the personal data we hold about you</li>
          <li>The right to request correction of inaccurate data</li>
          <li>The right to request deletion of your data</li>
          <li>The right to object to or restrict processing of your data</li>
          <li>The right to data portability</li>
        </ul>
        <p style={{ marginTop: "12px" }}>To exercise any of these rights, please contact us at the email address below.</p>
      </>)}

      {section("10. Changes to This Policy", <>
        <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by updating the date at the top of this page. Your continued use of IndieScout after any changes constitutes your acceptance of the updated policy.</p>
      </>)}

      {section("11. Contact Us", <>
        <p>If you have any questions about this Privacy Policy or how we handle your data, please contact us at:</p>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "16px 20px", marginTop: "12px" }}>
          <p style={{ fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "4px" }}>IndieScout</p>
          <p>Website: <a href="https://indiescout.xyz" style={{ color: "#a78bfa", textDecoration: "none" }}>indiescout.xyz</a></p>
        </div>
      </>)}

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "24px", display: "flex", gap: "20px" }}>
        <Link href="/terms" style={{ fontSize: "13px", fontWeight: 600, color: "rgba(167,139,250,0.6)", textDecoration: "none" }}>Terms of Service</Link>
        <Link href="/" style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>Back to home</Link>
      </div>
    </div>
  )
}
