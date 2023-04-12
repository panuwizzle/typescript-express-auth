import { Schema, model, Document } from "mongoose";

export interface ITodo extends Document {
  detail: string;
  isDone?: boolean;
  dateAdd: string;
  dateDone: string;
}

export interface ITodoRequestBody {
  detail: string;
  isDone?: boolean;
}

const todoSchema = new Schema<ITodo>({
  detail: {
    type: String,
    required: true
  },
  isDone: {
    type: Boolean
  },
  dateAdd: {
    type: String
  },
  dateDone: {
    type: String
  }
})
todoSchema.pre('save', async function (next) {
  try {
    this.dateAdd = new Date().toString()

    next();
  } catch (err: any) {
    next(err)
  }
});

export const Todo = model<ITodo>('Todo', todoSchema)

export const listTodo = () => {

}

export const getTodoByID = (id: string) => {

}

export const createTodo = async (todo: ITodoRequestBody) => {
  try {
    const newTodo = new Todo({
      detail: todo.detail,
      isDone: false
    })
    return await newTodo.save()
  } catch (error) {
    throw error
  }
}

export const updateTodo = (id: string, todo: ITodoRequestBody) => {

}

export const deleteTodo = (id: string) => {

}