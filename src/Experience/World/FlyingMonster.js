import * as THREE from 'three'
import Experience from '../Experience.js'
import { ExtendedObject3D } from '@enable3d/ammo-physics'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';
export default class FlyingMonster
{
    constructor(x, y)
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.physics = this.experience.physics.instance
        this.x = x
        this.y = y
        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('flying-monster')
        }

        // Resource
        this.resource = this.resources.items.flyingMonster

        this.setModel()
        this.setAnimation()
    }

    setModel()
    {
        this.flyingMonster = new ExtendedObject3D()
        this.resource.scene.position.y = -1.5
        this.flyingMonster.add(SkeletonUtils.clone(this.resource.scene))
        this.flyingMonster.scale.set( .5,  .5, .5)
        
        this.scene.add(this.flyingMonster)

        this.flyingMonster.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true
            }
        })
        this.flyingMonster.position.set( this.x + 3, 0, -.5)
        this.flyingMonster.name = `flying-monster${this.index + 10}`
        
        this.physics.add.existing(this.flyingMonster, {
            shape: 'box',
            ignoreScale: true,
            width: 1,
            height: 1,
            depth: 1,
            mass: 3,
            collisionFlags: 2,
        })
    }

    setAnimation()
    {
        this.animation = {}
        
        // Mixer
        this.animation.mixer = new THREE.AnimationMixer( this.flyingMonster)
        
        // Actions
        this.animation.actions = {}
        
        this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0])
        this.animation.actions.walking = this.animation.mixer.clipAction(this.resource.animations[1])
        this.animation.actions.running = this.animation.mixer.clipAction(this.resource.animations[2])
        
        this.animation.actions.current = this.animation.actions.walking
        this.animation.actions.current.play()

        // Play the action
        this.animation.play = (name) =>
        {
            const newAction = this.animation.actions[name]
            const oldAction = this.animation.actions.current

            newAction.reset()
            newAction.play()
            newAction.crossFadeFrom(oldAction, 1)

            this.animation.actions.current = newAction
        }

        // Debug
        if(this.debug.active)
        {
            const debugObject = {
                playIdle: () => { this.animation.play('idle') },
                playWalking: () => { this.animation.play('walking') },
                playRunning: () => { this.animation.play('running') }
            }
            this.debugFolder.add(debugObject, 'playIdle')
            this.debugFolder.add(debugObject, 'playWalking')
            this.debugFolder.add(debugObject, 'playRunning')
        }
    }

    update()
    {
        this.animation.mixer.update(this.time.delta * 0.001)
        if(!this.flyingMonster.userData.dead){
            this.flyingMonster.position.y = (Math.sin(this.time.elapsed * 0.001))* 10 +13
            this.flyingMonster.position.z = (Math.cos(this.time.elapsed * 0.001))* 30 
            this.flyingMonster.body.needUpdate = true
        }
    }
}