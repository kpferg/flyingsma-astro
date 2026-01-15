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
    // Flight School / Fly section redirects
    '/pages/redbird_simulator.html': '/flight-school',
    '/pages/our_instructors.html': '/flight-school#instructors',
    '/pages/flight_training.html': '/flight-school',
    '/pages/our_fleet.html': '/flight-school',
    '/pages/pricing.html': '/flight-school',
    '/pages/accelerated_courses.html': '/flight-school',
    '/pages/pilot_accomplishments.html': '/flight-school',
    '/fly': '/flight-school',

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
    '/multi-engine': '/flight-school/multi-engine',
  }
});
