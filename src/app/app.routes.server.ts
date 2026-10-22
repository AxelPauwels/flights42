import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'ticketing/reporting',
    renderMode: RenderMode.Client,
  },
  {
    path: 'ticketing/booking/flight-edit/:id',
    renderMode: RenderMode.Prerender,
    // The fallback option applies when a requested parameter value was not prerendered,
    // e.g., a link to flight-edit/17 when only 1, 2, and 3 were prerendered.
    fallback: PrerenderFallback.Server,
    async getPrerenderParams() {
      return [{ id: '1' }, { id: '2' }, { id: '3' }];
    },
  },
  {
    path: 'about',
    renderMode: RenderMode.Prerender,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
