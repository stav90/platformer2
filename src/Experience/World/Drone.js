import * as THREE from 'three'
import Experience from '../Experience.js'
import gsap from 'gsap'
import { AmmoPhysics, ExtendedMesh, PhysicsLoader, ThirdPerson, ExtendedObject3D } from '@enable3d/ammo-physics'
export default class Drone
{
    constructor(x, y, droneRange, axis, skin)
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.physics = this.experience.physics.instance
        this.drones = []
        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('fox')
        }

        // Resource
        this.resource = this.resources.items.hoverPlatform
        this.dronePlatform = this.resources.items.dronePlatform
        this.hoverPlatform = this.resources.items.hoverPlatform
        this.x = x
        this.y = y
        this.axis = axis
        this.skin = skin
        this.droneRange = droneRange
        this.createDrone()
    }

    createDrone()
    {
        this.droneRange = 10
        this.drone = new ExtendedObject3D()
  
        switch(this.skin) {
            case 'drone':
                // console.log('drone')
                this.model = this.dronePlatform.scene
                break
            case 'hover': 
                // console.log('hover')
                this.model =  this.hoverPlatform.scene
                break
        }
        this.drone.add(this.model.clone())
        this.drone.position.set(this.x, this.y, 0)
        // let longPlatform = this.model.clone()
        // longPlatform.position.set(this.x, this.y, 0)
        // longPlatform.name = 'platform'
        // this.scene.add(longPlatform)
        // this.physics.add.existing(longPlatform, 
        //     { 
        //         shape: 'box',
        //         offset: { y: 1.55 },  
        //         width: islandWidth, 
        //         height: 3, 
        //         depth: 3,
        //         mass: 10,
        //         collisionFlags: 2
        //     })
        
        
        this.physics.add.existing(this.drone, { shape: 'box', height: .5,width: 3.5, depth: 3.5, mass: 10,collisionFlags: 2, name: 'platformMoving'})
        if(this.axis == 'horizontal'){
            this.drone.name = 'platformHorizontalDrone'
        }else {
            this.drone.name = 'platformVerticalDrone'
        }

        this.propellers = []
        this.drone.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                
                child.castShadow = true
                if(child.name.includes('Propeller')){
                    this.propellers.push(child)
                }
            }
        })
        for(let i =0; i < this.propellers.length; i++){
                gsap.to(this.propellers[i].rotation, { y: this.propellers[i].rotation.y + Math.PI * 2, repeat: -1, duration: .5, ease: 'none' })
        }
        let drone = {
            model: this.drone,
            xPosition: this.x,
            axis: this.axis
        }
        
        this.drones.push(drone)
        this.scene.add(drone.model)
        
    }

    update() {
        this.drones.forEach((drone) => {
            if(drone.axis == 'horizontal'){
                drone.model.position.x = (Math.sin(this.time.elapsed * 0.001))* this.droneRange + drone.xPosition
                drone.model.body.needUpdate = true
            }else if(drone.axis == 'vertical') {
                drone.model.position.y = (Math.sin(this.time.elapsed * 0.001))* this.droneRange + this.droneRange
                drone.model.body.needUpdate = true
            } 
        })
    }
}