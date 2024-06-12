import express from 'express';
import UserControllers from '../controllers/UserControllers';

const router = express.Router();

const controller = new UserControllers();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/', controller.getUser);
router.put('/', controller.updateUser);
router.delete('/', controller.deleteUser);
router.get('/:companyId', controller.selectCompany);
router.put('/:token', controller.verifyUserEmail);
router.post('/forgotpassword', controller.forgotPassWord);
router.put('/resetpassword/:token', controller.resetPassword);

export default router;