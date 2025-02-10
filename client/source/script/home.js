import {htm} from "./utility";
import {goto} from "./vanjs-router";
import { RoundCarousel, RoundCarouselItem } from "round-carousel-component";

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
  		image: `https://cdn.jsdelivr.net/gh/ElijahDucote/DjEv@main/img/${index}.jpg`,
  		content:""
      //content: `<div><strong>Round Carousel</strong><span>Slide number ${index + 1}</span></div>`
  }));
  
  new RoundCarousel(node, {
    items,
    itemWidth:480,
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