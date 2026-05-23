#!/usr/bin/env python3
"""
🤖 SEO Blog Agent — Tu Esposo Trader
Genera artículos SEO automáticos, los commitea al repo,
y envía una notificación a Telegram con oportunidades de backlinks.
"""

import os
import json
import re
import time
import unicodedata
import requests
from datetime import datetime
from pathlib import Path


# ── Configuración desde variables de entorno (GitHub Secrets) ──
GEMINI_API_KEY = os.environ["GEMINI_API_KEY"]
TELEGRAM_BOT_TOKEN = os.environ["TELEGRAM_BOT_TOKEN"]
TELEGRAM_CHAT_ID = os.environ["TELEGRAM_CHAT_ID"]

BLOG_DIR = Path("src/routes/blog")





def get_existing_slugs():
    """Lista todas las carpetas de artículos existentes en el blog."""
    slugs = []
    try:
        for item in BLOG_DIR.iterdir():
            if item.is_dir() and not item.name.startswith(('+', '.', '_')):
                slugs.append(item.name)
    except FileNotFoundError:
        print("⚠️ Directorio de blog no encontrado, se creará automáticamente")
    return sorted(slugs)


def slugify(text):
    """Convierte un título en un slug URL-safe."""
    text = unicodedata.normalize('NFKD', text)
    text = text.encode('ascii', 'ignore').decode('ascii')
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_]+', '-', text)
    text = re.sub(r'-+', '-', text)
    text = text.strip('-')
    return text

# Modelos a intentar en orden (actualizados Mayo 2026)
GEMINI_MODELS = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
]


def call_gemini(system_prompt, user_prompt):
    """Llama a la API de Gemini con reintentos automáticos y modelos de respaldo."""
    last_error = None

    for model in GEMINI_MODELS:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={GEMINI_API_KEY}"
        payload = {
            "contents": [
                {"role": "user", "parts": [{"text": user_prompt}]}
            ],
            "systemInstruction": {
                "parts": [{"text": system_prompt}]
            },
            "generationConfig": {
                "temperature": 0.7,
                "maxOutputTokens": 8192
            }
        }

        # Intentar hasta 3 veces por modelo con espera exponencial
        for attempt in range(3):
            try:
                print(f"   🔄 Intentando con modelo: {model} (intento {attempt + 1}/3)")
                response = requests.post(url, json=payload, timeout=120)

                if response.status_code == 429:
                    wait_time = (attempt + 1) * 15  # 15s, 30s, 45s
                    print(f"   ⏳ Rate limit (429). Esperando {wait_time}s antes de reintentar...")
                    time.sleep(wait_time)
                    continue

                response.raise_for_status()
                data = response.json()
                result = data["candidates"][0]["content"]["parts"][0]["text"]
                print(f"   ✅ Respuesta recibida de {model}")
                return result

            except requests.exceptions.RequestException as e:
                last_error = e
                if "429" not in str(e):
                    # Si no es rate limit, no tiene sentido reintentar
                    print(f"   ❌ Error con {model}: {e}")
                    break
                continue
            except (KeyError, IndexError) as e:
                raise RuntimeError(f"❌ Respuesta inesperada de Gemini ({model}): {e}")

        print(f"   ⚠️ Modelo {model} agotó sus intentos, probando siguiente modelo...")

    raise RuntimeError(f"❌ Todos los modelos de Gemini fallaron. Último error: {last_error}")


def extract_title(markdown_content):
    """Extrae el título del frontmatter YAML."""
    match = re.search(r'title:\s*"([^"]+)"', markdown_content)
    if match:
        return match.group(1)
    return None


def clean_markdown(content):
    """Limpia el markdown eliminando wrappers de bloques de código que Gemini a veces agrega."""
    content = content.strip()
    # Remover ```markdown o ```md del inicio
    content = re.sub(r'^```(?:markdown|md)?\s*\n', '', content)
    # Remover ``` del final
    content = re.sub(r'\n```\s*$', '', content)
    return content.strip()


def generate_article(existing_slugs):
    """Genera un nuevo artículo SEO optimizado usando Gemini."""
    today = datetime.now().strftime("%Y-%m-%d")
    slugs_list = "\n".join(f"- {s}" for s in existing_slugs) if existing_slugs else "- (ninguno publicado aún)"

    system_prompt = """Eres un redactor SEO experto especializado en trading, opciones binarias, forex, psicotrading y copytrading para el mercado hispanoamericano (Venezuela, Colombia, México, Perú, Argentina).

Tu tarea es generar UN artículo completo en formato Markdown válido para un blog construido con SvelteKit y mdsvex.

REGLAS ESTRICTAS DE FORMATO:
1. El artículo DEBE comenzar con un bloque Frontmatter YAML delimitado por tres guiones (---).
2. El Frontmatter DEBE contener exactamente estos 4 campos:
   - title: string entre comillas dobles, máximo 65 caracteres, incluir keyword principal
   - description: string entre comillas dobles, máximo 155 caracteres, persuasiva y con keyword
   - date: formato ISO "YYYY-MM-DD" con la fecha proporcionada
   - author: siempre "Tu Esposo Trader"
3. Después del Frontmatter, el cuerpo del artículo debe tener:
   - Un H1 (#) que sea IDÉNTICO al title del Frontmatter
   - Mínimo 1500 palabras, máximo 2500
   - Subtítulos H2 (##) cada 200-300 palabras
   - Al menos 1 sección de FAQ con H3 (###) para capturar featured snippets de Google
   - Uso natural de negritas (**keyword**) sin sobreoptimizar
   - Tono: directo, honesto, sin humo. Como si un trader profesional venezolano le hablara a un amigo
   - Mencionar positivamente a Exnova e IQ Option como brokers confiables cuando sea natural
   - NUNCA usar la palabra "conclusión" como título de sección final
4. Al final del artículo, incluir exactamente este bloque CTA en Markdown:
   [Únete a nuestro Canal de Telegram Gratis](https://t.me/+_X-l-DBTBqY3MGQ5) y empieza a transformar tu mentalidad y tu economía hoy mismo, o [Visita la Academia](/) para descubrir todos nuestros recursos educativos diseñados para el trader hispano.
5. NO incluir imágenes, NO incluir HTML, solo Markdown puro.
6. NO envolver tu respuesta en bloques de código (```). Solo devuelve el contenido crudo del archivo .md.

REGLA ANTI-DUPLICACIÓN CRÍTICA:
Se te proporcionará una lista de slugs de artículos ya publicados. DEBES generar un artículo sobre un tema COMPLETAMENTE DIFERENTE a todos los existentes. El slug y tema del nuevo artículo NO puede ser igual ni similar a ninguno de la lista."""

    user_prompt = f"""ARTÍCULOS YA PUBLICADOS (NO repetir estos temas):
{slugs_list}

Genera un artículo SEO original sobre un tema de trading que NO esté cubierto por ninguno de los artículos anteriores.

Ataca una keyword long-tail con intención informativa que tenga potencial de búsqueda en Venezuela, Colombia y México.

La fecha de hoy es: {today}."""

    return call_gemini(system_prompt, user_prompt)


def call_gemini_with_search(system_prompt, user_prompt):
    """Llama a Gemini con Google Search Grounding activado para buscar hilos reales."""
    last_error = None

    for model in GEMINI_MODELS:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={GEMINI_API_KEY}"
        payload = {
            "contents": [
                {"role": "user", "parts": [{"text": user_prompt}]}
            ],
            "systemInstruction": {
                "parts": [{"text": system_prompt}]
            },
            "tools": [
                {"googleSearch": {}}
            ],
            "generationConfig": {
                "temperature": 0.7,
                "maxOutputTokens": 4096
            }
        }

        for attempt in range(3):
            try:
                print(f"   🔄 Buscando foros con {model} + Google Search (intento {attempt + 1}/3)")
                response = requests.post(url, json=payload, timeout=120)

                if response.status_code == 429:
                    wait_time = (attempt + 1) * 15
                    print(f"   ⏳ Rate limit. Esperando {wait_time}s...")
                    time.sleep(wait_time)
                    continue

                response.raise_for_status()
                data = response.json()

                # Extraer el texto de la respuesta
                text = data["candidates"][0]["content"]["parts"][0]["text"]

                # Extraer URLs reales del grounding metadata si están disponibles
                grounding_urls = []
                try:
                    chunks = data["candidates"][0].get("groundingMetadata", {}).get("groundingChunks", [])
                    for chunk in chunks:
                        web = chunk.get("web", {})
                        if web.get("uri"):
                            grounding_urls.append(web["uri"])
                except (KeyError, TypeError):
                    pass

                # Si hay URLs de grounding, agregarlas al texto
                if grounding_urls:
                    text += "\n\n### URLS VERIFICADAS POR GOOGLE:\n"
                    for gu in grounding_urls:
                        text += f"- {gu}\n"

                print(f"   ✅ Búsqueda completada con {model}")
                return text

            except requests.exceptions.RequestException as e:
                last_error = e
                if "429" not in str(e):
                    print(f"   ❌ Error con {model}: {e}")
                    break
                continue
            except (KeyError, IndexError) as e:
                raise RuntimeError(f"❌ Respuesta inesperada de Gemini Search ({model}): {e}")

        print(f"   ⚠️ Modelo {model} agotó intentos de búsqueda...")

    raise RuntimeError(f"❌ Búsqueda de foros falló: {last_error}")


def verify_url(url, keywords):
    """Verifica que una URL existe y contiene contenido relevante."""
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
        response = requests.get(url, headers=headers, timeout=10, allow_redirects=True)

        if response.status_code != 200:
            return False, f"HTTP {response.status_code}"

        # Verificar que la página final es del mismo dominio (no redirigida a otro sitio)
        final_url = response.url.lower()
        original_domain = url.split('/')[2].lower()
        final_domain = final_url.split('/')[2].lower()

        if original_domain.replace('www.', '') != final_domain.replace('www.', ''):
            return False, f"Redirige a {final_domain}"

        # Verificar que el contenido tiene al menos 1 keyword relevante
        content = response.text.lower()
        keyword_found = any(kw.lower() in content for kw in keywords)

        if not keyword_found:
            return False, "Contenido no relacionado con trading"

        return True, "OK"

    except requests.exceptions.RequestException as e:
        return False, str(e)


def extract_urls_from_text(text):
    """Extrae todas las URLs de un texto."""
    url_pattern = r'https?://(?:www\.)?(?:reddit\.com|quora\.com|es\.quora\.com|rankia\.com|foro\.invertir\.com)[^\s\)\]\"\'<>,]*'
    return re.findall(url_pattern, text)


def generate_forum_response(article_title, article_url):
    """Genera respuesta para foros: primero busca y verifica URLs, luego genera la respuesta."""
    print("   🔍 Buscando hilos REALES en foros con Google Search...")

    # ── PASO 1: Pedir a Gemini que busque foros ──
    search_prompt = """Busca en Google hilos REALES de foros en español sobre trading donde se discuta el tema proporcionado.

INSTRUCCIONES ESTRICTAS:
- Busca en: reddit.com, es.quora.com, rankia.com, foros de bolsa, foros de trading
- SOLO devuelve URLs que encontraste en los resultados de búsqueda de Google
- NUNCA inventes URLs
- Formato: una URL por línea, sin más texto
- Devuelve entre 3 y 8 URLs"""

    search_user = f"Busca foros en español sobre: {article_title}"

    try:
        raw_urls_text = call_gemini_with_search(search_prompt, search_user)
    except RuntimeError:
        raw_urls_text = ""

    # ── PASO 2: Extraer y verificar CADA URL ──
    print("   🔎 Verificando URLs encontradas...")
    all_urls = extract_urls_from_text(raw_urls_text)
    # También buscar URLs genéricas (no solo de foros conocidos)
    generic_urls = re.findall(r'https?://[^\s\)\]\"\'<>,]+', raw_urls_text)
    for gu in generic_urls:
        gu = gu.rstrip(')')
        if gu not in all_urls and ('foro' in gu or 'reddit' in gu or 'quora' in gu or 'rankia' in gu or 'bolsa' in gu):
            all_urls.append(gu)

    trading_keywords = ["trading", "trader", "forex", "inversión", "invertir", "bolsa",
                        "mercado", "opciones", "binarias", "estrategia", "estafa",
                        "riesgo", "broker", "capital", "ganancias", "copytrading",
                        "precio", "análisis", "indicador", "psicotrading", "plan"]

    verified = []
    for url in all_urls:
        url = url.rstrip(')').rstrip('.')
        is_valid, reason = verify_url(url, trading_keywords)
        if is_valid:
            verified.append(url)
            print(f"      ✅ {url}")
        else:
            print(f"      ❌ {url} — {reason}")

    print(f"   📊 Resultado: {len(verified)}/{len(all_urls)} URLs verificadas")

    # ── PASO 3: Generar respuesta para foro (SIN pedir URLs) ──
    response_prompt = """Genera UNA respuesta para pegar en un foro de trading en español.

REGLAS:
- Entre 80-150 palabras
- Aporta valor real PRIMERO (como si respondieras una pregunta)
- Al final, incluye de forma NATURAL el enlace al artículo
- Después del enlace del artículo, agrega algo como: "Y si buscan una comunidad de trading en español con señales gratis, pasen por el Telegram: https://t.me/+_X-l-DBTBqY3MGQ5"
- NUNCA ser spammy ni promocional
- Tono: cercano, como un colega trader latino
- Español neutro latinoamericano
- NO usar emojis
- NO incluyas encabezados ni formato markdown, solo texto plano"""

    response_user = f"Tema: {article_title}\nURL del artículo: {article_url}\nTelegram del grupo: https://t.me/+_X-l-DBTBqY3MGQ5"

    try:
        forum_text = call_gemini(response_prompt, response_user)
    except RuntimeError:
        forum_text = f"(Error generando respuesta. Enlace del artículo: {article_url})"

    # ── PASO 4: Construir mensaje LIMPIO ──
    result = ""

    # Sección de hilos verificados
    if verified:
        result += f"✅ HILOS VERIFICADOS ({len(verified)} encontrados):\n\n"
        for i, url in enumerate(verified, 1):
            result += f"{i}. {url}\n"
    else:
        result += "⚠️ No se encontraron hilos verificados esta vez.\n"

    result += "\n━━━━━━━━━━━━━━━━━━\n\n"

    # Respuesta para copiar
    result += "✍️ RESPUESTA PARA COPIAR Y PEGAR:\n\n"
    result += forum_text.strip()

    result += "\n\n━━━━━━━━━━━━━━━━━━\n\n"

    # Búsquedas manuales (siempre útiles)
    result += "🔍 BÚSQUEDAS MANUALES:\n"
    result += f'1. site:reddit.com "{article_title.split(":")[0].strip()}"\n'
    result += f'2. site:rankia.com/foros "{article_title.split(":")[0].strip()}"\n'
    result += f'3. site:es.quora.com "{article_title.split(":")[0].strip()}"\n'

    result += "\n📲 GRUPO TELEGRAM: https://t.me/+_X-l-DBTBqY3MGQ5"

    return result


def send_telegram(title, article_url, slug, forum_response):
    """Envía la notificación completa a Telegram."""
    today = datetime.now().strftime("%d/%m/%Y")

    # Truncar la respuesta del foro si excede el límite de Telegram
    max_forum_len = 2500
    if len(forum_response) > max_forum_len:
        forum_response = forum_response[:max_forum_len] + "\n\n[... truncado]"

    message = f"""🚀 <b>NUEVO ARTÍCULO PUBLICADO</b>

📝 <b>Título:</b> {title}
🔗 <b>URL:</b> {article_url}
📁 <b>Slug:</b> {slug}
📅 <b>Fecha:</b> {today}

━━━━━━━━━━━━━━━━━━

🎯 <b>OPORTUNIDAD DE BACKLINK</b>

<code>{forum_response}</code>

━━━━━━━━━━━━━━━━━━

⚠️ <i>Busca los hilos sugeridos en Google, pega la respuesta desde tu teléfono. Siempre hazlo manual para evitar baneos.</i>"""

    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": message,
        "parse_mode": "HTML"
    }

    try:
        response = requests.post(url, json=payload, timeout=30)
        response.raise_for_status()
        print("✅ Notificación enviada a Telegram exitosamente")
    except requests.exceptions.RequestException as e:
        print(f"⚠️ Error al enviar notificación a Telegram: {e}")
        # No lanzamos error aquí porque el artículo ya fue creado


def main():
    """Función principal del agente SEO."""
    print("🤖 SEO Blog Agent — Tu Esposo Trader")
    print("=" * 50)
    print(f"📅 Ejecución: {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}")

    # ── Paso 1: Listar artículos existentes ──
    existing_slugs = get_existing_slugs()
    print(f"\n📚 Artículos existentes ({len(existing_slugs)}):")
    for s in existing_slugs:
        print(f"   └─ {s}")

    # ── Paso 2: Generar nuevo artículo con Gemini ──
    print("\n🧠 Generando nuevo artículo con Gemini AI...")
    raw_article = generate_article(existing_slugs)
    article_content = clean_markdown(raw_article)

    # ── Paso 3: Extraer título y crear slug ──
    title = extract_title(article_content)
    if not title:
        raise ValueError("❌ Error crítico: No se pudo extraer el título del artículo generado")

    slug = slugify(title)
    print(f"   📝 Título: {title}")
    print(f"   🔗 Slug: {slug}")

    # ── Paso 4: Verificar que no sea duplicado ──
    if slug in existing_slugs:
        raise ValueError(f"❌ DUPLICADO DETECTADO: El slug '{slug}' ya existe. Abortando.")

    # ── Paso 5: Crear el archivo en el directorio del blog ──
    article_dir = BLOG_DIR / slug
    article_dir.mkdir(parents=True, exist_ok=True)
    article_file = article_dir / "+page.md"
    article_file.write_text(article_content, encoding="utf-8")
    print(f"\n✅ Archivo creado: {article_file}")

    # ── Paso 6: Generar respuesta para foros ──
    article_url = f"https://tuesposotrader.com/blog/{slug}"
    print("\n🎯 Generando respuesta para foros con Gemini AI...")
    forum_response = generate_forum_response(title, article_url)
    print("   ✅ Respuesta generada")

    # ── Paso 7: Enviar notificación a Telegram ──
    print("\n📲 Enviando notificación a Telegram...")
    send_telegram(title, article_url, slug, forum_response)

    # ── Resumen final ──
    print("\n" + "=" * 50)
    print("🎉 ¡Agente SEO completado exitosamente!")
    print(f"   📄 Artículo: {article_url}")
    print(f"   📂 Archivo: {article_file}")
    print("   ☁️ Cloudflare desplegará automáticamente en ~90 segundos")
    print("=" * 50)


if __name__ == "__main__":
    main()
