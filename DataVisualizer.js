class DataVisualizer {
    constructor({
        baseMapURL,
        dataMapURL,
        width,
        height,
        dataDepth,
    }) {
        this.baseMapURL = baseMapURL;
        this.dataMapURL =  dataMapURL;
        this.width = width;
        this.height = height;
        this.dataDepth = dataDepth;
    }

    init() {
        this.scene = new THREE.Scene();
        // camera
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.set(0, 50, 50);
        // renderer
        const rendererOptions = {
            antialias: true,
        };
        this.renderer = new THREE.WebGLRenderer(rendererOptions);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // set up lights
        this.setupLights();
        // add it to the html
        document.body.appendChild(this.renderer.domElement);

        const materials = [new THREE.MeshPhongMaterial()];

        const mergedGeometry = new THREE.Geometry();

        for(let j = 0; j < 10; j++) {
            const cubeGeometry = new THREE.CubeGeometry(1, 1, 1);
            const cube = new THREE.Mesh(cubeGeometry);
            cube.applyMatrix(new THREE.Matrix4().makeTranslation(j * 5, 0, 0));
            for(let k = 0; k < cubeGeometry.faces.length; k++){
                cubeGeometry.faces[k].materialIndex = 0;
            }
            mergedGeometry.merge(cubeGeometry, cube.matrix);
        }

        const mergedMesh = new THREE.Mesh(mergedGeometry, materials);

        this.scene.add(mergedMesh);

        this.control = new THREE.OrbitControls(this.camera, this.renderer.domElement);

        this.animate();
        console.log('DataVisualizer inited');
    }

    setupLights(){
        const lights = [];
        const light1 = new THREE.PointLight(0xffffff, 0.5, 0);
        light1.position.set(0,200,0);
        lights.push(light1);
        const light2 = new THREE.PointLight(0xffffff, 0.5, 0);
        light2.position.set(100,100,0);
        lights.push(light2);
        const light3 = new THREE.PointLight(0xffffff, 0.5, 0);
        light3.position.set(-100,-200,-100);
        lights.push(light3);
        for(let i = 0; i < lights.length; i++ ){
            this.scene.add(lights[i]);
        }
    }

    animate() {
        this.renderer.render(this.scene, this.camera);
        // put your objects to draw here
        this.control.update();
        requestAnimationFrame(() => this.animate());
    }
}