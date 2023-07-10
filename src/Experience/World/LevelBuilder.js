import * as THREE from 'three'
import Experience from '../Experience.js'
import LongPlatform from './FloatingIslandLong'
import Bridge from './Bridge'
import Drone from './Drone'
import Monster from './Monster'
import Letters from './Letters'
// import Plane from './PlaneWithShader'
import FlyingMonster from './FlyingMonster'
import data from '/static/levelData.json'
export default class Level
{
    constructor(player)
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.physics = this.experience.physics.instance
        this.player = player

        this.buildLevel()

    }
    buildLevel(){
        
        this.platforms = []
        this.monsters = []
        this.flyingMonsters = []
        const bridgeLength = 20
        const bridge = new Bridge()


        this.drones = []

       
       
        for(let i = 0; i < data.levelData.length; i++){
            switch(data.levelData[i].type) {
                case 'platform':
                    let longPlatform = new LongPlatform(data.levelData[i].x, data.levelData[i].y, data.levelData[i].skin, data.levelData[i].objects)
                    this.platforms.push(longPlatform)
                    if(data.levelData[i].objects == 'tree'){
                        longPlatform.addTree(parseFloat(data.levelData[i].x),parseFloat(data.levelData[i].y))
                        let monster = new Monster(parseFloat(data.levelData[i].x), parseFloat(data.levelData[i].y), i)
                        this.monsters.push(monster)
                    } else if(data.levelData[i].objects == 'letters'){
                        let letters = new Letters(parseFloat(data.levelData[i].x),parseFloat(data.levelData[i].y))
                    } 
                    // else if(data.levelData[i].objects == 'shader') {
                    //     this.plane = new Plane(parseFloat(data.levelData[i].x),parseFloat(data.levelData[i].y))
                    // }
                     else if(data.levelData[i].objects == 'flying-monster') {
                        this.flyingMonster = new FlyingMonster(parseFloat(data.levelData[i].x),parseFloat(data.levelData[i].y))
                        this.flyingMonsters.push(this.flyingMonster)
                    }
                    break;
                case 'bridge':
                    bridge.createBridge(parseFloat(data.levelData[i].x),parseFloat(data.levelData[i].y), bridgeLength)
                    break;
                case 'drone':
                    const droneRange = 10
                    let drone = new Drone(parseFloat(data.levelData[i].x),parseFloat(data.levelData[i].y), droneRange, data.levelData[i].axis, data.levelData[i].skin)
                    
                    // drone.creatDrone()
                    this.drones.push(drone)
                default:
                // code block
            }
        }
       
    }

    update()
    {
        if(this.drones){
            this.drones.forEach(drone => drone.update()); 
        }
        // if(this.plane){
        //     this.plane.update()
        // }
        if(this.flyingMonsters){
            this.flyingMonsters.forEach(flyingMonster => flyingMonster.update()); 
        }
        if(this.platforms){
            this.platforms.forEach(platform => platform.update()); 
        }
        if(this.monsters){
            this.monsters.forEach(monster => {
                monster.update()  
            }); 
        }
       
    }
}