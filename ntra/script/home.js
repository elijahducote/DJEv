import {htm} from "./utility";
import {goto} from "./vanjs-router";
import { RoundCarousel, RoundCarouselItem } from "round-carousel-component";

function getFontSizeInEm(element) {
    const computedStyle = window.getComputedStyle(element);
    const fontSizePx = parseFloat(computedStyle.fontSize);
    const parentFontSizePx = parseFloat(window.getComputedStyle(element.parentElement).fontSize) || 16; // Default 16px if no parent

    return fontSizePx; // Convert px to em
}



export function Home() {
  const cta = htm(htm("Book Us","span",{class:"button-text"}),
    "button",
    {
      class: "button"
    }
  ),
  node = htm(undefined,"div",{id:"carousel"}),
  items = Array(5)
  	.fill('')
  	.map((_, index) => ({
  		alt: "",
  		image: `https://cdn.jsdelivr.net/gh/ElijahDucote/DjEV@main/ntra/src/media/flyers/${index}.jpg`,
  		content:""
      //content: `<div><strong>Round Carousel</strong><span>Slide number ${index + 1}</span></div>`
  }));
  
  const slides = new RoundCarousel(node, {
    items,
    itemWidth:720,
    showControls: true,
    nextButtonContent: "",
    prevButtonContent: ""
  });
  
  
  cta.addEventListener("click",function() {
    goto("booking");
  });

  return htm([
    htm("Looking for a DJ?",
      "span",
      {
        class: "home-heading"
      }
    ),

    htm(undefined,
      "div",
      {
        class: "home-separator"
      }

    ),

    cta,
    
    node,

    /*htm(undefined,
      "div",
      {
        class: "home-poster"
      }
    ),*/

    htm(undefined,
      "br"
    ),

    htm("About",
      "span",
      {
        class: "home-heading"
      }
    ),

    htm(undefined,
      "div",
      {
        class: "home-separator"
      }

    ),

    htm("DJ Ev spins Chill Lo-Fi - Chillwave, Chillhop, Lo-Fi-house, Funk-soul, & open format.",
      "span",
      {
        class: "home-description"
      }
    )

  ],
    "div",
    {
      class: "home-about"
    }

  );
}