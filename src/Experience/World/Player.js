import * as THREE from 'three'
import { Vector3} from 'three'
import Experience from '../Experience.js'
// import { AmmoPhysics, ExtendedMesh, PhysicsLoader } from '@enable3d/ammo-physics'

export default class Player
{
    constructor(physics)
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        this.physicsWorld = physics.physicsWorld
        this.ammoLib = physics.ammoLib

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('fox')
        }

        // Resource
        this.resource = this.resources.items.foxModel

        this.setModel()
        this.addCharacter()
        // this.setAnimation()
    }

    setModel()
    {
        // this.model = this.resource.scene
        // this.model.scale.set(.02, .02, .02)
        // this.scene.add(this.model)

        // this.model.traverse((child) =>
        // {
        //     if(child instanceof THREE.Mesh)
        //     {
        //         child.castShadow = true
        //     }
        // }
        // this.playerShape = this.getPlayerShape()
        // console.log(this.playerShape, 'playerShape')
        // this.kController = this.addKinematicCharacterController()
        // console.log(this.kController, 'kcontroller')
    }
    // getPlayerShape(){
    //     const compoundShape = new this.ammoLib.btCompoundShape()
      
    //     const transform1 = new this.ammoLib.btTransform()
    //     transform1.setIdentity()
    //     transform1.setOrigin(new this.ammoLib.btVector3(0, 0, 0))
    //     compoundShape.addChildShape(transform1, new this.ammoLib.btSphereShape(0.25))
      
    //     const transform2 = new this.ammoLib.btTransform()
    //     transform2.setIdentity()
    //     transform2.setOrigin(new this.ammoLib.btVector3(0, 0.25, 0))
    //     compoundShape.addChildShape(transform2, new this.ammoLib.btCylinderShape(new this.ammoLib.btVector3(0.25, 0.25, 0)))
      
    //     return compoundShape
    //   }
  
    addCharacter() {
        //Three
        this.player = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({color: 0x30ab78}));
        this.player.scale.set(2, 2, 2)
        this.player.userData.tag = "player";
        this.scene.add(this.player)

        //Ammo
        const shape = new this.ammoLib.btCapsuleShape(0.5, 0.5)
      
        const ghostObject = new this.ammoLib.btPairCachingGhostObject()
        const transform = new this.ammoLib.btTransform()
        transform.setIdentity()
        transform.setOrigin(new this.ammoLib.btVector3(-5, 1, 0))
        transform.setRotation(new this.ammoLib.btQuaternion(0, 0, 0, 1))
        ghostObject.setWorldTransform(transform)
        ghostObject.setCollisionShape(shape)
        ghostObject.setCollisionFlags(ghostObject.getCollisionFlags() | 16) //CHARACTER_OBJECT
      
        this.controller = new this.ammoLib.btKinematicCharacterController(ghostObject, shape, 0.35, 1)
        this.controller.setUseGhostSweepTest(true)
      
        this.controller.setGravity(0)
        // it falls through the ground if I apply gravity
        // this.controller.setGravity(-this.physicsWorld.getGravity().y())
      
        // move slowly to the right
        this.controller.setWalkDirection(new this.ammoLib.btVector3(0.05, 0, 0))
      
        // addCollisionObject(collisionObject: Ammo.btCollisionObject, collisionFilterGroup?: number | undefined, collisionFilterMask?: number | undefined): void
        this.physicsWorld.addCollisionObject(ghostObject)
        this.physicsWorld.addAction(this.controller)

      }

      // "this.third.new." is equal to "new THREE."
    getRotation(t) {
      
    const ammoQuat = t.getRotation()
    const q = new THREE.Quaternion(ammoQuat.x(), ammoQuat.y(), ammoQuat.z(), ammoQuat.w())
  
    const qx = q.x
    const qy = q.y
    const qz = q.z
    const qw = q.w
  
    // https://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/index.htm
    const angle = 2 * Math.acos(qw)
    const x = qx / Math.sqrt(1 - qw * qw)
    const y = qy / Math.sqrt(1 - qw * qw)
    const z = qz / Math.sqrt(1 - qw * qw)
  
    return { x: x * angle || 0, y: y * angle || 0, z: z * angle || 0 }
  }
  
  
    update()
    {
        // this.animation.mixer.update(this.time.delta * 0.001)
        const t = this.controller.getGhostObject().getWorldTransform()
        // console.log(t)
        const r = this.getRotation(t)
        const theta = r.y
        const speed = 1 / 20
      
        const x = Math.sin(theta) * speed,
          y = 0,
          z = Math.cos(theta) * speed
      
        this.controller.setWalkDirection(new this.ammoLib.btVector3(x, y, z))
    }
}