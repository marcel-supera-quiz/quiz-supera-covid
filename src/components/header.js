import logoImg from '../assets/logo.png';

export default function headerComponent() {
  const header = document.createElement('header');
  header.className = 'absolute top-0 w-full z-10 px-6 py-4 lg:px-12';
  header.innerHTML = `
    <div class="max-w-7xl mx-auto flex justify-between items-center">
      <div class="flex items-center gap-3">
        <img src="${logoImg}" alt="Logo Supera Vitality" class="h-10 md:h-12 w-auto object-contain">
      </div>
      <div class="hidden sm:flex text-secondary-light/80 text-sm font-medium gap-2 items-center">
        <span class="material-symbols-outlined text-lg">verified_user</span>
        Ambiente Seguro
      </div>
    </div>
  `;
  return header;
}