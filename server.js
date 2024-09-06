const inquirer = require("inquirer");
const connection = require('./config/connection');

connection.connect((err) => {
    if (err) throw err;
    console.log("connected to the database");
    start();
});

function start() {
    inquirer
    .prompt({
        type: "list",
        name: "action",
        message: "make a selection for what you'd like to do",
        choices: [
            "view all departments",
            "view all roles",
            "view all employees",
            "add a department",
            "add a role",
            "add an employee",
            "update an employee role",
            "Exit",
        ],
    })
    .then((answer) => {
        switch (answer.action) {
            case "view all departments":
                viewAllDepartments();
                break;
            case "view all roles":
                viewAllRoles();
                break;
            case "view all employees":
                viewAllEmployees();
                break;
            case "add a department":
                addDepartment();
                break;
            case "add a role":
                addRole();
                break;
            case "add an employee":
                addEmployee();
                break;
            case "update an employee role":
                updateEmployeeRole();
                break;
            case "Exit":
                connection.end();
                break;
        }
    });
}

function viewAllDepartments() {
    const query = "SELECT * FROM department";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        start();
    });
}

function viewAllRoles() {
    const query = "SELECT role.title, role.id, department.department_name, role.salary from role join department on role.department_id = department.id";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        start();
    });
}

function viewAllEmployees() {
    const query = `
    SELECT e.id, e.first_name, e.last_name, r.title, d.department_name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name
    FROM employee e
    LEFT JOIN role r ON e.role_id=r.id
    LEFT JOIN department d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id;
    `;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        start();
});
}

function addDepartment() {
    inquirer
    .prompt ({
        type: "input",
        name: "name",
        message: "enter the name of the new department",
    })
    .then((answer) => {
        console.log(answer.name);
        const query = `INSERT INTO department (department_name) VALUES ('${answer.name}')`;
        connection.query(query, (err) => {
            if (err) throw err;
            console.log(`Added department ${answer.name} to the db`);
            start();
        });
    })
}

function addRole() {
    const query ="SELECT * FROM department";
    connection.query(query, (err, res) => {
        if (err) throw err;
        inquirer
            .prompt([
            {
                type: "input",
                name: "title",
                message: "Enter the title of the new role:",
            },
            {
                type: "input",
                name: "salary",
                message: "Enter the salary of the new role:",
            },
            {
                type: "list",
                name: "department",
                message: "Select the department for the new role:",
                choices: res.rows.map(
                    (department) => department.department_name
                )
            },
        ])
        .then((answer) => {
            const department = res.rows.find(
                (department) => department.name === answer.department
            );
            const query = "INSERT INTO role SET ?";
            connection.query(
                query,
                {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: department,
                },
                (err, res) => {
                    if (err) throw err;
                    console.log(
                        `Add role ${answer.title} with salary ${answer.salary} to the ${answer.department} department in the database!`
                    );
                    start();
                }
            );
        });
    });
}

function addEmployee() {
    connection.query ("SELECT id, title FROM role", (error, res) => {
        if (error) {
            console.error(error);
            return;
        }

        const role = res.rows.map(({ id, title }) => ({
            name: title,
            value: id,
        }));

        connection.query(
            `SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee`,
            (error, res) => {
                if (error) {
                    console.error(error);
                    return;
                }

                const manager = res.rows.map(({ id, name }) => ({
                    name,
                    value: id,
                }));

                inquirer
                .prompt([
                    {
                        type: "input",
                        name: "firstName",
                        message: "Enter the employee's first name:",
                    },
                    {
                        type: "input",
                        name: "lastName",
                        message: "Enter the employee's last name:",
                    },
                    {
                        type: "list",
                        name: "roleId",
                        message: "Select the employee role:",
                        choices: [
                            { name: "none", values: null },
                            ...role,
                        ],
                    },
                    {
                        type: "list",
                        name: "managerId",
                        message: "Select the employee manager:",
                        choices: [
                            { name: "none", values: null },
                            ...manager,
                        ],
                    },
                ])
                .then((answer) => {
                    const sql = 
                        `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ( '${answer.firstName}', '${answer.lastName}', '${answer.roleId}', '${answer.managerId}')`;
                    connection.query(sql, (error, res) => {
                        if (error) {
                            console.error(error);
                            return;
                        }

                        console.log("Employee added successfully");
                        start();
                    });
                })
                .catch((error) => {
                    console.error(error);
                });
            }
        );
    });
}

function updateEmployeeRole() {
    const queryEmployee =
        "SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role ON employee.role_id = role.id";
    const queryRole = "SELECT * FROM role";
    connection.query(queryEmployee, (err, resEmployee) => {
        if (err) throw err;
        connection.query(queryRole, (err, resRole) => {
            if (err) throw err;
            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "employee",
                        message: "Select the employee to update:",
                        choices: resEmployee.rows.map(
                            (employee) =>
                                `${employee.first_name} ${employee.last_name}`
                        ),
                    },
                    {
                        type: "list",
                        name: "role",
                        message: "Select the new role:",
                        choices: resRole.rows.map((role) => role.title),
                    },
                ])
                .then((answer) => {
                    const employee = resEmployee.rows.find(
                        (employee) =>
                            `${employee.first_name} ${employee.last_name}` ===
                            answer.employee
                    );
                    const role = resRole.rows.find(
                    (role) => role.title === answer.role 
                    );
                    const query =
                        `UPDATE employee SET role_id = '${role.id}' WHERE id = '${employee.id}'`;
                    connection.query(
                        query,
                        (err, res) => {
                            console.log(
                                `Update ${employee.first_name} ${employee.last_name}'s role to ${role.title} in the database!`
                            );
                            start();
                        }
                    );
            });
        });
    });
}
