
class Token{
userId
token
createdAt 
constructor(userId,token){
this.userId = userId
this.token=token
this.createdAt={default:Date.now,expires:3600}
}

}
module.exports = Token;