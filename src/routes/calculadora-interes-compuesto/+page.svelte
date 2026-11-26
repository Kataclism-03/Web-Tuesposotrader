<script lang="ts">
  import ToolShell from '../../components/ToolShell.svelte';

  interface SessionRow {
    day: number;
    startDay: number;
    unitStake: number;
    sessionDelta: number;
    stopFloorUsd: number;
    endDay: number;
  }

  let initialCapital = $state(100);
  let stakePct = $state(3);
  let payoutPct = $state(86);
  let dailyNetUnits = $state(1.5);
  let dailyStopUnits = $state(2);
  let totalSessions = $state(20);

  let cleanCap = $derived(Math.max(10, Number(initialCapital) || 10));
  let cleanStakePct = $derived(Math.min(20, Math.max(0.5, Number(stakePct) || 1)));
  let cleanPayout = $derived(Math.min(98, Math.max(60, Number(payoutPct) || 85)));
  let cleanDailyUnits = $derived(Math.min(10, Math.max(0.25, Number(dailyNetUnits) || 1)));
  let cleanStopUnits = $derived(Math.min(10, Math.max(1, Number(dailyStopUnits) || 2)));
  let cleanSessions = $derived(Math.min(90, Math.max(5, Math.round(Number(totalSessions) || 20))));

  let firstOrderStake = $derived(Math.max(1, cleanCap * (cleanStakePct / 100)));
  let maxDailyRiskUsd = $derived(firstOrderStake * cleanStopUnits);
  let dailyGrowthRate = $derived((cleanStakePct / 100) * (cleanPayout / 100) * cleanDailyUnits);

  let schedule = $derived.by((): SessionRow[] => {
    const rows: SessionRow[] = [];
    let running = cleanCap;
    for (let day = 1; day <= cleanSessions; day++) {
      const startDay = running;
      const unitStake = Math.max(1, startDay * (cleanStakePct / 100));
      const sessionDelta = unitStake * (cleanPayout / 100) * cleanDailyUnits;
      const stopFloorUsd = unitStake * cleanStopUnits;
      running = startDay + sessionDelta;
      rows.push({
        day,
        startDay,
        unitStake,
        sessionDelta,
        stopFloorUsd,
        endDay: running
      });
    }
    return rows;
  });

  let finalCapital = $derived(schedule.length > 0 ? schedule[schedule.length - 1].endDay : cleanCap);
  let netGrowthPct = $derived(((finalCapital - cleanCap) / cleanCap) * 100);

  const faqs = [
    {
      q: '¿Qué porcentaje por operación recomiendan para no descapitalizarse?',
      a: 'Entre el 1% y el 5% del capital disponible por orden individual, acompañado siempre de un candado diario fijo de 2 unidades adversas para cerrar el gráfico a tiempo.'
    },
    {
      q: '¿Por qué esta calculadora no usa martingala (duplicar importe)?',
      a: 'Porque duplicar tras 4 o 5 velas seguidas compromete entre el 30% y el 60% de toda la cuenta en minutos. El interés compuesto por sesión escala el importe solo cuando la cuenta sube.'
    },
    {
      q: '¿Qué pasa si mi cuenta es pequeña (por ejemplo $20 USD) y el mínimo del broker es $1?',
      a: 'Con $20 USD, el importe mínimo de $1 equivale exactamente al 5% por orden. Con un candado diario de 2 órdenes ($2 de límite diario), proteges el 90% de la cuenta para el día siguiente.'
    }
  ];

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'Calculadora de Interés Compuesto y Gestión de Riesgo para Trading',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        url: 'https://tuesposotrader.com/calculadora-interes-compuesto',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        description: 'Proyecta sesiones de trading con interés compuesto controlado y límite diario de protección sin martingala.'
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
  <title>Calculadora de Interés Compuesto para Trading (Sin Martingala)</title>
  <meta
    name="description"
    content="Simula tu plan de interés compuesto sesión por sesión en Exnova, IQ Option o Forex con porcentaje controlado y candado diario de protección."
  />
  <link rel="canonical" href="https://tuesposotrader.com/calculadora-interes-compuesto" />
  <meta property="og:title" content="Calculadora de Interés Compuesto para Trading" />
  <meta
    property="og:description"
    content="Calcula importe exacto por orden, límite diario de riesgo y proyección por sesiones."
  />
  <meta property="og:url" content="https://tuesposotrader.com/calculadora-interes-compuesto" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="https://tuesposotrader.com/assets/photos/og-image.png" />
  {@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

<ToolShell
  currentPath="/calculadora-interes-compuesto"
  badge="Gestión Matemática de Capital"
  title="Calculadora de Interés Compuesto y Riesgo Diario"
  subtitle="Define exactamente cuánto arriesgar en cada entrada, cuál es tu candado diario para detenerte a tiempo y cómo evoluciona una cuenta sesión tras sesión sin usar martingala."
  {faqs}
>
  <div class="comp-top-grid">
    <!-- Controles -->
    <section class="comp-card" aria-label="Parámetros del plan">
      <h2>Configura Tu Plan de Gestión</h2>

      <div class="field-row">
        <div class="field-group">
          <label for="cap-init">Capital inicial (USD)</label>
          <input id="cap-init" type="number" min="10" max="100000" step="10" bind:value={initialCapital} />
        </div>

        <div class="field-group">
          <label for="stake-pct">Importe por orden (% de cuenta)</label>
          <input id="stake-pct" type="number" min="0.5" max="20" step="0.5" bind:value={stakePct} />
        </div>
      </div>

      <div class="quick-presets" role="group" aria-label="Perfiles de gestión">
        <button
          type="button"
          class="preset-btn"
          class:is-active={stakePct === 2 && dailyStopUnits === 2}
          onclick={() => {
            stakePct = 2;
            dailyNetUnits = 1.5;
            dailyStopUnits = 2;
          }}
        >
          Conservador (2%)
        </button>
        <button
          type="button"
          class="preset-btn"
          class:is-active={stakePct === 3 && dailyStopUnits === 2}
          onclick={() => {
            stakePct = 3;
            dailyNetUnits = 1.5;
            dailyStopUnits = 2;
          }}
        >
          Equilibrado (3%)
        </button>
        <button
          type="button"
          class="preset-btn"
          class:is-active={stakePct === 5 && dailyStopUnits === 2}
          onclick={() => {
            stakePct = 5;
            dailyNetUnits = 2.0;
            dailyStopUnits = 2;
          }}
        >
          Dinámico (5%)
        </button>
      </div>

      <div class="field-row">
        <div class="field-group">
          <label for="payout-pct">Retorno medio del activo (%)</label>
          <input id="payout-pct" type="number" min="60" max="98" step="1" bind:value={payoutPct} />
        </div>

        <div class="field-group">
          <label for="sessions-cnt">Sesiones hábiles a proyectar</label>
          <select id="sessions-cnt" bind:value={totalSessions}>
            <option value={10}>10 sesiones (~2 semanas)</option>
            <option value={20}>20 sesiones (~1 mes hábil)</option>
            <option value={40}>40 sesiones (~2 meses)</option>
            <option value={60}>60 sesiones (~3 meses)</option>
          </select>
        </div>
      </div>

      <div class="field-row">
        <div class="field-group">
          <label for="daily-units">Meta neta media por sesión (unidades)</label>
          <input id="daily-units" type="number" min="0.25" max="10" step="0.25" bind:value={dailyNetUnits} />
        </div>

        <div class="field-group">
          <label for="stop-units">Candado diario de corte (unidades)</label>
          <input id="stop-units" type="number" min="1" max="10" step="1" bind:value={dailyStopUnits} />
        </div>
      </div>

      {#if cleanStakePct > 5}
        <div class="risk-banner risk-banner--warn">
          <strong>Atención:</strong> Arriesgar más del 5% por orden eleva la volatilidad de la cuenta. Mantenerte entre 2% y 5% protege tu capital ante días adversos.
        </div>
      {:else}
        <div class="risk-banner risk-banner--ok">
          <strong>Parámetro saludable:</strong> Con {cleanStakePct}% por orden y corte en -{cleanStopUnits}u, un día adverso se detiene en -{(cleanStakePct * cleanStopUnits).toFixed(1)}% de la cuenta.
        </div>
      {/if}
    </section>

    <!-- Resumen -->
    <section class="comp-card" aria-live="polite">
      <h2>Reglas Exactas para Tu Sesión de Hoy</h2>

      <div class="kpi-grid">
        <div class="kpi-box">
          <span>Importe Hoy (1x)</span>
          <strong>${firstOrderStake.toFixed(2)}</strong>
          <small>Mínimo broker $1.00</small>
        </div>
        <div class="kpi-box kpi-box--guard">
          <span>Candado Diario (-{cleanStopUnits}u)</span>
          <strong>-${maxDailyRiskUsd.toFixed(2)}</strong>
          <small>Si se toca, cierras sesión</small>
        </div>
        <div class="kpi-box kpi-box--proj">
          <span>Proyección ({cleanSessions} días)</span>
          <strong>${finalCapital.toFixed(2)}</strong>
          <small>+{netGrowthPct.toFixed(1)}% ({(dailyGrowthRate * 100).toFixed(2)}%/día)</small>
        </div>
      </div>

      <p class="comp-note">
        Esta tabla asume una media de <strong>+{cleanDailyUnits} unidades netas</strong> por sesión con retorno del <strong>{cleanPayout}%</strong>, recalculando el importe únicamente al inicio de cada nuevo día (interés compuesto entre sesiones, importe plano intradía).
      </p>

      <p class="comp-note">
        Profundiza en nuestra guía sobre <a href="/blog/gestion-de-riesgo-opciones-binarias">gestión de riesgo profesional</a> y por qué <a href="/blog/martingala-en-trading-funciona-o-es-una-trampa-mortifera-para-tu-capital">evitar la martingala</a>.
      </p>
    </section>
  </div>

  <!-- Tabla de Sesiones -->
  <section class="comp-table-wrap" aria-label="Tabla de progresión por sesiones">
    <h2>Hoja de Ruta Sesión por Sesión ({cleanSessions} sesiones)</h2>
    <div class="table-scroll">
      <table class="comp-table">
        <thead>
          <tr>
            <th>Sesión</th>
            <th>Capital Inicio</th>
            <th>Importe 1x ({cleanStakePct}%)</th>
            <th>Candado Corte (-{cleanStopUnits}u)</th>
            <th>Meta Sesión (+{cleanDailyUnits}u)</th>
            <th>Capital Cierre</th>
          </tr>
        </thead>
        <tbody>
          {#each schedule as row}
            <tr>
              <td>Día {row.day}</td>
              <td>${row.startDay.toFixed(2)}</td>
              <td class="col-accent">${row.unitStake.toFixed(2)}</td>
              <td class="col-stop">-${row.stopFloorUsd.toFixed(2)}</td>
              <td class="col-pos">+${row.sessionDelta.toFixed(2)}</td>
              <td><strong>${row.endDay.toFixed(2)}</strong></td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>
</ToolShell>

<style>
  .comp-top-grid {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .comp-card {
    background: var(--clr-surface);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.15rem;
  }

  .comp-card h2,
  .comp-table-wrap h2 {
    font-size: 1.2rem;
    margin-bottom: 0.25rem;
  }

  .field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.85rem;
  }

  .field-group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #e6ebf0;
  }

  input,
  select {
    width: 100%;
    background: #0B0E14;
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 10px;
    padding: 0.7rem 0.85rem;
    font-size: 0.96rem;
    font-family: inherit;
  }

  input:focus,
  select:focus {
    outline: 2px solid var(--clr-primary);
    border-color: transparent;
  }

  .quick-presets {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .preset-btn {
    flex: 1;
    min-width: 120px;
    background: rgba(255, 255, 255, 0.04);
    color: var(--clr-muted);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 0.45rem 0.75rem;
    font-size: 0.84rem;
    font-weight: 600;
    cursor: pointer;
  }

  .preset-btn.is-active,
  .preset-btn:hover {
    background: rgba(93, 95, 239, 0.22);
    color: #fff;
    border-color: var(--clr-primary);
  }

  .risk-banner {
    border-radius: 10px;
    padding: 0.85rem 1rem;
    font-size: 0.86rem;
    line-height: 1.5;
  }

  .risk-banner--warn {
    background: rgba(255, 165, 0, 0.1);
    border: 1px solid rgba(255, 165, 0, 0.35);
    color: #ffd599;
  }

  .risk-banner--ok {
    background: rgba(46, 204, 113, 0.1);
    border: 1px solid rgba(46, 204, 113, 0.32);
    color: #b8f5d0;
  }

  .kpi-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .kpi-box {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    padding: 1rem 1.15rem;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .kpi-box--guard {
    border-color: rgba(255, 107, 98, 0.3);
  }

  .kpi-box--proj {
    border-color: rgba(255, 215, 0, 0.32);
    background: rgba(255, 215, 0, 0.05);
  }

  .kpi-box span {
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--clr-muted);
  }

  .kpi-box strong {
    font-size: 1.65rem;
    color: #fff;
  }

  .kpi-box--proj strong {
    color: var(--clr-accent);
  }

  .kpi-box small {
    font-size: 0.8rem;
    color: var(--clr-muted);
  }

  .comp-note {
    font-size: 0.88rem;
    line-height: 1.55;
  }

  .comp-note a {
    color: var(--clr-accent);
    text-decoration: underline;
  }

  .comp-table-wrap {
    background: var(--clr-surface);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    padding: 1.5rem;
  }

  .table-scroll {
    overflow-x: auto;
    margin-top: 1rem;
  }

  .comp-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.92rem;
    min-width: 600px;
  }

  .comp-table th,
  .comp-table td {
    padding: 0.75rem 0.9rem;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  .comp-table th {
    color: var(--clr-muted);
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .col-accent {
    color: var(--clr-accent);
    font-weight: 600;
  }

  .col-stop {
    color: #ff8e88;
  }

  .col-pos {
    color: #7ee2a8;
  }

  @media (max-width: 860px) {
    .comp-top-grid,
    .field-row {
      grid-template-columns: 1fr;
    }
  }
</style>
