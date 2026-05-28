import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #07070d 0%, #0f1026 100%)",
          borderRadius: "50%",
          border: "2px solid #00d4ff",
          boxShadow: "0 0 8px rgba(0, 212, 255, 0.4)",
        }}
      >
        <span
          style={{
            color: "#00d4ff",
            fontSize: "14px",
            fontWeight: 900,
            fontFamily: "sans-serif",
            letterSpacing: "-0.5px",
            textShadow: "0 0 4px rgba(0, 212, 255, 0.3)",
          }}
        >
          TC
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
