import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TitleMarquee from "@/components/TitleMarquee";
import WorkGrid from "@/components/WorkGrid";
import ContactSection from "@/components/ContactSection";
import { getPublishedWork } from "@/lib/work";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Work — Eterno Studio™",
};

const PAD = "clamp(20px, 6.25vw, 40px)";

export default async function WorkPage() {
  const work = await getPublishedWork();

  return (
    <div className="flex min-h-screen flex-col overflow-clip">
      {/* Nav */}
      <Navbar pad={PAD} />

      {/* Title marquee */}
      <div className="pt-[clamp(32px,3.4vw,65px)]">
        <TitleMarquee text="WORK" count={work.length} />
      </div>

      {/* Projects */}
      <main className="pt-[70px]" style={{ paddingInline: PAD }}>
        <WorkGrid items={work} />
      </main>

      {/* Work with us */}
      <ContactSection pad={PAD} />

      {/* Footer */}
      <Footer pad={PAD} />
    </div>
  );
}
