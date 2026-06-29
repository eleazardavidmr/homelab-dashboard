export default function SideBar() {
  return (
    <aside class="hidden lg:flex flex-col h-[calc(100vh-57px)] w-64 bg-surface-container-low border-r border-outline-variant p-md gap-sm sticky top-[57px]">
      <div class="flex items-center gap-sm mb-md px-xs">
        <div class="w-8 h-8 bg-accent-blue flex items-center justify-center text-black font-bold">
          M
        </div>
        <div>
          <div class="font-label-mono text-xs text-primary leading-none">
            MINEROZ
          </div>
          <div class="font-label-mono text-[10px] text-on-surface-variant leading-none mt-1">
            V-NODE-01
          </div>
        </div>
      </div>
      <nav class="flex flex-col gap-xs flex-grow">
        <a
          class="flex items-center gap-sm p-sm bg-surface-bright text-secondary border-l-4 border-secondary font-label-mono transition-all duration-75"
          href="#"
        >
          <span
            class="material-symbols-outlined text-[18px]"
            data-icon="dashboard"
          >
            dashboard
          </span>
          <span>Overview</span>
        </a>
        <a
          class="flex items-center gap-sm p-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high font-label-mono transition-all duration-75"
          href="#"
        >
          <span
            class="material-symbols-outlined text-[18px]"
            data-icon="developer_board"
          >
            developer_board
          </span>
          <span>Containers</span>
        </a>
        <a
          class="flex items-center gap-sm p-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high font-label-mono transition-all duration-75"
          href="#"
        >
          <span
            class="material-symbols-outlined text-[18px]"
            data-icon="storage"
          >
            storage
          </span>
          <span>Storage</span>
        </a>
        <a
          class="flex items-center gap-sm p-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high font-label-mono transition-all duration-75"
          href="#"
        >
          <span class="material-symbols-outlined text-[18px]" data-icon="lan">
            lan
          </span>
          <span>Network</span>
        </a>
        <a
          class="flex items-center gap-sm p-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high font-label-mono transition-all duration-75"
          href="#"
        >
          <span
            class="material-symbols-outlined text-[18px]"
            data-icon="settings"
          >
            settings
          </span>
          <span>Settings</span>
        </a>
      </nav>
      <button class="w-full py-sm border border-error text-error font-label-mono text-xs hover:bg-error/10 transition-colors mb-md">
        REBOOT NODE
      </button>
      <div class="mt-auto flex flex-col gap-xs border-t border-outline-variant pt-md">
        <a
          class="flex items-center gap-sm text-on-surface-variant font-label-mono text-xs hover:text-on-surface"
          href="#"
        >
          <span
            class="material-symbols-outlined text-sm"
            data-icon="description"
          >
            description
          </span>{" "}
          Documentation
        </a>
        <a
          class="flex items-center gap-sm text-on-surface-variant font-label-mono text-xs hover:text-on-surface"
          href="#"
        >
          <span class="material-symbols-outlined text-sm" data-icon="help">
            help
          </span>{" "}
          Support
        </a>
      </div>
    </aside>
  );
}
