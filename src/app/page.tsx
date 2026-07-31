import Image from "next/image";

const messengerUrl = "https://m.me/arsenia.balinario";

const trustItems = [
  {
    label: "Personal guidance",
    text: "Speak directly with Arsenia—not a faceless booking form.",
  },
  {
    label: "Local and international flights",
    text: "Ask about domestic routes, family visits, or overseas travel.",
  },
  {
    label: "One simple Messenger thread",
    text: "Keep your questions, options, and next steps in one place.",
  },
];

const airlines = [
  { name: "Philippine Airlines", logoClass: "airline-logo-pal" },
  { name: "Cebu Pacific", logoClass: "airline-logo-cebu" },
  { name: "AirAsia", logoClass: "airline-logo-airasia" },
  { name: "Singapore Airlines", logoClass: "airline-logo-singapore" },
  { name: "Emirates", logoClass: "airline-logo-emirates" },
  { name: "Qatar Airways", logoClass: "airline-logo-qatar" },
];

const processSteps = [
  {
    number: "01",
    title: "Share your trip",
    text: "Send your route, travel dates, and number of passengers.",
  },
  {
    number: "02",
    title: "Review flight options",
    text: "Arsenia will share available choices and explain the next step.",
  },
  {
    number: "03",
    title: "Continue with Arsenia",
    text: "Ask questions and keep the conversation moving in Messenger.",
  },
];

function MessengerIcon({ className = "h-5 w-5" }: Readonly<{ className?: string }>) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 3.25c-5.22 0-9.25 3.82-9.25 8.96 0 2.69 1.1 5 2.9 6.58v2.81l2.65-1.46c1.11.32 2.35.49 3.7.49 5.22 0 9.25-3.82 9.25-8.96S17.22 3.25 12 3.25Z"
        fill="currentColor"
        opacity=".2"
      />
      <path
        d="m6.75 14.7 3.15-3.31 2.24 2.38 5.1-5.42-3.1 5.69-2.3-2.39-5.09 3.05Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PlaneIcon({ className = "h-5 w-5" }: Readonly<{ className?: string }>) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="m3.5 13.25 7.4-2.05 3.57-7.04c.22-.43.67-.7 1.15-.7h.3c.52 0 .9.5.76 1l-1.72 6.01 4.73-1.31c.78-.22 1.59.13 1.98.84.45.84.11 1.88-.75 2.28l-5.15 2.41.9 4.94c.09.5-.3.96-.8.96h-.35c-.42 0-.81-.2-1.05-.55l-2.97-4.31-4.35 2.03-1.53 1.89c-.23.28-.57.44-.93.44h-.17c-.43 0-.74-.42-.61-.83l.9-2.82-2.02-1.8c-.47-.42-.04-1.18.58-1.01Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MessengerLink({
  children,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <a
      className={`inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-messenger px-6 py-3.5 text-base font-semibold text-white shadow-[0_1px_2px_rgba(10,32,52,.12),0_10px_28px_rgba(27,116,228,.2)] transition-[background-color,box-shadow,transform] duration-150 hover:-translate-y-px hover:bg-messenger-hover hover:shadow-[0_1px_2px_rgba(10,32,52,.12),0_14px_32px_rgba(27,116,228,.24)] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-messenger focus-visible:ring-offset-4 ${className}`}
      href={messengerUrl}
      rel="noopener noreferrer"
      target="_blank"
    >
      <MessengerIcon />
      {children}
    </a>
  );
}

function BrandLockup() {
  return (
    <a
      aria-label="Message Arsenia at SkyBound Travel Hub on Messenger"
      className="group flex min-w-0 items-center gap-3 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-messenger focus-visible:ring-offset-4"
      href={messengerUrl}
      rel="noopener noreferrer"
      target="_blank"
    >
      <span className="truncate text-xs font-semibold tracking-[-0.01em] sm:text-sm">
        SkyBound Travel Hub
      </span>
      <span aria-hidden="true" className="h-5 w-px shrink-0 bg-line" />
      <span className="shrink-0 text-xs font-semibold sm:text-sm">Arsenia</span>
      <span className="hidden text-sm text-muted md:inline">Travel Consultant</span>
    </a>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/90 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-10">
        <BrandLockup />
        <a
          className="hidden min-h-11 items-center gap-2 text-sm font-semibold text-messenger underline-offset-4 transition-colors hover:text-messenger-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-messenger focus-visible:ring-offset-4 sm:inline-flex"
          href={messengerUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          <MessengerIcon className="h-4.5 w-4.5" />
          Message on Messenger
        </a>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="bg-paper" data-section="hero">
      <div className="mx-auto grid max-w-[1200px] items-center gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.08fr_.92fr] lg:gap-20 lg:px-10 lg:py-28 xl:gap-24">
        <div className="max-w-[42rem]">
          <p className="hero-reveal hero-reveal-1 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Personal flight assistance
          </p>
          <h1 className="hero-reveal hero-reveal-2 mt-6 text-balance text-[clamp(3rem,6vw,4.8rem)] font-semibold leading-[0.99] tracking-[-0.055em] text-ink">
            A simpler, more personal way to book your next flight.
          </h1>
          <p className="hero-reveal hero-reveal-3 mt-7 max-w-[36rem] text-pretty text-lg leading-8 text-muted sm:text-xl sm:leading-9">
            Chat directly with Arsenia for local and international flight
            options, fare questions, and clear booking guidance—all in
            Messenger.
          </p>
          <div className="hero-reveal hero-reveal-4 mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <MessengerLink>Chat with Arsenia on Messenger</MessengerLink>
            <p className="max-w-[14rem] text-sm leading-6 text-muted">
              No forms. No signup. Start with a simple message.
            </p>
          </div>
        </div>

        <figure className="portrait-reveal w-full max-w-[29rem] justify-self-center lg:justify-self-end">
          <div className="portrait-frame relative overflow-hidden rounded-[1.25rem] border border-line bg-mist p-3 shadow-[0_22px_60px_rgba(10,32,52,.1)] sm:p-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[.9rem] bg-[#d8d3ca]">
              <Image
                alt="Arsenia, travel consultant for SkyBound Travel Hub"
                className="object-cover object-[50%_30%]"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 460px"
                src="/arsenia-portrait-editorial.png"
              />
            </div>
          </div>
          <figcaption className="mt-4 flex items-start justify-between gap-5 border-t border-line pt-4">
            <span className="text-sm font-semibold text-ink">Arsenia</span>
            <span className="max-w-[16rem] text-right text-sm leading-6 text-muted">
              Personal flight assistance with SkyBound Travel Hub
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function TrustStrip() {
  return (
    <section className="border-y border-line bg-surface" data-section="trust">
      <div className="mx-auto grid max-w-[1200px] divide-y divide-line px-5 py-3 sm:px-8 md:grid-cols-3 md:divide-x md:divide-y-0 lg:px-10">
        {trustItems.map((item) => (
          <article
            className="py-7 md:px-7 md:py-8 first:md:pl-0 last:md:pr-0"
            key={item.label}
          >
            <h2 className="text-base font-semibold tracking-[-0.015em] text-ink">
              {item.label}
            </h2>
            <p className="mt-2 max-w-[20rem] text-sm leading-6 text-muted">
              {item.text}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function AirlineBand() {
  return (
    <section className="bg-surface" data-section="airlines">
      <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Airlines frequently requested
            </p>
            <h2 className="mt-4 max-w-[26rem] text-3xl font-semibold leading-tight tracking-[-0.035em] text-ink sm:text-4xl">
              Familiar airlines. One direct conversation.
            </h2>
          </div>
          <p className="max-w-[32rem] text-base leading-7 text-muted sm:text-lg sm:leading-8">
            Ask Arsenia about local and international options. Your choices
            will depend on the route, dates, and current airline schedule.
          </p>
        </div>

        <div className="logo-rail mt-11 border-y border-line bg-line">
          <ul className="grid grid-cols-2 gap-px md:grid-cols-3 xl:grid-cols-6">
            {airlines.map((airline) => (
              <li
                className="logo-cell group flex min-h-36 flex-col items-center justify-center gap-3 px-4 py-7 sm:px-6"
                data-airline-logo={airline.name}
                key={airline.name}
              >
                <span
                  aria-hidden="true"
                  className={`airline-logo-sprite ${airline.logoClass}`}
                />
                <span className="text-center font-mono text-[10px] font-semibold uppercase tracking-[0.11em] text-muted transition-colors duration-200 group-hover:text-ink">
                  {airline.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-4 text-xs leading-5 text-muted">
          Logos are shown for airline identification only.
        </p>
      </div>
    </section>
  );
}

function ProofSection() {
  return (
    <section className="bg-mist" data-section="proof">
      <div className="mx-auto grid max-w-[1200px] items-center gap-16 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1.08fr_.92fr] lg:gap-20 lg:px-10 lg:py-28 xl:gap-28">
        <figure className="trip-brief w-full max-w-[38rem]">
          <div className="flex items-start justify-between gap-6 border-b border-line pb-5">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                SkyBound Travel Hub
              </p>
              <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-ink">
                Example trip brief
              </h3>
            </div>
            <span className="rounded-full border border-line bg-white px-3 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-muted">
              Illustrative
            </span>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-5 py-9 sm:gap-8 sm:py-11">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                From
              </p>
              <p className="mt-2 text-4xl font-semibold tracking-[-0.05em] text-ink sm:text-5xl">
                CEB
              </p>
              <p className="mt-2 text-sm text-muted">Cebu</p>
            </div>
            <div className="trip-route" aria-hidden="true">
              <span />
              <PlaneIcon className="h-6 w-6" />
              <span />
            </div>
            <div className="text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                To
              </p>
              <p className="mt-2 text-4xl font-semibold tracking-[-0.05em] text-ink sm:text-5xl">
                SIN
              </p>
              <p className="mt-2 text-sm text-muted">Singapore</p>
            </div>
          </div>

          <dl className="grid gap-px border-y border-line bg-line sm:grid-cols-2">
            <div className="bg-white px-5 py-5 sm:px-6">
              <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                Travel window
              </dt>
              <dd className="mt-2 text-base font-semibold text-ink">
                Flexible dates in August
              </dd>
            </div>
            <div className="bg-white px-5 py-5 sm:px-6">
              <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                Travellers
              </dt>
              <dd className="mt-2 text-base font-semibold text-ink">
                2 adults
              </dd>
            </div>
          </dl>
          <figcaption className="mt-5 text-xs leading-5 text-muted">
            Example only—not a fare quote, booking confirmation, or availability promise.
          </figcaption>
        </figure>

        <div className="max-w-[38rem]">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            A clear first message
          </p>
          <h2 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-ink sm:text-5xl lg:text-[3.5rem]">
            Start with the essentials. We’ll take it from there.
          </h2>
          <div className="mt-7 space-y-5 text-lg leading-8 text-muted">
            <p>
              Send your route, preferred travel window, and passenger count.
              That is enough for Arsenia to begin the conversation.
            </p>
            <p>
              You can clarify schedules, baggage questions, and the next booking
              steps together in the same Messenger thread.
            </p>
          </div>
          <a
            className="text-link mt-8 inline-flex min-h-11 items-center gap-2 font-semibold text-messenger underline-offset-4 transition-colors hover:text-messenger-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-messenger focus-visible:ring-offset-4"
            href={messengerUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            Start a Messenger chat
            <span className="text-link-arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section className="bg-paper" data-section="process">
      <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
        <div className="max-w-[44rem]">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            What happens next
          </p>
          <h2 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-ink sm:text-5xl lg:text-[3.5rem]">
            Three clear steps. One conversation.
          </h2>
        </div>

        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8 lg:mt-16 lg:gap-12">
          {processSteps.map((step) => (
            <li className="border-t border-line pt-6" key={step.number}>
              <span className="font-mono text-sm font-semibold text-muted">
                {step.number}
              </span>
              <h3 className="mt-8 text-2xl font-semibold tracking-[-0.035em] text-ink">
                {step.title}
              </h3>
              <p className="mt-4 max-w-[20rem] text-base leading-7 text-muted sm:text-lg sm:leading-8">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ClosingSection() {
  return (
    <section className="bg-night text-white" data-section="closing">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1.1fr_.9fr] lg:items-end lg:gap-20 lg:px-10 lg:py-28">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Ready when you are
          </p>
          <h2 className="mt-5 max-w-[44rem] text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.045em] sm:text-5xl lg:text-[3.5rem]">
            Tell Arsenia where you’d like to go.
          </h2>
          <p className="mt-6 max-w-[37rem] text-lg leading-8 text-slate-300">
            Start with your route, dates, and passenger count. Arsenia can help
            you understand the available options from there.
          </p>
        </div>

        <div className="lg:justify-self-end">
          <blockquote className="max-w-[31rem] border-l border-slate-600 pl-5 text-lg leading-8 text-slate-200">
            “Hi Arsenia, can you check flights from Cebu to Singapore for two
            people in August?”
          </blockquote>
          <MessengerLink className="mt-8">
            Chat with Arsenia on Messenger
          </MessengerLink>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="bg-surface px-5 pb-10 pt-9 text-sm text-muted sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-7 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-semibold text-ink">SkyBound Travel Hub</p>
          <p className="mt-1">Arsenia · Travel Consultant</p>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <a
            className="inline-flex min-h-11 items-center font-semibold text-messenger underline-offset-4 hover:text-messenger-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-messenger focus-visible:ring-offset-4"
            href={messengerUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            m.me/arsenia.balinario
          </a>
          <p className="flex flex-wrap gap-x-2 sm:justify-end">
            <a
              className="inline-flex min-h-11 items-center underline-offset-4 hover:text-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-messenger focus-visible:ring-offset-4"
              href="tel:+639665891165"
            >
              09665891165
            </a>
            <span aria-hidden="true">·</span>
            <a
              className="inline-flex min-h-11 items-center underline-offset-4 hover:text-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-messenger focus-visible:ring-offset-4"
              href="tel:+639434106825"
            >
              09434106825
            </a>
          </p>
          <a
            className="inline-flex min-h-11 items-center underline-offset-4 hover:text-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-messenger focus-visible:ring-offset-4"
            href="mailto:amb.grab042364@gmail.com"
          >
            amb.grab042364@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <a
        className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:not-sr-only focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink focus:shadow-lg"
        href="#main-content"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main
        className="min-h-screen overflow-x-hidden"
        data-motion="subtle"
        id="main-content"
      >
        <HeroSection />
        <TrustStrip />
        <AirlineBand />
        <ProofSection />
        <ProcessSection />
        <ClosingSection />
      </main>
      <SiteFooter />
    </>
  );
}
