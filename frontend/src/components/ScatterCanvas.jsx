import { useEffect, useRef, useState } from "react";

export default function ScatterCanvas({ results }) {
  const canvasRef = useRef(null);

  const [queryPos, setQueryPos] = useState(null);
  const [allDocs, setAllDocs] = useState([]);
  const [docPositions, setDocPositions] = useState({});

  /* =========================
     FETCH DOCS
  ========================= */
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/vector/all");
        const data = await res.json();
        setAllDocs(data.docs || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDocs();
  }, []);

  /* =========================
     GENERATE RANDOM POSITIONS
  ========================= */
  useEffect(() => {
    if (!allDocs.length) return;

    const canvas = canvasRef.current;
    const positions = {};

    allDocs.forEach(doc => {
      positions[doc._id] = {
        x: 50 + Math.random() * (canvas.width - 100),
        y: 50 + Math.random() * (canvas.height - 100)
      };
    });

    setDocPositions(positions);
  }, [allDocs]);

  /* =========================
     DRAW
  ========================= */
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };

    const getRandomPosition = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height
    });

    const drawStar = (cx, cy) => {
      let spikes = 5;
      let outer = 10;
      let inner = 5;

      let rot = Math.PI / 2 * 3;
      let step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outer);

      for (let i = 0; i < spikes; i++) {
        ctx.lineTo(cx + Math.cos(rot) * outer, cy + Math.sin(rot) * outer);
        rot += step;
        ctx.lineTo(cx + Math.cos(rot) * inner, cy + Math.sin(rot) * inner);
        rot += step;
      }

      ctx.closePath();
      ctx.fillStyle = "#fff";
      ctx.shadowColor = "#fff";
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const draw = () => {
      ctx.fillStyle = "#07070f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (!queryPos) return;

      // 🟢 draw all docs
      allDocs.forEach(doc => {
        const pos = docPositions[doc._id];
        if (!pos) return;

        const isMatched = results?.some(r => r.id === doc._id);

        // glow
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = isMatched ? "#69f0ae33" : "#8882";
        ctx.fill();

        // dot
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = isMatched ? "#69f0ae" : "#555";
        ctx.fill();
      });

      // ⭐ query position
      let qx = queryPos.x;
      let qy = queryPos.y;

      if (results && results.length > 0) {
        const best = results[0];
        const pos = docPositions[best.id];

        if (pos) {
          qx = pos.x;
          qy = pos.y;
        }
      }

      drawStar(qx, qy);
    };

    resize();

    if (!queryPos) {
      setQueryPos(getRandomPosition());
      return;
    }

    draw();

    window.addEventListener("resize", () => {
      resize();
      draw();
    });

    return () => window.removeEventListener("resize", resize);

  }, [results, queryPos, allDocs, docPositions]);

  return (
    <div className="canvas">
      <canvas ref={canvasRef} />
    </div>
  );
}