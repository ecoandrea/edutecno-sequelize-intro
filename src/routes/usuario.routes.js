import { Router } from "express";
import { createUser, deletUser, getActiveUserById, getAllActiveUsers,  getUserByIdIncludeDeleted, getUsersByFilters, physicDeletUser, restoreUser, updateUser } from "../controllers/usuario.controller.js";


const router = Router()

router.post('/usuario', createUser);
router.get('/usuario', getAllActiveUsers);
router.get('/usuario/filter', getUsersByFilters);
router.get('/usuario/:id', getActiveUserById);
router.put('/usuario/:id', updateUser)
router.delete('/usuario/:id', deletUser);
router.patch('/usuario/:id', restoreUser)


router.get('/admin/usuario/:id', getUserByIdIncludeDeleted)
router.delete('/admin/usuario/:id', physicDeletUser)

export default router;