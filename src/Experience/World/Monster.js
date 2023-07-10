import * as THREE from 'three'
import Experience from '../Experience.js'
import { ExtendedObject3D } from '@enable3d/ammo-physics'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';
import data from '../../../static/levelData.json'
import gsap from 'gsap'
export default class Monster
{
    constructor(x, y, index)
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.physics = this.experience.physics.instance
        this.mixers = []
        this.monster
        this.x = x
        this.y = y
        this.index = index
        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('fox')
        }

        // Resource
        this.resource = this.resources.items.monster3

        this.createMonster()
        // this.addGroundDetector()
        // this.addHeadStompDetector()
        this.setAnimation()
        
        
    }

    createMonster() {
        this.monster = new ExtendedObject3D()
        this.monster.add(SkeletonUtils.clone(this.resource.scene))
        this.monster.position.set(this.x - 10, this.y + 2.2,0)
        this.monster.rotation.y = Math.PI * .5
        this.scene.add(this.monster)
        this.monster.name = `monster${this.index}`
        
        this.physics.add.existing(this.monster, {
            shape: 'box',
            ignoreScale: true,
            width: 1.25,
            height: 1.25,
            depth: 1.25,
            // height: 0.8,
            // radius: 0.75,
            // offset: { x: -10.75, y: 0, z: 0 },
            mass: 3,
            // collisionFlags: 2, 
           
        })
        
        this.monster.body.setCollisionFlags(6)

        // get position
        let tmp = this.monster.position.clone()
        let tmpRot = this.monster.rotation.clone()

        // tween the position
        const monsterAnimation = gsap.timeline({
            onUpdate: () => {
                // console.log(tmpRot.x)
                if(!this.monster.userData.dead){
                    this.monster.position.set(tmp.x, tmp.y, tmp.z)
                    this.monster.body.needUpdate = true
                }else{
                   
                    if(monsterAnimation != undefined){
                        monsterAnimation.kill()
                        this.animation.play('death')
                        this.animation.actions.current.setLoop(THREE.LoopOnce, 1)
                        this.animation.actions.current.clampWhenFinished = true      
                    }
               
                }
                
            },
            repeat: -1
        })
        monsterAnimation.to(tmp,{duration: 5, x: '+=20', yoyo: true, yoyoEase: true, ease: 'linear',})
        monsterAnimation.to(this.monster.rotation,{duration: .25, y: -Math.PI * .5,},5)
        monsterAnimation.to(tmp,{duration: 5, x: '-=20', yoyo: true, yoyoEase: true, ease: 'linear',})
        monsterAnimation.to(this.monster.rotation,{duration: .25, y:Math.PI * .55,},)
        // console.log(this.monster)
 
    }
    addGroundDetector() {
        
        const pos = { x: this.x, y: this.y , z: 0 }
        const sensor = this.physics.add.box({
                x: pos.x -1,
                y: pos.y - 0.5,
                z: pos.z + 3,
                width: 0.5,
                height: 3,
                depth: 0.5,
                collisionFlags: 1, // set the flag to static
                mass: 0.001
            },
            { lambert: { color: 0xff00ff, transparent: true, opacity: 0.0 } 
        })
        sensor.castShadow = sensor.receiveShadow = false
        this.physics.add.constraints.lock(this.monster.body, sensor.body)

        sensor.body.setCollisionFlags(4)

        sensor.body.on.collision((otherObject, event) => {
            // console.log(otherObject)
            if (/platform/.test(otherObject.name)) {
            if (event !== 'end'){
                this.monster.userData.onGround = true
                // this.monster.body.setAngularVelocityY(5)
            } 
            else {
                this.monster.userData.onGround = false
                // this.monster.body.setAngularVelocityY(0)
            }
            }
        }) 
    }

    setAnimation()
    {

        this.animation = {}
        this.animation.mixer = new THREE.AnimationMixer(this.monster)  

            // Actions
        this.animation.actions = {}
        
        this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0])
        this.animation.actions.walking = this.animation.mixer.clipAction(this.resource.animations[1])
        this.animation.actions.death = this.animation.mixer.clipAction(this.resource.animations[3])
        
        this.animation.actions.current = this.animation.actions.idle
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
    }

    update()
    {
        this.animation.mixer.update(this.time.delta * 0.001)            
              
        if(!this.monster.userData.dead){
            
            
            // const worldTheta = this.monster.world.theta
            // this.monster.body.setAngularVelocityY(0)
        
            // if(this.monster.userData.onGround){ 
            //     // this.monster.body.setVelocityX(-speed)
            //     this.monster.body.setAngularVelocityY(0)
                
            // }else{
            //     if (worldTheta < (Math.PI )) this.monster.body.setAngularVelocityY(2)
            // }
                
            
            // // this.monster.body.setAngularVelocityY(0)
            // const speed = .5
            // const rotation = this.monster.getWorldDirection(
            //     new THREE.Vector3()?.setFromEuler?.(this.monster.rotation) || this.monster.rotation.toVector3()
            // )
            // const theta = Math.atan2(rotation.x, rotation.z)

            // const x = Math.sin(theta) * speed,
            //     y = this.monster.body.velocity.y,
            //     z = Math.cos(theta) * speed

            // this.monster.body.setVelocity(x, y, z)
            
        }
    }
}