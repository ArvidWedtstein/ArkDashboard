import { Link, NavLink, routes } from "@redwoodjs/router";
import clsx from "clsx";
import { memo, useState } from "react";
import { useAuth } from "src/auth";
const Icon = (icon: string) => {
  // FontAwesome Light Icons
  const icons = {
    home: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 576 512"
        className="h-5 w-5 fill-current stroke-current"
      >
        <path d="M 575.1 256 c 0 -4.435 -1.831 -8.84 -5.423 -12 l -58.6 -51.87 c 0.002 -0.0938 0 0.0938 0 0 l 0.0247 -144.1 c 0 -8.844 -7.156 -15.1 -15.1 -15.1 l -95.1 0.0074 c -8.844 0 -15.1 7.156 -15.1 15.1 L 383.1 79.37 l -85.42 -75.37 c -3.016 -2.656 -6.797 -3.997 -10.58 -3.997 c -3.781 0 -7.563 1.341 -10.58 3.997 L 5.423 244 C 1.831 247.2 0.0005 251.6 0.0005 256 c 0 8.924 7.241 15.99 16.05 15.99 c 3.758 0 7.521 -1.313 10.53 -3.993 l 37.42 -33.02 v 197 c 0 44.12 35.89 79.1 79.1 79.1 h 287.1 c 44.11 0 79.1 -35.87 79.1 -79.1 V 234.1 L 549.4 268 c 3.031 2.688 6.812 3.1 10.58 3.1 C 568.7 271.1 575.1 264.9 575.1 256 z M 415.1 64 h 63.1 v 100.1 l -63.1 -56.47 V 64 z M 479.1 208 v 223.1 c 0 26.47 -21.53 47.1 -47.1 47.1 H 144 c -26.47 0 -47.1 -21.53 -47.1 -47.1 V 208 c 0 -0.377 -0.1895 -0.6914 -0.2148 -1.062 L 288 37.34 l 192.2 169.6 C 480.2 207.3 479.1 207.6 479.1 208 z z v 95.1 z" />
      </svg>
    ),
    basespot: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 512"
        className="h-5 w-5 fill-current stroke-current"
      >
        <path d="M320 128c0 8.844 7.156 16 16 16S352 136.7 352 127.8V16.01c0-8.844-7.156-16-16-16h-320c-8.844 0-16 7.156-16 16V208c0 4.25 1.688 8.312 4.688 11.31L64 278.6V496C64 504.8 71.16 512 80 512S96 504.8 96 496v-224c0-4.25-1.688-8.312-4.688-11.31L32 201.4V32h80v64c0 8.844 7.156 16 16 16S144 104.8 144 96V32h64v64c0 8.844 7.156 16 16 16S240 104.8 240 96V32H320V128zM176 144C149.5 144 128 165.5 128 192v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V192C224 165.5 202.5 144 176 144zM192 224H160V192c0-8.822 7.178-16 16-16S192 183.2 192 192V224zM490.7 255.1h-85.32C393.6 255.1 384 265.5 384 277.3v85.26c0 11.88 9.633 21.38 21.39 21.38h85.32c11.76 0 21.39-9.625 21.39-21.38V277.3C512.1 265.6 502.6 255.1 490.7 255.1zM480.1 351.1h-64.05l-.0205-63.98h64.01L480.1 351.1zM622.9 242.8l-151.4-137.7C464.8 99.03 456.4 96 447.1 96s-16.83 3.031-23.48 9.084L273.1 242.7C262.2 252.6 256 266.7 256 281.4V448c0 35.35 28.65 64 64 64h255.1c35.35 0 63.1-28.56 64-63.9L640 281.2C640 266.6 633.8 252.6 622.9 242.8zM607.1 448c-.002 17.6-14.4 32-32 32H320c-17.67 0-32-14.33-32-32V281.4c0-5.738 2.42-11.21 6.666-15.07l153.3-138.4l153.4 138.4C605.6 270.2 608 275.7 608 281.4L607.1 448z" />
      </svg>
    ),
    calculator: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        className="h-5 w-5 fill-current stroke-current"
      >
        <path d="M336 128H384v48c0 8.844 7.156 16.04 16 16.04S416 184.8 416 176V128h48C472.8 128 480 120.9 480 112S472.8 96 464 96H416V48c0-8.844-7.156-15.96-16-15.96S384 39.16 384 48V96h-48C327.2 96 320 103.2 320 112S327.2 128 336 128zM168.6 343.4c-6.254-6.254-16.37-6.254-22.63 0L112 377.4l-33.94-33.94c-6.254-6.254-16.37-6.254-22.63 0s-6.254 16.37 0 22.63L89.37 400l-33.94 33.94c-6.254 6.254-6.254 16.37 0 22.63s16.37 6.254 22.63 0L112 422.6l33.94 33.94c6.254 6.254 16.37 6.254 22.63 0s6.254-16.37 0-22.63L134.6 400l33.94-33.94C174.8 359.8 174.8 349.7 168.6 343.4zM48 128h128C184.8 128 192 120.8 192 112S184.8 96 176 96h-128C39.16 96 32 103.2 32 112S39.16 128 48 128zM496 240h-224v-224C272 7.156 264.8 0 256 0S240 7.156 240 16v224h-224C7.156 240 0 247.2 0 256s7.156 16 16 16h224v224c0 8.844 7.156 16 16 16s16-7.156 16-16v-224h224C504.8 272 512 264.8 512 256S504.8 240 496 240zM464 416h-128c-8.844 0-16 7.156-16 16s7.156 16 16 16h128c8.844 0 16-7.156 16-16S472.8 416 464 416zM464 352h-128c-8.844 0-16 7.156-16 16s7.156 16 16 16h128c8.844 0 16-7.156 16-16S472.8 352 464 352z" />
      </svg>
    ),
    gtw: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        className="h-5 w-5 fill-current stroke-current"
      >
        <path d="M278.1 128H229.7C200.1 128 176 152.1 176 181.6c0 8.844 7.156 16 16 16s16-7.156 16-16C208 169.7 217.7 160 229.7 160h48.47C292.4 160 304 171.6 304 185.9c0 9.875-5.469 18.75-14.53 23.27L248.6 230.3C243.3 233.1 240 238.6 240 244.5V272C240 280.8 247.2 288 256 288s16-7.156 16-16V254.3l32-16.61c19.75-9.875 32-29.76 32-51.82C336 153.9 310 128 278.1 128zM256 312c-11.04 0-20 8.953-20 20C236 343 244.1 352 256 352s20-8.955 20-20C276 320.1 267 312 256 312zM256 31.1c-141.4 0-255.1 93.13-255.1 208c0 47.63 19.91 91.25 52.91 126.3c-14.87 39.5-45.87 72.88-46.37 73.25c-6.623 7-8.373 17.25-4.623 26C5.816 474.3 14.38 480 24 480c61.49 0 109.1-25.75 139.1-46.25c28.1 9 60.16 14.25 92.9 14.25c141.4 0 255.1-93.13 255.1-208S397.4 31.1 256 31.1zM256 416c-28.25 0-56.24-4.25-83.24-12.75c-9.516-3.068-19.92-1.461-28.07 4.338c-22.1 16.25-58.54 35.29-102.7 39.66c11.1-15.12 29.75-40.5 40.74-69.63l.1289-.3398c4.283-11.27 1.791-23.1-6.43-32.82C47.51 313.1 32.06 277.6 32.06 240c0-97 100.5-176 223.1-176c123.5 0 223.1 79 223.1 176S379.5 416 256 416z" />
      </svg>
    ),
    tribes: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 fill-current stroke-current"
        viewBox="0 0 640 512"
      >
        <path d="M319.9 320c57.41 0 103.1-46.56 103.1-104c0-57.44-46.54-104-103.1-104c-57.41 0-103.1 46.56-103.1 104C215.9 273.4 262.5 320 319.9 320zM319.9 144c39.68 0 71.96 32.3 71.96 72S359.5 288 319.9 288S247.9 255.7 247.9 216S280.2 144 319.9 144zM369.9 352H270.1C191.6 352 128 411.7 128 485.3C128 500.1 140.7 512 156.4 512h327.2C499.3 512 512 500.1 512 485.3C512 411.7 448.4 352 369.9 352zM160.2 480c3.021-53.41 51.19-96 109.1-96H369.9c58.78 0 106.9 42.59 109.1 96H160.2zM512 160c44.18 0 80-35.82 80-80S556.2 0 512 0c-44.18 0-80 35.82-80 80S467.8 160 512 160zM512 32c26.47 0 48 21.53 48 48S538.5 128 512 128s-48-21.53-48-48S485.5 32 512 32zM128 160c44.18 0 80-35.82 80-80S172.2 0 128 0C83.82 0 48 35.82 48 80S83.82 160 128 160zM128 32c26.47 0 48 21.53 48 48S154.5 128 128 128S80 106.5 80 80S101.5 32 128 32zM561.1 192H496c-11.16 0-22.08 2.5-32.47 7.438c-7.984 3.797-11.39 13.34-7.594 21.31s13.38 11.39 21.31 7.594C483.3 225.5 489.6 224 496 224h65.08C586.1 224 608 246.7 608 274.7V288c0 8.844 7.156 16 16 16S640 296.8 640 288V274.7C640 229.1 604.6 192 561.1 192zM162.8 228.3c7.938 3.797 17.53 .375 21.31-7.594c3.797-7.969 .3906-17.52-7.594-21.31C166.1 194.5 155.2 192 144 192H78.92C35.41 192 0 229.1 0 274.7V288c0 8.844 7.156 16 16 16S32 296.8 32 288V274.7C32 246.7 53.05 224 78.92 224H144C150.4 224 156.7 225.5 162.8 228.3z" />
      </svg>
    ),
    story: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 512"
        className="h-5 w-5 fill-current stroke-current"
      >
        <path d="M633.6 243.2l-96-72c-7.031-5.281-17.06-3.891-22.41 3.203c-5.281 7.062-3.844 17.09 3.219 22.39L576 240H368V125.7C395.6 118.6 416 93.79 416 64c0-35.34-28.65-64-64-64C316.7 0 288 28.66 288 64c0 29.79 20.44 54.6 48 61.74V240h-192V125.7C171.6 118.6 192 93.79 192 64c0-35.34-28.65-64-64-64C92.65 0 64 28.66 64 64c0 29.79 20.44 54.6 48 61.74V240h-96C7.156 240 0 247.2 0 256s7.156 16 16 16h192v114.3C180.4 393.4 160 418.2 160 448c0 35.34 28.65 64 64 64c35.35 0 64-28.66 64-64c0-29.79-20.45-54.6-48-61.74V272h336l-57.6 43.2c-7.062 5.297-8.5 15.33-3.219 22.39C518.3 341.8 523.2 344 528 344c3.344 0 6.719-1.047 9.594-3.203l96-72C637.6 265.8 640 261 640 256S637.6 246.2 633.6 243.2zM320 64c0-17.64 14.36-32 32-32s32 14.36 32 32s-14.36 32-32 32S320 81.64 320 64zM96 64c0-17.64 14.36-32 32-32s32 14.36 32 32S145.6 96 128 96S96 81.64 96 64zM256 448c0 17.64-14.36 32-32 32s-32-14.36-32-32s14.36-32 32-32S256 430.4 256 448z" />
      </svg>
    ),
    dinos: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 512"
        className="h-5 w-5 fill-current stroke-current"
      >
        <path d="M528 248c-8.875 0-16 7.125-16 16s7.125 16 16 16S544 272.9 544 264S536.9 248 528 248zM619 179l-47.88-17.5C524.4 144.4 523.5 144 513.3 144C484.9 144 460 162.3 451.5 188.4l-1.25 4.5C395 199.6 352 246.9 352 304v72C352 398 333.1 416 312 416c-22 0-40-18-40-40v-240C272 61 211 0 136 0S0 61 0 136v223.5c0 43.63 5.375 84.5 17 128.6C20.75 502.3 33.5 512 48 512s27.25-9.75 31-23.88C90.63 444 96 403.1 96 359.5V136C96 114 113.1 96 136 96C157.1 96 176 114 176 136v240C176 451 237 512 312 512S448 451 448 376V304c0-4.125 1.625-7.875 4.125-10.75C461.6 318.9 485.8 336 512 336c11.38 0 12.5-.375 59.13-17.5L619 301C631.6 296.4 640 284.5 640 271.2V209C640 195.6 631.6 183.6 619 179zM608 271C520 303.1 519.3 304 513.3 304H512c-13.38 0-25.75-9.125-30-22.25L474.4 256H464C437.5 256 416 277.5 416 304v72C416 433.4 369.4 480 312 480S208 433.4 208 376v-240C208 96.25 175.8 64 136 64S64 96.25 64 136v223.5C64 401.5 58.63 439.6 48 480C37.38 439.6 32 401.5 32 359.5V136C32 78.63 78.63 32 136 32S240 78.63 240 136v240C240 415.8 272.3 448 312 448S384 415.8 384 376V304C384 259.9 419.9 224 464 224h10.38l7.625-25.75C486.3 185.1 498.6 176 512 176h1.25C519.3 176 520 176.9 608 209V271zM528 232c8.875 0 16-7.125 16-16s-7.125-16-16-16S512 207.1 512 216S519.1 232 528 232z" />
      </svg>
    ),
    items: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 512"
        className="h-5 w-5 fill-current stroke-current"
      >
        <path d="M528 248c-8.875 0-16 7.125-16 16s7.125 16 16 16S544 272.9 544 264S536.9 248 528 248zM619 179l-47.88-17.5C524.4 144.4 523.5 144 513.3 144C484.9 144 460 162.3 451.5 188.4l-1.25 4.5C395 199.6 352 246.9 352 304v72C352 398 333.1 416 312 416c-22 0-40-18-40-40v-240C272 61 211 0 136 0S0 61 0 136v223.5c0 43.63 5.375 84.5 17 128.6C20.75 502.3 33.5 512 48 512s27.25-9.75 31-23.88C90.63 444 96 403.1 96 359.5V136C96 114 113.1 96 136 96C157.1 96 176 114 176 136v240C176 451 237 512 312 512S448 451 448 376V304c0-4.125 1.625-7.875 4.125-10.75C461.6 318.9 485.8 336 512 336c11.38 0 12.5-.375 59.13-17.5L619 301C631.6 296.4 640 284.5 640 271.2V209C640 195.6 631.6 183.6 619 179zM608 271C520 303.1 519.3 304 513.3 304H512c-13.38 0-25.75-9.125-30-22.25L474.4 256H464C437.5 256 416 277.5 416 304v72C416 433.4 369.4 480 312 480S208 433.4 208 376v-240C208 96.25 175.8 64 136 64S64 96.25 64 136v223.5C64 401.5 58.63 439.6 48 480C37.38 439.6 32 401.5 32 359.5V136C32 78.63 78.63 32 136 32S240 78.63 240 136v240C240 415.8 272.3 448 312 448S384 415.8 384 376V304C384 259.9 419.9 224 464 224h10.38l7.625-25.75C486.3 185.1 498.6 176 512 176h1.25C519.3 176 520 176.9 608 209V271zM528 232c8.875 0 16-7.125 16-16s-7.125-16-16-16S512 207.1 512 216S519.1 232 528 232z" />
      </svg>
    ),
    maps: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 576 512"
        className="h-5 w-5 fill-current stroke-current"
      >
        <path d="M568.1 34.76c-4.406-2.969-9.982-3.554-14.94-1.616L409.6 90.67L179 32.51C175.9 31.67 172.5 31.89 169.5 33.01l-159.1 59.44C4.141 94.79 0 100.8 0 107.4v356.5c0 5.344 2.672 10.35 7.109 13.32s9.972 3.553 14.89 1.521l152.3-63.08l222.1 63.62C397.9 479.8 399.4 480 400.9 480c1.906 0 3.797-.3438 5.594-1l159.1-59.44C571.9 417.2 576 411.3 576 404.6V48.01C576 42.69 573.4 37.76 568.1 34.76zM192 68.79l192 48.42v325.3L192 387.6V68.79zM32 118.5l128-47.79v316.3l-128 53.02V118.5zM544 393.5l-128 47.8V122.4c.1914-.0684 .4043 .0391 .5938-.0371L544 71.61V393.5z" />
      </svg>
    ),
    lootcrates: (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 576 512"
          className="h-5 w-5 fill-current stroke-current"
        >
          <path d="M448 32H128C57.31 32 0 89.31 0 160v256c0 35.35 28.65 64 64 64h448c35.35 0 64-28.65 64-64V160C576 89.31 518.7 32 448 32zM96 448H64c-17.64 0-32-14.36-32-32V288h64V448zM96 256H32V160c0-41.66 26.84-76.85 64-90.1V256zM448 448H128V288h64v48C192 362.5 213.5 384 240 384h96c26.5 0 48-21.5 48-48V288h64V448zM224 336v-128C224 199.1 231.1 192 240 192h96C344.9 192 352 199.1 352 208v128c0 8.875-7.125 16-16 16h-96C231.1 352 224 344.9 224 336zM448 256h-64V208C384 181.5 362.5 160 336 160h-96C213.5 160 192 181.5 192 208V256H128V64h320V256zM544 416c0 17.64-14.36 32-32 32h-32V288h64V416zM544 256h-64V69.9C517.2 83.15 544 118.3 544 160V256zM288 320c8.875 0 16-7.125 16-16v-64C304 231.1 296.9 224 288 224S272 231.1 272 240v64C272 312.9 279.1 320 288 320z" />
        </svg>
        {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="h-5 w-5 fill-current stroke-current ml-1">
          <path d="M488.2 59.1C478.1 99.6 441.7 128 400 128s-78.1-28.4-88.2-68.9L303 24.2C298.8 7.1 281.4-3.3 264.2 1S236.7 22.6 241 39.8l8.7 34.9c11 44 40.2 79.6 78.3 99.6V480c0 17.7 14.3 32 32 32s32-14.3 32-32V352h16V480c0 17.7 14.3 32 32 32s32-14.3 32-32V174.3c38.1-20 67.3-55.6 78.3-99.6L559 39.8c4.3-17.1-6.1-34.5-23.3-38.8S501.2 7.1 497 24.2l-8.7 34.9zM400 96a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM80 96A48 48 0 1 0 80 0a48 48 0 1 0 0 96zm-8 32c-35.3 0-64 28.7-64 64v96l0 .6V480c0 17.7 14.3 32 32 32s32-14.3 32-32V352H88V480c0 17.7 14.3 32 32 32s32-14.3 32-32V252.7l13 20.5c5.9 9.2 16.1 14.9 27 14.9h48c17.7 0 32-14.3 32-32s-14.3-32-32-32H209.6l-37.4-58.9C157.6 142 132.1 128 104.7 128H72z" />
        </svg> */}
      </>
    ),
  };
  return icons[icon.toLowerCase()] || null;
};

const Sidebar = memo(({ }) => {
  const { currentUser, isAuthenticated, logOut } = useAuth();
  const navigation = [
    {
      name: "Home",
      href: routes.home(),
      color: "!ring-pea-400 !bg-pea-500",
    },
    {
      name: "Basespot",
      href: routes.basespots({ page: 1 }),
      color: "!ring-blue-400 !bg-blue-500",
    },
    {
      name: "Calculator",
      href: routes.materialCalculator(),
      color: "!ring-red-400 !bg-red-500",
    },
    {
      name: "GTW",
      href: routes.gtw(),
      color: "!ring-lime-400 !bg-lime-500",
    },
    {
      name: "Tribes",
      href: routes.tribes(),
      color: "!ring-emerald-400 !bg-emerald-500",
    },
    {
      name: "Story",
      href: routes.timelineSeasons(),
      color: "!ring-sky-200 !bg-sky-400",
    },
    {
      name: "Dinos",
      href: routes.dinos({ category: "ground" }),
      color: "!ring-indigo-400 !bg-indigo-500",
    },
    {
      name: "Items",
      href: routes.items(),
      color: "!ring-teal-500 !bg-teal-700",
    },
    {
      name: "Maps",
      href: routes.maps(),
      color: "!ring-amber-400 !bg-amber-500",
    },
  ];

  // const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <aside className="z-10 min-w-[14rem] overflow-x-auto border-gray-700 bg-zinc-800 py-2 dark:border-zinc-300 max-sm:border-b sm:h-auto sm:max-w-sm sm:overflow-visible sm:border-r sm:py-2 sm:px-4">
      <div className="sticky top-0 flex w-full flex-row items-start justify-between sm:flex-col sm:justify-start">
        <div className="flex items-center justify-center border-gray-700 text-black text-[#ffffffcc] transition-all dark:border-zinc-300 sm:my-3 sm:w-full sm:flex-col sm:border-b">
          <Link
            to={routes.profile({
              id: currentUser?.id || currentUser?.sub || "",
            })}
            className={clsx("text-center hover:underline", {
              "pointer-events-none cursor-not-allowed": !isAuthenticated,
            })}
          >
            <div className="relative">
              {isAuthenticated ? (
                <img
                  src={
                    currentUser?.avatar_url
                      ? `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/avatars/${currentUser.avatar_url}`
                      : `https://ui-avatars.com/api/?name=${currentUser?.full_name}`
                  }
                  className="animate-fade-in mx-1 aspect-square w-12 max-w-xs rounded-full object-cover object-center shadow sm:m-2 sm:w-20"
                  loading="lazy"
                />
              ) : (
                <div className="animate-fade-in mx-1 relative aspect-square w-12 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-600">
                  <svg
                    className="absolute -left-1 h-14 w-14 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
              {/* {currentUser?.status == "ONLINE" && (
                <span className="absolute bottom-2.5 right-2.5 h-4 w-4 translate-y-1/4 transform rounded-full border-2 border-white bg-green-400 dark:border-gray-800"></span>
              )} */}
            </div>
            <p className="hidden text-sm sm:block sm:text-xl">
              {currentUser?.full_name?.toString() || "Guest"}
            </p>
            <p className="hidden text-xs sm:block">
              {currentUser?.role_profile_role_idTorole &&
                currentUser?.role_profile_role_idTorole["name"]?.toString()}
            </p>
            <span className="sr-only">Your Profile</span>
          </Link>
          {isAuthenticated ? (
            <button
              className="rw-button rw-button-gray-outline rw-button-medium mx-3 text-white sm:my-3 sm:w-full"
              onClick={logOut}
            >
              Sign out
            </button>
          ) : (
            <Link
              className="rw-button rw-button-gray-outline rw-button-medium text-white sm:my-3 sm:w-full"
              to={routes.signin()}
            >
              Sign In
            </Link>
          )}
        </div>
        {navigation.map((item, index) => (
          <div
            className="flex flex-col items-center justify-start self-start text-white/70 transition-all hover:text-white sm:flex-row"
            key={`sidebar-item-${index}`}
          >
            <NavLink
              to={item.href}
              title={item.name}
              activeClassName={`text-white ring-2 ${item.color}`}
              matchSubPaths={false}
              className="mr-2 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-zinc-500 text-white outline-none ring-1 ring-transparent hover:text-gray-100 hover:ring-stone-400 focus:ring-stone-400 dark:bg-zinc-700 dark:hover:text-white dark:hover:ring-white dark:focus:ring-white sm:my-2"
            >
              {Icon(item.name)} <span className="sr-only">{item.name}</span>
            </NavLink>
            <span className="active: text-sm">{item.name}</span>
          </div>
        ))}
      </div>
    </aside>
  );
});

export default Sidebar;
