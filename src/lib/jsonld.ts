export function personSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Anish Sahoo',
    url: 'https://asahoo.dev',
    jobTitle: 'Backend / AI/ML engineer',
    sameAs: [
      'https://github.com/anish-sahoo',
      'https://linkedin.com/in/anish-sahoo',
    ],
  };
}

export function blogPostingSchema(opts: {
  title: string;
  description: string;
  publishedAt: Date;
  updatedAt?: Date;
  slug: string;
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: opts.title,
    description: opts.description,
    datePublished: opts.publishedAt.toISOString().slice(0, 10),
    dateModified: (opts.updatedAt ?? opts.publishedAt).toISOString().slice(0, 10),
    author: {
      '@type': 'Person',
      name: 'Anish Sahoo',
      url: 'https://asahoo.dev',
    },
    url: `https://asahoo.dev/notes/${opts.slug}`,
  };
}
