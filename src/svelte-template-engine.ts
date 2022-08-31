/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'svelte/register';

export function svelteTemplateEngine(filePath: string, options: unknown, next: any) 
{
  const Component = require(filePath).default;
  let { html, head, css } = Component.render(options);
  if (css.code) 
  {
    head = `${head}<style>${css.code}</style>`;
  }
  next(null, html.replace('%head%', head));
}