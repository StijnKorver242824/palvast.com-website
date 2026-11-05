# palvast.com website

Static site built by Jekyll on GitHub Pages. The only script is `consent.js` (the consent notice); the content works without it.

## Where things live

| What you want to change | File |
|---|---|
| Header (logo, menu) | `_includes/header.html` |
| Footer | `_includes/footer.html` |
| `<head>`: meta tags, hreflang, Open Graph, JSON-LD, page frame | `_layouts/default.html` |
| "Get in touch" block at the bottom of Home, About and Services | `_includes/contact-cta.html` |
| Company details (KvK number, address, email, VAT), shown in footer and privacy statement | `_data/company.yml` |
| Menu labels, button text, footer note (Dutch / English) | `_data/nl.yml`, `_data/en.yml` |
| Page content | `nl/.../index.html`, `en/.../index.html` |
| Styling | `style.css` |
| Site URL | `_config.yml` |

Each page file starts with a small front matter block (title and description). The language
(`nl` or `en`) and the layout come from the folder, set in `_config.yml`.

## Consent notice

Small notice at the bottom-left with Accept / Reject optional / Read more. Switch it off with `consent_banner: false` in `_config.yml`. The choice is stored in localStorage. Optional services go in as `<script type="text/plain" data-consent="optional" src="..."></script>` and only run after Accept. Texts: `consent:` in `_data/nl.yml` and `_data/en.yml`.

## Internal notes

Notes in the source (B&M mapping, open decisions, the commented-out launch line) are written as
`{% comment %} ... {% endcomment %}`. Unlike `<!-- -->` they do not appear in the published HTML.

## Add a page

1. Create `nl/<name>/index.html` and `en/<name>/index.html` with front matter and content.
2. Add the page to `nav` in `_data/nl.yml` and `_data/en.yml`.

The sitemap (`sitemap.xml`) is generated from the pages, so it updates by itself.

## Preview locally (optional)

Needs Ruby. Then: `bundle install` once, and `bundle exec jekyll serve`. Open http://localhost:4000.
Without a local setup, push and check the live site.

## Not Jekyll

`index.html` (root language redirect), `style.css`, `robots.txt`, `CNAME`, `favicon.svg`
and `og-image.png` are plain files and are copied as they are.
