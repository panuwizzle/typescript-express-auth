import { Router } from 'express'
import { listTodo, actionGetTodoByID, actionCreateTodo, actionUpdateTodo, actionDeleteTodo } from '../controllers/todo'

export const todoRouter = Router()

/** List */
todoRouter.get('/', listTodo)

/** Get one */
todoRouter.get('/:id', actionGetTodoByID)

/** Create */
todoRouter.post('/', actionCreateTodo)

/** Update */
todoRouter.patch('/', actionUpdateTodo)

/** Delete */
todoRouter.delete('/', actionDeleteTodo)