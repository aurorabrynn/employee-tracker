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
            choices: ["View department", "View role", "View employee", "Add department", "Add role", "Add employee", "Update department", "Update role", "Update employee", "Quit"],
            message: "What do you want to do?",
            type: "list"
        }
    ]).then(answers => {
        switch (answers.choice) {
            case "View department":
                console.log("viewing departments!")
                break;
            case "View role":
                console.log("viewing roles!")
                break;
            case "View employee":
                console.log("viewing employees!")
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
            case "Update department":
                console.log("updating departments!")
                break;
            case "Update role":
                console.log("updating roles!")
                break;
            case "Update employee":
                console.log("updating employees!")
                break;

            default:
                console.log("Thank you!")
                connection.end();
                break;
        }
    })
}

const artistSearch = () => {
    //need to ask user for an artist name
    inquirer.prompt({
        name: "artist",
        type: "input",
        message: "which artist?"
    }).then(answers => {
        connection.query(`SELECT * FROM top1000songs WHERE artist = ?`, answers.artist, (err, data) => {
            if (err) {
                throw err
            } else {
                console.table(data);
                start()
            }
        })
    })
    //query db for selected artist
    //start over
}

connection.connect((err) => {
    if (err) throw err;
    console.log("config done!")
    start()
})