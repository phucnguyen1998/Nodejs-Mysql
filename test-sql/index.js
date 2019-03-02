var express = require("express");
var app = express();
var mysql = require("mysql");
var bodyParser = require('body-parser');
var multer  = require('multer');

app.set("view engine", "ejs");
app.set("views","./views");
app.use(express.static("public"));
app.listen(8888);

//Cấu hình để nhận dữ liệu dạng Post trả về
var urlencodedParser = bodyParser.urlencoded({ extended: false });
//Cấu hình nơi file đc update và tên file
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './upload')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
});
var upload = multer({ storage: storage }).single("uploadfile"); //Chỉ sử dụng cho thẻ input có name="uploadfile" ,route add


//tao kết nối mysql
var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'nodejs',
});
connection.connect();//gọi kết nối

// Trang Chủ
app.get("/",function(req,res){
    connection.query('select * from newpp',function(error,results,field){
        if(error){res.send("<h1>Không thể kết nối tới Database !</h1>")};
        res.render("Post",{results});
    });
});

//Trang Admin
app.get("/admin",function(req,res){
    connection.query('select * from newpp',function(error,results,field){
        if(error){res.send("<h1>Không thể kết nối tới Database !</h1>")};
        res.render("admin",{results});
    });
})

//Chức năng Add 
app.get("/admin/add",function(req,res){
    res.render("add");
});

app.post("/admin/add", urlencodedParser ,function(req,res){
    upload(req,res,function(error){
        if(error){
            res.send("upload không thành công !");
            console.log(error);
        }else{
            var sql = "insert into newpp (id,title,posts,image) values ('"+req.body.id+"','"+req.body.title+"','"+req.body.post+"','"+req.file.originalname+"')";
            connection.query(sql,function(error,results,field){
                if(error){res.send("<h1>Không thể kết nối tới Database !</h1>")};
                res.redirect("/admin");
            });
        }
    })
});

//Chức năng Delete

app.get("/admin/delete/:id",function(req,res){
    connection.query('delete from newpp where id ='+req.params.id,function(error,results,field){
        if(error){
            res.send("<h1>Không thể kết nối tới Database !</h1>")
        }else{
        res.redirect("/admin");
        }
    });
})

//Chức năng Edit
app.get("/admin/edit/:id",function(req,res){
    connection.query('select * from newpp',function(error,results,field){
        if(error){res.send("<h1>Không thể kết nối tới Database !</h1>")};
        res.render("edit",{results});
    });
});

// app.post("/admin/edit/:id",function(req,res){
//     var id = req.params.id;
//     upload(req,res,function(error){
//         if(error){
//             res.send("upload không thành công !");
//             console.log(error);
//         }else{
//             if(req.file == undefined){
//                 connection.query("update newpp set id='"+req.body.id+"',title='"+req.body.title+"',posts='"+req.body.posts+"' WHERE id="+id,function(error,results,field){
//                     if(error){res.send("<h1>Không thể kết nối tới Database !</h1>")};   
//                     res.redirect("admin");
//                 });    
//             }else{
//                 connection.query("UPDATE newpp SET id='"+req.body.id+"',title='"+req.body.title+"',posts='"+req.body.posts+"',image='"+req.file.originalname+"' WHERE id="+id,function(error,results){
//                     if(error){res.send("<h1>Không thể kết nối tới Database !</h1>")};   
//                     res.redirect("admin");
//                 });
//             }  
//         }
//     })
// })
