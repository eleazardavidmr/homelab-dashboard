import { ExternalLink } from "lucide-react";

const services = [
  {
    name: "Immich",
    description: "Gestión de fotos y videos del hogar",
    port: 2283,
    url: "https://immich.edmr.dev",
    dockerName: "immich_server",
    icon: "📷",
  },
  {
    name: "Nextcloud",
    description: "Almacenamiento y archivos en la nube",
    port: 8080,
    url: "https://nextcloud.edmr.dev",
    dockerName: "nextcloud-app-1",
    icon: "☁️",
  },
  {
    name: "n8n",
    description: "Automatización de flujos y workflows",
    port: 5678,
    url: "https://n8n.edmr.dev",
    dockerName: "n8n",
    icon: "⚡",
  },
  {
    name: "Portainer",
    description: "Gestión visual de contenedores Docker",
    port: 9000,
    url: "https://portainer.edmr.dev",
    dockerName: "portainer",
    icon: "🐳",
  },
];

function ServiceCard({ service, dockerServices }) {
  const status = dockerServices?.[service.dockerName] ?? "unknown";
  const isRunning = status === "running";

  return (
    <a
      href={service.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-surface-container border border-custom-border hover:border-accent-blue transition-colors duration-200 cursor-pointer"
    >
      {/* Top bar de estado */}
      <div
        className={`h-0.5 w-full ${isRunning ? "bg-secondary" : "bg-error"}`}
      />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{service.icon}</span>
            <div>
              <div className="font-headline-md text-on-surface group-hover:text-accent-blue transition-colors">
                {service.name}
              </div>
              <div className="font-mono text-data-sm text-on-surface-variant mt-0.5">
                :{service.port}
              </div>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-on-surface-variant group-hover:text-accent-blue transition-colors mt-1" />
        </div>

        {/* Descripción */}
        <p className="text-body-md text-on-surface-variant mb-4 leading-snug">
          {service.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-custom-border">
          {/* Status badge */}
          <div className="flex items-center gap-2">
            <span
              className={`w-1.5 h-1.5 rounded-full ${isRunning ? "bg-secondary indicator-pulse" : "bg-error"}`}
            />
            <span
              className={`font-mono text-data-sm font-medium ${isRunning ? "text-secondary" : "text-error"}`}
            >
              {isRunning ? "ONLINE" : "OFFLINE"}
            </span>
          </div>

          {/* URL */}
          <span className="font-mono text-data-sm text-on-surface-variant truncate max-w-35">
            {service.url.replace("https://", "")}
          </span>
        </div>
      </div>
    </a>
  );
}

export default function ServicesPage({ dockerServices }) {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="font-headline-lg text-on-surface">Servicios</h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          {
            Object.values(dockerServices ?? {}).filter((s) => s === "running")
              .length
          }{" "}
          de {services.length} servicios activos
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-custom-border">
        {services.map((service) => (
          <ServiceCard
            key={service.name}
            service={service}
            dockerServices={dockerServices}
          />
        ))}
      </div>
    </div>
  );
}
