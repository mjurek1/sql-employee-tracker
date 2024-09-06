const inquirer = require("inquirer");
const connection = require('./config/connection');

connection.connect((err) => {
    if (err) throw err;
    console.log("connected to the database");
    start();
});

function start() {
    inquirer.createPromptModule({
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

