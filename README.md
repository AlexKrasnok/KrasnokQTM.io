# QTM Lab Website

Static website for the Quantum Technologies and Metamaterials Lab at Florida International University.

- Live site: https://krasnokqtm.com
- GitHub repository: https://github.com/AlexKrasnok/KrasnokQTM.io
- Open quantum-computing course: https://github.com/AlexKrasnok/quantum-computing-lectures

## Site Structure

- `index.html` — homepage, featured work, and news
- `research.html` and `research-*.html` — research areas and related publications
- `people.html` — lab members and collaborators
- `prof-krasnok.html` — professional profile
- `publications.html` — selected and recent publications, books, talks, and profile links
- `facilities.html` — laboratory facilities and equipment
- `teaching.html` — courses, the open lecture course, and teaching resources
- `resources.html` — research, software, writing, and FIU resources
- `openings.html` — recruiting and contact information
- `assets/css/styles.css` — shared styles
- `assets/js/main.js` — navigation behavior
- `assets/img/` — deployable logos, portraits, research graphics, covers, funding marks, and equipment images

## Deployment

The site uses static HTML, CSS, and vanilla JavaScript. A push to `main` runs `.github/workflows/static.yml` and publishes the repository through GitHub Pages. The `CNAME` file keeps the custom domain set to `krasnokqtm.com`.

## Content Maintenance

Only public website files belong in the repository. Working documents, downloaded source pages, CV source files, and previous site versions are stored outside the deployment folder.

Use descriptive alternative text for every meaningful image. Keep external publication links on publisher or DOI pages when available, and add `target="_blank" rel="noopener"` to external links.

The FIU logo files in `assets/img/logos/` are lab-supplied official assets. Do not redraw or modify them.
