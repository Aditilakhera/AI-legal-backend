import { getSignedUrl } from './services/gcs.service.js';
(async () => {
    try {
        const url = await getSignedUrl('generated_images/aisa_magic_edit_1775645841172.png');
        console.log('URL:', url);
    } catch (e) {
        console.error('OUTER ERROR:', e);
    }
})();