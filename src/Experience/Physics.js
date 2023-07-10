
import * as THREE from 'three'
// import Ammo from '../ammo/ammo'
import Experience from './Experience'
import { AmmoPhysics, PhysicsLoader} from '@enable3d/ammo-physics'
export default class Physics
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.setUpPhysicsWorld()
    }
    async setUpPhysicsWorld() {
        await PhysicsLoader('/ammo',() => Ready())
        const Ready = () => {
            this.instance = new AmmoPhysics(this.scene)
        }
        
        
    }

    update()
    {
        // if(this.physicsWorld !=undefined){
        //     this.physicsWorld.stepSimulation( this.time.delta, 10 );
        // }
    }
}