import * as THREE from 'three'
import Experience from '../Experience.js'
import { AmmoPhysics, ExtendedMesh, PhysicsLoader, ThirdPerson, ExtendedObject3D } from '@enable3d/ammo-physics'
import BasicCharacterControllerInput from '../Utils/BasicCharacterControllerInput'
import { TextTexture, TextSprite } from '@enable3d/three-graphics/jsm/flat'
import data from '/static/levelData.json'
import gsap from 'gsap'
export default class Platformer 
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.sizes = this.experience.sizes
        this.physics = this.experience.physics.instance
        this.score = 0

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('fox')
        }

        // Resource
        this.resource = this.resources.items.mikDude

        this.setModel()
        this.addGroundDetector()
        this.setAnimation()
        this.setUpControls()
        this.addtext()
    }

    setModel(){
      // this.experience.camera.instance.lookAt(0, 0, 0)
      this.physics.debug.enable()
      
      this.model = new ExtendedObject3D()
      this.model.add(this.resource.scene)
      this.model.visible = false
      this.model.scale.set(.35, .35, .35)
      this.model.position.set(parseFloat(data.playerStart.x), parseFloat(data.playerStart.y), 0)
      this.model.name = 'mik-dude'
      this.physics.add.existing(this.model, {
          shape: 'capsule',
          ignoreScale: true,
          height: 0.8,
          radius: 0.4,
          offset: { y: -0.8 }
      })
      // this.model.body.setCcdSweptSphereRadius(0.4)
      console.log(this.model)
      // this.model.body.setCollisionFlags(2) // make it kinematic
      this.model.body.setLinearFactor(1, 1, 0)
      this.model.body.setAngularFactor(0, 0, 0)
      this.model.body.setFriction(0)
     

      this.model.body.on.collision((otherObject, event) => {
        if (/coin/.test(otherObject.name)) {
          if (!otherObject.userData.dead) {
            otherObject.userData.dead = true
            otherObject.visible = false
            this.score += 10
            this.spriteText.setText(`score: ${this.score}`)
            this.physics.destroy(otherObject)
          }
        }
        if (/monster/.test(otherObject.name)) {
  
          if (!otherObject.userData.dead) {
            this.model.userData.dead = true
            this.model.visible = false
            this.physics.destroy(this.model)

          }
        }
      })


      this.model.traverse((child) =>
      {
          if(child instanceof THREE.Mesh)
          {
              child.castShadow = true
          }
      })
      this.scene.add(this.model)
    }

    addGroundDetector() {
        // add a sensor
        const sensor = new ExtendedObject3D()
        sensor.position.setX(data.playerStart.x)
        sensor.position.setY(data.playerStart.y -1)
        this.physics.add.existing(sensor, { mass: 1e-8,shape: 'box', width: .6, height: .2, depth: .6 })
        sensor.body.setCollisionFlags(4)
        // connect sensor to player
        this.physics.add.constraints.lock(this.model.body, sensor.body)
        // detect if sensor is on the ground
        sensor.body.on.collision((otherObject, event) => {
            if (/platform/.test(otherObject.name)) {
              // console.log(otherObject)
              if (event !== 'end') this.model.userData.onGround = true
              else this.model.userData.onGround = false
            }
            if(otherObject.name =='platformHorizontalDrone'){
                // adjust the velocity of the player while on the moving platform
                this.addVelocity = otherObject.body.velocity.x
                this.onHorizontalDrone = true
            
            }else{
              this.onHorizontalDrone = false    
            }
            if (/monster/.test(otherObject.name)) {
                 if (!otherObject.userData.dead) {
                  if(!this.model.userData.dead){
                    this.model.body.applyForceY(15)
                  }
               
                  otherObject.userData.dead = true
                 
                  setTimeout(() => {
                    gsap.to(otherObject.scale, {y: .1, x:.1, z:.1, duration: 1})
                    gsap.to(otherObject.position, {y: otherObject.position.y - 2,  duration: 1})
                  }, 1000);
                  this.score += 10
                  this.spriteText.setText(`score: ${this.score}`)
                  this.physics.destroy(otherObject)
                }
            }
            
        })
    }
    setUpControls() {
      this.input = new BasicCharacterControllerInput();
    }

    setAnimation()
    {
        this.animation = {}
        
        // Mixer
        this.animation.mixer = new THREE.AnimationMixer(this.model)
        
        // Actions
        this.animation.actions = {}
        
        this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0])
        this.animation.actions.walking = this.animation.mixer.clipAction(this.resource.animations[1])
        // this.animation.actions.running = this.animation.mixer.clipAction(this.resource.animations[2])
        
        this.animation.actions.current = this.animation.actions.idle
        this.animation.actions.current.play()

        // Play the action
        this.animation.play = (name) =>
        {
            const newAction = this.animation.actions[name]
            const oldAction = this.animation.actions.current

            newAction.reset()
            newAction.play()
            newAction.crossFadeFrom(oldAction, .2)

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
    walkAnimation() {
      if (this.animation.actions.current !== this.animation.actions.walking) this.animation.play('walking')
    }

    idleAnimation() {
      if (this.animation.actions.current !== this.animation.actions.idle) this.animation.play('idle')
    }
    addtext(){
    
        // add 2d text
        const text = new TextTexture('score: 00', { fontWeight: 'bold', fontSize: 48 })
        this.spriteText = new TextSprite(text)
        const scale = .5
        this.spriteText.setScale(scale)
        this.spriteText.setPosition(0 + (text.width * scale) / 2 + 12, this.sizes.height - (text.height * scale) / 2 - 12)
        this.experience.scene2d.add(this.spriteText)
      
    }

    update()
    {

        if(this.onHorizontalDrone){
            this.model.body.setVelocityX(this.model.body.velocity.x + this.addVelocity)
        }

        this.physics.update(this.time.delta * 1000)
        this.physics.updateDebugger()
        this.animation.mixer.update(this.time.delta * 0.001)

        if (this.model && this.model.body && !this.model.userData.dead) {

            // this.experience.camera.instance.position.lerp(this.model.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 5, 20)), 0.05)
            // this.experience.camera.controls.target.lerp(this.model.getWorldPosition(new THREE.Vector3().add(new THREE.Vector3(0, 5, 20))), 0.05)
       
            // get rotation of robot
            const theta = this.model.world.theta
            this.model.body.setAngularVelocityY(0)

            // set the speed variable
            const speed = 3

            // move left
            if (this.input.keys.left) {
              this.model.body.setVelocityX(-speed)
              if (theta > -(Math.PI / 2)) this.model.body.setAngularVelocityY(-4)
              this.walkAnimation()
            }
            // // move right
            else if (this.input.keys.right) {
              this.model.body.setVelocityX(speed)
              if (theta < Math.PI / 2) this.model.body.setAngularVelocityY(4)
              this.walkAnimation()
            }
            // // do not move
            else {
              this.model.body.setVelocityX(0)
              this.idleAnimation()
            }

            // jump
            if (this.input.keys.forward&& Math.abs(this.model.body.velocity.y) < 1e-1) {
              // this.model.animation.play('WalkJump')
              this.model.body.applyForceY(10)
            }
        }
    }
}
// && this.model.userData.onGround 