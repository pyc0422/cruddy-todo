$(() => {

  // View ////////////////////////////////////////////////////////////////////////

  var template = _.template(`
    <li data-id="<%=id%>" class="todo">
      <span><h3><%=text%></h4><em><h5><em>- <em><%=createTime%></h5></span>
      <button data-action="edit">edit</button>
      <button data-action="done">&#x2714;</button>
    </li>
  `);

  var renderTodo = (todo) => {
    return template(todo);
  };

  var addTodo = (todo) => {
    console.log('addtodo todo: ', todo);
    $('#todos').append(renderTodo(todo));
  };

  var changeTodo = (id, todo) => {
    $(`#todos [data-id=${id}]`).replaceWith(renderTodo(todo));
  };

  var removeTodo = (id) => {
    $(`#todos [data-id=${id}]`).remove();
  };

  var addAllTodos = (todos) => {
    console.log('addAllTodos: ', todos);
    _.each(todos, (todo) => {
      addTodo(todo);
    });
  };

  // Controller //////////////////////////////////////////////////////////////////

  $('#form button').click( (event) => {
    var text = $('#form input').val().trim();


    if (text) {
      var createTime = new Date().toLocaleString();
      var content = {text, createTime};
      console.log('submit content: ', content);
      Todo.create(content, addTodo);
    }
    $('#form input').val('');
  });

  $('#todos').delegate('button', 'click', (event) => {
    var id = $(event.target.parentNode).data('id');
    if ($(event.target).data('action') === 'edit') {
      Todo.readOne(id, (todo) => {
        var updatedText = prompt('Change to?', todo.text);
        if (updatedText !== null && updatedText !== todo.text) {
          Todo.update(id, updatedText, changeTodo.bind(null, id));
        }
      });
    } else {
      Todo.delete(id, removeTodo.bind(null, id));
    }
  });

  // Initialization //////////////////////////////////////////////////////////////

  console.log('CRUDdy Todo client is running the browser');
  Todo.readAll(addAllTodos);

});
