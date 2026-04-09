import { getSignedUrl } from './services/gcs.service.js';
import logger from './utils/logger.js';
(async () => {
  try {
    const url = await getSignedUrl('generated_images/aisa_magic_edit_1775645841172.png');
    console.log('SIGNED URL:', url);
  } catch (err) {
    console.error('ERROR:', err);
  }
})();