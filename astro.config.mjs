// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.flyingsma.com',
  vite: {
    plugins: [tailwindcss()]
  },
  trailingSlash: 'ignore',
  redirects: {
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
    '/pages/airport_FBO.html': '/services/corporate-arrivals',
    '/pages/FBO_Service_Fees.html': '/services/corporate-arrivals#fees',
    '/corporate-arrivals': '/services/corporate-arrivals',

    // Scenic Flights redirects
    '/pages/scenic_flights.html': '/services/scenic-flights',
    '/pages/discovery_flights.html': '/services/scenic-flights',
    '/scenic-flights': '/services/scenic-flights',

    // Home / Contact redirects
    '/pages/contact_us.html': '/contact',
    '/pages/events.html': '/news',

    // Maintenance redirects
    '/pages/maintenance.html': '/services/maintenance',
    '/aircraft-maintenance': '/services/maintenance',

    // Multi-engine redirects
    '/multi-engine': '/flight-training-center/multi-engine',
  }
});
