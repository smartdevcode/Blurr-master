

gsap.registerPlugin(ScrollTrigger);


// --- SETUP START ---
// Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll
const locoScroll = new LocomotiveScroll({
  el: document.querySelector("[data-scroll-container]"),
  smooth: true
});
// each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
locoScroll.on("scroll", ScrollTrigger.update);

// tell ScrollTrigger to use these proxy methods for the ".smooth-scroll" element since Locomotive Scroll is hijacking things
ScrollTrigger.scrollerProxy("[data-scroll-container]", {
  scrollTop(value) {
    return arguments.length ? locoScroll.scrollTo(value, {duration: 0, disableLerp: true}) : locoScroll.scroll.instance.scroll.y;
  }, // we don't have to define a scrollLeft because we're only scrolling vertically.
  getBoundingClientRect() {
    return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
  },
  // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
  pinType: document.querySelector("[data-scroll-container]").style.transform ? "transform" : "fixed"
});

// each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll. 
ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
ScrollTrigger.defaults({ scroller: "[data-scroll-container]" });


let body = document.querySelector("body")

ScrollTrigger.create({
  trigger: "#section3",
  start: "top 50%+=100px",
  endTrigger: "#section5",
  toggleActions: "play reverse play reverse",
  end: "bottom bottom",
  onToggle: self => {
    if(!self.isActive) {
      body.setAttribute('class', 'dark-mode')
    }else {
      body.setAttribute('class', 'light-mode')
    }
    console.log("toggled, isActive:", self.isActive)
  },
  onUpdate: self => {
    // document.
  }
});

let header = document.querySelector("header");

ScrollTrigger.create({
  trigger: "body",
  start: "top top",
  endTrigger: "footer",
  toggleActions: "play reverse play reverse",
  end: "bottom bottom",
  onToggle: self => {
    console.log("toggled, isActive:", self.isActive)
  },
  onUpdate: self => {
    console.log(self.direction, self.progress)
    console.log(self.progress.toFixed(2)*1)
    if(self.direction == 1) {
      header.setAttribute("class", "down")
    }
    if(self.direction == -1 && self.progress.toFixed(2)*1 < 1) {
      header.setAttribute("class", "up")
    }

    if(self.progress <= 0.01) {
      header.removeAttribute('class', 'up')
    }
  }
});

window.addEventListener("load", function () {
  let splitWords = function (selector) {
    var elements = document.querySelectorAll(selector);

    elements.forEach(function (el) {
      el.dataset.splitText = el.textContent;
      el.innerHTML = el.textContent
        .split(/\s/)
        .map(function (word) {
          return word
            .split("-")
            .map(function (word) {
              return '<span class="word">' + word + "</span>";
            })
            .join('<span class="hyphen">-</span>');
        })
        .join('<span class="whitespace"> </span>');
    });
  };

  let splitLines = function (selector) {
    var elements = document.querySelectorAll(selector);

    splitWords(selector);

    elements.forEach(function (el) {
      var lines = getLines(el);

      var wrappedLines = "";
      lines.forEach(function (wordsArr) {
        wrappedLines += '<span class="line"><span class="words">';
        wordsArr.forEach(function (word) {
          wrappedLines += word.outerHTML;
        });
        wrappedLines += "</span></span>";
      });
      el.innerHTML = wrappedLines;
    });
  };

  let getLines = function (el) {
    var lines = [];
    var line;
    var words = el.querySelectorAll("span");
    var lastTop;
    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      if (word.offsetTop != lastTop) {
        // Don't start with whitespace
        if (!word.classList.contains("whitespace")) {
          lastTop = word.offsetTop;

          line = [];
          lines.push(line);
        }
      }
      line.push(word);
    }
    return lines;
  };

  splitLines(".reveal-text");
  splitLines("h1")
  let revealText = document.querySelectorAll(".reveal-text");
  gsap.registerPlugin(ScrollTrigger);
  let revealLines = revealText.forEach((element) => {
    const lines = element.querySelectorAll(".words");
    const words = element.querySelectorAll(".word");
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: element
      }
    });
    tl.set(element, { autoAlpha: 1 });

    tl.from([words], 1, {
      yPercent: 100,
      translateZ: 0,
      rotateZ: [10, 0],
      ease: Power3.out,
    });
    
  });


const titles = document.querySelectorAll('.title');
const h1Tags = document.querySelectorAll('h1');
const h2Tags = document.querySelectorAll('h2');
const pTags = document.querySelectorAll('p');
splitLines(".title div")

titles.forEach((element) => {
  let icon = element.querySelector("i")
  let span = element.querySelector("span.words")
  let spanParent = span.parentNode
  let titleTl = gsap.timeline({
    scrollTrigger: {
      trigger: element,
    }
  })
  titleTl.from([spanParent, icon], 1, {
    width: 0,
    ease: Power2.out,
  })
})

pTags.forEach((element) => {
  let pTagsTl = gsap.timeline({
    scrollTrigger: {
      trigger: element
    }
  })

  pTagsTl.set(element, { autoAlpha: 1 });
  pTagsTl.from(element, 1, {
    yPercent: 25,
    opacity:0,
    ease: Power3.out,
    stagger: 2.5,
  });
})

h1Tags.forEach((element) => {
  const lines = element.querySelectorAll(".words");
  const words = element.querySelectorAll(".word");
  let h1TagsTl = gsap.timeline({
    scrollTrigger: {
      trigger: element,
    }
  });
  h1TagsTl.set(element, { autoAlpha: 1 });

  h1TagsTl.from([lines], 1, {
    yPercent: 100,
    translateZ: 0,
    ease: Power3.out,
  });
})

h2Tags.forEach((element) => {
  let h2TagsTl = gsap.timeline({
    scrollTrigger: {
      trigger: element
    }
  });

  h2TagsTl.from(element, 1, {
    yPercent: 100,
    ease: Power3.out,
  });
})

// reveal image
let revealImg = document.querySelectorAll(".reveal-img");

revealImg.forEach((container) => {
  let image = container.querySelector("img");
  let imgTl = gsap.timeline({
    scrollTrigger: {
      trigger: container
    }
  });

  imgTl.set(container, { autoAlpha: 1 });
  imgTl.from(container, 1.5, {
    xPercent: -100,
    ease: Power2.out
  });
  imgTl.from(image, 1.5, {
    xPercent: 100,
    scale: 1.3,
    delay: -1.5,
    ease: Power2.out
  });
});

let header = document.querySelector("header");
let logo = header.querySelector(".logo-brand");
let links = header.querySelectorAll("span");
let headerTl = gsap.timeline({
  scrollTrigger: {
    trigger: header
  }
})

headerTl.from([logo, links], 1, {
  opacity:0,
  ease: Power4.out
})

gsap.to(".parallax-img", {
  yPercent: 20,
  ease: "none",
  scrollTrigger: {
    trigger: ".parallax-img",
    scrub: true
  }, 
});

});


(function () {

  const link = document.querySelectorAll('nav > .hover-this');
  const cursor = document.querySelector('.cursor');
  cursor.style.zIndex = 1000;

  const animateit = function (e) {
        const span = this.querySelector('nav span');
        const { offsetX: x, offsetY: y } = e,
        { offsetWidth: width, offsetHeight: height } = this,

        move = 10,
        xMove = x / width * (move * 2) - move,
        yMove = y / height * (move * 2) - move;

        span.style.transform = `translate(${xMove}px, ${yMove}px)`;
        if(e.type === "mousemove") {
          cursor.style.transform = 'translate(-50%, -50%) scale(8)';
        }

        if (e.type === 'mouseleave') {
          span.style.transform = '';
          cursor.style.transform = "none"
        }
  };

  const editCursor = e => {
    const { clientX: x, clientY: y } = e;
    cursor.style.left = x + 'px';
    cursor.style.top = y + 'px';

    if (e.type === "mousemove") {
      cursor.style.display = "block";
    } else if (e.type === "mouseout") {
      cursor.style.display = "none";
    }
  };

  link.forEach(b => b.addEventListener('mousemove', animateit));
  link.forEach(b => b.addEventListener('mouseleave', animateit));
  window.addEventListener('mousemove', editCursor);
  window.addEventListener('mouseout', editCursor);

})();

var toggleBtn = document.querySelector("#toggle-button")
let flag = 0;
toggleBtn.addEventListener('click', function() {
  if(flag == 0) {
    document.querySelector("#nav-toggle").setAttribute('class', 'block')
    flag = 1
  }else {
    document.querySelector("#nav-toggle").setAttribute('class', 'hidden')
    flag = 0
  }
})

// Normal Button Animation

const btnSVGList = document.querySelectorAll("button.btn-arrow svg");

btnSVGList.forEach((svg) => {
  const line1 = svg.children[0];
  const line2 = svg.children[1];
  const line3 = svg.children[2];
  const btn = svg.parentElement;
  let btnColor = "white";

  if(btn.classList.contains("bg-white")) {
    btnColor = "black";
  }

  const svgAnimation = (e) => {

    const width = btn.offsetWidth;
    
    if(e.type === 'mouseover'){
      btn.style.border = `1px solid ${btnColor}`;
      btn.style.width = width + 9;

      svg.setAttribute('width', '27');  
      svg.setAttribute('height', '10');
      svg.setAttribute('viewBox', '0 0 27 10');
      svg.setAttribute('fill', 'none');

      line1.setAttribute('x1', '26.4655');
      line1.setAttribute('y1', '5.35355');
      line1.setAttribute('x2', '22.3305');
      line1.setAttribute('y2', '1.21848');
      line1.setAttribute('stroke', btnColor);
      
      line2.setAttribute('y1', '-0.5');
      line2.setAttribute('x2', '5.84787');
      line2.setAttribute('y2', '-0.5');
      line2.setAttribute('transform', 'matrix(-0.707107 0.707107 0.707107 0.707107 26.8191 5)');
      line2.setAttribute('stroke', btnColor);
      
      line3.setAttribute('x1', '0.449219');
      line3.setAttribute('y1', '5.03345');
      line3.setAttribute('x2', '26.1697');
      line3.setAttribute('y2', '5.03345');
      line3.setAttribute('stroke', btnColor);
      line3.setAttribute('duration', 2);

      
    } else {
      btn.style.border ='1px solid rgb(63 57 70 / var(--tw-border-opacity))';
      btn.style.width = width - 9;

      svg.setAttribute('width', '18');
      svg.setAttribute('height', '12');
      svg.setAttribute('viewBox', '0 0 18 12');
      svg.setAttribute('fill', 'red');

  
      line1.setAttribute('x1', '17.3892');
      line1.setAttribute('y1', '7.35355');
      line1.setAttribute('x2', '13.2542');
      line1.setAttribute('y2', '3.21848');
      line1.setAttribute('stroke', btnColor);
      
      line2.setAttribute('y1', '-0.5');
      line2.setAttribute('x2', '5.84787');
      line2.setAttribute('y2', '-0.5');
      line2.setAttribute('transform', 'matrix(-0.707107 0.707107 0.707107 0.707107 17.7428 7)');
      line2.setAttribute('stroke', btnColor);
      
      line3.setAttribute('x1', '0.699463');
      line3.setAttribute('y1', '7.03345');
      line3.setAttribute('x2', '17.0934');
      line3.setAttribute('y2', '7.03345');
      line3.setAttribute('stroke', btnColor);

    }
  }

  svg.parentElement.addEventListener("mouseover", svgAnimation);
  svg.parentElement.addEventListener("mouseleave", svgAnimation);

  const cursor = document.querySelector('.cursor');

  const hoverAnim = function (e) {
    // const span = this.querySelector('span');
    const { offsetX: x, offsetY: y } = e,
    { offsetWidth: width, offsetHeight: height } = this,

    move = 10,
    xMove = x / width * (move * 2) - move,
    yMove = y / height * (move * 2) - move;

    this.style.transform = `translate(${xMove}px, ${yMove}px)`;
    if(e.type === "mousemove") {
      cursor.style.transform = 'translate(-50%, -50%) scale(8)';
    }

    if (e.type === 'mouseleave') {
      this.style.transform = '';
      cursor.style.transform = "none"
    }
  };
  svg.parentElement.addEventListener("mousemove", hoverAnim);
  svg.parentElement.addEventListener("mouseleave", hoverAnim);
});



