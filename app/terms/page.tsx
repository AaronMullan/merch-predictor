import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold">Terms of Service</h1>

        <div className="prose dark:prose-invert">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

          <h2 className="mt-8 mb-4 text-2xl font-semibold">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using Merch Predictor ("the Service"), you agree to be bound by these
            Terms of Service. If you do not agree to these terms, please do not use the Service.
          </p>

          <h2 className="mt-8 mb-4 text-2xl font-semibold">2. Description of Service</h2>
          <p className="mb-4">
            Merch Predictor is a web-based application that helps users predict merchandise sales
            and manage inventory for touring events. The Service provides sales forecasting and
            inventory management tools.
          </p>

          <h2 className="mt-8 mb-4 text-2xl font-semibold">3. User Responsibilities</h2>
          <p className="mb-4">As a user of the Service, you agree to:</p>
          <ul className="mb-6 list-disc space-y-2 pl-6">
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account</li>
            <li>Use the Service in compliance with all applicable laws</li>
            <li>Not attempt to reverse engineer or interfere with the Service</li>
          </ul>

          <h2 className="mt-8 mb-4 text-2xl font-semibold">4. Intellectual Property</h2>
          <p className="mb-4">
            The Service and its original content, features, and functionality are owned by Merch
            Predictor and are protected by international copyright, trademark, and other
            intellectual property laws.
          </p>

          <h2 className="mt-8 mb-4 text-2xl font-semibold">5. Disclaimer of Warranties</h2>
          <p className="mb-4">
            The Service is provided "as is" without any warranties, expressed or implied. We do not
            guarantee that the predictions or recommendations will be accurate or suitable for your
            specific needs.
          </p>

          <h2 className="mt-8 mb-4 text-2xl font-semibold">6. Limitation of Liability</h2>
          <p className="mb-4">
            In no event shall Merch Predictor be liable for any indirect, incidental, special,
            consequential, or punitive damages arising out of or relating to your use of the
            Service.
          </p>

          <h2 className="mt-8 mb-4 text-2xl font-semibold">7. Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right to modify these terms at any time. We will notify users of any
            material changes by posting the new terms on this page.
          </p>

          <h2 className="mt-8 mb-4 text-2xl font-semibold">8. Contact Information</h2>
          <p className="mb-4">
            If you have any questions about these Terms of Service, please contact us at:
            <br />
            <a href="mailto:legal@merchpredictor.com" className="text-primary hover:underline">
              legal@merchpredictor.com
            </a>
          </p>

          <div className="mt-8 border-t pt-6">
            <Link href="/" className="text-primary inline-flex items-center hover:underline">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
