# Atlantic Divers website

A modern, responsive business website for **Atlantic Divers**, Pakistan's first ISO 45001:2018 certified commercial scuba diving company (Multan Road, Lahore).

It is a static site with no build step and no dependencies: plain HTML, CSS and JavaScript. Fonts load from Google Fonts.

## Structure

```
index.html            Page markup and content (all sections)
favicon.svg           Browser tab icon
assets/css/styles.css All styling (design tokens at the top in :root)
assets/js/main.js     Nav, animations, service filter, FAQ, quote form
assets/img/logo.svg   Logo mark
```

## Sections

Hero with a live status panel, qualifications strip, About, Services (12 services with category filter), Industries, Process, Safety and ISO 45001, Project highlights, 24-hour emergency banner, FAQ, Contact form, and Footer. A floating WhatsApp button and a scroll "depth meter" are included.

## Preview locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy

Upload the folder to any static host (cPanel, Netlify, Vercel, GitHub Pages, Cloudflare Pages). No server code is needed.

## Contact form

There is no backend. The form checks the required fields, then opens either the visitor's email app (pre-filled to `atlantic.divers@yahoo.com`) or WhatsApp (pre-filled message to +92 303 6504471). To collect submissions on a server instead, point the form at a service such as Formspree and remove the submit handler in `main.js`.

## Editing content

- **Phone / WhatsApp / email:** search `923036504471` and `atlantic.divers@yahoo.com` in `index.html` and `assets/js/main.js`.
- **Colours:** change the variables in `:root` at the top of `styles.css`.
- **Photos:** project cards use illustrated gradients. To use real photos, replace the `.proj__art` blocks with `<img>` tags.
