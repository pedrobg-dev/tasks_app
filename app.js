$(function () {

    let edit = false;
    console.log('JQuery is working');
    $('#task-result').hide();
    fecthTasks();

    $('#search').keyup(function (e) {
        let search = $('#search').val();
        $.ajax({
            type: "post",
            url: "task-search.php",
            data: { search },
            success: function (response) {
                let tasks = JSON.parse(response);
                let template = '';
                tasks.forEach(task => {
                    template += `<li>
                        ${task.name}
                    </li>`;
                });

                $('#container').html(template);
            }
        });
    });

    $('#task-form').submit(function (e) {
        const postDate = {
            name: $('#name').val(),
            description: $('#description').val(),
            id: $('#taskId').val()
        };

        let url = edit === false ? 'task-add.php' : 'task-edit.php';        
        $.post(url, postDate, function (response) {
            console.log(response);
            fecthTasks();
            $('#task-form').trigger('reset');
        })
        e.preventDefault();
    });

    $(document).on('click', '.task-delete', function () {
        if (confirm('Are you sure you want to delete it?')) {
            let element = $(this)[0].parentElement.parentElement;
            let id = $(element).attr('taskId');
            $.post('task-delete.php', { id }, function (response) {
                fecthTasks();
            });
        }
    });

    $(document).on('click', '.task-item', function(response) {
        let element = $(this)[0].parentElement.parentElement;
        let id = $(element).attr('taskId');
        $.post('task-single.php', {id}, function(response){
            const task= JSON.parse(response);
            $('#name').val(task.name);
            $('#description').val(task.description);
            $('#taskId').val(task.id);
            edit = true;
        });
    })

    function fecthTasks() {
        $.ajax({
            url: 'task-list.php',
            type: 'GET',
            success: function (response) {
                let tasks = JSON.parse(response);
                let template = '';
                tasks.forEach(task => {
                    template += `
                        <tr taskId="${task.id}">
                            <td>${task.id}</td>
                            <td>${task.name} 
                                <a href="#" class="task-item"><svg class="float-end" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-edit" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="#00abfb" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M9 7h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
                                <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                                <line x1="16" y1="5" x2="19" y2="8" />
                              </svg></a>
                            </td>
                            <td>${task.description}</td>
                            <td>
                                <buttton class="task-delete btn btn-danger">DELETE</buttton>
                            </td>
                        </tr>
                    `;
                });
                $('#tasks').html(template);
            }
        });
    }
});