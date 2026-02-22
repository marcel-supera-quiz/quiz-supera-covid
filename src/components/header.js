export default function headerComponent() {
    const header = document.createElement('header');
    header.className = 'absolute top-0 w-full z-10 px-6 py-4 lg:px-12';
    header.innerHTML = `
    <div class="max-w-7xl mx-auto flex justify-between items-center">
      <div class="flex items-center gap-3">
        <div class="size-8 text-primary">
          <span class="material-symbols-outlined text-4xl">psychology</span>
        </div>
        <div class="flex flex-col">
          <span class="font-display font-bold text-xl leading-none tracking-tight text-secondary">Supera</span>
          <span class="font-body text-[10px] font-bold uppercase tracking-widest text-primary">Vitality</span>
        </div>
      </div>
      <div class="hidden sm:flex text-secondary-light/80 text-sm font-medium gap-2 items-center">
        <span class="material-symbols-outlined text-lg">verified_user</span>
        Ambiente Seguro
      </div>
    </div>
  `;
    return header;
}