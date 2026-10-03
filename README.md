# QTM Lab Website

Static website for the Quantum Technologies and Metamaterials Lab at Florida International University.

- Live site: https://krasnokqtm.com
- GitHub repository: https://github.com/AlexKrasnok/KrasnokQTM.io
- Open quantum-computing course: https://github.com/AlexKrasnok/quantum-computing-lectures

## Site Structure

- `index.html` — homepage, featured work, and brief recent news
- `news.html` — dated news archive, photographs, publications, and lab milestones
- `research.html` and `research-*.html` — research areas and related publications
- `people.html` — lab members and collaborators
- `prof-krasnok.html` — professional profile
- `publications.html` — selected and recent publications, books, talks, and profile links
- `facilities.html` — laboratory facilities and equipment
- `teaching.html` — courses, the open lecture course, and teaching resources
- `resources.html` — research, software, writing, and FIU resources
- `openings.html` — opportunities, current fellowship deadlines, recruiting, and contact information
- `assets/css/styles.css` — shared styles
- `assets/js/main.js` — navigation behavior
- `assets/img/` — deployable logos, portraits, research graphics, covers, funding marks, and equipment images
- `assets/docs/` — two-page academic resume PDF

## Deployment

The site uses static HTML, CSS, and vanilla JavaScript. A push to `main` runs `.github/workflows/static.yml`. The workflow first runs `.github/scripts/prepare_site.py` to collect the public HTML, domain configuration, sitemap, and assets into `_site`, then publishes that directory through GitHub Pages. Local archives and documentation are excluded. The `CNAME` file keeps the custom domain set to `krasnokqtm.com`.

To preview locally, run `python -m http.server 8765` from this directory and open `http://localhost:8765`. To prepare a separate public bundle, run `python .github/scripts/prepare_site.py <empty-output-directory>`.

## Content Maintenance

Only public website files belong in the repository. Working documents, downloaded source pages, CV source files, and previous site versions are stored outside the deployment folder.

Use descriptive alternative text for every meaningful image. Keep external publication links on publisher or DOI pages when available, and add `target="_blank" rel="noopener"` to external links.

The FIU logo files in `assets/img/logos/` are lab-supplied official assets. Do not redraw or modify them.

Keep homepage Recent News concise and image-free, with highlights from the latest six to eight months. Add full stories to `news.html` under their year, give each a stable anchor, and link the homepage headline to that story. Preserve older stories in the archive. News dates describe the update; specify event dates in the text when they differ.
