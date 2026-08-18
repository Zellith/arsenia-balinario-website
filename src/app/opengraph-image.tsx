import { ImageResponse } from "next/og";

export const alt =
  "SkyBound Travel Hub with Arsenia — personal flight assistance on Messenger";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#fbfaf7",
        color: "#0b2238",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        padding: "72px 88px",
        width: "100%",
      }}
    >
      <div
        style={{
          borderLeft: "8px solid #8c6127",
          display: "flex",
          flexDirection: "column",
          maxWidth: "980px",
          paddingLeft: "48px",
        }}
      >
        <div
          style={{
            color: "#566677",
            fontSize: 30,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          SkyBound Travel Hub · Arsenia
        </div>
        <div
          style={{
            fontSize: 78,
            fontWeight: 500,
            letterSpacing: "-0.045em",
            lineHeight: 1.02,
            marginTop: "32px",
          }}
        >
          A simpler, more personal way to book your next flight.
        </div>
        <div
          style={{
            color: "#155fbd",
            fontSize: 34,
            fontWeight: 600,
            marginTop: "36px",
          }}
        >
          Start with one Messenger message.
        </div>
      </div>
    </div>,
    size,
  );
}
