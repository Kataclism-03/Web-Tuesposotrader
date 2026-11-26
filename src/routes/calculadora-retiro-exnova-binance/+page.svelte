<script lang="ts">
  import ToolShell from '../../components/ToolShell.svelte';

  const NETWORKS = [
    {
      id: 'trc20',
      name: 'USDT — Red Tron (TRC-20)',
      fixedFeeUsd: 1.0,
      pctFee: 0,
      eta: '2 a 15 minutos',
      recommended: true,
      note: 'Opción estándar para retiros desde Exnova hacia Binance Spot.'
    },
    {
      id: 'bep20',
      name: 'USDT — BNB Smart Chain (BEP-20)',
      fixedFeeUsd: 0.5,
      pctFee: 0,
      eta: '1 a 10 minutos',
      recommended: false,
      note: 'Comisión baja; verifica primero en tu panel de Exnova si está habilitada para tu país.'
    },
    {
      id: 'erc20',
      name: 'USDT — Red Ethereum (ERC-20)',
      fixedFeeUsd: 8.5,
      pctFee: 0,
      eta: '5 a 30 minutos',
      recommended: false,
      note: 'Costo de red elevado; desaconsejada para retiros menores a $200 USD.'
    },
    {
      id: 'card',
      name: 'Tarjeta Bancaria Directa (Visa / Mastercard)',
      fixedFeeUsd: 0,
      pctFee: 0.025,
      eta: '3 a 7 días hábiles',
      recommended: false,
      note: 'Sujeta a tiempos bancarios internacionales y posibles cargos del banco receptor.'
    }
  ];

  const CURRENCIES = [
    { code: 'VES', label: 'Venezuela (Bolívares — VES)', defaultRate: 46.5, step: 0.1 },
    { code: 'COP', label: 'Colombia (Pesos — COP)', defaultRate: 4180, step: 10 },
    { code: 'MXN', label: 'México (Pesos — MXN)', defaultRate: 20.1, step: 0.05 },
    { code: 'PEN', label: 'Perú (Soles — PEN)', defaultRate: 3.74, step: 0.01 },
    { code: 'ARS', label: 'Argentina (Pesos — ARS)', defaultRate: 1160, step: 5 },
    { code: 'USD', label: 'Dólares (Zinli / Wally / Panamá — USD)', defaultRate: 1.0, step: 0.01 }
  ];

  let grossUsd = $state(100);
  let selectedNetId = $state('trc20');
  let selectedCurrencyCode = $state('VES');
  let customP2pRate = $state(46.5);
  let brokerFeePct = $state(0); // 1 retiro gratis al mes habitual o 2% posterior

  let checkSameNetwork = $state(false);
  let checkKycVerified = $state(false);
  let checkEscrowBank = $state(false);

  function handleCurrencyChange(event: Event & { currentTarget: HTMLSelectElement }) {
    const code = event.currentTarget.value;
    selectedCurrencyCode = code;
    const found = CURRENCIES.find((c) => c.code === code);
    if (found) customP2pRate = found.defaultRate;
  }

  let activeNet = $derived(NETWORKS.find((n) => n.id === selectedNetId) || NETWORKS[0]);
  let activeCurrency = $derived(CURRENCIES.find((c) => c.code === selectedCurrencyCode) || CURRENCIES[0]);

  let sanitizedGross = $derived(Math.max(0, Number(grossUsd) || 0));
  let brokerFeeUsd = $derived(sanitizedGross * (Math.max(0, Number(brokerFeePct) || 0) / 100));
  let networkFeeUsd = $derived(
    sanitizedGross > 0 ? activeNet.fixedFeeUsd + sanitizedGross * activeNet.pctFee : 0
  );
  let totalFeesUsd = $derived(Math.min(sanitizedGross, brokerFeeUsd + networkFeeUsd));
  let netUsdtReceived = $derived(Math.max(0, sanitizedGross - totalFeesUsd));
  let feeSharePct = $derived(sanitizedGross > 0 ? (totalFeesUsd / sanitizedGross) * 100 : 0);
  let localAmountP2p = $derived(netUsdtReceived * Math.max(0, Number(customP2pRate) || 0));

  const faqs = [
    {
      q: '¿Cuál es la red más económica para retirar de Exnova a Binance?',
      a: 'USDT por la red Tron (TRC-20) suele costar alrededor de $1 USD fijo y llega en minutos, evitando las comisiones variables de Ethereum (ERC-20).'
    },
    {
      q: '¿Por qué no conviene retirar montos de $10 o $15 demasiado seguido?',
      a: 'Porque una comisión fija de red de $1 sobre $10 representa el 10% de tu retiro; en cambio, sobre $100 representa apenas el 1%.'
    },
    {
      q: '¿Qué pasa si copio una dirección TRC-20 de Binance pero selecciono ERC-20 al retirar?',
      a: 'Las transferencias entre redes incompatibles no se acreditan automáticamente. Verifica siempre que las siglas de la red coincidan exactamente en ambas plataformas antes de confirmar.'
    }
  ];

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'Calculadora de Retiro Exnova a Binance y P2P',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        url: 'https://tuesposotrader.com/calculadora-retiro-exnova-binance',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        description: 'Calcula comisiones de red TRC-20, ERC-20 y conversión P2P a moneda local en segundos.'
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
  <title>Calculadora de Retiro Exnova a Binance (TRC-20 y P2P)</title>
  <meta
    name="description"
    content="Calcula gratis cuánto llega neto al retirar de Exnova o IQ Option a Binance por USDT TRC-20 y cuánto recibes en Bolívares, Pesos o Soles vía P2P."
  />
  <link rel="canonical" href="https://tuesposotrader.com/calculadora-retiro-exnova-binance" />
  <meta property="og:title" content="Calculadora de Retiro Exnova a Binance (TRC-20 y P2P)" />
  <meta
    property="og:description"
    content="Simula comisiones exactas de red y cambio a moneda local antes de solicitar tu retiro."
  />
  <meta property="og:url" content="https://tuesposotrader.com/calculadora-retiro-exnova-binance" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="https://tuesposotrader.com/assets/photos/og-image.png" />
  {@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

<ToolShell
  currentPath="/calculadora-retiro-exnova-binance"
  badge="Calculadora Gratuita P2P & Cripto"
  title="Calculadora de Retiro de Exnova a Binance"
  subtitle="Compara redes blockchain (TRC-20 vs ERC-20), revisa comisiones estimadas y calcula cuánto llega exactamente a tu banco local por Binance P2P."
  {faqs}
>
  <div class="calc-grid">
    <!-- Panel de Entradas -->
    <section class="calc-card" aria-label="Parámetros del retiro">
      <h2>1. Datos de Tu Retiro</h2>

      <div class="field-group">
        <label for="gross-usd">Monto a retirar en USD</label>
        <div class="quick-pills" role="group" aria-label="Montos rápidos">
          {#each [20, 50, 100, 250, 500] as preset}
            <button
              type="button"
              class="pill-btn"
              class:is-active={grossUsd === preset}
              onclick={() => (grossUsd = preset)}
            >
              ${preset}
            </button>
          {/each}
        </div>
        <input
          id="gross-usd"
          type="number"
          min="1"
          max="100000"
          step="1"
          bind:value={grossUsd}
        />
      </div>

      <div class="field-group">
        <label for="network-select">Método / Red de retiro</label>
        <select id="network-select" bind:value={selectedNetId}>
          {#each NETWORKS as net}
            <option value={net.id}>{net.name}</option>
          {/each}
        </select>
        <small class="field-hint">{activeNet.note}</small>
      </div>

      <div class="field-group">
        <label for="broker-fee">Comisión del broker (%)</label>
        <select id="broker-fee" bind:value={brokerFeePct}>
          <option value={0}>0% — Retiro gratuito disponible</option>
          <option value={2}>2% — Comisión estándar en retiros adicionales</option>
        </select>
      </div>

      <div class="field-row">
        <div class="field-group">
          <label for="currency-select">Moneda local en Binance P2P</label>
          <select id="currency-select" value={selectedCurrencyCode} onchange={handleCurrencyChange}>
            {#each CURRENCIES as curr}
              <option value={curr.code}>{curr.label}</option>
            {/each}
          </select>
        </div>

        <div class="field-group">
          <label for="p2p-rate">Tasa P2P actual ({activeCurrency.code} por 1 USDT)</label>
          <input
            id="p2p-rate"
            type="number"
            min="0.01"
            step={activeCurrency.step}
            bind:value={customP2pRate}
          />
        </div>
      </div>
    </section>

    <!-- Panel de Resultados -->
    <section class="calc-card calc-card--result" aria-live="polite">
      <h2>2. Neto Estimado que Recibes</h2>

      <div class="result-highlight">
        <span class="result-highlight__label">Llega a tu Billetera Binance</span>
        <strong class="result-highlight__value">{netUsdtReceived.toFixed(2)} USDT</strong>
        <span class="result-highlight__sub">Tiempo estimado: {activeNet.eta}</span>
      </div>

      <div class="result-local">
        <span class="result-local__label">Equivalente al cambiar por P2P ({activeCurrency.code})</span>
        <strong class="result-local__value">
          {localAmountP2p.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          {activeCurrency.code}
        </strong>
      </div>

      <dl class="breakdown-list">
        <div>
          <dt>Monto solicitado</dt>
          <dd>${sanitizedGross.toFixed(2)} USD</dd>
        </div>
        <div>
          <dt>Cargo del broker ({brokerFeePct}%)</dt>
          <dd>-${brokerFeeUsd.toFixed(2)} USD</dd>
        </div>
        <div>
          <dt>Costo estimado de red</dt>
          <dd>-${networkFeeUsd.toFixed(2)} USD</dd>
        </div>
        <div class="breakdown-list__total">
          <dt>Impacto total de comisiones</dt>
          <dd>{feeSharePct.toFixed(2)}%</dd>
        </div>
      </dl>

      {#if feeSharePct > 5}
        <div class="alert-box alert-box--warn">
          <strong>Aviso de eficiencia:</strong> Las comisiones absorben el {feeSharePct.toFixed(1)}% de este envío. Usar <strong>USDT TRC-20</strong> o acumular al menos $50 reduce el impacto a ~2% o menos.
        </div>
      {:else}
        <div class="alert-box alert-box--ok">
          <strong>Ruta eficiente:</strong> El costo total estimado ({feeSharePct.toFixed(2)}%) conserva más del {(100 - feeSharePct).toFixed(1)}% de tu retiro.
        </div>
      {/if}

      <div class="safety-checklist">
        <h3>Verificación Rápida Anti-Errores (3 pasos)</h3>
        <label class="check-item">
          <input type="checkbox" bind:checked={checkSameNetwork} />
          <span>Confirmé que la red elegida en Exnova coincide letra por letra con la de Binance.</span>
        </label>
        <label class="check-item">
          <input type="checkbox" bind:checked={checkKycVerified} />
          <span>Mi identidad (KYC) está verificada en ambas cuentas.</span>
        </label>
        <label class="check-item">
          <input type="checkbox" bind:checked={checkEscrowBank} />
          <span>En P2P solo liberaré los USDT tras ver el dinero acreditado dentro de mi banco.</span>
        </label>
      </div>

      <p class="guide-link">
        ¿Primera vez retirando? Lee nuestra <a href="/blog/como-retirar-dinero-de-exnova-a-binance-paso-a-paso">guía completa paso a paso de Exnova a Binance</a>.
      </p>
    </section>
  </div>
</ToolShell>

<style>
  .calc-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    align-items: start;
  }

  .calc-card {
    background: var(--clr-surface);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .calc-card h2 {
    font-size: 1.2rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  .field-group {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }

  .field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.85rem;
  }

  label {
    font-size: 0.88rem;
    font-weight: 600;
    color: #e6ebf0;
  }

  input[type='number'],
  select {
    width: 100%;
    background: #0B0E14;
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 10px;
    padding: 0.75rem 0.9rem;
    font-size: 0.98rem;
    font-family: inherit;
  }

  input[type='number']:focus,
  select:focus {
    outline: 2px solid var(--clr-primary);
    border-color: transparent;
  }

  .field-hint {
    font-size: 0.8rem;
    color: var(--clr-muted);
  }

  .quick-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
    margin-bottom: 0.25rem;
  }

  .pill-btn {
    background: rgba(255, 255, 255, 0.04);
    color: var(--clr-muted);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 0.35rem 0.7rem;
    font-size: 0.84rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .pill-btn:hover,
  .pill-btn.is-active {
    background: rgba(93, 95, 239, 0.22);
    color: #fff;
    border-color: var(--clr-primary);
  }

  .result-highlight {
    background: rgba(93, 95, 239, 0.12);
    border: 1px solid rgba(93, 95, 239, 0.35);
    border-radius: 12px;
    padding: 1.15rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .result-highlight__label,
  .result-local__label {
    font-size: 0.82rem;
    color: var(--clr-muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .result-highlight__value {
    font-size: 2rem;
    color: #fff;
    line-height: 1.15;
  }

  .result-highlight__sub {
    font-size: 0.84rem;
    color: #c8d0d8;
  }

  .result-local {
    background: rgba(255, 215, 0, 0.07);
    border: 1px solid rgba(255, 215, 0, 0.24);
    border-radius: 12px;
    padding: 1rem 1.15rem;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .result-local__value {
    font-size: 1.45rem;
    color: var(--clr-accent);
  }

  .breakdown-list {
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
    font-size: 0.92rem;
  }

  .breakdown-list div {
    display: flex;
    justify-content: space-between;
    color: var(--clr-muted);
  }

  .breakdown-list dd {
    margin: 0;
    font-weight: 600;
    color: #fff;
  }

  .breakdown-list__total {
    padding-top: 0.55rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .alert-box {
    border-radius: 10px;
    padding: 0.85rem 1rem;
    font-size: 0.88rem;
    line-height: 1.5;
  }

  .alert-box--warn {
    background: rgba(255, 165, 0, 0.1);
    border: 1px solid rgba(255, 165, 0, 0.35);
    color: #ffd599;
  }

  .alert-box--ok {
    background: rgba(46, 204, 113, 0.1);
    border: 1px solid rgba(46, 204, 113, 0.32);
    color: #b8f5d0;
  }

  .safety-checklist {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 10px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .safety-checklist h3 {
    font-size: 0.92rem;
    margin-bottom: 0.15rem;
  }

  .check-item {
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    font-weight: 400;
    font-size: 0.85rem;
    color: var(--clr-muted);
    cursor: pointer;
  }

  .check-item input {
    margin-top: 0.2rem;
    accent-color: var(--clr-primary);
  }

  .guide-link {
    font-size: 0.86rem;
  }

  .guide-link a {
    color: var(--clr-accent);
    text-decoration: underline;
  }

  @media (max-width: 860px) {
    .calc-grid,
    .field-row {
      grid-template-columns: 1fr;
    }
  }
</style>
