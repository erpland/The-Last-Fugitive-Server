class Guest {
    nickname;
    current_level;
    level_rank;
    avatarCode;
    gender;
    is_notification;
    time_of_register;
    play_dates;
    avatarUrl;
   

    constructor(){
        this.nickname="Guest"+new Date().getTime();
        this.level_rank = []
        this.avatarCode = 0;
        this.current_level = 1;
        this.gender = 1;
        this.avatarUrl="/assets/avatars/male1.png";
        this.is_notification=true;
        this.time_of_register=new Date();
        this.play_dates=[]

    }
}

module.exports = Guest;