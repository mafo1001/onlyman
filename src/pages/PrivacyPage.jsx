import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
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
        <h1 style={{ fontSize: 18, fontWeight: 700 }}>Privacy Policy</h1>
      </div>

      <div style={{
        padding: '20px 16px 100px', maxWidth: 640, margin: '0 auto',
        fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)',
      }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 20 }}>
          Effective Date: {effectiveDate}
        </p>

        <div style={{
          padding: 16, borderRadius: 'var(--radius-md)',
          background: 'rgba(0,255,102,0.05)', border: '1px solid var(--border-accent)',
          marginBottom: 24, fontSize: 13,
        }}>
          Your privacy matters to us. This Privacy Policy explains how ONLYMAN collects, uses, shares, and 
          protects your personal information when you use our application. We are committed to transparency and 
          to giving you control over your data.
        </div>

        <Section title="1. Information We Collect">
          <h3 style={subheadingStyle}>1.1 Information You Provide</h3>
          <ul>
            <li><strong>Account Information:</strong> Name, email address, password, date of birth/age.</li>
            <li><strong>Profile Information:</strong> Photos, bio, tribe, body type, position, height, weight, interests, and "looking for" preferences.</li>
            <li><strong>Communications:</strong> Messages you send and receive through the App, including chat messages.</li>
            <li><strong>Photo Albums:</strong> Photos you upload to albums and the sharing permissions you set.</li>
            <li><strong>Reports & Feedback:</strong> Information you provide when reporting other users or contacting support.</li>
          </ul>

          <h3 style={subheadingStyle}>1.2 Information Collected Automatically</h3>
          <ul>
            <li><strong>Location Data:</strong> With your permission, we collect your device's geolocation to display distances to other users. We collect approximate location only and never share your precise coordinates.</li>
            <li><strong>Device Information:</strong> Device type, operating system version, app version, unique device identifiers, and crash logs.</li>
            <li><strong>Usage Data:</strong> How you interact with the App, including pages visited, features used, time spent, and interaction patterns.</li>
            <li><strong>Network Information:</strong> IP address, connection type (WiFi/cellular), and general network data.</li>
          </ul>

          <h3 style={subheadingStyle}>1.3 Information from Third Parties</h3>
          <p>
            If you sign in through a third-party service (e.g., Google), we may receive basic profile information 
            from that service in accordance with their privacy policies and your settings.
          </p>
        </Section>

        <Section title="2. How We Use Your Information">
          <p>We use your information to:</p>
          <ul>
            <li><strong>Provide the Service:</strong> Create and manage your account, display your profile to other users, facilitate messaging and matching.</li>
            <li><strong>Show Nearby Users:</strong> Use your location data to calculate and display distances between you and other users.</li>
            <li><strong>Personalize Your Experience:</strong> Recommend profiles and content based on your preferences and activity.</li>
            <li><strong>Ensure Safety:</strong> Detect, prevent, and address fraud, abuse, spam, and violations of our Terms of Service.</li>
            <li><strong>Improve the App:</strong> Analyze usage patterns to fix bugs, add features, and improve overall performance.</li>
            <li><strong>Communicate:</strong> Send push notifications (with your consent), service announcements, and responses to your inquiries.</li>
            <li><strong>Legal Compliance:</strong> Comply with applicable laws, regulations, and legal proceedings.</li>
          </ul>
        </Section>

        <Section title="3. How We Share Your Information">
          <p>We do not sell your personal information. We may share your data in the following circumstances:</p>
          <ul>
            <li><strong>With Other Users:</strong> Your profile information (name, age, photos, bio, distance, tribe, interests) is visible to other users based on your privacy settings. Your precise location is never shared—only approximate distance.</li>
            <li><strong>Photo Album Sharing:</strong> When you grant a user access to an album, they can view its contents. You can revoke access at any time.</li>
            <li><strong>Service Providers:</strong> We may share data with trusted third-party service providers who assist us in operating the App (e.g., hosting, analytics, push notifications). These providers are contractually required to protect your data.</li>
            <li><strong>Legal Requirements:</strong> We may disclose information if required by law, court order, or governmental authority, or in good faith to protect our rights, safety, or the safety of others.</li>
            <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your data may be transferred as part of the transaction. We will notify you before your data becomes subject to a different privacy policy.</li>
          </ul>
        </Section>

        <Section title="4. Data Storage & Security">
          <p>
            We implement industry-standard security measures to protect your personal information, including:
          </p>
          <ul>
            <li>Encryption of data in transit (TLS/SSL) and at rest.</li>
            <li>Secure password hashing — we never store passwords in plain text.</li>
            <li>Regular security audits and vulnerability assessments.</li>
            <li>Access controls limiting who can access your data within our organization.</li>
            <li>Secure cloud infrastructure with redundancy and backup systems.</li>
          </ul>
          <p>
            While we take reasonable measures to protect your data, no system is 100% secure. We cannot guarantee 
            absolute security and encourage you to use strong, unique passwords and exercise caution when sharing 
            personal information.
          </p>
        </Section>

        <Section title="5. Data Retention">
          <p>We retain your personal information for as long as:</p>
          <ul>
            <li>Your account is active.</li>
            <li>It is necessary to provide you with services.</li>
            <li>We are required by law or regulation to retain it.</li>
            <li>It is needed to resolve disputes, enforce agreements, or protect our legal interests.</li>
          </ul>
          <p>
            When you delete your account, we will delete or anonymize your personal data within 30 days, 
            except where retention is required by law. Some information may persist in encrypted backups for a 
            limited period.
          </p>
        </Section>

        <Section title="6. Your Rights & Choices">
          <p>Depending on your jurisdiction, you may have the following rights:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data.</li>
            <li><strong>Deletion:</strong> Request deletion of your personal data ("right to be forgotten").</li>
            <li><strong>Portability:</strong> Request your data in a structured, machine-readable format.</li>
            <li><strong>Objection:</strong> Object to the processing of your data for certain purposes.</li>
            <li><strong>Restriction:</strong> Request that we limit how we use your data.</li>
            <li><strong>Withdraw Consent:</strong> Where processing is based on consent, you can withdraw it at any time.</li>
          </ul>
          <p>
            To exercise these rights, contact us at the address below. We will respond within 30 days (or as required by law).
          </p>
        </Section>

        <Section title="7. Location Privacy">
          <p>
            Location data is a core feature of ONLYMAN, used to show which users are nearby. Here's how we handle it:
          </p>
          <ul>
            <li>We only access your location when the App is in use (no background tracking).</li>
            <li>Only an approximate distance (e.g., "2.3 km") is shown to other users — never your exact coordinates.</li>
            <li>You can disable location sharing in your device settings or in-app privacy settings at any time.</li>
            <li>You can choose to hide your distance from other users in the App's settings.</li>
          </ul>
        </Section>

        <Section title="8. Push Notifications">
          <p>
            With your consent, we may send push notifications for new messages, matches, events, and other updates. 
            You can manage notification preferences in the App settings or through your device's notification settings. 
            Disabling notifications will not affect the core functionality of the App.
          </p>
        </Section>

        <Section title="9. Cookies & Tracking">
          <p>
            The App may use local storage and similar technologies to remember your preferences, keep you signed in, 
            and improve your experience. We use:
          </p>
          <ul>
            <li><strong>Essential Storage:</strong> Required for the App to function (e.g., authentication tokens, user preferences).</li>
            <li><strong>Analytics:</strong> Anonymous usage data to understand how the App is used and to improve it.</li>
          </ul>
          <p>
            We do not use third-party advertising cookies or tracking pixels.
          </p>
        </Section>

        <Section title="10. Children's Privacy">
          <p>
            ONLYMAN is not intended for anyone under the age of 18. We do not knowingly collect personal information 
            from individuals under 18. If we learn that we have collected data from a minor, we will delete it 
            immediately. If you believe a minor is using the App, please contact us.
          </p>
        </Section>

        <Section title="11. International Data Transfers">
          <p>
            Your data may be processed in countries other than your own. When we transfer data internationally, 
            we ensure appropriate safeguards are in place, such as Standard Contractual Clauses or equivalent 
            mechanisms, to protect your information in accordance with this Privacy Policy and applicable data 
            protection laws.
          </p>
        </Section>

        <Section title="12. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. If we make material changes, we will notify you 
            through the App or via email before the changes take effect. The "Effective Date" at the top of this 
            page indicates when the policy was last updated. We encourage you to review it periodically.
          </p>
        </Section>

        <Section title="13. Contact Us">
          <p>
            If you have any questions, concerns, or requests regarding your privacy or this Privacy Policy, 
            please contact us:
          </p>
          <div style={{
            padding: 16, borderRadius: 'var(--radius-md)',
            background: 'var(--bg-elevated)', marginTop: 8,
          }}>
            <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: 4 }}>ONLYMAN Privacy Team</p>
            <p>Email: <span style={{ color: 'var(--accent)', fontWeight: 600 }}>privacy@onlyman.app</span></p>
            <p style={{ marginTop: 4 }}>General Support: <span style={{ color: 'var(--accent)', fontWeight: 600 }}>support@onlyman.app</span></p>
          </div>
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

const subheadingStyle = {
  fontSize: 14, fontWeight: 600, color: 'var(--text-primary)',
  marginTop: 12, marginBottom: 6,
};

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
        strong { color: var(--text-primary); }
      `}</style>
    </div>
  );
}
