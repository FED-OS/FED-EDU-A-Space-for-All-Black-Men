# Publish Velvet Form with GitHub Pages

## 1. Create the repository

1. Go to [github.com/new](https://github.com/new).
2. Create a new repository named `velvet-form` (or any name you prefer).
3. Keep it public if you are using GitHub Free.
4. Do not add a README, `.gitignore`, or license during creation.

## 2. Upload this project

Upload the contents of this folder to the repository. Make sure the hidden `.github` folder is included; it contains the deployment workflow.

You can upload through the GitHub website by selecting **Add file → Upload files**, dragging in the project files, and committing to the `main` branch.

## 3. Enable Pages deployment

After the first upload:

1. Open the repository's **Settings → Pages**.
2. Under **Build and deployment**, choose **GitHub Actions** as the source.
3. Open the **Actions** tab and wait for **Deploy to GitHub Pages** to finish.

## 4. Open your site

Your URL will be:

```text
https://YOUR-GITHUB-USERNAME.github.io/REPOSITORY-NAME/
```

The workflow automatically adjusts the Vite base path for project-page URLs.

## Important upload note

Upload the source project, not the Manus preview link. Include `package.json`, `pnpm-lock.yaml`, `client/`, `shared/`, `vite.config.ts`, and `.github/workflows/deploy-pages.yml`.
