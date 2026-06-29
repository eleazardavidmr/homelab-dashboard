import { useState, useEffect } from "react";
import { animate, motion, useMotionValue, useSpring } from "framer-motion";

function useCountUp(target, duration = 1.2, decimals = 0) {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 120, damping: 18 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    motionValue.set(0);
    const controls = animate(motionValue, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    });

    const unsubscribe = springValue.on("change", (latest) => {
      const value =
        decimals > 0 ? latest.toFixed(decimals) : Math.round(latest);
      setDisplay(value.toString());
    });

    return () => {
      unsubscribe();
      controls.stop();
    };
  }, [motionValue, springValue, target, duration, decimals]);

  return display;
}

function getTempColor(temp) {
  if (temp >= 80) return { text: "text-[#f26464]", bg: "bg-[#f26464]" };
  if (temp >= 60) return { text: "text-[#f5c842]", bg: "bg-[#f5c842]" };
  return { text: "text-[#3ecf8e]", bg: "bg-[#3ecf8e]" };
}

function getUsageColor(percent) {
  if (percent >= 80) return "bg-[#f26464]";
  if (percent >= 60) return "bg-[#f5c842]";
  return "bg-[#3ecf8e]";
}

function formatUptime(hours) {
  const totalMinutes = Math.round(hours * 60);
  const days = Math.floor(totalMinutes / 1440);
  const hrs = Math.floor((totalMinutes % 1440) / 60);
  const mins = totalMinutes % 60;
  return [days > 0 ? `${days}d` : null, hrs > 0 ? `${hrs}h` : null, `${mins}m`]
    .filter(Boolean)
    .join(" ");
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export default function HomePage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/homelab-stats.json")
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => setData(data))
      .catch((error) => setError(error.message));
  }, []);

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-error font-mono">
        Error cargando datos: {error}
      </div>
    );
  }

  const tempValue = useCountUp(data?.temperature_c ?? 0);
  const cpuValue = useCountUp(data?.cpu_percent ?? 0);
  const ramValue = useCountUp(data?.ram?.used_gb ?? 0);
  const ramPercentValue = useCountUp(data?.ram?.percent ?? 0);
  const diskValue = useCountUp(data?.disk?.used_gb ?? 0);
  const diskPercentValue = useCountUp(data?.disk?.percent ?? 0);
  const sentValue = useCountUp(data?.network?.bytes_sent_mb ?? 0);
  const recvValue = useCountUp(data?.network?.bytes_recv_mb ?? 0);

  if (!data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-on-surface-variant font-mono tracking-[0.08em]">
        Cargando estadísticas...
      </div>
    );
  }

  const tempColor = getTempColor(data.temperature_c);
  const cpuColor = getUsageColor(data.cpu_percent);
  const ramColor = getUsageColor(data.ram.percent);
  const diskColor = getUsageColor(data.disk.percent);

  return (
    <motion.div
      className="grid gap-1 border border-custom-border bg-custom-border grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="bg-surface-container p-6"
        variants={cardVariants}
        whileHover={{ y: -3, scale: 1.005 }}
      >
        <div className="text-[0.65rem] uppercase tracking-[0.14em] font-semibold text-on-surface-variant mb-3">
          Temperatura CPU
        </div>
        <div
          className={`font-mono text-[3.5rem] font-semibold leading-none transition-colors duration-500 ${tempColor.text}`}
        >
          {tempValue}
          <span className="text-[1.2rem] text-on-surface-variant ml-1">°C</span>
        </div>
        <div className="mt-4 h-1 rounded-full overflow-hidden bg-custom-border">
          <motion.div
            className={`${tempColor.bg} h-full rounded-full`}
            initial={{ width: 0 }}
            animate={{
              width: `${Math.min(Math.max(data.temperature_c, 0), 100)}%`,
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>
        <div className="mt-3 flex justify-between font-mono text-[0.62rem] text-on-surface-variant">
          <span>0°</span>
          <span>50°</span>
          <span>75°</span>
          <span>100°</span>
        </div>
      </motion.div>

      <motion.div
        className="bg-surface-container p-6"
        variants={cardVariants}
        whileHover={{ y: -3, scale: 1.005 }}
      >
        <div className="text-[0.65rem] uppercase tracking-[0.14em] font-semibold text-on-surface-variant mb-3">
          CPU
        </div>
        <div className="font-mono text-[2rem] font-semibold text-on-surface">
          {cpuValue}
          <span className="text-[0.85rem] text-on-surface-variant ml-1">%</span>
        </div>
        <div className="text-[0.72rem] text-on-surface-variant mt-1 mb-4">
          Uso actual
        </div>
        <div className="h-1 rounded-full overflow-hidden bg-custom-border">
          <motion.div
            className={`${cpuColor} h-full rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${data.cpu_percent}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      <motion.div
        className="bg-surface-container p-6"
        variants={cardVariants}
        whileHover={{ y: -3, scale: 1.005 }}
      >
        <div className="text-[0.65rem] uppercase tracking-[0.14em] font-semibold text-on-surface-variant mb-3">
          RAM
        </div>
        <div className="font-mono text-[2rem] font-semibold text-on-surface">
          {ramValue}
          <span className="text-[0.85rem] text-on-surface-variant ml-1">
            GB
          </span>
        </div>
        <div className="text-[0.72rem] text-on-surface-variant mt-1 mb-4">
          {ramPercentValue}% de {data.ram.total_gb} GB usados
        </div>
        <div className="h-1 rounded-full overflow-hidden bg-custom-border">
          <motion.div
            className={`${ramColor} h-full rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${data.ram.percent}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      <motion.div
        className="bg-surface-container p-6"
        variants={cardVariants}
        whileHover={{ y: -3, scale: 1.005 }}
      >
        <div className="text-[0.65rem] uppercase tracking-[0.14em] font-semibold text-on-surface-variant mb-3">
          Disco
        </div>
        <div className="font-mono text-[2rem] font-semibold text-on-surface">
          {diskValue}
          <span className="text-[0.85rem] text-on-surface-variant ml-1">
            GB
          </span>
        </div>
        <div className="text-[0.72rem] text-on-surface-variant mt-1 mb-4">
          {diskPercentValue}% de {data.disk.total_gb} GB usados
        </div>
        <div className="h-1 rounded-full overflow-hidden bg-custom-border">
          <motion.div
            className={`${diskColor} h-full rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${data.disk.percent}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      <motion.div
        className="bg-surface-container p-6"
        variants={cardVariants}
        whileHover={{ y: -3, scale: 1.005 }}
      >
        <div className="text-[0.65rem] uppercase tracking-[0.14em] font-semibold text-on-surface-variant mb-3">
          Uptime
        </div>
        <div className="font-mono text-[2rem] font-semibold text-[#3ecf8e]">
          {formatUptime(data.uptime_hours)}
        </div>
        <div className="text-[0.72rem] text-on-surface-variant mt-2">
          desde el último reinicio
        </div>
      </motion.div>

      <motion.div
        className="bg-surface-container p-6"
        variants={cardVariants}
        whileHover={{ y: -3, scale: 1.005 }}
      >
        <div className="text-[0.65rem] uppercase tracking-[0.14em] font-semibold text-on-surface-variant mb-3">
          Red
        </div>
        <div className="flex justify-between items-center py-2 border-b border-custom-border text-on-surface-variant">
          <span className="uppercase tracking-widest text-[0.65rem] font-semibold">
            ↑ Enviado
          </span>
          <span className="font-mono text-[1rem] font-semibold text-accent-blue">
            {sentValue} MB
          </span>
        </div>
        <div className="flex justify-between items-center py-2 text-on-surface-variant">
          <span className="uppercase tracking-widest text-[0.65rem] font-semibold">
            ↓ Recibido
          </span>
          <span className="font-mono text-[1rem] font-semibold text-[#3ecf8e]">
            {recvValue} MB
          </span>
        </div>
      </motion.div>

      <motion.div
        className="col-span-full bg-surface-container p-6"
        variants={cardVariants}
        whileHover={{ y: -3, scale: 1.005 }}
      >
        <div className="text-[0.65rem] uppercase tracking-[0.14em] font-semibold text-on-surface-variant mb-3">
          Servicios Docker
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(data.services).map(([name, status]) => (
            <div
              key={name}
              className={`flex items-center gap-2 px-3 py-2 border rounded text-[0.72rem] font-mono ${
                status === "running"
                  ? "border-[#1e3a2f] bg-[#0d1f18] text-[#3ecf8e]"
                  : "border-[#3a1e1e] bg-[#1f0d0d] text-[#f26464]"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current block" />
              {name}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
