# QTM Lab website

Static website of the Quantum Technologies and Metamaterials Lab (QTM Lab) at Florida International University.

- Live site: https://krasnokqtm.com
- Open quantum-computing course: https://github.com/AlexKrasnok/quantum-computing-lectures

## Pages

- `index.html`: home page with the lab statement, recent news, the journal-cover slideshow, and links to the main sections
- `research.html` and `research-*.html`: research directions and key papers
- `publications.html`: journal articles by year, preprints, commentary, books, and journal covers
- `people.html`: lab members, alumni, and collaborators
- `prof-krasnok.html`: profile of Prof. Krasnok
- `teaching.html`: courses, the open lecture course, the textbook, and recorded lectures
- `quantum-fiu.html`: the FIU Quantum Initiative, the on-campus IonQ quantum computer, and quantum events in Florida
- `news.html`: news archive, newest first
- `openings.html`: openings, fellowships, and how to apply
- `facilities.html` and `resources.html`: laboratory equipment and research resources
- `contact.html`: redirect to the contact section of `openings.html`

## Files

- `assets/css/site.css`: styles
- `assets/js/bloch.js`: Bloch-sphere animation on the home page
- `assets/js/covers.js`: journal-cover slideshow
- `assets/fonts/`: EB Garamond and Noto Sans web fonts (SIL Open Font License)
- `assets/img/`: images; most pictures come in AVIF and WebP at two widths
- `assets/docs/`: two-page academic resume (PDF)

## Deployment

A push to `main` runs `.github/workflows/static.yml`. The workflow collects the public files with `.github/scripts/prepare_site.py` and publishes them through GitHub Pages. `CNAME` keeps the custom domain `krasnokqtm.com`.

To preview the site, run `python -m http.server 8765` in this folder and open `http://localhost:8765`.

## Images

Photographs of the FIU campus and Miami come from Wikimedia Commons under the licenses named in their captions. The FIU logo files are official assets; do not redraw or modify them. Every meaningful image needs descriptive alternative text.

Only public website files belong in this repository.
