class Level {
    code;
    map;
    player;
    enemies;
    step_cap;
    difficulty;
    end_point;
   

    constructor(code,map,player,enemies,step_cap,difficulty,end_point){
        this.code=code
        this.map=map
        this.player=player
        this.enemies=enemies
        this.step_cap=step_cap
        this.difficulty=difficulty
        this.end_point=end_point

    }
}

module.exports = Level;