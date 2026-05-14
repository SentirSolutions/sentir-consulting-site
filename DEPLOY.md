# Publishing sentir-solutions.com — Step by Step

Total time: about 30 minutes. Cost: $0/month.

## Why two repos?

Your company documents (frameworks, client files, internal ops) live in a private repo.
The website lives in a separate public repo — GitHub Pages requires public repos on free accounts,
and you don't want internal documents accidentally exposed.

```
Sentir_Consulting/      ← private repo, company docs only
  00_Company_Foundation/
  01_Frameworks/
  ...
  website/              ← copy this folder's contents into the public repo below

sentir-solutions-site/ ← public repo, GitHub Pages serves this
  index.html
  how-we-help.html
  mission.html
  about.html
  opportunity.html
  css/
  google-apps-script.gs
```

---

## Part 1 — Set up Google Sheets lead capture (10 min)

Do this first so the calculator is wired before the site goes live.

1. Go to [sheets.google.com](https://sheets.google.com) → create a new spreadsheet named **Sentir Leads**
2. In the spreadsheet: **Extensions → Apps Script**
3. Delete any existing code, paste the entire contents of `google-apps-script.gs`
4. Click **Save** (Ctrl+S)
5. Click **Deploy → New Deployment**
6. Click the gear icon → **Web App**
7. Execute as: **Me** · Who has access: **Anyone**
8. Click **Deploy** and authorize Google when prompted
9. Copy the **Web App URL**
10. Open `opportunity.html`, find this line:
    ```
    const SHEETS_ENDPOINT = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
    ```
    Replace the placeholder with your URL (keep the quotes) and save.

To get email notifications for each lead: open `google-apps-script.gs`, find the
commented `MailApp.sendEmail` block, uncomment it, fill in your email, and redeploy.

---

## Part 2 — Create the public website repo (5 min)

### GitHub

1. Go to [github.com](https://github.com) → **+ → New repository**
2. Name: `sentir-solutions-site`
3. Visibility: **Public**
4. Click **Create repository**

### GitLab (also free, same outcome)

1. Go to [gitlab.com](https://gitlab.com) → **New project → Create blank project**
2. Name: `sentir-solutions-site` · Visibility: **Public**
3. Add a `.gitlab-ci.yml` file (see end of this guide)

---

## Part 3 — Push the website files (5 min)

Copy the contents of the `website/` folder into a fresh local folder, then push:

```bash
# In a new folder (not inside your private Sentir_Consulting repo)
mkdir sentir-solutions-site
cd sentir-solutions-site

# Copy all files from website/ here, then:
git init
git add .
git commit -m "Launch sentir-solutions.com"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sentir-solutions-site.git
git push -u origin main
```

**Enable GitHub Pages:**
1. Repository → **Settings → Pages**
2. Source: **Deploy from a branch** · Branch: **main** / **/ (root)**
3. Click **Save**

**Add custom domain:**
1. Still in Settings → Pages → **Custom domain**
2. Enter: `sentir-solutions.com`
3. Click **Save** · Check **Enforce HTTPS**

---

## Part 4 — Point GoDaddy DNS to GitHub Pages (10 min + propagation)

Log into GoDaddy → **My Products → DNS** for `sentir-solutions.com`.

Delete any existing A records for `@`, then add these four:

| Type | Name | Value           | TTL |
|------|------|-----------------|-----|
| A    | @    | 185.199.108.153 | 600 |
| A    | @    | 185.199.109.153 | 600 |
| A    | @    | 185.199.110.153 | 600 |
| A    | @    | 185.199.111.153 | 600 |

Add a CNAME for www:

| Type  | Name | Value                     | TTL |
|-------|------|---------------------------|-----|
| CNAME | www  | YOUR_USERNAME.github.io   | 600 |

**Timeline:** DNS propagates in 1–4 hours. SSL issues automatically. Site live within 2 hours.

---

## Part 5 — Email forwarding (5 min)

The site links to `tim@sentir-solutions.com`. GoDaddy includes free email forwarding.

1. GoDaddy → **My Products → Email & Office → Add**
2. Choose **Email Forwarding** (free)
3. Create: `tim@sentir-solutions.com` → `tim.hislop@gmail.com`

---

## Updating the site later

Edit files in the `website/` folder of your private repo, copy changes to your
`sentir-solutions-site` folder, then:

```bash
git add -A
git commit -m "Update: [what changed]"
git push
```

GitHub redeploys in under 60 seconds.

---

## GitLab CI file (if using GitLab instead of GitHub)

Create `.gitlab-ci.yml` in the repo root:

```yaml
pages:
  stage: deploy
  script:
    - mkdir -p public
    - cp index.html how-we-help.html mission.html about.html opportunity.html public/
    - cp -r css public/
  artifacts:
    paths:
      - public
  only:
    - main
```

---

## Files in website/

| File | Purpose |
|------|---------|
| `index.html` | Home |
| `how-we-help.html` | Six areas of focus |
| `mission.html` | Mission and workforce covenant |
| `about.html` | About Tim |
| `opportunity.html` | ROI calculator with lead capture |
| `css/styles.css` | Shared design system |
| `google-apps-script.gs` | Lead capture script — deploy to Google Apps Script |
