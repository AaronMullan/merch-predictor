import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold">Privacy Policy</h1>

        <div className="prose dark:prose-invert">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

          <h2 className="mt-8 mb-4 text-2xl font-semibold">1. Introduction</h2>
          <p className="mb-4">
            Merch Predictor ("we," "our," or "us") is committed to protecting your privacy. This
            Privacy Policy explains how we collect, use, and safeguard your information when you use
            our application.
          </p>

          <h2 className="mt-8 mb-4 text-2xl font-semibold">2. Information We Collect</h2>
          <p className="mb-4">We collect the following types of information:</p>
          <ul className="mb-6 list-disc space-y-2 pl-6">
            <li>Sales data and inventory information you input into the application</li>
            <li>Venue capacity and tour date information</li>
            <li>Usage statistics and application performance data</li>
          </ul>

          <h2 className="mt-8 mb-4 text-2xl font-semibold">3. How We Use Your Information</h2>
          <p className="mb-4">We use the collected information to:</p>
          <ul className="mb-6 list-disc space-y-2 pl-6">
            <li>Provide and improve our merchandise prediction services</li>
            <li>Generate sales forecasts and inventory recommendations</li>
            <li>Enhance the user experience and application functionality</li>
          </ul>

          <h2 className="mt-8 mb-4 text-2xl font-semibold">4. Data Security</h2>
          <p className="mb-4">
            We implement appropriate security measures to protect your information. However, no
            method of transmission over the internet is 100% secure, and we cannot guarantee
            absolute security.
          </p>

          <h2 className="mt-8 mb-4 text-2xl font-semibold">5. Your Rights</h2>
          <p className="mb-4">You have the right to:</p>
          <ul className="mb-6 list-disc space-y-2 pl-6">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt-out of certain data collection</li>
          </ul>

          <h2 className="mt-8 mb-4 text-2xl font-semibold">6. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact us at:
            <br />
            <a href="mailto:privacy@merchpredictor.com" className="text-primary hover:underline">
              privacy@merchpredictor.com
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
