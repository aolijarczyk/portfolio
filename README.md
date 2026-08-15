# olijarczyk.com — portfolio site

Static site. Plain HTML, CSS, and vanilla JavaScript. No build step. No framework.

## Folder structure

```
site/
├── index.html          Home (Sheet 1 of 5)
├── projects.html       Projects (Sheet 2)
├── prints.html         3D print library with live viewer (Sheet 3)
├── resume.html         Resume + PDF download (Sheet 4)
├── contact.html        Contact (Sheet 5)
├── css/style.css       All styles
├── js/models-list.js   Model registry — edit this to add parts
├── js/viewer.js        three.js STL viewer (no edits needed)
├── models/             STL files
├── reports/            Project report PDFs (student ID removed for the web)
├── resume/             Resume PDF (phone number removed for the web)
├── favicon.svg         Browser tab icon
├── CNAME               Custom domain for GitHub Pages (olijarczyk.com)
└── .nojekyll           Tells GitHub Pages to skip Jekyll processing
```

## Preview the site on your computer

The 3D viewer loads STL files over HTTP. A double-clicked HTML file does not
give the viewer HTTP access. Start a small local server first (Windows):

1. Open this folder in File Explorer.
2. Click the address bar, type `cmd`, and press Enter.
3. Run: `py -m http.server 8000` (or `python -m http.server 8000`).
4. Open http://localhost:8000 in a browser.
5. After you edit files, refresh with Ctrl+F5 to skip the browser cache.

## Add a 3D model

1. Export the part as STL, in millimeters.
2. Rename the file: all lowercase, dashes instead of spaces.
   Example: `Main AssemblyV2.stl` -> `main-assembly-v2.stl`
3. Copy the file into the `models/` folder.
4. Add one entry to `js/models-list.js`. The comments in that file show the format.

Two rules prevent broken models:

- The `file` value in `js/models-list.js` must match the real file name
  exactly, including capital letters. GitHub Pages is case-sensitive.
- Do not use spaces in file names.

Both current models (the UAV capstone assembly and the stand) are already
in `models/`, with descriptions set in `js/models-list.js`. Edit the
descriptions there if you want different wording.

## Edit content

- Page text lives in the five HTML files.
- The nav bar is repeated in each HTML file. If you change a link, change all five files.
- **Resume PDF**: `resume/Andrew-Olijarczyk-Resume.pdf` is your uploaded resume
  with the phone number removed. To update the resume, replace the file and keep
  the same file name. The original file was not changed.
- **Project reports**: `reports/` holds the two PDFs linked from the Projects
  page. Your RIN (student ID) was removed from both web copies. The original
  files were not changed.
- **GitHub and LinkedIn**: `contact.html` contains two ready-made cards inside an
  HTML comment. Fill in your URLs, then delete the `<!--` and `-->` markers.
- **Rev number**: the hero title block and footers show "Rev 1.0". Bump the
  number when you make a major update, if you like the convention.

## Publish on GitHub Pages

1. Create a GitHub account, if you do not have one.
2. Create a new public repository named `olijarczyk.github.io`.
3. Upload everything in this folder, including `CNAME` and `.nojekyll`.
4. Open the repository: Settings → Pages. Set Source = Deploy from a branch,
   Branch = main, folder = / (root).
5. In the same Pages screen, confirm the custom domain shows `olijarczyk.com`.
6. Log in to your domain registrar. Add these DNS records:
   - `A` record, host `@`, value `185.199.108.153`
   - `A` record, host `@`, value `185.199.109.153`
   - `A` record, host `@`, value `185.199.110.153`
   - `A` record, host `@`, value `185.199.111.153`
   - `CNAME` record, host `www`, value `olijarczyk.github.io`
7. Wait up to one hour. Back in Settings → Pages, turn on "Enforce HTTPS"
   once the certificate is ready.

## Checklist before going live

- [ ] Check the two model descriptions in `js/models-list.js`
- [ ] Add GitHub and LinkedIn links in `contact.html`
- [ ] Confirm the resume PDF is the version you want public (the PDF still
      shows the old Gmail address until you replace the file)
- [ ] Read every page once in the browser
