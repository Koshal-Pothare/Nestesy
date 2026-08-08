import ContactHero from "../components/ContactHero";
import ContactSection from "../components/ContactSection";
import ContactMap from "../components/ContactMap";
import ContactSupport from "../components/ContactSupport";

const Contact = () => {
  return (
    <main className="bg-[#F8F6F2] overflow-x-hidden">

      {/* Hero */}
      <ContactHero />

      {/* Contact Form + Info */}
<section className="relative z-20 -mt-2 lg:-mt-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ContactSection />
        </div>
      </section>

      {/* Map */}
      <section className="px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto">
          <ContactMap />
        </div>
      </section>

      {/* Support */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <ContactSupport />
        </div>
      </section>

    </main>
  );
};

export default Contact;