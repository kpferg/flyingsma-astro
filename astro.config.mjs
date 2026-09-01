// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

/**
 * Legacy and convenience URLs, mapped to their current home.
 *
 * Declared up here rather than inline so the sitemap filter below can read the
 * keys and keep these out of the sitemap — they are real pages in the build
 * output, but they are redirect stubs, not destinations.
 */
const redirects = {
  // Flight Training Center / Fly section redirects
  '/pages/redbird_simulator.html': '/flight-training-center',
  '/pages/our_instructors.html': '/flight-training-center#instructors',
  '/pages/flight_training.html': '/flight-training-center',
  '/pages/our_fleet.html': '/flight-training-center',
  '/pages/pricing.html': '/flight-training-center',
  '/pages/accelerated_courses.html': '/flight-training-center',
  '/pages/pilot_accomplishments.html': '/flight-training-center',
  '/fly': '/flight-training-center',

  // Legacy /flight-school URLs → new /flight-training-center URLs
  '/flight-school': '/flight-training-center',
  '/flight-school/contact': '/flight-training-center/contact',
  '/flight-school/multi-engine': '/flight-training-center/multi-engine',
  '/flight-school/scenic-flights': '/flight-training-center/scenic-flights',
  '/flight-school/news': '/flight-training-center/news',

  // Corporate Arrivals redirects
  '/pages/airport_FBO.html': '/fbo-services/corporate-arrivals',
  '/pages/FBO_Service_Fees.html': '/fbo-services/corporate-arrivals#fees',
  '/corporate-arrivals': '/fbo-services/corporate-arrivals',

  // Scenic Flights redirects
  '/pages/scenic_flights.html': '/flight-training-center/scenic-flights',
  '/pages/discovery_flights.html': '/flight-training-center/scenic-flights',
  '/scenic-flights': '/flight-training-center/scenic-flights',

  // Home / Contact redirects
  '/pages/contact_us.html': '/flight-training-center/contact',
  '/pages/events.html': '/flight-training-center/news',

  // Pre-split section indexes. These have no page of their own since the
  // site was divided into /fbo-services and /flight-training-center, but
  // Google still has /news indexed and /contact is a URL people type.
  // Both point at the flight training side: the indexed /news content is
  // the flight training feed, and the FBO news collection is empty.
  '/news': '/flight-training-center/news',
  '/contact': '/flight-training-center/contact',

  // Maintenance redirects
  '/pages/maintenance.html': '/fbo-services/maintenance',
  '/aircraft-maintenance': '/fbo-services/maintenance',

  // Multi-engine redirects
  '/multi-engine': '/flight-training-center/multi-engine',
};

/**
 * Program pages that are written but deliberately not exposed yet: nothing on
 * the site links to them and they are not uploaded to production. They must
 * stay out of the sitemap too, or we would be handing Google the very pages we
 * are keeping unlisted. Delete entries here when a page goes live.
 */
const unlistedPages = [
  '/flight-training-center/private-pilot',
  '/flight-training-center/instrument-rating',
  '/flight-training-center/commercial',
  '/flight-training-center/tailwheel',
  '/flight-training-center/backcountry',
];

const redirectPaths = Object.keys(redirects).map((from) => from.replace(/\/$/, ''));

// https://astro.build/config
export default defineConfig({
  site: 'https://www.flyingsma.com',
  vite: {
    plugins: [tailwindcss()]
  },
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      // A sitemap should list canonical destinations only, so drop both the
      // redirect stubs and the pages we are deliberately not exposing.
      filter: (page) => {
        const path = new URL(page).pathname.replace(/\/$/, '');
        return !unlistedPages.includes(path) && !redirectPaths.includes(path);
      },
    }),
  ],
  redirects,
});
