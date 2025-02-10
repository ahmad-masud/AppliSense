import React from "react";
import "../styles/TermsPrivacy.css";

function PrivacyPolicy() {
  return (
    <div className="privacy-container">
      <h1 className="privacy-title">Privacy Policy</h1>
      <p className="privacy-text">
        AppliSense is committed to protecting your privacy. This policy explains
        how we collect, use, and safeguard your information.
      </p>
      <h2 className="privacy-subtitle">Information We Collect</h2>
      <p className="privacy-text">
        We collect personal data when you register, including your name, email,
        and job application details. Additionally, we may collect metadata such
        as IP addresses and device information for security purposes.
      </p>
      <h2 className="privacy-subtitle">How We Use Your Data</h2>
      <p className="privacy-text">
        Your data is used solely for the purpose of providing and improving our
        services. This includes managing your account, storing application data,
        and ensuring security.
      </p>
      <h2 className="privacy-subtitle">Data Security</h2>
      <p className="privacy-text">
        Your data is stored securely in our MongoDB database and is only
        accessible to authorized personnel. We implement encryption, secure
        authentication, and access control measures to prevent unauthorized
        access, alteration, or disclosure of your information.
      </p>
      <h2 className="privacy-subtitle">Third-Party Sharing</h2>
      <p className="privacy-text">
        AppliSense does not sell, rent, or share your data with third parties
        except as required by law or with your explicit consent.
      </p>
      <h2 className="privacy-subtitle">User Rights</h2>
      <p className="privacy-text">
        You have the right to request access to your data, request corrections,
        or request deletion of your account at any time by contacting our
        support team.
      </p>
      <h2 className="privacy-subtitle">Data Retention</h2>
      <p className="privacy-text">
        We retain your data as long as your account is active. If you choose to
        delete your account, your data will be permanently removed from our
        systems within 30 days.
      </p>
      <h2 className="privacy-subtitle">Security Limitations</h2>
      <p className="privacy-text">
        By using our service, you acknowledge that data transmission over the
        internet is not completely secure. While we strive to protect your
        information, we cannot guarantee absolute security.
      </p>
    </div>
  );
}

export default PrivacyPolicy;
