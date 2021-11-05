const express = require('express');
const {v4: uuidv4} = require('uuid')
const app = express();

app.use(express.json());

const users = [];

function checkExistsUserAccount(req, res, next){
  const {username} = req.headers;

  const user = users.find(user => user.username === username);

  if(!user){
    return res.status(401).json({error:'User not exists!'});
  }

  req.username = user;

  next();
}

app.post('/users', (req,res) => {
  const {name,username} = req.body;

  const userAlreadyExists = users.some((user) => user.username === username);

  if(userAlreadyExists){
    return res.status(401).json({error:'User already exists'});
  }

  users.push({
    name,
    username,
    id: uuidv4(),
    todos:[]
  });

  return res.json({message:'Account created!'});
});

app.get('/todos', checkExistsUserAccount, (req,res) => {
  const {username} = req;

  return res.json(username.todos);
});

app.post('/todos', checkExistsUserAccount, (req,res) => {
  const {username} = req;

  const tarefa = req.body;

  const todosCreate = {
    id:uuidv4(),
    tarefa
  }
 
  username.todos.push(todosCreate)

  return res.json(username.todos)

});

app.put('/todos/:id', checkExistsUserAccount, (req,res) => {
  const {username} = req;
  const {id} = req.params;

  const {tarefa} = req.body;

  let tarefaUpdate = username.todos.findIndex((tarefa) => tarefa.id === id);

  username.todos[tarefaUpdate].tarefa = tarefa

  return res.json(username.todos);
});

app.listen(3333);