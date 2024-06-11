const express = require('express');
const cors = require('cors');
const fs = require('fs');
const {v4 : uuidv4} = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors()); // Добавляем CORS middleware

const dbFilePath = './db.json';

// Создаем или загружаем начальные данные, если файла нет
let toDoLists = {};
if (fs.existsSync(dbFilePath)) {
	const data = fs.readFileSync(dbFilePath, 'utf8');
	toDoLists = JSON.parse(data);
} else {
	fs.writeFileSync(dbFilePath, JSON.stringify(toDoLists), 'utf8');
}

// Функция для чтения данных из базы данных
const fetchTodoListsFromDB = () => {
	try {
		if (fs.existsSync(dbFilePath)) {
			const data = fs.readFileSync(dbFilePath, 'utf8');
			toDoLists = JSON.parse(data);
			console.log('Данные обновлены из базы данных.');
		}
	} catch (error) {
		console.error('Ошибка при чтении данных из базы данных:', error);
	}
};

// Устанавливаем интервал для обновления данных каждые 2 секунд
setInterval(fetchTodoListsFromDB, 2000);

// Начальная загрузка данных при запуске сервера
fetchTodoListsFromDB();

// Главная страница
app.get('/', (req, res) => {
	res.send('<h1>Welcome to the ToDoList API</h1>');
});

// Endpoint для получения листов
app.get('/api/todolists', (req, res) => {
	res.json(toDoLists);
});
//Первый Туду Лист
app.get('/api/getFirstToDoListId', (req, res) => {
	const firstToDoListId = Object.values(toDoLists)[0].id;
	res.json({firstToDoListId});
});

//Получение массива Туду Листов c их id
app.get('/api/getToDoListsTitlesWithIdArr', (req, res) => {
	const toDoListsTitleWithId = Object.entries(toDoLists).reduce((acc, [name, info]) => {
		acc[name] = {title : info.title, id : info.id};
		return acc;
	}, {});
	res.json(toDoListsTitleWithId);
});


// Создание нового ToDoList
app.post('/api/postToDoList', (req, res) => {
	const {title} = req.body;
	const id = uuidv4();
	const newTodoList = {
		id,
		title,
		content : [],
	};
	
	toDoLists[title] = newTodoList;
	fs.writeFileSync(dbFilePath, JSON.stringify(toDoLists), 'utf8');
	res.status(201).json(newTodoList);
});


// Получение ToDoList по его идентификатору
app.get('/api/toDoListsById/:id', (req, res) => {
	const {id} = req.params;
	const todoList = Object.values(toDoLists).find(list => list.id === id);
	if ( !todoList) {
		res.status(404).json({error : 'ToDoList not found'});
		return;
	}
	res.json(todoList);
});
// Получение ToDoList по его индексу
app.get('/api/toDoListsByIndex/:index', (req, res) => {
	const {index} = req.params;
	const todoList = Object.values(toDoLists)[index];
	if ( !todoList) {
		res.status(404).json({error : 'ToDoList not found'});
		return;
	}
	res.json(todoList);
});

//Изменение названия листа
app.put('/api/ChangeToDoListTitleById/:id', (req, res) => {
	const {id} = req.params;
	const {title} = req.body;
	
	// Находим нужный список дел по его id
	const foundToDoList = Object.values(toDoLists).find(list => list.id === id);
	
	if ( !foundToDoList) {
		return res.status(404).json({error : 'ToDoList not found!'});
	}
	
	// Обновляем название списка дел
	foundToDoList.title = title;
	
	// Записываем обновленные данные обратно в файл db.json
	fs.writeFileSync(dbFilePath, JSON.stringify(toDoLists), 'utf8');
	
	// Отправляем ответ об успешном обновлении названия списка дел
	return res.status(200).json({message : 'ToDoListTitle changed successfully!'});
});


// Удаление ToDoList по его идентификатору
app.delete('/api/DeleteToDoListsById/:id', (req, res) => {
	const {id} = req.params;
	
	// Находим индекс списка в массиве todoLists
	const listIndex = Object.values(toDoLists).findIndex(list => list.id === id);
	
	// Проверяем, был ли найден список
	if (listIndex === -1) {
		res.status(404).json({error : 'ToDoList not found'});
		return;
	}
	
	// Удаляем список из массива todoLists по индексу
	delete toDoLists[Object.keys(toDoLists)[listIndex]];
	
	// Сохраняем обновленные данные в файл db.json
	fs.writeFileSync(dbFilePath, JSON.stringify(toDoLists), 'utf8');
	
	res.status(200).json({message : 'ToDoList deleted successfully'});
});


//Добавление таска
app.post('/api/todolists/:id/', (req, res) => {
	const {id} = req.params;
	const {ToDoContent, status, id : taskId} = req.body;
	
	const todoList = Object.values(toDoLists).find((list) => list.id === id);
	if ( !todoList) {
		res.status(404).json({error : 'ToDoList not found'});
		return;
	}
	
	const newTask = {
		id : taskId,
		ToDoContent : ToDoContent,
		status : status,
	};
	
	todoList.content.push(newTask);
	fs.writeFileSync(dbFilePath, JSON.stringify(toDoLists), 'utf8');
	
	res.status(201).json(newTask);
});

//Изменения статуса и контента
app.put('/api/todolists/:todo_list_id/:task_id', (req, res) => {
	const {todo_list_id, task_id} = req.params;
	const {status, newContent} = req.body;
	const todoList = Object.values(toDoLists).find((list) => list.id === todo_list_id);
	if ( !todoList) {
		res.status(404).json({error : 'List not found'});
		return;
	}
	const task = todoList.content.find((task) => task.id === task_id);
	if ( !task) {
		res.status(404).json({error : 'Task not found'});
		return;
	}
	if (status) {
		// Если передан статус, обновляем его
		task.status = status;
	}
	if (newContent) {
		// Если передан новый текст задачи, обновляем его
		task.ToDoContent = newContent;
	}
	fs.writeFileSync(dbFilePath, JSON.stringify(toDoLists), 'utf8');
	res.status(200).json(task);
});
//Удаление таска
app.delete('/api/todolists/:todo_list_id/:task_id', (req, res) => {
	const {todo_list_id, task_id} = req.params;
	const todoList = Object.values(toDoLists).find((list) => list.id === todo_list_id);
	if ( !todoList) {
		res.status(404).json({error : 'List not found'});
		return;
	}
	
	const taskIndex = todoList.content.findIndex((task) => task.id === task_id);
	if (taskIndex === -1) {
		res.status(404).json({error : 'Task not found'});
		return;
	}
	
	todoList.content.splice(taskIndex, 1);
	fs.writeFileSync(dbFilePath, JSON.stringify(toDoLists), 'utf8');
	
	res.status(200).json({message : 'Task deleted successfully'});
});
// Запуск сервера


app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

