import React from "react";
import "../styles/TermsPrivacy.css";

function TermsOfService() {
  return (
    <div className="tos-container">
      <h1 className="tos-title">Terms of Service</h1>
      <p className="tos-text">
        By accessing or using AppliSense, you agree to be bound by these Terms
        of Service. If you do not agree to these terms, you may not use our
        platform.
      </p>
      <h2 className="tos-subtitle">Account Registration</h2>
      <p className="tos-text">
        Users must provide accurate and complete information when creating an
        account. Your account is personal to you and cannot be shared or
        transferred. You are responsible for maintaining the confidentiality of
        your account credentials and are fully responsible for all activities
        that occur under your account.
      </p>
      <h2 className="tos-subtitle">Prohibited Activities</h2>
      <p className="tos-text">
        Unauthorized access, data scraping, reverse engineering, or attempting
        to disrupt the service in any manner is strictly prohibited. Users must
        not engage in fraudulent activities, distribute malware, or attempt to
        bypass security features. Any violation may result in immediate
        termination of your account and potential legal action.
      </p>
      <h2 className="tos-subtitle">Service Modifications</h2>
      <p className="tos-text">
        We reserve the right to modify or discontinue any part of the service at
        any time without prior notice. We are not liable for any loss or
        inconvenience caused by such modifications.
      </p>
      <h2 className="tos-subtitle">User Data and Content</h2>
      <p className="tos-text">
        Users retain ownership of any content they upload but grant AppliSense a
        non-exclusive license to use, store, and process this data as required
        to provide the service.
      </p>
      <h2 className="tos-subtitle">Limitation of Liability</h2>
      <p className="tos-text">
        AppliSense is not liable for any loss, damage, or legal claims resulting
        from the use of the service. Users agree to use the platform at their
        own risk.
      </p>
    </div>
  );
}

export default TermsOfService;
