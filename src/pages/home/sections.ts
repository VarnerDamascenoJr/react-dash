export const homeSectionIds = {
  events: 'events',
  exports: 'exports',
  funnel: 'funnel',
  overview: 'overview',
  settings: 'settings',
  survival: 'survival',
  windows: 'windows',
} as const;

export const homeSectionHrefs = {
  events: `/#${homeSectionIds.events}`,
  exports: `/#${homeSectionIds.exports}`,
  funnel: `/#${homeSectionIds.funnel}`,
  overview: '/',
  settings: `/#${homeSectionIds.settings}`,
  survival: `/#${homeSectionIds.survival}`,
  windows: `/#${homeSectionIds.windows}`,
} as const;
