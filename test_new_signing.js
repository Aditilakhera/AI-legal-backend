import { getSignedUrl } from './services/gcs.service.js';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    try {
        const url = await getSignedUrl('generated_images/aisa_magic_edit_1775645841172.png');
        console.log('Generated URL:', url);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
test();