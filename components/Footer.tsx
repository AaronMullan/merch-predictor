import Link from 'next/link';
import { Container } from './Container';

export function Footer() {
  return (
    <footer className="border-t">
      <Container className="py-6">
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <div className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Merch Predictor. All rights reserved.
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
