const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());

// получение списка данных
app.get("/api/users", (req, res) => {
    const content = fs.readFileSync("lab2/users.json", "utf8");
    const users = JSON.parse(content);
    res.json({ success: true, message: users });
  });
  
// получение одного пользователя по id
app.get("/api/users/:id", (req, res) => {
    const id = req.params.id; // получаем id
    const content = fs.readFileSync("lab2/users.json", "utf8");
    const users = JSON.parse(content);
    let user = null;
    for (let i = 0; i < users.length; i++) {
        if (users[i].id == id) {
          user = users[i];
          console.log("🚀 ~ app.get ~ user:", user);
          break;
        }
      }
    if (user) {
        res.json({ success: true, message: user });
    } else {
        res.status(404).json({ success: false, message: "" });
    }

    
  });
  

app.post("/api/users",(req,res) =>{
    const { name, age, id} = req.body;
    let validName = false;
    let validAge = false;
    let validId = false;
    // Проверка имени на соответствие формату
    for(let i = 0; i < name.length;++i){
        if (name[i] != " " && (name[i].charCodeAt(0) < 65 || name[i].charCodeAt(0) > 122)){
            break;
        }else{
            validName = true;
        }
    }
    // Проверка ID на соответствие формату
    if(typeof id === 'number'){
        validId = true
    }
    // Проверка возраста на соответствие формату
    if(typeof age === 'number'){
        if(age > 0){
            age = true;
        }
    }

    if (name == null || age == null || !(validAge) || !(validId) || !(validName)){
        res.status(404).json({success:false,message: "Данные переданы неверно",validId:validId,validAge:validAge,validName:validName});
    }
    
    const data = fs.readFileSync("lab2/users.json","utf8");
    const users = JSON.parse(data);

    let user = {name , age};

    const idd = Math.max.apply(
        Math,
        users.map((o) => {
            return o.id;
        }),
    )
    user.id = idd + 1;
    users.push(user);
    const newData = JSON.stringify(users);
    fs.writeFileSync("lab2/users.json",newData);
    res.json({success:true,user:user,users:users})
});

app.delete("/api/users/:id",(req,res) => {
    const id = req.params.id;
    if(id == null || id == ""){
        res.status(404).json({success:false,message:"Данные не заполнены"});
    }
    const data = fs.readFileSync("lab2/users.json","utf8");
    const users = JSON.parse(data);
    let index = -1;
    for(let i = 0; i < users.length; i++){
        if(users[i].id == id){
            index = i;
            break;
        }
    }
    if(index > -1){
        const user = users.splice(index, 1)[0];
        const data = JSON.stringify(users);
        fs.writeFileSync("lab2/users.json",data);
        res.json({ success: true, message: user });
    }else{
        res.status(404).json({ success: false, message: "Ошибка записи" });
    }
})


app.put("/api/users",(req,res) => {
    const {name,age,id} = req.body;
    if(name == null || age == null || id == null){
        res.status(404).json({ success: false, message: "Данные не заполнены" });
    }
    const data = fs.readFileSync("lab2/users.json", "utf8");
    const users = JSON.parse(data);
    let user;
    for (let i = 0; i < users.length; i++) {
        if (users[i].id == id) {
          user = users[i];
          break;
        }
      }
    if(user){
        user.age = age;
        user.name = name;
        const newData = JSON.stringify(users);
        fs.writeFileSync("users.json", newData);
        res.json({ success: true, message: user });
    }else{
        res.status(404).json({ success: false, message: "Ошибка записи" });
    }
    
})


app.listen(3000, () => {
    console.log("Сервер ожидает подключения");
});