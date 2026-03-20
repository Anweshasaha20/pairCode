import mongoose ,{ Document } from "mongoose";

export interface Iuser extends Document {
    username : string,
    email? : string , 
    password? : string,
    githubId? : string,
    avatarUrl? : string
}

const UserSchema = new mongoose.Schema<Iuser> ( {
    username : {type : String , required : true , unique : true},
    email : {type : String , required : false , unique : true},
    password : {type : String , required : false},
    githubId : {type : String , required : false},
    avatarUrl : {type : String , required : false}
} , {
    timestamps : true
})

const UserModel = mongoose.model<Iuser>("User", UserSchema);

export default UserModel;