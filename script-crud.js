document.addEventListener('DOMContentLoaded', function () {
    const addTaskButton = document.querySelector('.app__button--add-task');
    const formAddTask = document.querySelector('.app__form-add-task');
    const taskList = document.querySelector('.app__section-task-list');
    const textarea = document.querySelector('.app__form-textarea');
    const restartButton = document.querySelector('.app__button--restart-list');

    // Recuperar tarefas salvas no armazenamento local ao carregar a página
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    for (const taskDescription of savedTasks) {
        createTaskElement(taskDescription);
    }

    addTaskButton.addEventListener('click', function () {
        formAddTask.classList.remove('hidden');
        textarea.focus();
    });

    const cancelButton = document.querySelector('.app__form-footer__button--cancel');
    cancelButton.addEventListener('click', function () {
        formAddTask.classList.add('hidden');
        textarea.value = '';
    });

    const confirmButton = document.querySelector('.app__form-footer__button--confirm');
    confirmButton.addEventListener('click', function () {
        const taskDescription = textarea.value.trim();

        if (taskDescription !== '') {
            createTaskElement(taskDescription);

            // Adicionar a tarefa à lista e salvar no armazenamento local
            saveTasks();
        }
    });

    // Função para criar um elemento de tarefa
    function createTaskElement(taskDescription) {
        const taskItem = document.createElement('li');
        const taskContent = document.createElement('div');
        taskContent.textContent = taskDescription;
        taskItem.appendChild(taskContent);
    
        const completeButton = document.createElement('button');
        completeButton.textContent = 'Tarefa concluída';
        completeButton.addEventListener('click', function () {
            // Marcar a tarefa como concluída
            taskItem.classList.toggle('completed');
            // Esconder botões "Tarefa concluída" e "Editar" quando a tarefa for concluída
            completeButton.style.display = 'none';
            editButton.style.display = 'none';
            // Exibir mensagem
            alert('Legal! Você concluiu uma tarefa.');
        });
        taskItem.appendChild(completeButton);
    
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.addEventListener('click', function () {
            const currentDescription = taskContent.textContent;
            const newDescription = prompt('Editar tarefa:', currentDescription);
    
            if (newDescription !== null && newDescription !== '') {
                taskContent.textContent = newDescription;
                saveTasks();
            }
        });
        taskItem.appendChild(editButton);
    
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.addEventListener('click', function () {
            taskList.removeChild(taskItem);
            saveTasks();
        });
        taskItem.appendChild(deleteButton);
    
        taskList.appendChild(taskItem);
        textarea.value = '';
        formAddTask.classList.add('hidden');
    }
    

    // Função para salvar as tarefas no armazenamento local
    function saveTasks() {
        const tasks = Array.from(taskList.children).map(taskItem => {
            return taskItem.firstChild.textContent;
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    // Get the elements
    

    // Event listener for the "Recomeçar lista" button
    restartButton.addEventListener('click', function () {
        // Show confirmation alert
        const confirmed = confirm('Tem certeza que deseja recomeçar sua lista de tarefas?');
    
        // If user clicks "OK" (true), clear the task list
        if (confirmed) {
            taskList.innerHTML = '';
            // Save the empty task list
            saveTasks();
        }
        // If user clicks "Cancel" (false), do nothing
    });
});
