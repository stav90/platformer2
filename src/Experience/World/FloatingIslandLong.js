import * as THREE from 'three'
import Experience from '../Experience.js'
import { ExtendedObject3D } from '@enable3d/ammo-physics'
import Monster from './Monster'
import gsap from 'gsap'

export default class LongPlatform
{
    constructor(x, y, skin, objects)
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.physics = this.experience.physics.instance
        this.coins = []
        this.monsters = []
        this.leaves = []
        this.objects = objects
        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('fox')
        }

        // Resource
        this.resource = this.resources.items.longIsland
        this.roadPlatform = this.resources.items.road
        this.naturePlatform = this.resources.items.longIsland
        this.coin = this.resources.items.coin.scene
        this.trees = this.resources.items.tree.scene
        // this.tree2 = this.resources.items.tree2.scene
        
        
        this.x = x
        this.y = y
        this.skin = skin
        // this.addtree(this.x, this.y)
        this.createPlatform()
  

    }
  
    createPlatform = () => {

        const islandWidth = 20
        // this.model = this.resource.scene
        switch(this.skin) {
            case 'nature':
                this.model = this.naturePlatform.scene
                break
            case 'road': 
                this.model =  this.roadPlatform.scene
                break
        }
        // console.log(this.model)
        let longPlatform = this.model.clone()
        longPlatform.position.set(this.x, this.y, 0)
        if(this.objects == 'flying-monster'){
            longPlatform.name = 'flyingMonsterPlatform'
        }else {
            longPlatform.name = 'platform'
        }
     
        this.scene.add(longPlatform)
        this.physics.add.existing(longPlatform, { 
                shape: 'box',
                offset: { y: 1.55 },  
                width: islandWidth, 
                height: 3, 
                depth: 3,
                mass: 0,
                collisionFlags: 2
            })
            
        this.addCoins(this.x, this.y)
    }

    addTree(x, y) {
        let tree = new ExtendedObject3D()
            tree.add(this.trees.clone())
            tree.rotation.y = -Math.PI * .5
            tree.position.set((parseFloat(x)), (parseFloat(y) +1.5), -1)
            this.scene.add(tree)

           // add hacd shape to existing mesh
            tree.traverse((child) =>
            {
                if(child instanceof THREE.Mesh)
                {
                    if(child.name == 'platformLeftLeaf'){
                        child.visible = false
                        this.platformLeftLeaf = child
                        this.physics.add.existing(this.platformLeftLeaf, {mass: 0, shape: 'box',width: 1, depth: 3.5, height: .3, name: 'platform'  })
                        this.platformLeftLeaf.body.setCollisionFlags(2)
                    }
                    if( child.name == 'platformLeftLeaf2'){
                        child.visible = false
                    }
                    if(child.name == 'platformRightLeaf'){
                        child.visible = false
                        this.platformRightLeaf = child
                        this.physics.add.existing(this.platformRightLeaf, {mass: 0, shape: 'box',width: 1, depth: 3.5, height: .3, name: 'platform2'  })
                        this.platformRightLeaf.body.setCollisionFlags(2)
                    }
                    if( child.name == 'platformRightLeaf2'){
                        child.visible = false
                    }
                    if(child.name == 'platformTopLeaf'){
                        child.visible = false
                        this.platformTopLeaf = child
                        this.physics.add.existing(this.platformTopLeaf, {mass: 0, shape: 'box',width: 1, depth: 3.5, height: .3, name: 'platform3'  })
                        this.platformTopLeaf.body.setCollisionFlags(2)
                    }
                    if( child.name == 'platformTopLeaf2'){
                        child.visible = false
                    }
                    if(child.name.includes('Plane')){
                     
                       this.leaves.push(child)
                       
                    }
                }
            })   
            
    }
    
    addCoins(x, y) {
            let coin = new ExtendedObject3D()
            coin.add(this.coin.clone())
            coin.name ='coin'
            coin.position.set((parseFloat(x)), (parseFloat(y)+ 9), 0)
            this.physics.add.existing(coin, 
                { 
                    shape: 'box',
                    ignoreScale: true,
                    width: 0.5,
                    height: 0.5,
                    depth: 0.5
                })
            coin.body.setCollisionFlags(6)
            this.coins.push(coin)
            this.scene.add(coin)   
    }

    update()
    {   
        this.leaves.forEach((leaf, index) => {
            if(index % 2 ==0){
                leaf.rotateY(0.0100) * index
            }else {
                leaf.rotateY(-0.0150) * index
            }

        })
        this.coins.forEach(coin => {
            if (!coin.userData.dead) {
                coin.rotation.y += 0.03
                coin.body.needUpdate = true
            }
        })
    }
}