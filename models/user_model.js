class User {
    nickname;
    current_level;
    level_rank;
    avatarCode;
    gender;
    is_notification;
    time_of_register;
    play_dates;
    avatarUrl;
    isActive;

    constructor(nickname, email,password,avatarCode,gender,avatarUrl,level_rank=[],current_level=1,is_notification=true,time_of_register=new Date(),play_dates=[]){
        this.nickname=nickname;
        this.email=email;
        this.password = password;
        this.level_rank = level_rank
        this.avatarCode = avatarCode;
        this.current_level = current_level;
        this.gender = gender;
        this.avatarUrl=avatarUrl;
        this.is_notification=is_notification;
        this.time_of_register=time_of_register;
        this.play_dates=play_dates
        this.isActive=true;
    }
}

module.exports = User;