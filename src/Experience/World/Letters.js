import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Letters
{
    constructor(x, y)
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.physics = this.experience.physics.instance
        this.resource = this.resources.items.letters
        this.x = x
        this.y = y
        this.setModel()
    }
    setModel(){
        this.model = this.resource.scene.clone()
        this.model.scale.set(5, 5, 5)
        this.model.position.set( this.x, 4, -.2)
       
        this.scene.add(this.model)
        
        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true  
                this.physics.add.existing(child, {mass: 3, shape: 'hacd'})
                child.body.setCollisionFlags(0)
                
            }
        })  
    }      

}