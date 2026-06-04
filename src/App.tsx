import QRCodeGenerator from './components/QRCodeGenerator';

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans flex items-center justify-center p-4 lg:p-0">
      <div className="w-full max-w-[1024px] lg:h-[768px] bg-card border border-border shadow-2xl flex flex-col lg:flex-row overflow-hidden">
        <QRCodeGenerator />
      </div>
    </div>
  );
}
