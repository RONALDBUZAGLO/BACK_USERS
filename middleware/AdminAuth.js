const jwt = require("jsonwebtoken");
const secret = "a84gr51g35r14va5614rwf3q54g65et4h8ry4ju5641ik34oç386p43651nd3f64";

module.exports = function (req,res,next) {
    
    const authToken = req.headers['authorization']

    if (authToken != undefined) {
        const bearer = authToken.split(' ');
        var token = bearer[1];

        try {
            var decoded = jwt.verify(token,secret);
            if(decoded.role == 1){
                next();
            }else{
                res.status(403);
                res.send("Você não tem permissão!");
                return;
            }
        
        } catch (err) {
            res.status(403);
            res.send("Você não está autenticado!");
            return;
        }
        

    }else{
        res.status(403);
        res.send("Você não está autenticado!");
        return;
    }

}