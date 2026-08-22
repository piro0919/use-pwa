import { ImageResponse } from "next/og";

export const alt = "use-pwa";

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

const TITLE = "use-pwa";
const DESCRIPTION = "React hook for detecting and handling PWA installation.";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        padding: "0 80px",
        background: "#0b0b0f",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: 600,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 84,
            fontWeight: 700,
            letterSpacing: -1,
          }}
        >
          {TITLE}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 32,
            marginTop: 28,
            lineHeight: 1.4,
            color: "#a1a1aa",
          }}
        >
          {DESCRIPTION}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            marginTop: 48,
            color: "#71717a",
          }}
        >
          kkweb.io
        </div>
      </div>

      {/* 何をするパッケージなのかを右に置く。名前と説明だけだと、
          9件が同じ絵になってタイムラインで見分けが付かない */}
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flex: 1,
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "#15151c",
            border: "1px solid #26262f",
            borderRadius: 20,
            display: "flex",
            flexDirection: "column",
            padding: 28,
            width: 340,
          }}
        >
          <div style={{ alignItems: "center", display: "flex", gap: 16 }}>
            <div
              style={{
                background: "linear-gradient(135deg, #34d399 0%, #059669 100%)",
                borderRadius: 14,
                height: 64,
                width: 64,
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div
                style={{
                  background: "#3f3f46",
                  borderRadius: 4,
                  height: 12,
                  width: 150,
                }}
              />
              <div
                style={{
                  background: "#27272e",
                  borderRadius: 4,
                  height: 10,
                  width: 110,
                }}
              />
            </div>
          </div>
          <div
            style={{
              alignItems: "center",
              background: "#34d399",
              borderRadius: 12,
              color: "#04241a",
              display: "flex",
              fontSize: 24,
              fontWeight: 700,
              height: 56,
              justifyContent: "center",
              marginTop: 26,
            }}
          >
            Install
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
