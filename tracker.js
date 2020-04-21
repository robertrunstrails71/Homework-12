var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "robrtruns",

  password: "letsrun",
  database: "employee_DB"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId); 
    showAll();
    myFunction();
  });

  function myFunction() {
    myVar = setTimeout(runData, 100);
  }

  function showAll() {
    var query = "SELECT e.id AS employee_id, first_name, last_name, title, salary, d.name AS department_name FROM employee AS e JOIN role AS r ON r.id = role_id JOIN department AS d ON department_id = d.id;";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].employee_id + " | " + res[i].first_name + " | " + res[i].last_name + " | " + res[i].title + " | " + res[i].salary + " | " + res[i].department_name);
        }
    }
    )};

function runData() {

    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "View department",
                "View employees",
                "View roles",
                "Add departments",
                "Add roles",
                "Add employees",
                "Update employee roles"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {

                case "View department":
                    viewDepartment();
                    break;

                case "View employees":
                    viewEmployees();
                    break;

                case "View roles":
                    viewRole();
                    break;

                case "Add departments":
                    addDepartment();
                    break;

                case "Add roles":
                    addRoles();
                    break;

                case "Add employees":
                    addEmployees();
                    break;

                case "Update employee roles":
                    updateEmployee();
                    break;

            }
        });
}


  

function viewDepartment() {
    var query = "SELECT name FROM department";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].name);
        }
        runData();
    });
}
function viewEmployees() {
    var query = "SELECT first_name, last_name FROM employee";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].first_name + " " + res[i].last_name);
        }
        runData();
    });
}
function viewRole() {
    var query = "SELECT title FROM role";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].title);
        }
        runData();
    });
}

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Please add department"
        }
    ])
        .then(function (answer) {
            var query = "INSERT INTO department (name) VALUES ('" + answer.name + "');"
            connection.query(query, function (err, res) {
                console.log("Department added");
            })
            viewDepartment();
            runData();
        });
}

function addRoles() {
    connection.query("SELECT * FROM department", function (err, results) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "input",
                name: "title",
                message: "Please add title"
            },
            {
                type: "number",
                name: "salary",
                message: "Please add salary"
            },
            {
                type: "rawlist",
                name: "choice",
                message: "Please choose existing roles",
                choices: function () {
                    var choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choiceArray.push({ name: results[i].name, value: results[i].id });
                    }
                    return choiceArray;
                },
            }
        ])
            .then(function (answer) {
                console.log(answer);
                var query = "INSERT INTO role (title, salary, department_id) VALUES (?,?,?);"
                connection.query(query, [answer.title, answer.salary, answer.choice], function (err, res) {
                    console.log(err);
                    console.log("Role added");
                    viewRole();
                    runData();
                })
            });
    }
    )
};

function addEmployees() {
    connection.query("SELECT * FROM role", function (err, results) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "input",
                name: "name",
                message: "Please add name"
            },
            {
                type: "input",
                name: "lastname",
                message: "Please add last name"
            },
            {
                type: "rawlist",
                name: "role",
                message: "Please choose existing roles",
                choices: function () {
                    var roleArray = [];
                    for (var i = 0; i < results.length; i++) {
                        roleArray.push({ name: results[i].title, value: results[i].id });
                    }
                    return roleArray;
                },
            }
        ])
            .then(function (answer) {
                console.log(answer);
                var query = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,0);"
                connection.query(query, [answer.name, answer.lastname, answer.role], function (err, res) {
                    console.log(err);
                    console.log("Employee added");
                    viewEmployees();
                    runData();
                })
            });
    }
    )
};
 function updateEmployee() {
     connection.query("SELECT * FROM employee", function (err, results) {
         if (err) throw err;
         inquirer.prompt([
             {
                 type: "rawlist",
                 name: "role",
                 message: "Please choose existing employee",
                 choices: function () {
                     var employeeArray = [];
                     for (var i = 0; i < results.length; i++) {
                         employeeArray.push({ name: results[i].first_name + " " + results[i].last_name, value: results[i].id });
                     }
                     return employeeArray;
                 }
             },            
         ])
             .then(function (answer) {
                 console.log(answer);
             });
     })
 };       