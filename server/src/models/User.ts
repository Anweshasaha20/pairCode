import mongoose ,{ Document } from "mongoose";

export interface Iuser extends Document {
    username : string,
    email : string , 
    password : string
}

const UserSchema = new mongoose.Schema<Iuser> ( {
    username : {type : String , required : true , unique : true},
    email : {type : String , required : true , unique : true},
    password : {type : String , required : true}
} , {
    timestamps : true
})

const UserModel = mongoose.model<Iuser>("User", UserSchema);

export default UserModel;