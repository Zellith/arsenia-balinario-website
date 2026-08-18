const deploymentUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined;

export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ??
    deploymentUrl ??
    "https://arsenia-balinario-website.vercel.app",
);

export const canonicalUrl = new URL("/", siteUrl).toString();
export const messengerUrl = "https://m.me/arsenia.balinario";
export const personImageUrl = new URL(
  "/arsenia-portrait-editorial.webp",
  siteUrl,
).toString();

const websiteId = `${canonicalUrl}#website`;
const webpageId = `${canonicalUrl}#webpage`;
const organizationId = `${canonicalUrl}#organization`;
const personId = `${canonicalUrl}#arsenia-balinario`;
const personImageId = `${canonicalUrl}#arsenia-portrait`;
const logoId = `${canonicalUrl}#logo`;

export const entityJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: canonicalUrl,
      name: "SkyBound Travel Hub",
      alternateName: "SkyBound Travel Hub with Arsenia",
      publisher: { "@id": organizationId },
    },
    {
      "@type": "WebPage",
      "@id": webpageId,
      url: canonicalUrl,
      name: "Arsenia Balinario | SkyBound Travel Hub Flight Assistance",
      description:
        "Contact Arsenia Balinario at SkyBound Travel Hub for personal help with local and international flight options.",
      isPartOf: { "@id": websiteId },
      mainEntity: { "@id": personId },
      about: [{ "@id": personId }, { "@id": organizationId }],
      primaryImageOfPage: { "@id": personImageId },
    },
    {
      "@type": "Person",
      "@id": personId,
      name: "Arsenia Balinario",
      url: canonicalUrl,
      image: { "@id": personImageId },
      jobTitle: "Travel Consultant",
      description:
        "Travel consultant at SkyBound Travel Hub providing personal guidance for local and international flight options.",
      sameAs: ["https://www.facebook.com/arsenia.balinario"],
      worksFor: { "@id": organizationId },
      knowsAbout: [
        "Local flight options",
        "International flight options",
        "Flight booking guidance",
      ],
    },
    {
      "@type": "TravelAgency",
      "@id": organizationId,
      name: "SkyBound Travel Hub",
      url: canonicalUrl,
      description:
        "Personal assistance with local and international flight options through Messenger.",
      logo: { "@id": logoId },
      image: { "@id": logoId },
      email: "amb.grab042364@gmail.com",
      telephone: ["+639665891165", "+639434106825"],
      areaServed: ["Philippines", "International"],
      employee: { "@id": personId },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "amb.grab042364@gmail.com",
        telephone: "+639665891165",
        url: messengerUrl,
        areaServed: ["PH", "International"],
      },
    },
    {
      "@type": "ImageObject",
      "@id": personImageId,
      url: personImageUrl,
      contentUrl: personImageUrl,
      width: 920,
      height: 1438,
      caption: "Arsenia Balinario, travel consultant at SkyBound Travel Hub",
    },
    {
      "@type": "ImageObject",
      "@id": logoId,
      url: new URL("/icon.png", siteUrl).toString(),
      contentUrl: new URL("/icon.png", siteUrl).toString(),
      width: 512,
      height: 512,
      caption: "SkyBound Travel Hub brand mark",
    },
  ],
};
