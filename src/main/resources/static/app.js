$(async function () {
    await getTableWithUsers();
    getDefaultModal();
    getActiveUserInfo();
    createUser();
    getNewUserForm()
})

// rest into users

const userFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    listUsers: async () => await fetch('rest'),
    createUser: async (user) => await fetch('rest', {
        method: 'POST',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    findOneUser: async (id) => await fetch(`rest/${id}`),
    getPrincipalInfo: async () => await fetch(`rest/principal`),
    updateUser: async (user, id) => await fetch(`rest/${id}`, {
        method: 'PUT',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    deleteUser: async (id) => await fetch(`rest/${id}`, {method: 'DELETE',
            headers: userFetchService.head})
}

async function getActiveUserInfo() {
    let headRole = $('#headRole')


    let principal = await userFetchService.getPrincipalInfo();
    let user = principal.json();
    user.then(user => {
        let userInfoFilling = `
       <h6> <b> ${user.email}</b> with roles: ${user.rolesView}</h6>
    `
        headRole.append(userInfoFilling)
    })
}

//
async function getTableWithUsers() {
    let table = $('#tableUsers tbody');
    table.empty();

    await userFetchService.listUsers()
        .then(res => res.json())
        .then(users => {
            users.forEach(user => {
                let tableFilling = `$(
                        <tr>
                            <td style='text-align: center'>${user.id}</td>
                            <td style='text-align: center'>${user.name}</td>
                            <td style='text-align: center'>${user.lastname}</td>
                            <td style='text-align: center'>${user.age}</td>
                            <td style='text-align: center'>${user.email}</td>
                            <td style='text-align: center'>${user.password}</td>
                            <td style='text-align: center'>${user.rolesView}</td>
                            <td style='text-align: center'>
                                <button type="button" data-userid="${user.id}" data-action="edit" class="btn btn-sm btn-info"
                                data-toggle="modal" data-target="#someDefaultModal">Edit</button>
                            </td>
                            <td style='text-align: center'>
                                <button type="button" data-userid="${user.id}" data-action="delete" class="btn btn-sm btn-danger"
                                data-toggle="modal" data-target="#someDefaultModal">Delete</button>
                            </td>
                        </tr>
                )`;
                table.append(tableFilling);
            })
        })

    $("#tableUsers").find('button').on('click', (event) => {
        let defaultModal = $('#someDefaultModal');

        let targetButton = $(event.target);
        let buttonUserId = targetButton.attr('data-userid');
        let buttonAction = targetButton.attr('data-action');

        defaultModal.attr('data-userid', buttonUserId);
        defaultModal.attr('data-action', buttonAction);
        defaultModal.modal('show');
    })
}

async function editUser(modal, id) {
    let preuser = await userFetchService.findOneUser(id);
    let user = preuser.json();

    modal.find('.modal-title').html('Edit user');

    let editButton = `<button  class="btn btn-primary" id="editButton">Edit</button>`;
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(editButton);
    modal.find('.modal-footer').append(closeButton);

    user.then(user => {
        let bodyForm = `
            <div align="center">
            <form class="form-group" id="editUser" >
            <div class="col-7">
                <label for="id">ID</label>
                <input type="text" class="form-control" id="id" name="id" value="${user.id}" disabled><br>
                <labelfor="name">Name</label>
                <input class="form-control" type="text" id="name" value="${user.name}"><br>
                <labelfor="lastname">Lastname</label>
                <input class="form-control" type="text" id="lastname" value="${user.lastname}"><br>
                <labelfor="age">Age</label>
                <input class="form-control" id="age" type="number" value="${user.age}"> <br>
                <labelfor="email">Email</label>
                <input class="form-control" type="text" id="email" value="${user.email}"><br>
                <labelfor="password">Password</label>
                <input class="form-control" type="text" id="password" value="${user.password}"><br>
                <labelfor="roles">Roles</label>
                <select class="custom-select" size="2" multiple name="roles" id="roles" required>
                <option value="ROLE_ADMIN">ADMIN</option>
                <option selected value="ROLE_USER">USER</option>
                </select>
                </div>
            </form>
            </div>
        `;
        modal.find('.modal-body').append(bodyForm);
    })

    $("#editButton").on('click', async () => {
        let id = modal.find("#id").val().trim();
        let name = modal.find("#name").val().trim();
        let lastname = modal.find("#lastname").val().trim();
        let age = modal.find("#age").val().trim();
        let email = modal.find("#email").val().trim();
        let password = modal.find("#password").val().trim();
        let roles = modal.find("#roles").val();
        let data = {
            id: id,
            name: name,
            lastname: lastname,
            age: age,
            email: email,
            password: password,
            roles: roles

        }
        const response = await userFetchService.updateUser(data, id);

        if (response.ok) {
            getTableWithUsers();
            modal.modal('hide');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="someError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;

            modal.find('.modal-body').prepend(alert);
        }
    })
}


async function deleteUser(modal, id) {
    let preUser = await userFetchService.findOneUser(id);
    let user = preUser.json();

    modal.find('.modal-title').html('Delete User');

    let deleteButton = `<button  class="btn btn-danger" id="deleteButton">Delete</button>`;
    let closeButtonDelete = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(deleteButton);
    modal.find('.modal-footer').append(closeButtonDelete);

    user.then(user => {
        let bodyForm = `
            <div align="center">
            <form class="form-group" id="deleteUser" >
            <div class="col-7">
                <labelfor="id">ID</label>
                <input disabled type="text" class="form-control" id="id" name="id" value="${user.id}"><br>
                <labelfor="firstName">First Name</label>
                <input disabled class="form-control" type="text" id="firstName" value="${user.name}"><br>
                <labelfor="lastName">Last Name</label>
                <input disabled class="form-control" type="text" id="lastName" value="${user.lastname}"><br>
                <labelfor="age">Age</label>
                <input disabled class="form-control" type="text" id="age" value="${user.age}"><br>
                <labelfor="email">Email</label>
                <input disabled class="form-control" type="text" id="username" value="${user.email}"><br>
                <labelfor="password">Password</label>
                <input disabled class="form-control" type="password" id="password" value="${user.password}"><br>
                <labelfor="roles">Roles</label>
                <select class="custom-select"
                        size="2"
                        multiple name="roles"
                        id="roles" required disabled>
                <option value="1">ADMIN</option>
                <option value="2">USER</option>
                </select>
                </div>
            </form>
            </div>
        `;
        modal.find('.modal-body').append(bodyForm);
    })

    $("#deleteButton").on('click', async () => {
        let id = modal.find("#id").val().trim();

        const response = await userFetchService.deleteUser(id);

        if (response.ok) {
            getTableWithUsers();
            modal.modal('hide');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="someError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            modal.find('.modal-body').prepend(alert);
        }
    })
}

async function getDefaultModal() {
    $('#someDefaultModal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-userid');
        let action = thisModal.attr('data-action');
        switch (action) {
            case 'edit':
                editUser(thisModal, userid);
                break;
            case 'delete':
                deleteUser(thisModal, userid);
                break;

        }
    }).on("hidden.bs.modal", (e) => {
        let thisModal = $(e.target);
        thisModal.find('.modal-title').html('');
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    })
}

async function getNewUserForm() {
    let button = $(`#SliderNewUserForm`);
    let form = $(`#defaultSomeForm`)
    button.on('click', () => {
        if (form.attr("data-hidden") === "true") {
            form.attr('data-hidden', 'false');
            form.show();
            button.text('New User');
        } else {
            form.attr('data-hidden', 'true');
            form.hide();
            button.text('New User');
        }
    })
}


async function createUser() {
    $('#createUserButton').click(async () => {
        let createUserForm = $('#defaultSomeForm')
        let name = createUserForm.find('#CreateUserName').val().trim();
        let lastname = createUserForm.find('#CreateUserLastname').val().trim();
        let age = createUserForm.find('#CreateUserAge').val().trim();
        let email = createUserForm.find('#CreateUserEmail').val().trim();
        let password = createUserForm.find('#CreateUserPassword').val().trim();
        let roles = createUserForm.find('#CreateUserRoles').val()
        let data = {
            name: name,
            lastname: lastname,
            age: age,
            email: email,
            password: password,
            roles: roles
        }
        const response = await userFetchService.createUser(data);
        if (response.ok) {
            getTableWithUsers();
            createUserForm.find('#CreateUserName').val('');
            createUserForm.find('#CreateUserLastname').val('');
            createUserForm.find('#CreateUserAge').val('');
            createUserForm.find('#CreateUserEmail').val('');
            createUserForm.find('#CreateUserPassword').val('');
            createUserForm.find('#CreateUserRoles').val('');


        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            addUserForm.prepend(alert)
        }
    })
}