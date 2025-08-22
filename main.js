const socket = io();
const container = document.getElementById("game-container");
let otherPlayers = {};
let moveForward=false, moveBackward=false, moveLeft=false, moveRight=false;
const speed = 0.1;

document.getElementById("join-button").addEventListener("click", ()=>{startGame();});

function startGame(){
    document.getElementById("join-button").style.display="none";

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
    const renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(window.innerWidth,window.innerHeight);
    container.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff,1); light.position.set(5,10,7); scene.add(light);

    // Ground
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(100,100), new THREE.MeshLambertMaterial({color:0x228B22}));
    ground.rotation.x=-Math.PI/2; scene.add(ground);

    // Player
    const player = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshLambertMaterial({color:0xff0000}));
    player.position.y=0.5; scene.add(player);

    // Keyboard
    window.addEventListener("keydown",(e)=>{if(e.key==="w")moveForward=true;if(e.key==="s")moveBackward=true;if(e.key==="a")moveLeft=true;if(e.key==="d")moveRight=true;});
    window.addEventListener("keyup",(e)=>{if(e.key==="w")moveForward=false;if(e.key==="s")moveBackward=false;if(e.key==="a")moveLeft=false;if(e.key==="d")moveRight=false;});

    socket.on("updatePlayers",(players)=>{otherPlayers=players;});

    function animate(){
        requestAnimationFrame(animate);
        if(moveForward)player.position.z-=speed;
        if(moveBackward)player.position.z+=speed;
        if(moveLeft)player.position.x-=speed;
        if(moveRight)player.position.x+=speed;

        socket.emit("move",{x:player.position.x,y:player.position.y,z:player.position.z});

        // Draw other players
        for(let id in otherPlayers){
            if(id===socket.id)continue;
            let p=otherPlayers[id];
            let mesh=scene.getObjectByName(id);
            if(!mesh){mesh=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshLambertMaterial({color:0x0000ff}));mesh.name=id;scene.add(mesh);}
            mesh.position.set(p.x,p.y,p.z);
        }

        camera.position.x=player.position.x;
        camera.position.z=player.position.z+5;
        camera.position.y=player.position.y+2;
        camera.lookAt(player.position);

        renderer.render(scene,camera);
    }

    animate();
}
