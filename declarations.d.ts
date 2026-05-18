declare module "*.mp4" {
    const src: string;
    export default src;
}

// Allow importing global CSS/SCSS files as side-effect imports
declare module "*.css";
declare module "*.scss";

// CSS module imports (e.g. *.module.css / *.module.scss) return a mapping
declare module "*.module.css" {
    const classes: { readonly [key: string]: string };
    export default classes;
}

declare module "*.module.scss" {
    const classes: { readonly [key: string]: string };
    export default classes;
}