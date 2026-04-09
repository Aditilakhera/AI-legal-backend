import 'dotenv/config';
import { getSignedUrl } from './services/gcs.service.js';
async function test() {
    try {
        const url = await getSignedUrl('generated_images/aisa_magic_edit_1775645841172.png');
        console.log('MANUAL V4 SIGNED URL WITH DOTENV:', url);
    } catch(e) {
        console.error('ERROR:', e.message);
    }
}
test();