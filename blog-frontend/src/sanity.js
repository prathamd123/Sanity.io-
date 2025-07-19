import { createClient } from '@sanity/client';

export default createClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
  dataset: process.env.REACT_APP_SANITY_DATASET,
  useCdn: true, // set to false if you want fresh data every time
  apiVersion: process.env.REACT_APP_SANITY_API_VERSION || '2023-01-01',
});
