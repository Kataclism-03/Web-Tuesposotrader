/**
 * Configuración centralizada de enlaces de conversión y herramientas interactivas.
 * Para medir exactamente cuántos miembros entran a Telegram desde cada sección sin cookies:
 * crea enlaces de invitación separados en Telegram (Admin -> Enlaces de invitación)
 * y reemplaza cada URL aquí.
 */
export const TELEGRAM_LINKS = {
	home: 'https://t.me/+gsWkXwzphmUzZmYx',
	blogTop: 'https://t.me/+gsWkXwzphmUzZmYx',
	blogBottom: 'https://t.me/+gsWkXwzphmUzZmYx',
	blogSticky: 'https://t.me/+gsWkXwzphmUzZmYx',
	tools: 'https://t.me/+gsWkXwzphmUzZmYx'
};

export const INTERACTIVE_TOOLS = [
	{
		href: '/calculadora-retiro-exnova-binance',
		badge: 'Calculadora P2P & Redes',
		title: 'Calculadora de Retiro a Binance',
		shortTitle: 'Retiro a Binance',
		description: 'Calcula comisiones exactas TRC-20 vs ERC-20 y cuánto recibes neto en tu moneda local por P2P.'
	},
	{
		href: '/calculadora-interes-compuesto',
		badge: 'Gestión de Riesgo',
		title: 'Calculadora de Interés Compuesto',
		shortTitle: 'Interés Compuesto',
		description: 'Proyecta sesiones paso a paso con porcentaje controlado y tope diario sin usar martingala.'
	},
	{
		href: '/horarios-mercado-forex-otc',
		badge: 'Reloj en Tiempo Real',
		title: 'Horarios de Mercado en Vivo',
		shortTitle: 'Horarios en Vivo',
		description: 'Verifica al instante si Londres, Nueva York o la ventana óptima OTC están abiertas en tu país.'
	}
];

/**
 * Registra el clic saliente hacia Telegram con su ubicación exacta para auditoría de conversión.
 * @param {string} placement - Identificador del botón (ej. 'blog_top', 'tool_retiro', 'home_hero')
 */
export function trackTelegramClick(placement) {
	if (typeof window === 'undefined') return;
	try {
		const key = 'tet_cta_clicks_v1';
		const raw = localStorage.getItem(key);
		/** @type {Record<string, number>} */
		const counts = raw ? JSON.parse(raw) : {};
		counts[placement] = (counts[placement] || 0) + 1;
		localStorage.setItem(key, JSON.stringify(counts));
	} catch {
		// Modo incógnito o almacenamiento restringido: ignorar silenciosamente
	}
}
