import{W as h,S as f,n as S,P as u,T as w,d as l,N as g,e as z,f as M,g as R,h as v,a as x}from"./three.module-ffe6d0bc.js";import{O as y,c as G}from"./checker-213443de.js";const d=document.querySelector("#c"),r=new h({antialias:!0,canvas:d}),i=new f;{const t=new S(16777215,1);i.add(t)}const P=45,W=2,b=.1,F=100,s=new u(P,W,b,F);s.position.set(0,10,20);const p=new y(s,d);p.target.set(0,5,0);p.update();const T=new w;{const e=T.load(G);e.wrapS=l,e.wrapT=l,e.magFilter=g,e.colorSpace=z;const t=40/2;e.repeat.set(t,t);const o=new M(40,40),a=new R({map:e,side:v});a.color.setRGB(1.5,1.5,1.5);const c=new x(o,a);c.rotation.x=Math.PI*-.5,i.add(c)}function q(n){const e=n.domElement,t=e.clientWidth,o=e.clientHeight,a=e.width!==t||e.height!==o;return a&&n.setSize(t,o,!1),a}function m(n){if(q(r)){const e=r.domElement;s.aspect=e.clientWidth/e.clientHeight,s.updateProjectionMatrix()}r.render(i,s),requestAnimationFrame(m)}requestAnimationFrame(m);
//# sourceMappingURL=cameras-e411f1ca.js.map
