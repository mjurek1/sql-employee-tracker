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
    const query = "SELECT * FROM department";
    connection.query(query, (err, res) => {
        if (err) throw err;
        inquirer
        .prompt([
            {
                type: "input",
                name: "title",
                message: "Enter the title of the new role",
            },
            {
                type: "input",
                name: "salary",
                message: "enter the salary for the role",
            },
            {
                type: "list",
                name: "department",
                message: "select a department for this role",
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
                        `Add role ${answer.title} with salary ${answer.salary} to the ${answer.department} department in the db`
                    );
                    start();
                }
            );
        });
    });
}

