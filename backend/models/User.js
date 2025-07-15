import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const addressSchema = new mongoose.Schema({
  type: {
    type: String, 
    required: true,
  },
  name: String,
  street: String,
  city: String,
  district: String,
  zipCode: String,
  country: String,
  isDefault: {
    type: Boolean,
    default: false,
  },
}, { _id: false });

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    image: {
        type: String,
    },
    addresses: [addressSchema],
    
},{
    versionKey: false,
    timestamps: true,
});




userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    if(obj.image){
        obj.image = `${process.env.PUBLIC_URL}/users/${obj.image}`;
    }else{
        obj.image = "";
    }
    delete obj.password;
    return obj;
};

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
}

userSchema.methods.generateToken = function () {
    let secret = process.env.JWT_SECRET;
    let expiresDate = process.env.JWT_EXPIRES_IN;
    return jwt.sign({ id: this._id, role: this.role },
         secret, {
        expiresIn: expiresDate,
    });
};



export default mongoose.model('User', userSchema);

