import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  const navigate = useNavigate();
  const effectiveDate = 'February 20, 2026';

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '16px', position: 'sticky', top: 0, zIndex: 10,
        background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-subtle)',
      }}>
        <button onClick={() => navigate(-1)} style={{ color: 'var(--text-primary)' }}>
          <ArrowLeft size={22} />
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 700 }}>Terms of Service</h1>
      </div>

      <div style={{
        padding: '20px 16px 100px', maxWidth: 640, margin: '0 auto',
        fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)',
      }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 20 }}>
          Effective Date: {effectiveDate}
        </p>

        <Section title="1. Acceptance of Terms">
          <p>
            By downloading, accessing, or using the ONLYMAN application ("App"), you agree to be bound by these 
            Terms of Service ("Terms"). If you do not agree to all of these Terms, do not use the App. We reserve 
            the right to modify these Terms at any time. Continued use of the App after changes constitutes acceptance 
            of the revised Terms.
          </p>
        </Section>

        <Section title="2. Eligibility">
          <p>
            You must be at least 18 years of age to create an account and use the App. By using the App, you represent 
            and warrant that you are at least 18 years old and have the legal capacity to enter into these Terms. 
            ONLYMAN is designed exclusively for men seeking to connect with other men.
          </p>
        </Section>

        <Section title="3. Account Registration">
          <p>
            To use certain features of the App, you must create an account. You agree to:
          </p>
          <ul>
            <li>Provide accurate, current, and complete information during registration.</li>
            <li>Maintain and update your information to keep it accurate.</li>
            <li>Keep your login credentials confidential and not share them with anyone.</li>
            <li>Be responsible for all activity under your account.</li>
            <li>Notify us immediately of any unauthorized access to your account.</li>
          </ul>
          <p>
            We reserve the right to suspend or terminate accounts that contain false or misleading information.
          </p>
        </Section>

        <Section title="4. User Conduct">
          <p>You agree not to:</p>
          <ul>
            <li>Use the App for any illegal, harmful, or fraudulent purposes.</li>
            <li>Harass, bully, intimidate, stalk, or threaten other users.</li>
            <li>Post content that is defamatory, obscene, hateful, discriminatory, or promotes violence.</li>
            <li>Impersonate another person or create fake profiles.</li>
            <li>Solicit money or commercial services from other users.</li>
            <li>Use the App for commercial purposes, advertising, or spam without our consent.</li>
            <li>Upload viruses, malware, or other harmful code.</li>
            <li>Attempt to access another user's account without authorization.</li>
            <li>Use automated scripts, bots, or scraping tools on the App.</li>
            <li>Share content depicting minors in any context.</li>
          </ul>
          <p>
            Violations may result in immediate account suspension or termination at our sole discretion.
          </p>
        </Section>

        <Section title="5. User Content">
          <p>
            You retain ownership of the content you post ("User Content"), including photos, text, and profile 
            information. By posting content on the App, you grant ONLYMAN a non-exclusive, worldwide, royalty-free, 
            transferable license to use, display, reproduce, and distribute your User Content solely for the purpose 
            of operating and improving the App.
          </p>
          <p>
            You are solely responsible for your User Content. You represent and warrant that you have the right to 
            post such content, and that your content does not violate the rights of any third party, including 
            intellectual property, privacy, or publicity rights.
          </p>
          <p>
            We reserve the right to remove any content that violates these Terms or that we deem inappropriate, 
            without prior notice.
          </p>
        </Section>

        <Section title="6. Photo Albums & Sharing">
          <p>
            The App allows you to create photo albums and share them with specific users. You are responsible for 
            the content of your albums and for choosing who can access them. Shared album access can be revoked at 
            any time. Recipients of shared albums must not redistribute, screenshot, or record shared content without 
            explicit consent from the album owner.
          </p>
        </Section>

        <Section title="7. Geolocation Services">
          <p>
            The App uses geolocation data to show distance between users. By enabling location services, you consent 
            to the collection and use of your location data as described in our Privacy Policy. You may disable 
            location services at any time through your device settings, but some features may not function properly 
            without it. Your precise location is never shared with other users—only an approximate distance is displayed.
          </p>
        </Section>

        <Section title="8. Interactions Between Users">
          <p>
            ONLYMAN is a platform that facilitates connections between users. We are not responsible for the conduct 
            of any user, whether on or off the App. You agree to exercise caution and good judgment when interacting 
            with other users, especially when meeting in person.
          </p>
          <p>
            We strongly recommend:
          </p>
          <ul>
            <li>Meeting in public places for initial encounters.</li>
            <li>Informing a friend or family member of your plans.</li>
            <li>Never sharing financial information with other users.</li>
            <li>Reporting any suspicious, abusive, or threatening behavior.</li>
          </ul>
        </Section>

        <Section title="9. Blocking & Reporting">
          <p>
            You may block any user at any time. Blocked users will not be able to view your profile or send you 
            messages. You may also report users who violate these Terms. We review all reports and take appropriate 
            action, which may include warnings, content removal, or account termination. Reports are kept confidential.
          </p>
        </Section>

        <Section title="10. Intellectual Property">
          <p>
            The App, including its design, code, logos, trademarks, and all content created by ONLYMAN 
            (excluding User Content), is the property of ONLYMAN and is protected by intellectual property laws. 
            You may not copy, modify, distribute, sell, or reverse-engineer any part of the App without our 
            express written permission.
          </p>
        </Section>

        <Section title="11. Termination">
          <p>
            You may delete your account at any time through the App settings. We reserve the right to suspend or 
            terminate your account at any time, with or without cause, and with or without notice. Upon termination, 
            your right to use the App ceases immediately. Data retention after termination is governed by our 
            Privacy Policy.
          </p>
        </Section>

        <Section title="12. Disclaimers">
          <p>
            THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR 
            IMPLIED. WE DO NOT WARRANT THAT THE APP WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE. WE MAKE NO 
            REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF ANY CONTENT ON THE APP, INCLUDING USER PROFILES.
          </p>
          <p>
            WE DO NOT CONDUCT CRIMINAL BACKGROUND CHECKS ON USERS. YOU ARE SOLELY RESPONSIBLE FOR YOUR SAFETY 
            WHEN INTERACTING WITH OTHER USERS.
          </p>
        </Section>

        <Section title="13. Limitation of Liability">
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, ONLYMAN SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
            SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE APP. 
            OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU HAVE PAID US IN THE 12 MONTHS PRECEDING THE CLAIM. 
            SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES, SO SOME OF THESE 
            LIMITATIONS MAY NOT APPLY TO YOU.
          </p>
        </Section>

        <Section title="14. Indemnification">
          <p>
            You agree to indemnify and hold harmless ONLYMAN, its affiliates, officers, directors, employees, and 
            agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising out 
            of or related to your use of the App, your User Content, or your violation of these Terms.
          </p>
        </Section>

        <Section title="15. Governing Law & Disputes">
          <p>
            These Terms are governed by and construed in accordance with applicable laws. Any dispute arising from 
            these Terms or your use of the App shall first be attempted to be resolved through good-faith 
            negotiation. If a resolution cannot be reached, the dispute shall be submitted to binding arbitration 
            in accordance with the rules of the applicable arbitration body in your jurisdiction.
          </p>
        </Section>

        <Section title="16. Changes to the Terms">
          <p>
            We may revise these Terms at any time. If we make material changes, we will notify you through the 
            App or via email. Your continued use of the App after such notification constitutes acceptance of the 
            updated Terms. We encourage you to review these Terms periodically.
          </p>
        </Section>

        <Section title="17. Contact Us">
          <p>
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <p style={{ color: 'var(--accent)', fontWeight: 600 }}>
            support@onlyman.app
          </p>
        </Section>

        <div style={{
          marginTop: 32, padding: 16, borderRadius: 'var(--radius-md)',
          background: 'var(--bg-elevated)', textAlign: 'center',
          fontSize: 12, color: 'var(--text-muted)',
        }}>
          © 2026 ONLYMAN. All rights reserved.
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{
        fontSize: 16, fontWeight: 700, color: 'var(--text-primary)',
        marginBottom: 10, paddingBottom: 6,
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        {title}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {children}
      </div>
      <style>{`
        ul { padding-left: 20px; margin: 6px 0; }
        li { margin-bottom: 4px; }
      `}</style>
    </div>
  );
}
