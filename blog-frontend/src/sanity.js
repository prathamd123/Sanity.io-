import { createClient } from '@sanity/client';

export default createClient({
  projectId: 's0q05stc', // your Sanity project ID
  dataset: 'production', // your dataset
  useCdn: true,          // `false` if you want to ensure fresh data
  apiVersion: '2023-01-01', // use today's date
}); 