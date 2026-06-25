import jq from 'jquery';

(globalThis as any).$ = jq;
(globalThis as any).jQuery = jq;

if (!(globalThis as any).__externalLibsLoaded) {
  import('../Semantic-UI-2.5.0/dist/semantic.min.js');
  import ("../node_modules/semantic-ui-calendar/dist/calendar.js");
  import ("../node_modules/prismjs/components/prism-core.js");
  (globalThis as any).__externalLibsLoaded = true;
}

