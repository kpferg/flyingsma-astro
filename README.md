# Southern Maine Aviation Website

Astro-based website for Southern Maine Aviation, featuring separate sub-sites for Flight Training and FBO Services.

## Project Structure

```text
/
├── public/
│   └── images/          # Static images (hero, instructors, fleet, etc.)
├── src/
│   ├── components/      # Reusable Astro components
│   │   ├── common/      # Header, Footer, Analytics, etc.
│   │   ├── sections/    # Page sections (News, Instructors, Fleet, FAQ)
│   │   ├── seo/         # Schema.org components
│   │   └── ui/          # UI components (cards, buttons, etc.)
│   ├── content/         # Content collections (FAQ, services)
│   ├── data/            # JSON data files (site config, services, etc.)
│   ├── layouts/         # Page layouts (Base, FlightSchool, FBO)
│   ├── pages/           # Route pages
│   │   ├── flight-school/   # Flight training sub-site
│   │   └── services/        # FBO sub-site
│   └── styles/          # Global CSS
└── package.json
```

## Commands

All commands are run from the root of the project:

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Installs dependencies                        |
| `npm run dev`     | Starts local dev server at `localhost:4321`  |
| `npm run build`   | Build your production site to `./dist/`      |
| `npm run preview` | Preview your build locally, before deploying |

## Analytics

The site uses Google Analytics 4 and Google Tag Manager for tracking.

- **Google Tag Manager ID**: `GTM-MBBK54R`
- **Google Analytics 4 ID**: `G-07ZFNQB859`

### Custom Events

#### Subsite Selection Tracking

The main landing page tracks which sub-site users click into (Flight Training vs FBO Services).

**Event Name**: `subsite_selection`

| Parameter        | Values                              |
| :--------------- | :---------------------------------- |
| `event_category` | `Navigation`                        |
| `event_label`    | `Flight Training` or `FBO Services` |

**To view in Google Analytics:**

1. Go to **Reports > Engagement > Events**
2. Click on `subsite_selection` in the event list
3. Add a secondary dimension of `Event label` to see the breakdown between "Flight Training" and "FBO Services"

Alternatively, use **Explore** for custom reports:

1. Go to **Explore > Blank**
2. Add dimension: `Event name`, `Event label`
3. Add metric: `Event count`
4. Filter by `Event name` = `subsite_selection`

## Content Management

Dynamic content (instructors, fleet, news) is fetched from Contentful CMS at runtime (client-side).

- **Space ID**: `gf6i9onr9mz0`
- **Content Types**: `instructor`, `aircraft`, `news-events`, `fuelPrices`

## Layouts

- **BaseLayout**: Used for the main landing page
- **FlightSchoolLayout**: Used for `/flight-school/*` pages (blue theme)
- **FBOLayout**: Used for `/services/*` pages (slate theme)
