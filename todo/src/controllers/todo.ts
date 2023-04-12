import { Request, Response } from 'express'
import { ITodoRequestBody, createTodo } from '../models/todo'

export const listTodo = async (req: Request, res: Response) => {
  res.send('list Todo')
}

export const actionGetTodoByID = async (req: Request, res: Response) => {
  res.send('get Todo' + req.params.id)
}

export const actionCreateTodo = async (req: Request<{}, {}, ITodoRequestBody>, res: Response) => {
  const { detail } = req.body
  console.log(await createTodo({ detail }))
  res.send({ ok: 'ok' })
}

export const actionUpdateTodo = async (req: Request, res: Response) => {
  res.send('update Todo')
}

export const actionDeleteTodo = async (req: Request, res: Response) => {
  res.send('delete Todo')
}
