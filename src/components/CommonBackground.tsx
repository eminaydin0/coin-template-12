import React from "react";

const CommonBackground: React.FC = () => {
  return (
    <>
      <style>
        {`
        @keyframes auroraDrift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes floatBlob {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.5; }
          50% { transform: translateY(-20px) scale(1.05); opacity: 0.7; }
        }

        .bg-root {
          position: fixed;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          overflow: hidden;
          background: radial-gradient(circle at 30% 30%, #0a0a0a 0%, #000000 100%);
        }

        /* Aurora gradient layer (deep space glow) */
        .aurora {
          position: absolute;
          inset: -60%;
          background: linear-gradient(
            120deg,
            rgba(255, 153, 51, 0.08),
            rgba(230, 100, 0, 0.12),
            rgba(255, 255, 255, 0.04)
          );
          background-size: 200% 200%;
          animation: auroraDrift 60s ease-in-out infinite;
          filter: blur(120px);
          mix-blend-mode: screen;
        }

        /* Blobs for motion depth */
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          animation: floatBlob 20s ease-in-out infinite;
        }

        .blob.orange {
          top: 30%;
          left: 10%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(255, 111, 0, 0.25), transparent 70%);
        }

        .blob.purple {
          bottom: 15%;
          right: 20%;
          width: 260px;
          height: 260px;
          background: radial-gradient(circle, rgba(155, 135, 245, 0.2), transparent 70%);
          animation-delay: 5s;
        }

        .blob.blue {
          top: 60%;
          left: 40%;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(0, 204, 255, 0.12), transparent 70%);
          animation-delay: 10s;
        }

        /* Subtle dot grid texture */
        .texture {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 60px 60px;
          opacity: 0.08;
          mix-blend-mode: overlay;
        }

        /* Soft vignette for cinematic focus */
        .vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 50%, transparent 60%, rgba(0,0,0,0.9));
        }

        /* Optional grain for realism */
        .grain {
          position: absolute;
          inset: 0;
          background-image: url('https://www.transparenttextures.com/patterns/noise.png');
          opacity: 0.04;
          mix-blend-mode: overlay;
        }
        `}
      </style>

      <div className="bg-root">
        <div className="aurora" />
        <div className="blob orange" />
        <div className="blob purple" />
        <div className="blob blue" />
        <div className="texture" />
        <div className="grain" />
        <div className="vignette" />
      </div>
    </>
  );
};

export default CommonBackground;
