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

const randomColors = [new THREE.Color("orange"), new THREE.Color("AFFF33"), new THREE.Color( "33BEFF"), new THREE.Color("3C21A9")]

const selectMaterial = new THREE.MeshStandardMaterial({color:'pink'})



let potGeo
let pot
let potMesh
let mask2
let mask2backup
let mask;
let mask2Geo
let mask2backupGeo
let maskGeo
let maskbackupGeo
let backupcolors
let potColors
const mouse = new THREE.Vector2()
mouse.x = null
mouse.y=null
mouse.y2 = null

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
let colorInside2
let colorOutside2
let colorInside3
let colorOutside3
gltfLoader.load(
    '/mask.glb',
    (gltf) =>
    {
        
   

        mask=gltf.scene

        maskGeo = mask.children[1].geometry.attributes.position.array;
        const facecolors = new Float32Array(maskGeo.length * 3)
        const colorInside = new THREE.Color('red')
        const colorOutside = new THREE.Color('blue')
        colorInside2 = new THREE.Color('green')
        colorOutside2 = new THREE.Color('yellow')
     

        
for(let i = 0; i < maskGeo.length; i++)
{
    const i3 = i * 3
    const mixedColor = colorInside.clone()  
    mixedColor.lerp(colorOutside, mask.children[1].geometry.attributes.position.array[i3+1]/2+.5)
    facecolors[i3    ] = mixedColor.r
    facecolors[i3 + 1] = mixedColor.g
    facecolors[i3 + 2] = mixedColor.b
}


let pixleMaterial = new THREE.PointsMaterial({
    color:"pink",
    size:.03,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true

})

const randomColors = [new THREE.Color("orange"), new THREE.Color("yellow"), new THREE.Color( "blue"), new THREE.Color("red"), new THREE.Color("violet")]
setInterval(() => {
    if(mask.children){
        
        let rand1 = Math.floor(Math.random()*(randomColors.length-1))
        let rand2 = Math.floor(Math.random()*(randomColors.length-1))
    colorInside2 = randomColors[rand1]

    colorOutside2 = randomColors[rand2]

    // console.log(colorInside2)
    // console.log(colorOutside2)

    backupcolors=new Float32Array(maskGeo.length * 3)
    for(let i = 0; i < maskGeo.length; i++)
    {
        var i3 = i * 3
        var mixedColor = colorInside2.clone()
        mixedColor.lerp(colorOutside2, mask.children[1].geometry.attributes.position.array[i3+1]/2+.5)
        backupcolors[i3    ] = mixedColor.r
        backupcolors[i3 + 1] = mixedColor.g
        backupcolors[i3 + 2] = mixedColor.b
    }
}
if(potGeo){
        
    let rand1 = Math.floor(Math.random()*(randomColors.length-1))
    let rand2 = Math.floor(Math.random()*(randomColors.length-1))
colorInside3 = randomColors[rand1]

colorOutside3 = randomColors[rand2]

// console.log(colorInside2)
// console.log(colorOutside2)

potColors=new Float32Array(maskGeo.length * 3)
for(let i = 0; i < maskGeo.length; i++)
{
    var i3 = i * 3
    var mixedColor = colorInside2.clone()
    mixedColor.lerp(colorOutside2, pot.children[0].geometry.attributes.position.array[i3+1]/2+.5)
    potColors[i3    ] = mixedColor.r
    potColors[i3 + 1] = mixedColor.g
    potColors[i3 + 2] = mixedColor.b
}
}
}, 4000);
       
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
        backupcolors=new Float32Array(maskGeo.length * 3)
        for(let i = 0; i < maskGeo.length; i++)
        {
            var i3 = i * 3
            var mixedColor = colorInside2.clone()
            mixedColor.lerp(colorOutside2, mask.children[1].geometry.attributes.position.array[i3+1]/2+.5)
            backupcolors[i3    ] = mixedColor.r
            backupcolors[i3 + 1] = mixedColor.g
            backupcolors[i3 + 2] = mixedColor.b
        }
        
        // console.log(backupcolors)
        mask2Geo.setAttribute('color', new THREE.BufferAttribute(facecolors,3))
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

        let pixleMaterial = new THREE.PointsMaterial({
            color:"pink",
            size:.03,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true
        })

        // scene.add(mask)
        // console.log(mask2.geometry.attributes)
        mask2backupGeo = new THREE.BufferGeometry;
       
        mask2backupGeo.setAttribute(
            'position',
            new THREE.BufferAttribute(maskbackupGeo,3)
        )
        
        
        mask2backup = new THREE.Points(mask2backupGeo, pixleMaterial)
        
        
        


        
        // scene.add(mask2backup)
        

            

        




    }
)
gltfLoader.load(
    '/pot2.glb',
    (gltf) =>
    {
        pot=gltf.scene
        let potGeoPoints = pot.children[0].geometry.attributes.position.array;

        let pixleMaterial = new THREE.PointsMaterial({
            color:"pink",
            size:.03,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true
        
        })
        colorInside3 = new THREE.Color('violet')
        colorOutside3= new THREE.Color('yellow')

        potColors=new Float32Array(potGeoPoints.length * 3)
        for(let i = 0; i < maskGeo.length; i++)
        {
            var i3 = i * 3
            var mixedColor = colorInside3.clone()
            mixedColor.lerp(colorOutside3, pot.children[0].geometry.attributes.position.array[i3+1]/2+.5)
            potColors[i3    ] = mixedColor.r
            potColors[i3 + 1] = mixedColor.g
            potColors[i3 + 2] = mixedColor.b
        }
        
        // console.log(backupcolors)
        
        
        potGeo = new THREE.BufferGeometry;
        
        potGeo.setAttribute(
            'position',
            new THREE.BufferAttribute(potGeoPoints,3)
        )
        potGeo.setAttribute('color', new THREE.BufferAttribute(potColors,3))


        potMesh = new THREE.Points(potGeo, pixleMaterial)
 
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

renderer.setClearColor( 'black',.5);

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
  
    if(mask2){
mask2.rotation.y+=.001
// mask2.rotation.x+=.001

    }


    


    for(const object of objectsToUpdate)
    {
   
    }
    
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    world.step(1 / 60, deltaTime, 3)
    
    if(mask2&&potMesh){
    
        // mask2.rotation.y+=.001
    let count = mask2.geometry.attributes.position.count

    for(let i=0; i<count; i++){
    // if(mask2.geometry.attributes.position.getY(i)>mouse.y*4-.65&&mask2.geometry.attributes.position.getY(i)<mouse.y*4+.65&&mask2.geometry.attributes.position.getX(i)<6){
        if(mask2.geometry.attributes.position.getY(i)<mouse.y*4){

        // console.log(mouse.y)
        // console.log(mask2.geometry.attributes.position.getY(i))
        
        let Xposition = mask2.geometry.attributes.position.getX(i)+.1
        let flow = "on"
        if(mask2.geometry.attributes.position.getX(i)<6&&mask2.geometry.attributes.position.getX(i)!==potMesh.geometry.attributes.position.getX(i)){
        mask2.geometry.attributes.position.setX(i, Xposition)   
        mask2.geometry.attributes.color.array[i*3]+=.02
        mask2.geometry.attributes.color.array[i*3+1]+=.02
        mask2.geometry.attributes.color.array[i*3+2]+=.02
        }
        else if(mask2.geometry.attributes.position.getX(i)>6){
            mask2.geometry.attributes.position.setX(i, potMesh.geometry.attributes.position.getX(i))
            mask2.geometry.attributes.position.setY(i, potMesh.geometry.attributes.position.getY(i))
            mask2.geometry.attributes.position.setZ(i, potMesh.geometry.attributes.position.getZ(i))
            mask2.geometry.attributes.color.array[i*3]=potColors[i*3]
            mask2.geometry.attributes.color.array[i*3+1]=potColors[i*3+1]
            mask2.geometry.attributes.color.array[i*3+2]=potColors[i*3+2]
            }

            
        
        
            



        
        // console.log(mask2.geometry.attributes.color)

        
    }
    else{
        // mask2.geometry.attributes.position.setX(i, mask2backup.geometry.attributes.position.getX(i))
        // mask2.geometry.attributes.position.setY(i, mask2backup.geometry.attributes.position.getY(i))
        // mask2.geometry.attributes.position.setZ(i, mask2backup.geometry.attributes.position.getZ(i))
        // if(display=="pot"){
        //  mask2.geometry.attributes.position.setX(i, potMesh.geometry.attributes.position.getX(i))
        //     mask2.geometry.attributes.position.setY(i, potMesh.geometry.attributes.position.getY(i))
        //     mask2.geometry.attributes.position.setZ(i, potMesh.geometry.attributes.position.getZ(i))
          
        // }

        // else{
        mask2.geometry.attributes.position.setX(i, mask2backup.geometry.attributes.position.getX(i))
        mask2.geometry.attributes.position.setY(i, mask2backup.geometry.attributes.position.getY(i))
        mask2.geometry.attributes.position.setZ(i, mask2backup.geometry.attributes.position.getZ(i))

        // }
        // if(mask2.geometry.attributes.color.array[i*3]>0){
            mask2.geometry.attributes.color.array[i*3]=backupcolors[i*3]
            mask2.geometry.attributes.color.array[i*3+1]=backupcolors[i*3+1]
            mask2.geometry.attributes.color.array[i*3+2]=backupcolors[i*3+2]

        // }
      
    };
   
   
}


    
mask2.geometry.attributes.position.needsUpdate = true;
mask2backup.geometry.attributes.position.needsUpdate = true;
mask2.geometry.attributes.color.needsUpdate=true;
backupcolors.update=true
potColors.update=true
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