import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import MikDude from './MikDude.js'
import Island from './FloatingIsland'
import IslandLong from './FloatingIslandLong'

import Bridge from './Bridge'
import Level from './LevelBuilder'
import Monster from './Monster'
export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup  
            // this.monster = new Monster()
            this.mikDude = new MikDude()
            this.level = new Level()

            this.environment = new Environment()
        })
    }

    update()
    {
        if(this.mikDude)
            this.mikDude.update()
        if(this.level)
            this.level.update()
        if(this.bridge)
            this.bridge.update()
        if(this.monster)
            this.monster.update() 
    }
}