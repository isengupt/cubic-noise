import React, { useRef, useEffect, useState } from "react";
import paper from "paper";
import "./App.css";
import SimplexNoise from "simplex-noise";
import Scene from "./Scene";
import gsap from "gsap";
const MenuLeft = ({ magnetIn, magnetOut, rotateMenu }) => {
  return (
    <>
      <nav class="nav">
        <a
          href="#"
          className="link"
          onMouseEnter={magnetIn}
          onMouseLeave={magnetOut}
          onClick={rotateMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="16"
            height="16"
          >
            <path
              fill-rule="evenodd"
              d="M8.156 1.835a.25.25 0 00-.312 0l-5.25 4.2a.25.25 0 00-.094.196v7.019c0 .138.112.25.25.25H5.5V8.25a.75.75 0 01.75-.75h3.5a.75.75 0 01.75.75v5.25h2.75a.25.25 0 00.25-.25V6.23a.25.25 0 00-.094-.195l-5.25-4.2zM6.906.664a1.75 1.75 0 012.187 0l5.25 4.2c.415.332.657.835.657 1.367v7.019A1.75 1.75 0 0113.25 15h-3.5a.75.75 0 01-.75-.75V9H7v5.25a.75.75 0 01-.75.75h-3.5A1.75 1.75 0 011 13.25V6.23c0-.531.242-1.034.657-1.366l5.25-4.2h-.001z"
            ></path>
          </svg>
        </a>
      </nav>
    </>
  );
};

const MenuRight = ({ magnetIn, magnetOut, rotateMenu }) => {
  return (
    <>
      <nav class="nav">
        <a
          href="#"
          className="link"
          onMouseEnter={magnetIn}
          onMouseLeave={magnetOut}
          onClick={rotateMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="16"
            height="16"
          >
            <path
              fill-rule="evenodd"
              d="M0 7.75A.75.75 0 01.75 7h14.5a.75.75 0 010 1.5H.75A.75.75 0 010 7.75z"
            ></path>
          </svg>
        </a>
        <a
          href="#"
          className="link"
          onMouseEnter={magnetIn}
          onMouseLeave={magnetOut}
          onClick={rotateMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="16"
            height="16"
          >
            <path
              fill-rule="evenodd"
              d="M3.22 9.78a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0l4.25 4.25a.75.75 0 01-1.06 1.06L8 6.06 4.28 9.78a.75.75 0 01-1.06 0z"
            ></path>
          </svg>
        </a>
        <a
          href="#"
          className="link"
          onMouseEnter={magnetIn}
          onMouseLeave={magnetOut}
          onClick={rotateMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="16"
            height="16"
          >
            <path
              fill-rule="evenodd"
              d="M12.78 6.22a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06 0L3.22 7.28a.75.75 0 011.06-1.06L8 9.94l3.72-3.72a.75.75 0 011.06 0z"
            ></path>
          </svg>
        </a>
      </nav>
    </>
  );
};

export default function Cursor() {
  const mouse = useRef(null);
  const canvas = useRef(null);

  let lastX = 1000;
  let lastY = 1000;
  let clientX = 1000;
  let clientY = 1000;
  const [stuck, setStuck] = useState(false);
  const [[stuckX, stuckY], setStuckCoords] = useState([-100, -100]);

  const magnetIn = (e) => {
    setStuck(true);
    const navItem = e.currentTarget;
    const navItemBox = navItem.getBoundingClientRect();
    setStuckCoords([
      Math.round(navItemBox.left + navItemBox.width / 2),
      Math.round(navItemBox.top + navItemBox.height / 2),
    ]);
    //stuckX = Math.round(navItemBox.left + navItemBox.width / 2);
    //stuckY = Math.round(navItemBox.top + navItemBox.height / 2);
    //console.log(navItem)
  };

  const magnetOut = () => {
    setStuck(false);
  };

  const handleMouseMove = (e) => {
    clientX = e.clientX;
    clientY = e.clientY;
    mouse.current.style.left = `${clientX - 2.5}px`;
    mouse.current.style.top = `${clientY - 2.5}px`;
    // console.log(stuck);
  };

  const initCanvas = () => {
    paper.setup(canvas.current);

    const polygon = new paper.Path.RegularPolygon(new paper.Point(0, 0), 8, 15);
    polygon.strokeColor = "#E963FE";
    polygon.strokeWidth = 1;

    const polygon1 = new paper.Path.RegularPolygon(
      new paper.Point(0, 0),
      8,
      15
    );
    polygon1.strokeColor = "#3DB1FB";
    polygon1.strokeWidth = 1;

    // polygon.smooth();
    const shapeBounds = {
      width: 50,
      height: 50,
    };

    const noiseScale = 150; // speed
    const noiseRange = 4; // range of distortion
    let isNoisy = false; // state

    const noiseObjects = polygon.segments.map(() => new SimplexNoise());
    const noise1Objects = polygon1.segments.map(() => new SimplexNoise());
    let bigCoordinates = [];

    let group = new paper.Group([polygon]);
    let group1 = new paper.Group([polygon1]);
    group.applyMatrix = false;
    group1.applyMatrix = false;

    const lerp = (a, b, n) => {
      return (1 - n) * a + n * b;
    };

    const map = (value, in_min, in_max, out_min, out_max) => {
      return (
        ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
      );
    };

    // if (clientX <= 70 && clientY <= 70) {
    //   isStuck = true;
    // } else {
    //   isStuck = false;
    // }

    paper.view.onFrame = (event) => {
      if (!stuck) {
        // move circle around normally
        lastX = lerp(lastX, clientX, 0.2);
        lastY = lerp(lastY, clientY, 0.2);
        group.position = new paper.Point(lastX, lastY);
        group1.position = new paper.Point(lastX, lastY);
      } else if (stuck) {
        lastX = lerp(lastX, stuckX, 0.2);
        lastY = lerp(lastY, stuckY, 0.2);
        group.position = new paper.Point(lastX, lastY);
        group1.position = new paper.Point(lastX, lastY);
      }

      if (stuck && polygon.bounds.width < shapeBounds.width) {
        // scale up the shape
        polygon.scale(1.08);
        polygon1.scale(1.08);
      } else if (!stuck && polygon.bounds.width > 30) {
        // remove noise
        if (isNoisy) {
          polygon.segments.forEach((segment, i) => {
            segment.point.set(bigCoordinates[i][0], bigCoordinates[i][1]);
          });
          polygon1.segments.forEach((segment, i) => {
            segment.point.set(bigCoordinates[i][0], bigCoordinates[i][1]);
          });

          isNoisy = false;
          bigCoordinates = [];
        }
        // scale down the shape
        const scaleDown = 0.85;
        polygon.scale(scaleDown);
        polygon1.scale(scaleDown);
      }
      /*  else {
        // console.log(lastX);
        lastX = lerp(lastX, 30, 0.3);
        lastY = lerp(lastY, 30, 0.3);
        group.position = new paper.Point(lastX, lastY);
      } */

      if (stuck && polygon.bounds.width >= shapeBounds.width) {
        isNoisy = true;
        // first get coordinates of large circle
        if (bigCoordinates.length === 0) {
          polygon.segments.forEach((segment, i) => {
            bigCoordinates[i] = [segment.point.x, segment.point.y];
          });
          polygon1.segments.forEach((segment, i) => {
            bigCoordinates[i] = [segment.point.x, segment.point.y];
          });
        }

        // loop over all points of the polygon
        polygon.segments.forEach((segment, i) => {
          // get new noise value
          // we divide event.count by noiseScale to get a very smooth value
          const noiseX = noiseObjects[i].noise2D(event.count / noiseScale, 0);
          const noiseY = noiseObjects[i].noise2D(event.count / noiseScale, 1);

          // map the noise value to our defined range
          const distortionX = map(noiseX, -1, 1, -noiseRange, noiseRange);
          const distortionY = map(noiseY, -1, 1, -noiseRange, noiseRange);

          // apply distortion to coordinates
          const newX = bigCoordinates[i][0] + distortionX;
          const newY = bigCoordinates[i][1] + distortionY;

          // set new (noisy) coodrindate of point
          segment.point.set(newX, newY);
        });

        polygon1.segments.forEach((segment, i) => {
          // get new noise value
          // we divide event.count by noiseScale to get a very smooth value
          const noiseX = noise1Objects[i].noise2D(event.count / noiseScale, 0);
          const noiseY = noise1Objects[i].noise2D(event.count / noiseScale, 1);

          // map the noise value to our defined range
          const distortionX = map(noiseX, -1, 1, -noiseRange, noiseRange);
          const distortionY = map(noiseY, -1, 1, -noiseRange, noiseRange);

          // apply distortion to coordinates
          const newX = bigCoordinates[i][0] + distortionX;
          const newY = bigCoordinates[i][1] + distortionY;

          // set new (noisy) coodrindate of point
          segment.point.set(newX, newY);
        });
      }
      polygon.smooth();
      polygon1.smooth();
    };
  };

  useEffect(() => {
    mouse.current.style.left = "-100px";
    mouse.current.style.top = "-100px";

    canvas.current.width = window.innerWidth;
    canvas.current.height = window.innerHeight;

    initCanvas();
  });

  const [rotate, setRotate] = useState(false);
  const angle = React.useRef({
    value: 100,
    spinning: !rotate,
    spin: 1,
  });

  function rotateMenu() {
    console.log("hello");
    setRotate((currentRotate) => !currentRotate);
    if (!rotate) {
      gsap.to(angle.current, {
        duration: 1,
        value: 30,
        ease: "power2.inOut",
      });
      gsap.to(angle.current, {
        duration: 1,
        spin: 0,
        ease: "power2.inOut",
      });
    } else {
      gsap.to(angle.current, {
        duration: 1,
        value: 100,
        ease: "power2.inOut",
      });
      gsap.to(angle.current, {
        duration: 1,
        spin: 1,
        ease: "power2.inOut",
      });
    }
    angle.current.spinning = rotate;
  }

  function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function translateMenu() {
    setRotate((currentRotate) => !currentRotate);
    if (!rotate) {
      gsap.to(angle.current, {
        duration: 1,
        value: randomIntFromInterval(-10, 20),
        ease: "power2.inOut",
      });
      gsap.to(angle.current, {
        duration: 1,
        spin: 0,
        ease: "power2.inOut",
      });
    } else {
      gsap.to(angle.current, {
        duration: 1,
        value: 100,
        ease: "power2.inOut",
      });
      gsap.to(angle.current, {
        duration: 1,
        spin: 1,
        ease: "power2.inOut",
      });
    }

    /*  gsap.to(angle.current, {
        duration: 1,
        spin: 0,
        ease: "power2.inOut",
        delay: 1
      });  */
  }

  return (
    <main className="page-header">
      <Scene angle={angle} />
      <div onMouseMove={handleMouseMove} className="container">
        <div ref={mouse} className="cursor cursor--small" />
        <canvas ref={canvas} className="cursor cursor--canvas" />
        <div className="section">
          <div className="sidebar left">
            <MenuLeft
              rotateMenu={rotateMenu}
              magnetIn={magnetIn}
              magnetOut={magnetOut}
            />

            <a
              href="#"
              className="link full__link"
              onMouseEnter={magnetIn}
              onMouseLeave={magnetOut}
              onClick={translateMenu}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                width="16"
                height="16"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.75 2a.75.75 0 01.75.75V7h4.25a.75.75 0 110 1.5H8.5v4.25a.75.75 0 11-1.5 0V8.5H2.75a.75.75 0 010-1.5H7V2.75A.75.75 0 017.75 2z"
                ></path>
              </svg>
            </a>
          </div>
          <div className="content">
            <div className="text__contain">
              <div>
                Welcome
                <span className="hero__span">to</span>
              </div>

              <div>
                Digital
                <span className="large__hero">Dream</span>
              </div>
            </div>
          </div>
          <div className="sidebar right">
            <MenuRight
              rotateMenu={rotateMenu}
              magnetIn={magnetIn}
              magnetOut={magnetOut}
            />

            <a
              href="#"
              className="link full__link"
              onMouseEnter={magnetIn}
              onMouseLeave={magnetOut}
              onClick={translateMenu}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                width="16"
                height="16"
              >
                <path
                  fill-rule="evenodd"
                  d="M2.75 2.5a.25.25 0 00-.25.25v2.5a.75.75 0 01-1.5 0v-2.5C1 1.784 1.784 1 2.75 1h2.5a.75.75 0 010 1.5h-2.5zM10 1.75a.75.75 0 01.75-.75h2.5c.966 0 1.75.784 1.75 1.75v2.5a.75.75 0 01-1.5 0v-2.5a.25.25 0 00-.25-.25h-2.5a.75.75 0 01-.75-.75zM1.75 10a.75.75 0 01.75.75v2.5c0 .138.112.25.25.25h2.5a.75.75 0 010 1.5h-2.5A1.75 1.75 0 011 13.25v-2.5a.75.75 0 01.75-.75zm12.5 0a.75.75 0 01.75.75v2.5A1.75 1.75 0 0113.25 15h-2.5a.75.75 0 010-1.5h2.5a.25.25 0 00.25-.25v-2.5a.75.75 0 01.75-.75z"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
