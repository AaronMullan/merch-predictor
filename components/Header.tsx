import Link from 'next/link';
import { Container } from './Container';

export function Header() {
  return (
    <header className="border-b">
      <Container className="py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">👕</span>
            <h1 className="text-xl font-bold">Merch Predictor</h1>
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/" className="hover:text-primary">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary">
                  About
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </Container>
    </header>
  );
}
