import { BookingForm } from "@/components/booking/BookingForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section */}
      <header className="relative h-[400px] w-full overflow-hidden bg-gradient-to-br from-teal-900 to-teal-700">
        <div className="absolute inset-0 bg-black/20 z-10" />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-start">
          <div className="max-w-2xl animate-in slide-in-from-bottom-8 fade-in duration-700">
            <span className="inline-block py-1 px-3 rounded-full bg-white/20 text-white backdrop-blur-sm text-sm font-medium mb-4 border border-white/30">
              CareConnect Clinic
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 leading-tight">
              Your Health, <br/>Our Priority
            </h1>
            <p className="text-lg text-white/90 max-w-lg leading-relaxed">
              Experience world-class healthcare with our team of dedicated specialists. Book your appointment online in minutes.
            </p>
          </div>
        </div>
      </header>

      {/* Main Booking Section - Overlapping Hero */}
      <main className="container mx-auto px-4 -mt-24 relative z-30 pb-20">
        <BookingForm />
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { title: "Expert Specialists", desc: "Top-rated doctors across multiple disciplines." },
            { title: "Instant Booking", desc: "Real-time availability with no waiting on hold." },
            { title: "24/7 Support", desc: "Always here to help with your medical needs." }
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white border border-border shadow-sm">
              <h3 className="font-serif font-bold text-xl mb-2 text-primary">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
      
      <footer className="bg-white border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2024 CareConnect Clinic. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
