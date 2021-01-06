import React, { Component } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { vertex } from "./shaders/vertex";
import { fragment } from "./shaders/fragment";
import gsap from "gsap";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

class Font extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0,
      paused: true,
      isRunning: false,

      data: {
        distortion: 0.0,
        bloomStrength: 0.5,
      },
    };

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.animate = this.animate.bind(this);
  }
  componentDidMount() {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({
  
    });

    this.width = this.mount.clientWidth;
    this.height = this.mount.clientHeight;
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.setSize(this.width, this.height);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.container = document.getElementById("scene");

    this.mount.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      45,
      this.width / this.height,
      0.01,
      100
    );
    this.camera.lookAt(new THREE.Vector3());
    this.camera.position.set(0, 0, 100);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.time = 0;
    this.setupResize();
    this.addPost();
    this.addObjects();
    this.animate();

    this.resize();
  }

  addPost() {
    this.renderScene = new RenderPass(this.scene, this.camera);

    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.0,
      0.4,
      0.65
    );

    this.bloomPass.threshold = this.state.data.bloomThreshold;
    this.bloomPass.strength = this.state.data.bloomStrength;
    this.bloomPass.radius = this.state.data.bloomRadius;

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(this.renderScene);
    this.composer.addPass(this.bloomPass);
  }

  addObjects() {
    let that = this;
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: "f", value: 0 },

        resolution: { type: "v4", value: new THREE.Vector4() },
        uvRate1: {
          value: new THREE.Vector2(1, 1),
        },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    /*    let meshes = [];

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        let m = this.material.clone();
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), m);
        
        mesh.position.x = i*1.1-5;
        mesh.position.z = j*1.1-5;
        meshes.push(mesh.scale)
        this.scene.add(mesh);
        mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.1
      }
    }

    this.scene.add(new THREE.AmbientLight('#59314f'))

    const light  = new THREE.PointLight('#45caf7',1,15.5)
    light.position.set(2,2,-4).multiplyScalar(1.5)
    this.scene.add(light);

    let t1 = gsap.timeline({repeat: -1,
    repeatDelay: 0
    })

    t1.to(meshes, {
      duration: 1,
      x: 1,
      y: 1,
      z: 1,
      yoyo: true,
      stagger: {
        grid: [10,10],
        from: 'center',
        amount: 1.5
      }
    }) */

    let count = 2 * 15;

    let geometry = new THREE.BoxBufferGeometry(1, 1, 1);

    this.mesh = new THREE.InstancedMesh(geometry, this.material, count ** 3);

    let random = new Float32Array(count ** 3);
    let depth = new Float32Array(count ** 3);
    let pos = new Float32Array(3 * count ** 3);

    let transform = new THREE.Object3D();

    let jj = 0;
    let ii = 0;
    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        for (let k = 0; k < count; k++) {
          transform.position.set(i - count / 2, j - count / 2, k - count / 2);
          transform.updateMatrix();
          random[ii] = Math.random();
          depth[ii] = j / count;
          pos[jj] = i / count;
          jj++;
          pos[jj] = j / count;
          jj++;
          pos[jj] = k / count;
          jj++;

          this.mesh.setMatrixAt(ii++, transform.matrix);
        }
      }
    }

    geometry.setAttribute(
      "random",
      new THREE.InstancedBufferAttribute(random, 1)
    );

    geometry.setAttribute(
      "depth",
      new THREE.InstancedBufferAttribute(depth, 1)
    );

    geometry.setAttribute("pos", new THREE.InstancedBufferAttribute(pos, 3));

    this.scene.add(this.mesh);


const color = "#45caf7";
const density = 0.01;
this.scene.fog = new THREE.FogExp2(color, density);
  }

  setupResize = () => {
    window.addEventListener("resize", this.resize);
  };

  resize = () => {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    console.log("resize");

    this.imageAspect = 853 / 1280;
    /* 
    let a1;
    let a2;

    if (this.height / this.width > this.imageAspect) {
      a1 = (this.width / this.height) * this.imageAspect;
      a2 = 1;
    } else {
      a1 = 1;
      a2 = this.height / this.width / this.imageAspect;
    }

    this.material.uniforms.resolution.value.x = this.width;
    this.material.uniforms.resolution.value.y = this.height;
    this.material.uniforms.resolution.value.z = a1;
    this.material.uniforms.resolution.value.w = a2;

    const dist = this.camera.position.z;
    const height = 1;
    this.camera.fov = 2* (180/Math.PI) * Math.atan(height/(2*dist));

    if (this.width / this.height > 1) {
      this.plane.scale.x = this.camera.aspect;
    } else {
      this.plane.scale.y = 1 / this.camera.aspect;
    }  */

    this.camera.updateProjectionMatrix();
    console.log(this.camera);
  };

  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  }

  start() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  }

  stop() {
    cancelAnimationFrame(this.frameId);
  }

  animate() {
    this.time += 0.05;
    
    this.material.uniforms.time.value = this.time;
    this.mesh.rotation.x = this.time * this.props.angle.current.spin / 8
    this.mesh.rotation.y = this.time * this.props.angle.current.spin /8
    this.camera.position.z = this.props.angle.current.value
    this.frameId = requestAnimationFrame(this.animate);

    //this.renderScene();
    this.composer.render();
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (
      <div
        id="scene"
        ref={(mount) => {
          this.mount = mount;
        }}
      />
    );
  }
}

export default Font;
