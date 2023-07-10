import * as THREE from 'three'
import Experience from '../Experience.js'
import { AmmoPhysics, ExtendedMesh, PhysicsLoader, ThirdPerson, ExtendedObject3D } from '@enable3d/ammo-physics'

export default class Bridge
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.physics = this.experience.physics.instance

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('fox')
        }

        // Resource
        this.resource = this.resources.items.plank

        this.createBridge()

    }

    createBridge = async(x, y, length) => {

        const createPlank = (x, offset, mass) => {
            let plank = new ExtendedObject3D()
            plank.add(this.resource.scene.clone())
            plank.scale.set(.5, .5, .5)
            plank.position.set(x + offset,y)
            plank.name = 'platformPlank'
            this.scene.add(plank)
            this.physics.add.existing(plank, {shape: 'box',height: 0.25,width: 1.4,depth: 2, y:0, z: 0, x: 1 + x, mass: mass})
            return plank
        }
        const hingePlank = (plankA, plankB) => {
            this.physics.add.constraints.hinge(plankA.body, plankB.body, {
                pivotA: { x: .5 },
                pivotB: { x: -.5 },
                axisA: { z: .5 },
                axisB: { z: .5 }
            })
        }
        let planksArray = []
        
        const createPlanks = () => {
            for(let i = 0; i <= length; i++){
                let plank
                if(i == 0 || i == length){
                    plank = createPlank(x, i, 0)
                }else {
                    plank = createPlank(x, i, 1)
                }
                planksArray.push(plank)
            }
        }
        const connectPlanks = () => {
            for(let i = 0; i <= length; i++){
                if( i != length){
                    hingePlank(planksArray[i], planksArray[i + 1])
                }
            }
        }
        await createPlanks()
        connectPlanks()
            
 
    }


    update()
    {

    }
}