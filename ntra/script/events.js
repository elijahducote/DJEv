import {htm} from "./utility";

import { RoundCarousel, RoundCarouselItem } from "round-carousel-component";

const node = htm(undefined,"div",{id:"carousel"});

// Create an array of Carousel Items
const items = Array(5)
	.fill('')
	.map((_, index) => ({
		alt: "",
		image: `https://cdn.jsdelivr.net/gh/ElijahDucote/DjEv@main/xtra/src/media/img/${index}.jpg`,
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

export function Events() {
  return node;
}