import HyperHTMLElement from "../node_modules/hyperhtml-element/esm/index.js";

export class PathValue extends HyperHTMLElement {

  constructor() {
    super();
  }

  render(res) {
    const seg = res.path.split(".");
    const parent = seg.length <2 ? undefined : seg.slice(0, seg.length-2).join(".");
    res.parentReduced ? this.setAttribute("parentReduced", res.changeReduced) : this.removeAttribute("parentReduced");
    res.parentComputed? this.setAttribute("parentComputed", res.changeComputed) : this.removeAttribute("parentComputed");
    res.changeReduced ? this.setAttribute("reduced", res.parentReduced) : this.removeAttribute("reduced");
    res.changeComputed ? this.setAttribute("computed", res.parentComputed) : this.removeAttribute("computed");
    res.path ? this.setAttribute("path", res.path) : this.removeAttribute("path");
    parent ?  this.setAttribute("parent", parent) : this.removeAttribute("parent");

    this.html`
      <div class="spaces" style="${"margin-left: " +(seg.length*10)+ "px"}">${(res.isParent ? "+" : " ")}</div>
      ${seg[seg.length-1]}
      <div class="start">${res.start}</div>
      <div class="reduced">${res.reduced}</div>
      <div class="computed">${res.computed}</div>
    `;
  }
}

customElements.define("path-value", PathValue);