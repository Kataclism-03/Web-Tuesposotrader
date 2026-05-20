import os
import shutil
import re

os.makedirs('src/routes', exist_ok=True)
os.makedirs('static/assets', exist_ok=True)
os.makedirs('static/scripts', exist_ok=True)

# Copy directories
if os.path.exists('src_old/styles'):
    shutil.copytree('src_old/styles', 'static/styles', dirs_exist_ok=True)
if os.path.exists('src_old/assets'):
    shutil.copytree('src_old/assets', 'static/assets', dirs_exist_ok=True)
if os.path.exists('src_old/data'):
    shutil.copytree('src_old/data', 'static/data', dirs_exist_ok=True)
if os.path.exists('src_old/scripts'):
    shutil.copytree('src_old/scripts', 'static/scripts', dirs_exist_ok=True)

# Process app.html
with open('src_old/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = re.sub(r'<body>.*?</body>', '<body>\n\t\t<div style="display: contents">%sveltekit.body%</div>\n\t</body>', html, flags=re.DOTALL)
html = html.replace('./styles', '/styles')

# Remove the script tag from app.html (Svelte will inject its own)
html = re.sub(r'<script.*?</script>', '', html, flags=re.DOTALL)

with open('src/app.html', 'w', encoding='utf-8') as f:
    f.write(html)

# Build +page.svelte
page_content = '<div id="background-rotator" class="background-rotator"></div>\n<div id="page-wrapper" class="page-wrapper">\n'

slots = ['header', 'hero', 'about', 'media-gallery', 'benefits', 'social-links', 'footer']
for slot in slots:
    if slot == 'footer':
        page_content += '</main>\n'
    if slot == 'hero':
        page_content += '<main>\n'
        
    try:
        with open(f'src_old/components/{slot}.html', 'r', encoding='utf-8') as f:
            page_content += f.read() + '\n'
    except:
        pass

page_content += '</div>\n'

script_tag = '''<script>
    import { onMount } from 'svelte';
    onMount(async () => {
        // Load main.js dynamically so it runs after DOM is ready
        await import('/scripts/main.js');
    });
</script>

'''

with open('src/routes/+page.svelte', 'w', encoding='utf-8') as f:
    f.write(script_tag + page_content)

with open('src/routes/+layout.js', 'w', encoding='utf-8') as f:
    f.write('export const prerender = true;\n')

print('Migration basic setup done')
