const express = require("express");
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const path = require('path');
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'pulseMyWay',
  password: 'xxxxxx',
  database: 'pulse'
});
const botToken = 'xxxxxx';


let jwtSecret = 'xxxxx';
const bcrypt = require('bcrypt');
const saltRounds = 10;
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(botToken, {polling: true});

let chatID = 241014511;



const PORT = 80;

const app = express();
const router = express.Router();

const cors = require("cors");
app.use(cors());
app.use(express.json()); 

function time() {
    const israelFormattedDate = new Date().toLocaleString('en-GB', {
        timeZone: 'Asia/Jerusalem',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      
    return israelFormattedDate
}

app.post("/api/users", (req, res) => {
    if(req.body.token == undefined) {
        return res.end(JSON.stringify({status: false}));
    }
    jwt.verify(req.body.token, jwtSecret, function(err, decoded) {
        if (err) throw err;
        if(decoded.isAdmin == 'true') {
            connection.query("SELECT id, userName, status, lastUpdated FROM users", function (err, result, fields) {
                if (err) throw err;
                return res.end(JSON.stringify({status: true , data: JSON.stringify(result).toString('utf-8')}));
            });
        } else {
            return res.json(JSON.stringify({status: false}));
        }
    });

    
});

app.get("/api/users/:id", (req, res) => {
    connection.query(`SELECT * FROM users WHERE id = ?` , [req.params.id], function (err, result, fields) {
        if (err) throw err;
        if(result[0] == null) {
            bot.sendMessage(chatID , 'Someone tried to access a user id that doesnt exist in DB \n 🌐: **' + req.headers['x-forwarded-for'] || req.socket.remoteAddress + "** \n 📙: **" + req.headers['token'] + "**"  )
            return console.log('Someone tried to access a user id that doesnt exist in DB')
        }
        if( req.headers['token']) {
            jwt.verify( req.headers['token'], jwtSecret, function(err, decoded) {
                if (err) throw err;
                if(decoded.isAdmin == 'true') {
                    res.json(result);
                } else if(decoded.id == req.params.id) {
                    res.json(result);
                }
            })
        }
     
    });   
});

app.post("/api/users/:id", (req, res) => {
    let muscle = Number(req.body.muscle)
    let bFat = Number(req.body.bFat)
    let weight = Number(req.body.weight)
    let chronologicAge = Number(req.body.chronologicAge)
    let userName = req.body.name
    let email = req.body.email
    let activityLevel = req.body.activity
    let weightList = []
    weightList.push({
        bodyFat: bFat,
        muscle: muscle,
        chronologicAge: chronologicAge,
        weight: weight,
        date: time(),
        activity: activityLevel,
        gender: req.body.gender,
        age: req.body.age,
        height: req.body.height,

    })
    
    connection.query(
        "INSERT INTO users (userName, status, weightList, lastUpdated, email) VALUES (?, ?, ?, ?, ?)",
        [userName, "active", JSON.stringify(weightList), time(), email, ],
        function(err, result, fields) {
            if (err) {
                console.error(err);
                return;
            }
            bcrypt.hash('123456', saltRounds, function(err33, hash) {
                connection.query(
                    "INSERT INTO loginusers (id , username, password) VALUES (? , ?, ?)",
                    [result.insertId , email, hash],
                    function(err2, result2, fields2) {
                        if (err2) {
                            console.error(err);
                            return;
                        }
                    })
            })
        });
    
   
    return res.send(true)
});

       

app.post("/api/checkJWT", (req, res) => {
    let token = req.body.token
    let checkAdmin = req.body.isAdmin

    if(token == undefined) {
        return res.end(JSON.stringify({status: false}));
    }
    jwt.verify(token, jwtSecret, function(err, decoded) {
        if (err) { 
            res.end(JSON.stringify({status: false}));
            throw err 
        };
        if(checkAdmin == true) {
            if(decoded.isAdmin == 'true') {

                return res.json({status: true});
            } else {
                return res.json({status: false});
            }
        } else {
            return res.json({status: true});
        }
    });
})

   

app.post("/api/users/:id/editWeight", (req, res) => {
    let muscle = Number(req.body.muscle)
    let bFat = Number(req.body.bFat)
    let weight = Number(req.body.weight)
    let chronologicAge = Number(req.body.chronologicAge)
    let tkn = req.body.token
    let date = req.body.date

    if(tkn == undefined) {
        return res.end(JSON.stringify({status: false}));
    }
    
    jwt.verify(tkn, jwtSecret, function(err, decoded) {
        if (err) throw err;
        if(decoded.isAdmin == 'true') {
             connection.query(`SELECT weightList FROM users WHERE id = ?` , [req.params.id], function (err, result, fields) {
                if (err) throw err;
                if(result[0] == null) {
                    return console.log('Someone tried to access a user id that doesnt exist in DB')
                }
                let oldData = JSON.parse(result[0].weightList)
             
                oldData.map((e , i) => {
                    if(e.date == date) {
                        if(i == 0) {
                            let age = oldData[0].age
                            let height= oldData[0].height
                            let activity = oldData[0].activity
                            let gender = oldData[0].gender
                            oldData[i] = {age: age , height: height, activity: activity, gender: gender, bodyFat: bFat, muscle: muscle, chronologicAge: chronologicAge, weight: weight, date: date}
                        } else {
                            oldData[i] = {bodyFat: bFat, muscle: muscle, chronologicAge: chronologicAge, weight: weight, date: date}
                        }
                    }
                })

                connection.query(`UPDATE users SET lastUpdated = ? WHERE id = ?`,[time() , req.params.id] ,function (err, result, fields) {
                    return res.send(true) 
                })
                connection.query(`UPDATE users SET weightList = ? WHERE id = ?`,[JSON.stringify(oldData) , req.params.id] ,function (err, result, fields) {
                })
             });
         }
     })
})

function findIndex(data, date) {
    const index = data.findIndex((e) => e.date === date);
    return index !== -1 ? index : undefined;
  }

app.post("/api/users/:id/deleteWeight", (req, res) => {
    let tkn = req.body.token
    let date = req.body.date
    if(tkn == undefined) {
        return res.end(JSON.stringify({status: false}));
    }
    
    jwt.verify(tkn, jwtSecret, function(err, decoded) {
        if (err) throw err;
        if(decoded.isAdmin == 'true') {
             connection.query(`SELECT weightList FROM users WHERE id = ?` , [req.params.id], function (err, result, fields) {
                if (err) throw err;
                if(result[0] == null) {
                    return console.log('Someone tried to access a user id that doesnt exist in DB')
                }
                let oldData = JSON.parse(result[0].weightList)
                let index = findIndex(oldData , date)
                console.log(index)
                if(index !== 0) {
                    oldData.splice(index, 1);
                    res.send(true)
                } else {
                    res.send(false)
                }

                connection.query(`UPDATE users SET lastUpdated = ? WHERE id = ?`,[time() , req.params.id] ,function (err, result, fields) {
                })
                connection.query(`UPDATE users SET weightList = ? WHERE id = ?`,[JSON.stringify(oldData) , req.params.id] ,function (err, result, fields) {
                })

                
             });
         }
     })
})



app.post("/api/users/:id/addWeight", (req, res) => {
   let muscle = Number(req.body.muscle)
   let bFat = Number(req.body.bFat)
   let weight = Number(req.body.weight)
   let chronologicAge = Number(req.body.chronologicAge)
   let tkn = req.body.token
   if(tkn == undefined) {
       return res.end(JSON.stringify({status: false}));
   }
   
   jwt.verify(tkn, jwtSecret, function(err, decoded) {
       if (err) throw err;
       if(decoded.isAdmin == 'true') {
            connection.query(`SELECT weightList FROM users WHERE id = ?` , [req.params.id], function (err, result, fields) {
                if (err) throw err;
                if(result[0] == null) {
                    return console.log('Someone tried to access a user id that doesnt exist in DB')
                }
                let oldData = JSON.parse(result[0].weightList)
                
                oldData.push({bodyFat: bFat, muscle: muscle, chronologicAge: chronologicAge, weight: weight, date: req.body.date})
                connection.query(`UPDATE users SET lastUpdated = ? WHERE id = ?`,[time() , req.params.id] ,function (err, result, fields) {
                    return res.send(true) 
                })
                connection.query(`UPDATE users SET weightList = ? WHERE id = ?`,[JSON.stringify(oldData) , req.params.id] ,function (err, result, fields) {
                })


            });
        }
    })
});

// userName: fullName,
// email: userEmai,
// age: UserAge,
// height: userHeight,
// activity: activityLevel,
// gender: userGender,


app.post("/api/users/:id/updateUserPass", (req, res) => {
    let password = req.body.pass
    let tkn = req.body.token
    if(tkn == undefined) {
        return res.end(JSON.stringify({status: false}));
    }
    jwt.verify(tkn, jwtSecret, function(err, decoded) {
        if (err) { 
            res.end(JSON.stringify({status: false}));
            throw err 
        };
        if(decoded.isAdmin == 'true') {
            connection.query(`SELECT * FROM users WHERE id = ?` , [req.params.id], function (err, result, fields) {
                if (err) throw err;
                if(result[0] == null) {
                    return console.log('Someone tried to update a user id that doesnt exist in DB')
                }
               
                bcrypt.hash(password, saltRounds, function(err33, hash) {
                    connection.query(`UPDATE loginusers SET password = ? WHERE id = ?`,[hash , req.params.id], function(err2, result2, fields2) {
                        if (err2) {
                            console.error(err);
                            return;
                        }
                        res.send(true)
                        bot.sendMessage(chatID, "👤: " + result[0].email + "'s password got changed");
                    })
                })
 
            });
        }
    })
})
app.post("/api/users/:id/updateUser", (req, res) => {
    let userName = req.body.userName
    let email = req.body.email
    let age = req.body.age
    let height = req.body.height
    let activity = req.body.activity
    let gender = req.body.gender
    let tkn = req.body.token
    if(tkn == undefined) {
        return res.end(JSON.stringify({status: false}));
    }
    jwt.verify(tkn, jwtSecret, function(err, decoded) {
        if (err) { 
            res.end(JSON.stringify({status: false}));
            throw err 
        };
        if(decoded.isAdmin == 'true') {
            connection.query(`SELECT weightList FROM users WHERE id = ?` , [req.params.id], function (err, result, fields) {
                if (err) throw err;
                if(result[0] == null) {
                    return console.log('Someone tried to update a user id that doesnt exist in DB')
                }

                let oldData = JSON.parse(result[0].weightList)
                oldData[0].age = age
                oldData[0].height = height
                oldData[0].activity = activity
                oldData[0].gender = gender

                connection.query(`UPDATE users SET lastUpdated = ? WHERE id = ?`,[time() , req.params.id] ,function (err, result, fields) {
                    return res.send(true) 
                })
                connection.query(`UPDATE users SET weightList = ? WHERE id = ?`,[JSON.stringify(oldData) , req.params.id] ,function (err, result, fields) {
                })
                
                connection.query(`UPDATE users SET username = ?, email = ? WHERE id = ?`,[userName , email , req.params.id] ,function (err, result, fields) {
                })
                connection.query(`UPDATE loginusers SET username = ? WHERE id = ?`,[email , req.params.id] ,function (err, result, fields) {
                })
            });
        }
    })
 });
 
app.post("/api/checkLoginUser", (req, res) => {
    let username = req.body.username
    let password = req.body.password

    connection.query(`SELECT password, isAdmin, id FROM loginusers WHERE username = ?` , [username], function (err, dbResult, fields) {
        if(dbResult[0]) {
            bcrypt.compare(password, dbResult[0].password, function(err, result) {
                if(result == true) {
                    jwt.sign({isAdmin: dbResult[0].isAdmin, id: dbResult[0].id}, jwtSecret, {expiresIn: '30d'}, (err, asyncToken) => {
                        if (err) throw err;
                        bot.sendMessage(chatID, "👤: " + username + " Just logged in");
                        return res.json(JSON.stringify({status: true , token: asyncToken , admin: dbResult[0].isAdmin , id:dbResult[0].id } ))
                        
                    });
                } else {
                    return res.json(JSON.stringify({status: false}))
                }
            });
        } else {
            return res.json(JSON.stringify({status: false}))
        }
       
    })
})

app.use(express.static(path.join(__dirname, '../build')));

// Handle any other routes by serving the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

setInterval(function () {
    connection.query('SELECT 1');
}, 5000);

app.listen(PORT, () => {
    connection.connect();
    console.log(`Server listening on ${PORT}`);
});
  