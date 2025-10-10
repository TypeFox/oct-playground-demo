# GitHub Actions Workflows

## CI Workflow

The CI workflow (`ci.yml`) ensures the application builds successfully before merging.

### Triggers

- **Push** to `main` or any `feature/**` branch
- **Pull requests** targeting `main`

### Build Matrix

Tests across multiple Node.js versions:
- Node.js 18.x (LTS)
- Node.js 20.x (Current LTS)

### Steps

1. **Checkout code** - Clone the repository
2. **Setup Node.js** - Install specified Node.js version with npm cache
3. **Install dependencies** - Run `npm ci` in app directory (uses workspace)
4. **Build backend** - Compile TypeScript backend to JavaScript
5. **Build frontend** - Build React frontend with Vite
6. **Verify artifacts** - Check that all expected build files exist
7. **Upload artifacts** - Store build outputs for inspection (7 days retention)

### Build Verification

The workflow verifies these artifacts are created:

**Backend:**
- `backend/dist/server.js`
- `backend/dist/discount-rules.js`
- `backend/dist/types.js`

**Frontend:**
- `frontend/dist/index.html`
- `frontend/dist/assets/` (CSS and JS bundles)

### Status Badge

Add to README.md:
```markdown
![CI](https://github.com/TypeFox/oct-playground-demo/workflows/CI/badge.svg)
```

### Local Testing

To test the same build process locally:

```bash
cd app
npm ci
npm run build --workspace=backend
npm run build --workspace=frontend
```

### Troubleshooting

**If CI fails:**

1. Check the workflow run logs on GitHub Actions tab
2. Look for TypeScript compilation errors
3. Verify all dependencies are in package.json
4. Test the build locally with the same Node.js version
5. Ensure package-lock.json is committed

**Common issues:**

- Missing dependencies: Run `npm install` and commit updated package-lock.json
- TypeScript errors: Fix type issues in source code
- Build configuration: Check tsconfig.json and vite.config.ts
