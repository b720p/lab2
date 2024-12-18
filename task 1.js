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
    const { name, age} = req.body;
    let validName = false;
    let validAge = false;
    // Проверка имени на соответствие формату
    for(let i = 0; i < name.length;++i){
        if (name[i] != " " && (name[i].charCodeAt(0) < 65 || name[i].charCodeAt(0) > 122 || (name[i].charCodeAt(0) >= 91 && name[i].charCodeAt(0) <= 96))){
            validName = false;
            break;
        }else{
            validName = true;
        }
    }
    
    // Проверка возраста на соответствие формату
    if(typeof age === 'number'){
        if(age > 0){
            validAge = true;
        }
    }

    if (!(validAge) || !(validName)){
        res.status(404).json({success:false,message: "Данные переданы неверно",validAge:validAge,validName:validName});
        return;
    }
    
    const data = fs.readFileSync("lab2/users-for-task1.json","utf8");
    const users = JSON.parse(data);

    let user = {name , age};
    if(users.length <= 0){
        user.id = 1;
        users.push(user);
        const newData = JSON.stringify(users);
        fs.writeFileSync("lab2/users-for-task1.json",newData);
        res.json({success:true,users:users})
        return;
    }
    const idd = Math.max.apply(
        Math,
        users.map((o) => {
            return o.id;
        }),
    )
    user.id = idd + 1;
    users.push(user);
    const newData = JSON.stringify(users);
    fs.writeFileSync("lab2/users-for-task1.json",newData);
    res.json({success:true,users:users})
});

app.delete("/api/users/:id",(req,res) => {
    const id = req.params.id;
    if(id == null || id <= 0){
        res.status(404).json({success:false,message:"Данные не заполнены"});
        return;
    }
    const data = fs.readFileSync("lab2/users-for-task1.json","utf8");
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
        fs.writeFileSync("lab2/users-for-task1.json",data);
        res.json({ success: true, message: user });
    }else{
        res.status(404).json({ success: false, message: "Ошибка записи" });
    }
})


app.put("/api/users",(req,res) => {
    const {name,age,id} = req.body;
    let validName = false;
    let validAge = false;
    let validId = false;
    if(name == null || age == null || id == null){
        res.status(404).json({ success: false, message: "Данные не заполнены" });
        return;
    }
    
    for(let i = 0; i < name.length;++i){
        if (name[i] != " " && (name[i].charCodeAt(0) < 65 || name[i].charCodeAt(0) > 122 || (name[i].charCodeAt(0) >= 91 && name[i].charCodeAt(0) <= 96))){
            validName = false;
            break;
        }else{
            validName = true;
        }
    }
    // Проверка возраста на соответствие формату
    if(typeof age === 'number'){
        if(age > 0){
            validAge = true;
        }
    }
    // Проверка ID на соответствие формату
    if(typeof id === 'number'){
        if(id > 0){
            validId = true;
        }
    }
    if (!(validAge) || !(validId) || !(validName)){
        res.status(404).json({success:false,message: "Данные переданы неверно",validId:validId,validAge:validAge,validName:validName});
        return;
    }
    const data = fs.readFileSync("lab2/users-for-task1.json", "utf8");
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
        fs.writeFileSync("lab2/users-for-task1.json", newData);
        res.json({ success: true, message: user });
    }else{
        res.status(404).json({ success: false, message: "Ошибка записи" });
    }
    
})


app.listen(3000, () => {
    console.log("Сервер ожидает подключения");
});