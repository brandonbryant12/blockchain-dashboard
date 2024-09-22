import './globals.css';
import { NavBar } from './components/NavBar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Blockchain Nodes Dashboard</title>
      </head>
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
