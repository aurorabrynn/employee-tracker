const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: 'root',

    // Your password
    password: 'password',
    database: 'employee_DB',
});

const start = () => {
    inquirer.prompt([
        {
            name: "choice",
            choices: ["View departments", "View roles", "View employees", "Add department", "Add role", "Add employee", "Update departments", "Update roles", "Update employees", "Quit"],
            message: "What do you want to do?",
            type: "list"
        }
    ]).then(answers => {
        switch (answers.choice) {
            case "View departments":
                console.log("viewing departments!")
                viewDepartments()
                break;
            case "View roles":
                console.log("viewing roles!")
                viewRoles()
                break;
            case "View employees":
                console.log("viewing employees!")
                viewEmployees()
                break;
            case "Add department":
                console.log("adding departments!")
                break;
            case "Add role":
                console.log("adding roles!")
                break;
            case "Add employee":
                console.log("adding employees!")
                break;
            case "Update departments":
                console.log("updating departments!")
                break;
            case "Update roles":
                console.log("updating roles!")
                break;
            case "Update employees":
                console.log("updating employees!")
                break;

            default:
                console.log("Thank you!")
                connection.end();
                break;
        }
    })
}

const viewDepartments = () => {
    //view department table
    connection.query(`SELECT * FROM department`, (err, data) => {
        if (err) {
            throw err
        } else {
            console.table(data);
            start()
        }
    })
}

const viewRoles = () => {
    //view role table
    connection.query(`SELECT role.id, role.title, role.salary, department.name FROM role
    JOIN department ON role.department_id = department.id;`, (err, data) => {
        if (err) {
            throw err
        } else {
            console.table(data);
            start()
        }
    })
}

const viewEmployees = () => {
    //view employee table
    connection.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name FROM employee 
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id;`, (err, data) => {
        if (err) {
            throw err
        } else {
            console.table(data);
            start()
        }
    })
}

connection.connect((err) => {
    if (err) throw err;
    console.log("config done!")
    start()
})