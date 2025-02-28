import van from "vanjs-core";
import {list, reactive} from "vanjs-ext";
import { Route } from "vanjs-router";
import {ChevronsUp,Instagram,Youtube,Link,Loader} from "vanjs-feather";
import BlurryImageLoad from "./blurry-load";
import Home from "./home";

var Dfalt = "span",
itR8R = 0;

function throttle(functN, Dlay) {
  let pre = 0;
  return function() {
    if (Date.now() - pre > Dlay) {
      pre = Date.now();
      return functN.apply(this, arguments);
    } 
  }
}

function htm(content,nomer,attr) {
  const args = [];
  if (attr) args[0] = attr;
  if (!nomer) nomer = Dfalt;
  if (Array.isArray(content)) {
    let itR8 = content.length,
    nth = itR8;
    for (;itR8;--itR8) {
      args.push(content[nth - itR8]);
    }
  }
  else args.push(content);
  //return van.tags[nomer](attr,content);
  return van.tags[nomer].apply(null,args);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function interaction (e) {
  const elm = e.target,
  parent = elm.parentElement,
  attr = parent.parentElement.dataset.index;
  if (!attr) return;
  await sleep(1000);
  parent.style.transform = "none";
  window.open(links[parseInt(attr)],"EvMusicSocials","noreferrer,noopener");
}
const wrapper = document.getElementsByClassName("wrapper"),
app = wrapper[0],
blurryImageLoad = new BlurryImageLoad(),
socials = [Instagram({class:"icon",id:"instagram"}),Youtube({class:"icon",id:"youtube",stroke:"url(#gradi-yt)"}),Link({class:"icon",id:"linktree"})],
links = ["HTTPS://INSTAGRAM.COM/_EVMUSIC_","HTTPS://YOUTUBE.COM/@_EVMUSIC","HTTPS://LINKTR.EE/EVDMUSIC"],
iconname = ["HOME","DJEV","BOOK","NOTE"],
entity = ["instagram","youtube","linktree"];
socials[0].children[0].style.stroke = "none";
socials[1].children[1].style.stroke = "#FFFFFF";

document.addEventListener("touchmove", throttle(async function (e) {
  for (let i = 3;i;--i) {
    let tym = ((Math.random() * 3) | 0) || 1;
    await sleep(tym*500);
    socials[3 - i].parentNode.style.opacity = "0.0";
  }
},500));

function Menu() {
  const exit = htm("","img",{class:"exit-icon",src:"./CDN/img/svg/CRUX.svg"});
  exit.addEventListener("touchend", throttle(function () {
    wrapper[5].parentNode.addEventListener("transitionend",function(){
      Object.assign(wrapper[5].parentNode.style, {display:"none",visibility:"hidden",opacity:"0"});
    },{once:true});
    wrapper[5].parentNode.style.opacity = "0";
  },3000));
  van.add(wrapper[5],exit);
  return list(wrapper[5],reactive(["ome", "J Sets", "ook Us","laylists"]),function (v) {
	let section = htm([htm("","img",{class:"letter-icon",src:`./CDN/img/svg/${iconname[itR8R]}.svg`}),v],"h2");
	++itR8R;
	//van.add(wrapper[5],htm([htm("test","span"),v],"h2"));
	Dfalt = "br";
	van.add(wrapper[5],htm());
	return section;
  });
}

function Header() {
  let i = 3,
  nth;
  const img = htm(htm("","img",{src:"./CDN/img/logo_white.png"}),"div",{class:"header-img"}),
  drawer = htm(ChevronsUp({class:"icon",id:"drawer"}),"main",{class:"menu"});
  
  drawer.addEventListener("touchend", throttle(function () {
    this.addEventListener("transitionend",async function(){
      Object.assign(wrapper[5].parentNode.style, {display:"initial",visibility:"visible"});
      await sleep(100);
      wrapper[5].parentNode.style.opacity = "1";
    },{once:true});
  },2000));
  
  van.add(img,drawer);
  
  for (i = 3;i;--i) {
    nth = 3 - i;
    van.add(wrapper[nth + 1],htm(socials[nth],"main",{class:`newmedia social-${entity[nth]}`,"data-index":nth}));
    document.getElementById(entity[nth]).addEventListener("touchend",interaction);
  }
  van.add(wrapper[4],htm("","img",{src:"./CDN/img/PREVIEW_BG.jpg",class:"d-ev-music-image blurry-load","data-large":"./CDN/img/DJ_EV_new.png"}));
  Menu();
  return img;
}

function WebApp() {
  const loading = Loader({class:"icon spinner"});
  return Route({
      rule: "home",
      delayed: true,
      Loader: Header,
      onLoad: function () {
        const elm = this.element;
        /*this.element.addEventListener("animationend",function () {
          this.classList.remove("fadeIn");
          
        },{once:true});*/
        loading.addEventListener("animationiteration",function () {
          elm.style.opacity = "0.5";
          loading.style.animationPlayState = "paused";
          loading.classList.remove("spinner");
          loading.classList.add("fadeAway");
          loading.style.animationPlayState = "running";
          loading.addEventListener("animationend", function () {
            loading.remove();
            elm.style.opacity = "1.0";
            wrapper[1].firstChild.style.opacity = "1.0";
            wrapper[2].firstChild.style.opacity = "1.0";
            wrapper[3].firstChild.style.opacity = "1.0";
          },{once:true});
        },{once:true});
        this.show();
      },
      onFirst: function () {
        const elem = this.element;
        document.addEventListener("DOMContentLoaded", function () {
          van.add(elem.parentElement,htm(loading,"main"));
          loading.style.animationPlayState = "running";
        },{once:true});
        //van.add(this.element.parentElement,Loader({class:"icon"}));
      }
  });
}
van.add(app, WebApp);
blurryImageLoad.load();
/*van.add(wrapper[1],htm(socials[0],"main",{class:"social-instagram","data-index":0}));
document.getElementById("instagram").addEventListener("touchend",interaction);
van.add(wrapper[2],htm(socials[1],"main",{class:"social-youtube","data-index":1}));
document.getElementById("youtube").addEventListener("touchend",interaction);
van.add(wrapper[3],htm(socials[2],"main",{class:"social-linktree","data-index":2}));
document.getElementById("linktree").addEventListener("touchend",interaction);*/