import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { LoopOnce, SphereGeometry, TextureLoader } from 'three'
import CANNON, { Sphere } from 'cannon'
import $ from "./Jquery"




const textureLoader = new THREE.TextureLoader()






// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()




//raycaster
const raycaster = new THREE.Raycaster()

//cannon
console.log(CANNON)
const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true
world.gravity.set(0, - 9.82, 0)

const defaultMaterial = new CANNON.Material('default')
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 30,
        restitution: 0.1
    }
)


// const fakeEarthMaterial = new THREE.MeshStandardMaterial({color:'pink'})
// const fakeEarthGeometry = new THREE.SphereGeometry(5.6,20,20)
// const fakeEarthMesh = new THREE.Mesh(fakeEarthGeometry, fakeEarthMaterial)
// fakeEarthMesh.position.copy(bubbleBody.position)
// scene.add(fakeEarthMesh)
    
//physics floor
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.mass = 0
let faceGeo
floorBody.addShape(floorShape)
floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1,0,0),
    Math.PI *0.5
)
world.addBody(floorBody)
//objects to update
const objectsToUpdate = []


 const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

 

})



const selectMaterial = new THREE.MeshStandardMaterial({color:'pink'})
const selectMaterial1 = new THREE.MeshBasicMaterial({color:'pink'})
const selectMaterial2 = new THREE.MeshBasicMaterial({color:'#89cff0'})
const selectMaterial3 = new THREE.MeshBasicMaterial({color:'#32CD32'})


let mask2
let mask2backup
let mask;
let mask2Geo
let mask2backupGeo
let maskGeo
let maskbackupGeo
const mouse = new THREE.Vector2()
mouse.x = null
mouse.y=null
mouse.y2 = null
// const facecolors = new Float32Array(maskGeo.length * 3)

// for(let i = 0; i < maskGeo.length; i++)
// {
//     // ...

//     colors[i3    ] = 1
//     colors[i3 + 1] = 0
//     colors[i3 + 2] = 0
// }

const pixleMaterial = new THREE.PointsMaterial({
    color:"pink",
    size:.03,
    // depthWrite: false,
    // blending: THREE.AdditiveBlending,
    // vertexColors: true





})
window.addEventListener('mousemove', (event) =>
{
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1
    mouse.y2 =-(event.clientY / sizes.height)

    // console.log(mouse)
})

/**
 * Models
 */
// const dracoLoader = new DRACOLoader()
// dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
// gltfLoader.setDRACOLoader(dracoLoader)
let rotation="on"
let mixer = null


gltfLoader.load(
    '/mask.glb',
    (gltf) =>
    {
        
   

        mask=gltf.scene

        maskGeo = mask.children[1].geometry.attributes.position.array;
       
        console.log(maskGeo)
        console.log(mask)

        mask.scale.set(1, 1, 1)
        mask.position.set(0, 0, -2)
        mask.traverse((child)=>{
            child.material = selectMaterial
        })

        // scene.add(mask)
        mask2Geo = new THREE.BufferGeometry;
        
        mask2Geo.setAttribute(
            'position',
            new THREE.BufferAttribute(maskGeo,3)
        )
      
        mask2 = new THREE.Points(mask2Geo, pixleMaterial)
        
        mask2.scale.set(2,2,2)
        
        


        scene.add(mask2)
        
        console.log(mask2.geometry.attributes.position.array)

            

        




    }
)

gltfLoader.load(
    '/mask.glb',
    (gltf) =>
    {
        
   

        mask=gltf.scene

        maskbackupGeo = mask.children[1].geometry.attributes.position.array;
        console.log(maskGeo)
        console.log(mask)

        mask.scale.set(1, 1, 1)
        mask.position.set(0, 0, -2)
        mask.traverse((child)=>{
            child.material = selectMaterial
        })

        // scene.add(mask)
        
        mask2backupGeo = new THREE.BufferGeometry;
       
        mask2backupGeo.setAttribute(
            'position',
            new THREE.BufferAttribute(maskbackupGeo,3)
        )
        
        mask2backup = new THREE.Points(mask2backupGeo, pixleMaterial)
        
        
        


        
        // scene.add(mask2backup)
        

            

        




    }
)


/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('orange', .5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight('#F5F5DC', 2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(- 5, 5, 3)
scene.add(directionalLight)

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 100)
if(sizes.width>860){
camera.position.set(0, 0, 20)
}
else{
    camera.position.set(0, 0,20)
}


scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.setClearColor( 'orange',.5);

// renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

raycaster.setFromCamera(mouse, camera)






/**
 * Animate
 */

let oldElapsedTime=null;

const clock = new THREE.Clock()
let previousTime = 0
const tick = () =>


// world.step(1 / 60, deltaTime, 3)
// let count = mask.children[1].geometry.attributes.position.count
// for(let i=0; i<count; i++){
// const x = mask.children[1].geometry.attributes.position.getX(i);
// const xsin = Math.sin(x+elapsedTime)
// mask.children[1].geometry.attributes.position.setZ(i, xsin)
// }
// mask.children[1].geometry.attributes.position.needsUpdate = true;

   
{


    


    for(const object of objectsToUpdate)
    {
   
    }
    
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    world.step(1 / 60, deltaTime, 3)

    if(mask2){
    
        // mask2.rotation.y+=.001
    let count = mask2.geometry.attributes.position.count

    for(let i=0; i<count; i++){
    if(mask2.geometry.attributes.position.getY(i)>mouse.y*4-.65&&mask2.geometry.attributes.position.getY(i)<mouse.y*4+.65&&mask2.geometry.attributes.position.getX(i)<6){
        // console.log(mouse.y)
        // console.log(mask2.geometry.attributes.position.getY(i))
        let Xposition = mask2.geometry.attributes.position.getX(i)+.1
        mask2.geometry.attributes.position.setX(i, Xposition)

        
    }
    else{
        mask2.geometry.attributes.position.setX(i, mask2backup.geometry.attributes.position.getX(i))

    };
   
   
}
    
mask2.geometry.attributes.position.needsUpdate = true;
mask2backup.geometry.attributes.position.needsUpdate = true;

}
    
    



   


    // if(box != null){
    // const intersects = raycaster.intersectObject(box.children[0].children[0])
    


    // if(intersects.length>0){

    //       box.children[0].children[1].children[0].material.color.set("yellow")
    //       console.log(intersects)
          
            
    //     }
    // else{

        
    //     box.children[0].children[1].children[0].material.color.set("violet")


    // }


    // }

  

 



    for(const object of objectsToUpdate)
    {
      
    }

 

    controls.update()



    
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()