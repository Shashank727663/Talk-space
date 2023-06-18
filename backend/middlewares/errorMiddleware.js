const notfound = (req,res,next) =>{
    const error = new Error(`not found -${req.orginalUrl}`)
    res.status(404)
    next(error);
}

const errorHandler = (req,res,next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode)
    res.json({
        message : error.message,
        stack : error.stack
    })
}


module.exports = {notfound , errorHandler}