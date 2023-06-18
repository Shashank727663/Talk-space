const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")
const userModel = mongoose.Schema(
    {
        name : {type: String, required: true},
        email:{type: String, required: true, unique: true},
        password:{type: String, required: true},
        pic:{type: String, default: "data:image/png;base64,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"},
    },
    {timestamps: true,}
    
);

userModel.methods.matchPassword = async function(eneterdPassword) {
    return await bcrypt.compare(eneterdPassword,this.password)
}
userModel.pre("save" , async function(next) {
    if(!this.isModified) {
        next();
    }

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password,salt);
})

const user = mongoose.model("User", userModel);

module.exports = user;

