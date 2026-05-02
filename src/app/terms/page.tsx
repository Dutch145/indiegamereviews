import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for IndieScout — the rules and guidelines for using our platform.",
}

export default function TermsPage() {
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
        <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#fff", letterSpacing: "-1px", marginTop: "16px", marginBottom: "8px" }}>Terms of Service</h1>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.25)" }}>Last updated: May 2, 2026</p>
      </div>

      <div style={{ background: "rgba(167,139,250,0.05)", border: "1px solid rgba(167,139,250,0.15)", borderRadius: "12px", padding: "16px 20px", marginBottom: "36px" }}>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
          These Terms of Service (&quot;Terms&quot;) govern your use of IndieScout, operated at <a href="https://indiescout.xyz" style={{ color: "#a78bfa", textDecoration: "none" }}>indiescout.xyz</a>. By accessing or using IndieScout, you agree to be bound by these Terms. If you do not agree, please do not use the site.
        </p>
      </div>

      {section("1. About IndieScout", <>
        <p>IndieScout is an indie game review platform where users can read editor reviews, submit community reviews, and suggest games for coverage. The service is provided free of charge.</p>
      </>)}

      {section("2. Eligibility", <>
        <p style={{ marginBottom: "8px" }}>You must be at least 13 years of age to use IndieScout. By creating an account, you represent and warrant that:</p>
        <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <li>You are at least 13 years old</li>
          <li>You have the legal capacity to enter into these Terms</li>
          <li>You will comply with these Terms at all times</li>
          <li>The information you provide is accurate and complete</li>
        </ul>
      </>)}

      {section("3. User Accounts", <>
        <p style={{ marginBottom: "8px" }}>When you create an account on IndieScout, you are responsible for:</p>
        <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <li>Maintaining the confidentiality of your password</li>
          <li>All activity that occurs under your account</li>
          <li>Notifying us immediately of any unauthorised use of your account</li>
        </ul>
        <p style={{ marginTop: "12px" }}>You may not create accounts for others without their permission, impersonate any person, or use a username that is offensive, misleading, or violates any third-party rights.</p>
      </>)}

      {section("4. User-Generated Content", <>
        <p style={{ marginBottom: "8px" }}>By submitting reviews, scores, game suggestions, or any other content to IndieScout, you grant us a non-exclusive, royalty-free, worldwide licence to display, reproduce, and distribute that content on the platform.</p>
        <p style={{ marginBottom: "8px" }}>You are solely responsible for content you submit. You agree not to post content that:</p>
        <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <li>Is false, misleading, or deceptive</li>
          <li>Is defamatory, abusive, hateful, or harassing</li>
          <li>Contains personal information about other individuals without their consent</li>
          <li>Infringes on any third-party intellectual property rights</li>
          <li>Promotes illegal activities</li>
          <li>Contains spam, advertising, or unsolicited commercial content</li>
          <li>Contains malware, viruses, or harmful code</li>
        </ul>
        <p style={{ marginTop: "12px" }}>We reserve the right to remove any content that violates these Terms or that we deem inappropriate, without notice.</p>
      </>)}

      {section("5. Game Reviews and Opinions", <>
        <p style={{ marginBottom: "8px" }}>Reviews and scores on IndieScout represent the opinions of individual editors and community members. They do not constitute professional advice.</p>
        <p>Editor reviews are produced by IndieScout staff and are clearly labelled as such. Community reviews are submitted by registered users. IndieScout does not guarantee the accuracy, completeness, or reliability of any review or score.</p>
      </>)}

      {section("6. Intellectual Property", <>
        <p style={{ marginBottom: "8px" }}>The IndieScout name, logo, website design, and original editorial content are owned by IndieScout and are protected by intellectual property laws. You may not reproduce, distribute, or create derivative works from our content without express written permission.</p>
        <p>Game titles, artwork, screenshots, and related intellectual property belong to their respective developers and publishers. IndieScout uses such material for review and commentary purposes under fair use principles.</p>
      </>)}

      {section("7. Prohibited Uses", <>
        <p style={{ marginBottom: "8px" }}>You agree not to use IndieScout to:</p>
        <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <li>Scrape, crawl, or systematically extract data from the site without permission</li>
          <li>Attempt to gain unauthorised access to any part of the site or its systems</li>
          <li>Interfere with or disrupt the operation of the site</li>
          <li>Use the site for any unlawful purpose</li>
          <li>Create multiple accounts to manipulate review scores or game request votes</li>
          <li>Harass, threaten, or intimidate other users</li>
        </ul>
      </>)}

      {section("8. Disclaimers", <>
        <p style={{ marginBottom: "8px" }}>IndieScout is provided &quot;as is&quot; and &quot;as available&quot; without any warranties of any kind, either express or implied. We do not warrant that:</p>
        <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <li>The site will be uninterrupted, error-free, or secure</li>
          <li>Any information on the site is accurate, complete, or current</li>
          <li>The site will meet your specific requirements</li>
        </ul>
      </>)}

      {section("9. Limitation of Liability", <>
        <p>To the fullest extent permitted by law, IndieScout and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the site, including but not limited to loss of data, loss of profits, or loss of goodwill, even if we have been advised of the possibility of such damages.</p>
      </>)}

      {section("10. Third-Party Links", <>
        <p>IndieScout may contain links to third-party websites, including game stores and developer pages. These links are provided for convenience only. We have no control over and assume no responsibility for the content, privacy policies, or practices of third-party sites.</p>
      </>)}

      {section("11. Account Termination", <>
        <p style={{ marginBottom: "8px" }}>We reserve the right to suspend or terminate your account at any time, with or without notice, if we believe you have violated these Terms or if we deem it necessary to protect the platform or its users.</p>
        <p>You may delete your account at any time by contacting us. Upon deletion, your reviews will be removed from public display.</p>
      </>)}

      {section("12. Changes to These Terms", <>
        <p>We may update these Terms from time to time. We will notify you of significant changes by updating the date at the top of this page. Your continued use of IndieScout after any changes constitutes your acceptance of the updated Terms.</p>
      </>)}

      {section("13. Governing Law", <>
        <p>These Terms shall be governed by and construed in accordance with applicable law. Any disputes arising from these Terms or your use of IndieScout shall be subject to the exclusive jurisdiction of the relevant courts.</p>
      </>)}

      {section("14. Contact Us", <>
        <p>If you have any questions about these Terms, please contact us at:</p>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "16px 20px", marginTop: "12px" }}>
          <p style={{ fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "4px" }}>IndieScout</p>
          <p>Website: <a href="https://indiescout.xyz" style={{ color: "#a78bfa", textDecoration: "none" }}>indiescout.xyz</a></p>
        </div>
      </>)}

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "24px", display: "flex", gap: "20px" }}>
        <Link href="/privacy" style={{ fontSize: "13px", fontWeight: 600, color: "rgba(167,139,250,0.6)", textDecoration: "none" }}>Privacy Policy</Link>
        <Link href="/" style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>Back to home</Link>
      </div>
    </div>
  )
}
