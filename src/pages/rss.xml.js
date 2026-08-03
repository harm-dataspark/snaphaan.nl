import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const teksten = (await getCollection('teksten', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'Harm',
    description: 'Gedichten, gedachten en verhalen van Harm Snaphaan.',
    site: context.site,
    items: teksten.map((tekst) => ({
      title: tekst.data.title,
      description: tekst.data.description,
      pubDate: tekst.data.date,
      link: `/teksten/${tekst.id}/`,
    })),
  });
}
