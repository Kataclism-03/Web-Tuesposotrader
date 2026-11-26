<script lang="ts">
  import { onMount } from 'svelte';
  import ToolShell from '../../components/ToolShell.svelte';

  let nowMs = $state(Date.now());
  let visitorTz = $state('America/Caracas');

  onMount(() => {
    try {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (detected) visitorTz = detected;
    } catch {
      visitorTz = 'America/Caracas';
    }
    const timer = setInterval(() => {
      nowMs = Date.now();
    }, 1000);
    return () => clearInterval(timer);
  });

  function formatClock(ms: number, timeZone: string): string {
    try {
      return new Intl.DateTimeFormat('es-ES', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(new Date(ms));
    } catch {
      return '--:--:--';
    }
  }

  function formatUtcWindowInVisitorTz(
    startUtcHour: number,
    startUtcMin: number,
    endUtcHour: number,
    endUtcMin: number,
    tz: string
  ): string {
    const base = new Date(nowMs);
    const d1 = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate(), startUtcHour, startUtcMin));
    const d2 = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate(), endUtcHour, endUtcMin));
    const fmt = new Intl.DateTimeFormat('es-ES', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    return `${fmt.format(d1)} – ${fmt.format(d2)}`;
  }

  let utcDate = $derived(new Date(nowMs));
  let utcDay = $derived(utcDate.getUTCDay()); // 0 Dom .. 6 Sab
  let utcMinutesOfDay = $derived(utcDate.getUTCHours() * 60 + utcDate.getUTCMinutes());

  // Forex Spot cierra desde Viernes 22:00 UTC hasta Domingo 22:00 UTC
  let isSpotWeekendClosed = $derived(
    utcDay === 6 ||
    (utcDay === 5 && utcMinutesOfDay >= 22 * 60) ||
    (utcDay === 0 && utcMinutesOfDay < 22 * 60)
  );

  function inUtcRange(mins: number, startMin: number, endMin: number): boolean {
    if (startMin < endMin) return mins >= startMin && mins < endMin;
    return mins >= startMin || mins < endMin;
  }

  let sessions = $derived([
    {
      id: 'london',
      name: 'Sesión de Londres (Europa)',
      assets: 'EUR/USD, GBP/USD, EUR/GBP, Oro',
      localWindow: formatUtcWindowInVisitorTz(7, 0, 16, 0, visitorTz),
      vetWindow: '03:00 – 12:00 VET',
      isOpen: !isSpotWeekendClosed && inUtcRange(utcMinutesOfDay, 7 * 60, 16 * 60),
      tag: 'Alta Liquidez'
    },
    {
      id: 'ny',
      name: 'Sesión de Nueva York (EE. UU.)',
      assets: 'USD, Índices US500/US100, XAU/USD, Acciones',
      localWindow: formatUtcWindowInVisitorTz(12, 0, 21, 0, visitorTz),
      vetWindow: '08:00 – 17:00 VET',
      isOpen: !isSpotWeekendClosed && inUtcRange(utcMinutesOfDay, 12 * 60, 21 * 60),
      tag: 'Tendencias Claras'
    },
    {
      id: 'overlap',
      name: 'Solapamiento Londres + Nueva York',
      assets: 'Pares mayores Forex y Oro (máximo volumen diario)',
      localWindow: formatUtcWindowInVisitorTz(12, 0, 16, 0, visitorTz),
      vetWindow: '08:00 – 12:00 VET',
      isOpen: !isSpotWeekendClosed && inUtcRange(utcMinutesOfDay, 12 * 60, 16 * 60),
      tag: 'Franja Principal'
    },
    {
      id: 'tokyo',
      name: 'Sesión de Tokio (Asia)',
      assets: 'USD/JPY, AUD/JPY, EUR/JPY',
      localWindow: formatUtcWindowInVisitorTz(0, 0, 9, 0, visitorTz),
      vetWindow: '20:00 – 05:00 VET',
      isOpen: !isSpotWeekendClosed && inUtcRange(utcMinutesOfDay, 0, 9 * 60),
      tag: 'Volatilidad Moderada'
    },
    {
      id: 'otc_diurno',
      name: 'Ventana Diurna OTC (Cripto, Índices y Materias Primas)',
      assets: 'Activos -OTC en Exnova e IQ Option (opera los 7 días)',
      localWindow: formatUtcWindowInVisitorTz(12, 0, 20, 45, visitorTz),
      vetWindow: '08:00 – 16:45 VET',
      isOpen: inUtcRange(utcMinutesOfDay, 12 * 60, 20 * 60 + 45),
      tag: '7 Días / Mayor Fluidez'
    },
    {
      id: 'otc_reset',
      name: 'Reinicio Diario de Cripto OTC (Pausa Recomendada)',
      assets: 'Cierres técnicos de 30 min en pares Cripto OTC',
      localWindow: formatUtcWindowInVisitorTz(20, 45, 21, 20, visitorTz),
      vetWindow: '16:45 – 17:20 VET',
      isOpen: inUtcRange(utcMinutesOfDay, 20 * 60 + 45, 21 * 60 + 20),
      isPauseWindow: true,
      tag: 'Evitar Entradas'
    }
  ]);

  const faqs = [
    {
      q: '¿Cuál es la mejor hora del día para operar desde Venezuela, Colombia o México?',
      a: 'Entre las 08:00 AM y las 12:00 PM (hora de Venezuela / UTC-4), cuando coinciden abiertas las bolsas de Londres y Nueva York con el mayor volumen institucional del día.'
    },
    {
      q: '¿Por qué conviene evitar Cripto e Índices OTC después de las 16:45 VET?',
      a: 'Porque a las 16:45 VET (20:45 UTC) ocurre el reinicio técnico diario de numerosos pares Cripto OTC y tras el cierre de Nueva York disminuye el rango medio por vela.'
    },
    {
      q: '¿Qué activos están disponibles los sábados y domingos?',
      a: 'Durante el fin de semana el mercado Forex Spot interbancario permanece cerrado y operan los mercados Cripto directos y los catálogos OTC de los brokers, recomendándose respetar igualmente el horario diurno.'
    }
  ];

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'Monitor de Horarios de Mercado Forex y OTC en Tiempo Real',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        url: 'https://tuesposotrader.com/horarios-mercado-forex-otc',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        description: 'Consulta en vivo qué sesiones bursátiles y ventanas OTC están abiertas en la zona horaria exacta de tu país.'
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a }
        }))
      }
    ]
  });
</script>

<svelte:head>
  <title>Horarios del Mercado Forex y OTC en Vivo (Tu Hora Local)</title>
  <meta
    name="description"
    content="Reloj en tiempo real de las sesiones de Londres, Nueva York, Tokio y ventanas óptimas OTC en Exnova e IQ Option convertidas automáticamente a la hora de tu país."
  />
  <link rel="canonical" href="https://tuesposotrader.com/horarios-mercado-forex-otc" />
  <meta property="og:title" content="Horarios del Mercado Forex y OTC en Vivo" />
  <meta
    property="og:description"
    content="Verifica al instante qué mercados están abiertos ahora mismo y evita las horas de baja liquidez o reinicio de servidor."
  />
  <meta property="og:url" content="https://tuesposotrader.com/horarios-mercado-forex-otc" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="https://tuesposotrader.com/assets/photos/og-image.png" />
  {@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

<ToolShell
  currentPath="/horarios-mercado-forex-otc"
  badge="Semáforo de Liquidez en Vivo"
  title="Horarios del Mercado Forex y OTC en Tiempo Real"
  subtitle="Convertimos automáticamente las sesiones de Londres, Nueva York, Tokio y los cortes técnicos OTC a la zona horaria de tu dispositivo para que operes solo cuando hay fluidez real."
  {faqs}
>
  <!-- Relojes Superiores -->
  <section class="clocks-bar" aria-label="Relojes mundiales en vivo">
    <div class="clock-card clock-card--local">
      <span>Tu Hora Local ({visitorTz})</span>
      <strong>{formatClock(nowMs, visitorTz)}</strong>
    </div>
    <div class="clock-card">
      <span>Venezuela (VET · UTC-4)</span>
      <strong>{formatClock(nowMs, 'America/Caracas')}</strong>
    </div>
    <div class="clock-card">
      <span>Nueva York (Wall Street)</span>
      <strong>{formatClock(nowMs, 'America/New_York')}</strong>
    </div>
    <div class="clock-card">
      <span>Londres (Reino Unido)</span>
      <strong>{formatClock(nowMs, 'Europe/London')}</strong>
    </div>
  </section>

  {#if isSpotWeekendClosed}
    <div class="weekend-banner">
      <strong>Fin de semana bursátil activo:</strong> El mercado Forex Spot tradicional está cerrado hasta el domingo a las 18:00 VET. Solo operan activos Cripto y catálogos OTC.
    </div>
  {/if}

  <!-- Tarjetas de Sesiones -->
  <section class="sessions-list" aria-label="Estado actual de cada sesión">
    {#each sessions as s}
      <article class="session-row" class:is-open={s.isOpen && !s.isPauseWindow} class:is-pause={s.isOpen && s.isPauseWindow}>
        <div class="session-row__main">
          <div class="session-row__title-line">
            {#if s.isPauseWindow}
              <span class="status-pill" class:status-pill--warn={s.isOpen} class:status-pill--idle={!s.isOpen}>
                {s.isOpen ? '⚠️ EN REINICIO AHORA' : 'Fuera de reinicio'}
              </span>
            {:else}
              <span class="status-pill" class:status-pill--open={s.isOpen} class:status-pill--closed={!s.isOpen}>
                {s.isOpen ? '🟢 ABIERTA AHORA' : '🔴 CERRADA'}
              </span>
            {/if}
            <span class="session-tag">{s.tag}</span>
          </div>
          <h2>{s.name}</h2>
          <p>{s.assets}</p>
        </div>

        <div class="session-row__times">
          <div>
            <span>En tu país</span>
            <strong>{s.localWindow}</strong>
          </div>
          <div>
            <span>Hora Venezuela</span>
            <strong>{s.vetWindow}</strong>
          </div>
        </div>
      </article>
    {/each}
  </section>

  <p class="hours-guide-note">
    ¿Quieres profundizar cómo adaptar tu estrategia a cada sesión? Lee nuestra guía sobre <a href="/blog/horarios-del-mercado-forex-cuando-operar-para-maxima-rentabilidad">cuándo operar según cada horario de mercado</a>.
  </p>
</ToolShell>

<style>
  .clocks-bar {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.85rem;
    margin-bottom: 1.5rem;
  }

  .clock-card {
    background: var(--clr-surface);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .clock-card--local {
    border-color: rgba(255, 215, 0, 0.38);
    background: rgba(255, 215, 0, 0.06);
  }

  .clock-card span {
    font-size: 0.76rem;
    color: var(--clr-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .clock-card strong {
    font-size: 1.45rem;
    font-variant-numeric: tabular-nums;
    color: #fff;
  }

  .clock-card--local strong {
    color: var(--clr-accent);
  }

  .weekend-banner {
    background: rgba(93, 95, 239, 0.12);
    border: 1px solid rgba(93, 95, 239, 0.35);
    border-radius: 12px;
    padding: 0.9rem 1.15rem;
    font-size: 0.9rem;
    color: #dfe2ff;
    margin-bottom: 1.5rem;
  }

  .sessions-list {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }

  .session-row {
    background: var(--clr-surface);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 14px;
    padding: 1.25rem 1.4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
  }

  .session-row.is-open {
    border-color: rgba(46, 204, 113, 0.42);
    background: linear-gradient(90deg, rgba(46, 204, 113, 0.07) 0%, rgba(22, 26, 34, 1) 55%);
  }

  .session-row.is-pause {
    border-color: rgba(255, 165, 0, 0.5);
    background: linear-gradient(90deg, rgba(255, 165, 0, 0.1) 0%, rgba(22, 26, 34, 1) 55%);
  }

  .session-row__main {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .session-row__title-line {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex-wrap: wrap;
  }

  .status-pill {
    font-size: 0.74rem;
    font-weight: 700;
    padding: 0.22rem 0.6rem;
    border-radius: 6px;
    letter-spacing: 0.03em;
  }

  .status-pill--open {
    background: rgba(46, 204, 113, 0.16);
    color: #8cf0b5;
  }

  .status-pill--closed,
  .status-pill--idle {
    background: rgba(255, 255, 255, 0.06);
    color: var(--clr-muted);
  }

  .status-pill--warn {
    background: rgba(255, 165, 0, 0.2);
    color: #ffd080;
  }

  .session-tag {
    font-size: 0.76rem;
    color: var(--clr-accent);
    font-weight: 600;
  }

  .session-row h2 {
    font-size: 1.12rem;
  }

  .session-row p {
    font-size: 0.88rem;
  }

  .session-row__times {
    display: flex;
    gap: 1.5rem;
    flex-shrink: 0;
    text-align: right;
  }

  .session-row__times span {
    display: block;
    font-size: 0.75rem;
    color: var(--clr-muted);
  }

  .session-row__times strong {
    font-size: 0.98rem;
    font-variant-numeric: tabular-nums;
    color: #fff;
  }

  .hours-guide-note {
    margin-top: 1.5rem;
    font-size: 0.9rem;
  }

  .hours-guide-note a {
    color: var(--clr-accent);
    text-decoration: underline;
  }

  @media (max-width: 860px) {
    .clocks-bar {
      grid-template-columns: 1fr 1fr;
    }

    .session-row {
      flex-direction: column;
      align-items: flex-start;
    }

    .session-row__times {
      width: 100%;
      justify-content: space-between;
      text-align: left;
      padding-top: 0.75rem;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }
  }
</style>
