import * as THREE from 'three'
import Experience from '../Experience.js'
import VertexShader from '../../../static/shaders/shaderOne/vertex.glsl'
import FragementShader from   '../../../static/shaders/shaderOne/fragment.glsl'
export default class Plane
{
    constructor(x, y)
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.physics = this.experience.physics.instance
        this.resource = this.resources.items.letters
        this.texture = this.resources.items.backgroundTexture
        this.x = x
        this.y = y
        this.setModel()
    }
    setModel(){
        const multiply = 3
        const geometry = new THREE.PlaneGeometry( 1, 1, 4, 4 );
        // Material
        this.material = new THREE.ShaderMaterial({
            vertexShader: VertexShader,
            fragmentShader: FragementShader,
            uniforms:
            {
                uFrequency: { value: new THREE.Vector2(10, 5) },
                uTime: { value: 0 },
                uColor: { value: new THREE.Color('orange') },
                uTexture: { value: this.texture }
            }
        })
        const plane = new THREE.Mesh( geometry, this.material );
        plane.position.set( this.x, 5, -.5)
        plane.scale.set(3, 3,3)
        this.scene.add( plane ); 

        
    }  
    update () {
        this.material.uniforms.uTime.value = this.time.elapsed * 0.001
    }    
}