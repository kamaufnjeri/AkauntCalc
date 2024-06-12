import express from 'express';
import CompanyControllers from '../controllers/CompanyControllers';

const router = express.Router();

const controller = new CompanyControllers();

router.post('/', controller.createCompany);
router.put('/:id', controller.updateCompany);
router.get('/:id', controller.getCompany);
router.post('/:id/invitation', controller.sentInvitation);
router.post('/invitation/:token', controller.acceptInvitation);
router.delete('/:id', controller.deleteCompany);

export default router;