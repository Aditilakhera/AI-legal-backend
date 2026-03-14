import express from 'express';
import * as knowledgeController from '../controllers/knowledge.controller.js';
import uploadMiddleware from '../middlewares/upload.middleware.js';

const router = express.Router();

router.post('/upload', uploadMiddleware, knowledgeController.uploadDocument);
router.post('/upload-url', knowledgeController.uploadUrl);
router.get('/documents', knowledgeController.getDocuments);
router.get('/list', knowledgeController.getKnowledgeList);
router.post('/reindex/:id', knowledgeController.reindexDocument);
router.get('/download/:id', knowledgeController.downloadDocument);
router.delete('/:id', knowledgeController.deleteDocument);
router.delete('/delete/:id', knowledgeController.deleteDocument);

// Knowledge Source (Website) Management
router.get('/sources', knowledgeController.getKnowledgeSources);
router.post('/recrawl', knowledgeController.recrawlSource);
router.post('/recrawl/:id', (req, res) => {
    req.body.id = req.params.id;
    knowledgeController.recrawlSource(req, res);
});
router.patch('/sources/:id', knowledgeController.updateSourceStatus);
router.delete('/sources/:id', knowledgeController.deleteKnowledgeSource);

export default router;
