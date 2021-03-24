const User = require("../models/User");
const PasswordToken = require("../models/PasswordToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

const secret = "a84gr51g35r14va5614rwf3q54g65et4h8ry4ju5641ik34oç386p43651nd3f64"

class UserController{

    async index(req,res){
        var users = await User.findAll();
        res.json(users);
    }

    async findUser(req,res){
        var id = req.params.id;
        var user = await User.findById(id);
        if(user == undefined){
            res.status(404);
            res.json({});
        }else{
            res.status(200);
            res.json(user);
        }
    }

    async create(req,res){
        // console.log(req.body);
        // res.send("Pegando o corpo da requisição");
        var {email,name,password} = req.body;

        if(email == undefined || email == "" || email == " "){
            res.status(400);
            res.json({err:"O e-mail é inválido!"});
            return;
        }

        var emailExists = await User.findEmail(email);

        if (emailExists) {
            res.status(406);
            res.json({err:"Este e-mail já está cadastrado"});
            return;
        }

        await User.new(email,password,name);


        res.status(200);
        res.send("tudo ok");

    }

    async edit(req,res){
        var {id,name,role,email} = req.body;
        var result = await User.update(id,email,name,role);
        if (result != undefined) {
            if (result.status) {
                res.status(200);
                res.send("Tudo ok!");
            }else{
                res.status(400);
                res.send(result.error);
            }
            
        }else{
            res.status(406);
            res.send("Ocorreu um erro no servidor!");
        }
    }

    async remove(req,res){
        var id = req.params.id;

        var result = await User.delete(id);
        if (result.status) {
            res.status(200);
            res.send("tudo ok");
        }else{
            res.status(406);
            res.send(result.err);
        }
    }

    async recoverPassword(req,res){
        var email = req.body.email;
        var result = await PasswordToken.create(email);
        if(result.status){
            res.status(200)
            res.send(" "+result.token);
        }else{
            res.status(406);
            res.send(result.err);
        }
    }

    async changePassword(req,res){
        var token = req.body.token;
        var password = req.body.password;

        var isTokenValid = await PasswordToken.validate(token);
        if (isTokenValid.status) {

            await User.changePassword(password,isTokenValid.token.user_id,isTokenValid.token.token);
            res.status(200);
            res.send("Senha alterada");
            
        } else {
            res.status(406);
            res.send("Token inválido");
        }
    }

    async login(req,res){
        
        var {email,password} = req.body;
        var user = await User.findByEmail(email);

        if (user != undefined) {

            var resultado = await bcrypt.compare(password,user.password);
                        
            if (resultado){

                var token = jwt.sign({ email:user.email, role: user.role }, secret);

                res.status(200);
                res.json({token:token});
                
            } else {

                res.status(406);
                res.json({err:"Senha incorreta"});

            }
        } else {
            res.status(406);
            res.json({status:false,err:"O usuário não existe!"});

        }
    }

}

module.exports = new UserController();
