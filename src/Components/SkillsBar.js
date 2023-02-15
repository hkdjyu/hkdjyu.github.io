import {useState} from "react";
import {useInView} from "react-intersection-observer";
import ShowMoreIcon from "@material-ui/icons/ArrowDropDownRounded"
import ShowLessIcon from "@material-ui/icons/ArrowDropUpRounded"
import "../Styles/SkillsBar.css";
import {motion} from "framer-motion";
import {View} from "react-native";


const skillList = [
    {lang: "C#", percent: "95%" , icon: 
        <svg viewBox="0 0 128 128">
        <path fill="#9B4F96" d="M115.4 30.7L67.1 2.9c-.8-.5-1.9-.7-3.1-.7-1.2 0-2.3.3-3.1.7l-48 27.9c-1.7 1-2.9 3.5-2.9 5.4v55.7c0 1.1.2 2.4 1 3.5l106.8-62c-.6-1.2-1.5-2.1-2.4-2.7z"></path><path fill="#68217A" d="M10.7 95.3c.5.8 1.2 1.5 1.9 1.9l48.2 27.9c.8.5 1.9.7 3.1.7 1.2 0 2.3-.3 3.1-.7l48-27.9c1.7-1 2.9-3.5 2.9-5.4V36.1c0-.9-.1-1.9-.6-2.8l-106.6 62z"></path><path fill="#fff" d="M85.3 76.1C81.1 83.5 73.1 88.5 64 88.5c-13.5 0-24.5-11-24.5-24.5s11-24.5 24.5-24.5c9.1 0 17.1 5 21.3 12.5l13-7.5c-6.8-11.9-19.6-20-34.3-20-21.8 0-39.5 17.7-39.5 39.5s17.7 39.5 39.5 39.5c14.6 0 27.4-8 34.2-19.8l-12.9-7.6zM97 66.2l.9-4.3h-4.2v-4.7h5.1L100 51h4.9l-1.2 6.1h3.8l1.2-6.1h4.8l-1.2 6.1h2.4v4.7h-3.3l-.9 4.3h4.2v4.7h-5.1l-1.2 6h-4.9l1.2-6h-3.8l-1.2 6h-4.8l1.2-6h-2.4v-4.7H97zm4.8 0h3.8l.9-4.3h-3.8l-.9 4.3z"></path>
        </svg>
    },
    {lang: "C", percent: "75%", icon:
        <svg viewBox="0 0 128 128">
        <path fill="#659AD3" d="M115.4 30.7L67.1 2.9c-.8-.5-1.9-.7-3.1-.7-1.2 0-2.3.3-3.1.7l-48 27.9c-1.7 1-2.9 3.5-2.9 5.4v55.7c0 1.1.2 2.4 1 3.5l106.8-62c-.6-1.2-1.5-2.1-2.4-2.7z"></path><path fill="#03599C" d="M10.7 95.3c.5.8 1.2 1.5 1.9 1.9l48.2 27.9c.8.5 1.9.7 3.1.7 1.2 0 2.3-.3 3.1-.7l48-27.9c1.7-1 2.9-3.5 2.9-5.4V36.1c0-.9-.1-1.9-.6-2.8l-106.6 62z"></path><path fill="#fff" d="M85.3 76.1C81.1 83.5 73.1 88.5 64 88.5c-13.5 0-24.5-11-24.5-24.5s11-24.5 24.5-24.5c9.1 0 17.1 5 21.3 12.5l13-7.5c-6.8-11.9-19.6-20-34.3-20-21.8 0-39.5 17.7-39.5 39.5s17.7 39.5 39.5 39.5c14.6 0 27.4-8 34.2-19.8l-12.9-7.6z"></path>
        </svg>
    },
    {lang: "C++", percent: "75%", icon: 
        <svg viewBox="0 0 128 128">
        <path fill="#D26383" d="M115.4 30.7L67.1 2.9c-.8-.5-1.9-.7-3.1-.7-1.2 0-2.3.3-3.1.7l-48 27.9c-1.7 1-2.9 3.5-2.9 5.4v55.7c0 1.1.2 2.4 1 3.5l106.8-62c-.6-1.2-1.5-2.1-2.4-2.7z"></path><path fill="#9C033A" d="M10.7 95.3c.5.8 1.2 1.5 1.9 1.9l48.2 27.9c.8.5 1.9.7 3.1.7 1.2 0 2.3-.3 3.1-.7l48-27.9c1.7-1 2.9-3.5 2.9-5.4V36.1c0-.9-.1-1.9-.6-2.8l-106.6 62z"></path><path fill="#fff" d="M85.3 76.1C81.1 83.5 73.1 88.5 64 88.5c-13.5 0-24.5-11-24.5-24.5s11-24.5 24.5-24.5c9.1 0 17.1 5 21.3 12.5l13-7.5c-6.8-11.9-19.6-20-34.3-20-21.8 0-39.5 17.7-39.5 39.5s17.7 39.5 39.5 39.5c14.6 0 27.4-8 34.2-19.8l-12.9-7.6z"></path><path d="M82.1 61.8h5.2v-5.3h4.4v5.3H97v4.4h-5.3v5.2h-4.4v-5.2h-5.2v-4.4zm18.5 0h5.2v-5.3h4.4v5.3h5.3v4.4h-5.3v5.2h-4.4v-5.2h-5.2v-4.4z" fill="#fff"></path>
        </svg>
    },
    {lang: "Java", percent: "80%", icon:
        <svg viewBox="0 0 128 128">
        <path fill="#0074BD" d="M52.581 67.817s-3.284 1.911 2.341 2.557c6.814.778 10.297.666 17.805-.753 0 0 1.979 1.237 4.735 2.309-16.836 7.213-38.104-.418-24.881-4.113zm-2.059-9.415s-3.684 2.729 1.945 3.311c7.28.751 13.027.813 22.979-1.103 0 0 1.373 1.396 3.536 2.157-20.352 5.954-43.021.469-28.46-4.365z"></path><path fill="#EA2D2E" d="M67.865 42.431c4.151 4.778-1.088 9.074-1.088 9.074s10.533-5.437 5.696-12.248c-4.519-6.349-7.982-9.502 10.771-20.378.001 0-29.438 7.35-15.379 23.552z"></path><path fill="#0074BD" d="M90.132 74.781s2.432 2.005-2.678 3.555c-9.716 2.943-40.444 3.831-48.979.117-3.066-1.335 2.687-3.187 4.496-3.576 1.887-.409 2.965-.334 2.965-.334-3.412-2.403-22.055 4.719-9.469 6.762 34.324 5.563 62.567-2.506 53.665-6.524zm-35.97-26.134s-15.629 3.713-5.534 5.063c4.264.57 12.758.439 20.676-.225 6.469-.543 12.961-1.704 12.961-1.704s-2.279.978-3.93 2.104c-15.874 4.175-46.533 2.23-37.706-2.038 7.463-3.611 13.533-3.2 13.533-3.2zM82.2 64.317c16.135-8.382 8.674-16.438 3.467-15.353-1.273.266-1.845.496-1.845.496s.475-.744 1.378-1.063c10.302-3.62 18.223 10.681-3.322 16.345 0 0 .247-.224.322-.425z"></path><path fill="#EA2D2E" d="M72.474 1.313s8.935 8.939-8.476 22.682c-13.962 11.027-3.184 17.313-.006 24.498-8.15-7.354-14.128-13.828-10.118-19.852 5.889-8.842 22.204-13.131 18.6-27.328z"></path><path fill="#0074BD" d="M55.749 87.039c15.484.99 39.269-.551 39.832-7.878 0 0-1.082 2.777-12.799 4.981-13.218 2.488-29.523 2.199-39.191.603 0 0 1.98 1.64 12.158 2.294z"></path><path fill="#EA2D2E" d="M94.866 100.181h-.472v-.264h1.27v.264h-.47v1.317h-.329l.001-1.317zm2.535.066h-.006l-.468 1.251h-.216l-.465-1.251h-.005v1.251h-.312v-1.581h.457l.431 1.119.432-1.119h.454v1.581h-.302v-1.251zm-44.19 14.79c-1.46 1.266-3.004 1.978-4.391 1.978-1.974 0-3.045-1.186-3.045-3.085 0-2.055 1.146-3.56 5.738-3.56h1.697v4.667h.001zm4.031 4.548v-14.077c0-3.599-2.053-5.973-6.997-5.973-2.886 0-5.416.714-7.473 1.622l.592 2.493c1.62-.595 3.715-1.147 5.771-1.147 2.85 0 4.075 1.147 4.075 3.521v1.779h-1.424c-6.921 0-10.044 2.685-10.044 6.723 0 3.479 2.058 5.456 5.933 5.456 2.49 0 4.351-1.028 6.088-2.533l.316 2.137h3.163v-.001zm13.452 0h-5.027l-6.051-19.689h4.391l3.756 12.099.835 3.635c1.896-5.258 3.24-10.596 3.912-15.733h4.271c-1.143 6.481-3.203 13.598-6.087 19.688zm19.288-4.548c-1.465 1.266-3.01 1.978-4.392 1.978-1.976 0-3.046-1.186-3.046-3.085 0-2.055 1.149-3.56 5.736-3.56h1.701v4.667h.001zm4.033 4.548v-14.077c0-3.599-2.059-5.973-6.999-5.973-2.889 0-5.418.714-7.475 1.622l.593 2.493c1.62-.595 3.718-1.147 5.774-1.147 2.846 0 4.074 1.147 4.074 3.521v1.779h-1.424c-6.923 0-10.045 2.685-10.045 6.723 0 3.479 2.056 5.456 5.93 5.456 2.491 0 4.349-1.028 6.091-2.533l.318 2.137h3.163v-.001zm-56.693 3.346c-1.147 1.679-3.005 3.008-5.037 3.757l-1.989-2.345c1.547-.794 2.872-2.075 3.489-3.269.532-1.063.753-2.43.753-5.701V92.891h4.284v22.173c0 4.375-.348 6.144-1.5 7.867z"></path>
        </svg>
    },
    {lang: "Python", percent: "65%", icon:
        <svg viewBox="0 0 128 128">
        <linearGradient id="python-original-a" gradientUnits="userSpaceOnUse" x1="70.252" y1="1237.476" x2="170.659" y2="1151.089" gradientTransform="matrix(.563 0 0 -.568 -29.215 707.817)"><stop offset="0" stop-color="#5A9FD4"></stop><stop offset="1" stop-color="#306998"></stop></linearGradient><linearGradient id="python-original-b" gradientUnits="userSpaceOnUse" x1="209.474" y1="1098.811" x2="173.62" y2="1149.537" gradientTransform="matrix(.563 0 0 -.568 -29.215 707.817)"><stop offset="0" stop-color="#FFD43B"></stop><stop offset="1" stop-color="#FFE873"></stop></linearGradient><path fill="url(#python-original-a)" d="M63.391 1.988c-4.222.02-8.252.379-11.8 1.007-10.45 1.846-12.346 5.71-12.346 12.837v9.411h24.693v3.137H29.977c-7.176 0-13.46 4.313-15.426 12.521-2.268 9.405-2.368 15.275 0 25.096 1.755 7.311 5.947 12.519 13.124 12.519h8.491V67.234c0-8.151 7.051-15.34 15.426-15.34h24.665c6.866 0 12.346-5.654 12.346-12.548V15.833c0-6.693-5.646-11.72-12.346-12.837-4.244-.706-8.645-1.027-12.866-1.008zM50.037 9.557c2.55 0 4.634 2.117 4.634 4.721 0 2.593-2.083 4.69-4.634 4.69-2.56 0-4.633-2.097-4.633-4.69-.001-2.604 2.073-4.721 4.633-4.721z" transform="translate(0 10.26)"></path><path fill="url(#python-original-b)" d="M91.682 28.38v10.966c0 8.5-7.208 15.655-15.426 15.655H51.591c-6.756 0-12.346 5.783-12.346 12.549v23.515c0 6.691 5.818 10.628 12.346 12.547 7.816 2.297 15.312 2.713 24.665 0 6.216-1.801 12.346-5.423 12.346-12.547v-9.412H63.938v-3.138h37.012c7.176 0 9.852-5.005 12.348-12.519 2.578-7.735 2.467-15.174 0-25.096-1.774-7.145-5.161-12.521-12.348-12.521h-9.268zM77.809 87.927c2.561 0 4.634 2.097 4.634 4.692 0 2.602-2.074 4.719-4.634 4.719-2.55 0-4.633-2.117-4.633-4.719 0-2.595 2.083-4.692 4.633-4.692z" transform="translate(0 10.26)"></path><radialGradient id="python-original-c" cx="1825.678" cy="444.45" r="26.743" gradientTransform="matrix(0 -.24 -1.055 0 532.979 557.576)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#B8B8B8" stop-opacity=".498"></stop><stop offset="1" stop-color="#7F7F7F" stop-opacity="0"></stop></radialGradient><path opacity=".444" fill="url(#python-original-c)" d="M97.309 119.597c0 3.543-14.816 6.416-33.091 6.416-18.276 0-33.092-2.873-33.092-6.416 0-3.544 14.815-6.417 33.092-6.417 18.275 0 33.091 2.872 33.091 6.417z"></path>
        </svg>
    },
    {lang: "HTML", percent: "85%", icon:
        <svg viewBox="0 0 128 128">
        <path fill="#E44D26" d="M19.037 113.876L9.032 1.661h109.936l-10.016 112.198-45.019 12.48z"></path><path fill="#F16529" d="M64 116.8l36.378-10.086 8.559-95.878H64z"></path><path fill="#EBEBEB" d="M64 52.455H45.788L44.53 38.361H64V24.599H29.489l.33 3.692 3.382 37.927H64zm0 35.743l-.061.017-15.327-4.14-.979-10.975H33.816l1.928 21.609 28.193 7.826.063-.017z"></path><path fill="#fff" d="M63.952 52.455v13.763h16.947l-1.597 17.849-15.35 4.143v14.319l28.215-7.82.207-2.325 3.234-36.233.335-3.696h-3.708zm0-27.856v13.762h33.244l.276-3.092.628-6.978.329-3.692z"></path>
        </svg>
    },
    {lang: "CSS", percent: "85%", icon:
        <svg viewBox="0 0 128 128">
        <path fill="#1572B6" d="M18.814 114.123L8.76 1.352h110.48l-10.064 112.754-45.243 12.543-45.119-12.526z"></path><path fill="#33A9DC" d="M64.001 117.062l36.559-10.136 8.601-96.354h-45.16v106.49z"></path><path fill="#fff" d="M64.001 51.429h18.302l1.264-14.163H64.001V23.435h34.682l-.332 3.711-3.4 38.114h-30.95V51.429z"></path><path fill="#EBEBEB" d="M64.083 87.349l-.061.018-15.403-4.159-.985-11.031H33.752l1.937 21.717 28.331 7.863.063-.018v-14.39z"></path><path fill="#fff" d="M81.127 64.675l-1.666 18.522-15.426 4.164v14.39l28.354-7.858.208-2.337 2.406-26.881H81.127z"></path><path fill="#EBEBEB" d="M64.048 23.435v13.831H30.64l-.277-3.108-.63-7.012-.331-3.711h34.646zm-.047 27.996v13.831H48.792l-.277-3.108-.631-7.012-.33-3.711h16.447z"></path>
        </svg>
    },
    {lang: "JavaScript", percent: "70%", icon:
        <svg viewBox="0 0 128 128">
        <path fill="#F0DB4F" d="M1.408 1.408h125.184v125.185H1.408z"></path><path fill="#323330" d="M116.347 96.736c-.917-5.711-4.641-10.508-15.672-14.981-3.832-1.761-8.104-3.022-9.377-5.926-.452-1.69-.512-2.642-.226-3.665.821-3.32 4.784-4.355 7.925-3.403 2.023.678 3.938 2.237 5.093 4.724 5.402-3.498 5.391-3.475 9.163-5.879-1.381-2.141-2.118-3.129-3.022-4.045-3.249-3.629-7.676-5.498-14.756-5.355l-3.688.477c-3.534.893-6.902 2.748-8.877 5.235-5.926 6.724-4.236 18.492 2.975 23.335 7.104 5.332 17.54 6.545 18.873 11.531 1.297 6.104-4.486 8.08-10.234 7.378-4.236-.881-6.592-3.034-9.139-6.949-4.688 2.713-4.688 2.713-9.508 5.485 1.143 2.499 2.344 3.63 4.26 5.795 9.068 9.198 31.76 8.746 35.83-5.176.165-.478 1.261-3.666.38-8.581zM69.462 58.943H57.753l-.048 30.272c0 6.438.333 12.34-.714 14.149-1.713 3.558-6.152 3.117-8.175 2.427-2.059-1.012-3.106-2.451-4.319-4.485-.333-.584-.583-1.036-.667-1.071l-9.52 5.83c1.583 3.249 3.915 6.069 6.902 7.901 4.462 2.678 10.459 3.499 16.731 2.059 4.082-1.189 7.604-3.652 9.448-7.401 2.666-4.915 2.094-10.864 2.07-17.444.06-10.735.001-21.468.001-32.237z"></path>
        </svg>
    },
    {lang: "TypeScript", percent: "70%", icon:
        <svg viewBox="0 0 128 128">
        <path fill="#fff" d="M22.67 47h99.67v73.67H22.67z"></path><path data-name="original" fill="#007acc" d="M1.5 63.91v62.5h125v-125H1.5zm100.73-5a15.56 15.56 0 017.82 4.5 20.58 20.58 0 013 4c0 .16-5.4 3.81-8.69 5.85-.12.08-.6-.44-1.13-1.23a7.09 7.09 0 00-5.87-3.53c-3.79-.26-6.23 1.73-6.21 5a4.58 4.58 0 00.54 2.34c.83 1.73 2.38 2.76 7.24 4.86 8.95 3.85 12.78 6.39 15.16 10 2.66 4 3.25 10.46 1.45 15.24-2 5.2-6.9 8.73-13.83 9.9a38.32 38.32 0 01-9.52-.1 23 23 0 01-12.72-6.63c-1.15-1.27-3.39-4.58-3.25-4.82a9.34 9.34 0 011.15-.73L82 101l3.59-2.08.75 1.11a16.78 16.78 0 004.74 4.54c4 2.1 9.46 1.81 12.16-.62a5.43 5.43 0 00.69-6.92c-1-1.39-3-2.56-8.59-5-6.45-2.78-9.23-4.5-11.77-7.24a16.48 16.48 0 01-3.43-6.25 25 25 0 01-.22-8c1.33-6.23 6-10.58 12.82-11.87a31.66 31.66 0 019.49.26zm-29.34 5.24v5.12H56.66v46.23H45.15V69.26H28.88v-5a49.19 49.19 0 01.12-5.17C29.08 59 39 59 51 59h21.83z"></path>
        </svg>
    },
    {lang: "GLSL", percent: "60%", icon:   
        <svg viewBox="0 0 128 128">
        <path d="M27.363 76.605c-6.078 0-9.094-3.645-10.277-7.453 1.32 6.195 8.449 12.23 30.945 14.91 21.258 2.551 35.09-3.848 39.77-6.824 0 0 3.156-1.367 1.266.742 0 0-13.398 12.129-39.609 12.285-26.262.129-47.09-12.863-46.984-26.043-.125-13.125 20.723-26.145 46.984-26.039 26.262.125 39.609 12.281 39.609 12.281 1.895 2.105-1.266.75-1.266.75-4.668-2.969-18.457-8.82-39.77-6.824-20.934 1.98-27.77 8.977-30.086 13.648-.871 1.813-1.27 3.523-1.367 5.242.566-4.496 3.414-9.766 10.766-9.766 8.34 0 10.871 6.824 10.871 11.496 0 4.727-2.547 11.551-10.871 11.551zm84.496-4.539h11.086v3.961h-15.77v-21.89h4.66v17.902zm-17.113-7.828h9.309v11.816h-3.105l-.465-2.746c-1.18 1.344-2.891 3.324-6.941 3.324-5.371 0-10.227-3.777-10.227-11.445 0-5.984 3.387-11.605 10.926-11.605 6.832 0 9.523 4.359 9.793 7.352h-4.66c0-.852-1.582-3.598-4.875-3.598-3.32 0-6.406 2.258-6.406 7.875 0 5.988 3.32 7.512 6.512 7.512 1.023 0 4.441-.395 5.383-4.816h-5.187V64.22zm-67.273-8.031c-4.844 0-7.75 3.746-7.75 8.926 0 5.152 2.918 8.926 7.75 8.926 4.844 0 7.75-3.75 7.75-8.926 0-5.152-2.918-8.926-7.75-8.926zm12.539 5.832h2.262v1.977h.055c.57-.805 1.66-2.387 4.25-2.387 3.789 0 6.512 3.152 6.512 7.09 0 3.348-1.965 7.719-6.836 7.719-1.91 0-3.164-.883-3.785-1.875h-.055v7.035h-2.402zm6.082 12.387c2.617 0 4.391-2.227 4.391-5.301 0-1.797-.738-5.355-4.445-5.355-3.461 0-3.844 3.664-3.844 5.934 0 3.715 2.375 4.711 3.898 4.711zm21.527-2.754c-.082.664-.738 2.652-2.535 3.824-.656.43-1.582.969-3.871.969-4.008 0-6.402-2.973-6.402-7.035 0-4.34 2.125-7.773 6.836-7.773 4.117 0 6.133 3.215 6.133 8.191H57.34c0 2.922 1.391 4.605 4.145 4.605 2.262 0 3.602-1.711 3.684-2.758h2.398zm-2.539-3.719c-.137-2.168-1.066-4.176-3.984-4.176-2.207 0-3.949 2.008-3.949 4.176zm15.984 8.086h-2.402v-8.613c0-2.43-.711-3.664-3.051-3.664-1.363 0-3.762.859-3.762 4.656v7.613h-2.402V62.016h2.266v1.977h.055c.52-.75 1.852-2.383 4.305-2.383 2.207 0 4.992.883 4.992 4.875v9.555" fill="#B3B3B3"></path><path d="M26.289 75.031c-6.137 0-9.203-3.645-10.387-7.453 1.336 6.191 8.555 12.23 31.27 14.91 21.473 2.543 35.465-3.848 40.199-6.828 0 0 3.191-1.363 1.277.746 0 0-13.508 12.129-40.094 12.285C22.02 88.816.926 75.828 1.086 62.648.957 49.523 22.02 36.504 48.555 36.609c26.531.125 40.094 12.281 40.094 12.281 1.914 2.105-1.277.75-1.277.75-4.719-2.969-18.676-8.82-40.199-6.828-21.207 1.984-28.094 8.98-30.41 13.652a13.44 13.44 0 00-1.383 5.242c.57-4.496 3.449-9.77 10.871-9.77 8.398 0 10.98 6.828 10.98 11.551s-2.574 11.5-10.98 11.5zm85.57-4.543h11.195v3.965h-15.93V52.555h4.707v17.91zm-17.277-7.824H104v11.813h-3.137l-.469-2.738c-1.195 1.34-2.926 3.324-7.051 3.324-5.437 0-10.387-3.777-10.387-11.445 0-5.984 3.422-11.605 11.031-11.605 6.891 0 9.633 4.359 9.902 7.352h-4.707c0-.852-1.605-3.598-4.93-3.598-3.359 0-6.461 2.258-6.461 7.875 0 5.988 3.359 7.512 6.566 7.512 1.035 0 4.488-.395 5.438-4.816h-5.242v-3.687zm-68.348-8.031c-4.898 0-7.855 3.746-7.855 8.926 0 5.148 2.949 8.926 7.855 8.926 4.898 0 7.859-3.75 7.859-8.926 0-5.152-2.949-8.926-7.859-8.926zm12.703 5.828h2.285v1.98h.055c.582-.805 1.68-2.387 4.301-2.387 3.832 0 6.566 3.152 6.566 7.09 0 3.344-1.988 7.719-6.891 7.719-1.93 0-3.195-.883-3.832-1.875h-.055v7.035H38.94V60.488zm6.133 12.395c2.648 0 4.441-2.23 4.441-5.305 0-1.801-.75-5.359-4.496-5.359-3.496 0-3.883 3.668-3.883 5.938 0 3.715 2.398 4.711 3.938 4.711zm21.742-2.762c-.082.672-.742 2.652-2.562 3.828-.66.43-1.598.969-3.91.969-4.055 0-6.457-2.973-6.457-7.039 0-4.336 2.152-7.77 6.941-7.77 4.16 0 6.188 3.215 6.188 8.191H56.465c0 2.922 1.402 4.602 4.191 4.602 2.289 0 3.637-1.707 3.719-2.754h2.43zm-2.57-3.715c-.141-2.172-1.078-4.176-4.027-4.176-2.234 0-4 2.004-4 4.176zm16.145 8.082h-2.426v-8.609c0-2.434-.719-3.664-3.09-3.664-1.379 0-3.805.855-3.805 4.656v7.613h-2.43V60.441h2.289v1.977h.055c.523-.75 1.871-2.383 4.355-2.383 2.23 0 5.043.883 5.043 4.875v9.504" fill="#5586A4"></path><path d="M127.754 74.242A2.015 2.015 0 01126.719 76c-.321.183-.664.27-1.035.27s-.711-.09-1.031-.27a2.06 2.06 0 01-.758-.742 1.97 1.97 0 01-.277-1.016 1.98 1.98 0 01.277-1.012 2.07 2.07 0 011.789-1.012 2.074 2.074 0 011.793 1.012 1.98 1.98 0 01.277 1.012zm-.398 0c0-.449-.164-.836-.492-1.152a1.62 1.62 0 00-1.176-.484 1.62 1.62 0 00-1.18.484 1.54 1.54 0 00-.488 1.152 1.55 1.55 0 00.488 1.156c.328.32.719.48 1.18.48a1.61 1.61 0 001.176-.48c.328-.32.492-.703.492-1.156zm-2.605-1.082h.988c.277 0 .484.055.609.168s.188.258.188.441a.54.54 0 01-.145.379c-.094.105-.246.184-.453.23a.597.597 0 01.188.098.876.876 0 01.176.227c.004.004.125.215.359.621h-.652l-.426-.738c-.07-.082-.145-.121-.215-.121-.02 0-.039 0-.07.008v.852h-.551zm.551.918h.238c.156 0 .27-.023.336-.074s.098-.113.098-.195-.031-.148-.094-.195-.168-.078-.32-.078h-.258zm0 0" fill="#999"></path><path d="M127.754 73.719a1.95 1.95 0 01-.277 1.012 1.972 1.972 0 01-.758.742 2.07 2.07 0 01-1.035.273c-.367 0-.711-.094-1.031-.273s-.57-.426-.758-.742a1.95 1.95 0 01-.277-1.012c0-.359.094-.699.277-1.016a2.02 2.02 0 01.758-.738c.32-.18.664-.27 1.031-.27s.719.09 1.035.27.574.426.758.738.277.656.277 1.016zm-.398 0a1.53 1.53 0 00-.492-1.152c-.324-.324-.719-.484-1.176-.484s-.855.16-1.18.484a1.54 1.54 0 00-.488 1.152 1.55 1.55 0 00.488 1.156 1.62 1.62 0 001.18.477c.461 0 .852-.156 1.176-.477s.492-.703.492-1.156zm-2.605-1.086h.988c.277 0 .484.059.609.168s.188.262.188.445c0 .145-.047.27-.145.379-.094.102-.246.18-.453.23a.597.597 0 01.188.098.92.92 0 01.176.223c.004.004.125.215.359.625h-.652l-.426-.738c-.07-.082-.145-.125-.215-.125-.02 0-.039.004-.07.008v.855h-.551zm.551.922h.238c.156 0 .27-.027.336-.078a.24.24 0 00.098-.195.23.23 0 00-.094-.191c-.062-.051-.168-.078-.32-.078h-.258zm0 0" fill="#5586A4"></path>
        </svg>
    },
    {lang: "RISC-V", percent: "40%", icon:<svg viewBox="0 0 128 128"><defs><clipPath id="clipPath5345"><path d="m12 344h72v56.5h-72z"/></clipPath></defs><g transform="matrix(1.33 0 0 -1.33 -16 534)"><g transform="matrix(1.23 0 0 1.3 .989 -129)"><g clip-path="url(#clipPath5345)"><path d="m49.9 387c0-5.94-3.73-11.5-10.9-12.8l10.2-11.9 1.01 1.35 18.3 25.7v10.9h-29.6c7.33-1.23 11.1-7.17 11.1-13.2z" fill="#f6b21a"/><path d="m55.1 361 13.3 18.6v-20.2h-14.3zm-26 19.5h7.11c5.08 0 7.68 3.7 7.68 7.28 0 3.59-2.49 7.29-7.68 7.29h-9.7v-35.5h17.7l-15.2 18.2v2.8z" fill="#2a3172"/><path d="m28.8 344h2.25v10.4h-2.25z" fill="#2a3172"/><path d="m35.8 348c-.789 0-1.58.333-2.25 1.01-.567.564-1.02 1.35-1.02 2.24 0 .783.341 1.56 1.02 2.24.563.563 1.35 1.01 2.25 1.01h11.9v-2.24h-11.9c-.226 0-.451-.109-.679-.224-.226-.226-.226-.335-.226-.674 0-.333.116-.448.226-.672.227-.226.343-.226.679-.226h8.58c.789 0 1.58-.333 2.25-1.01.567-.559 1.02-1.35 1.02-2.24 0-.892-.341-1.56-1.02-2.24-.563-.563-1.35-1.01-2.25-1.01h-11.9v2.24h11.9c.226 0 .451.115.677.226.227.224.227.339.227.672 0 .224-.116.448-.227.672-.226.226-.341.226-.677.226z" fill="#2a3172"/><path d="m54.1 354h9.7v-2.24h-9.7c-.789 0-1.58-.335-2.14-.783-.561-.563-.787-1.24-.787-2.13 0-.787.336-1.57.787-2.13.563-.563 1.24-.788 2.14-.788h9.7v-2.24h-9.7c-1.47 0-2.6.557-3.73 1.56-1.01 1.01-1.58 2.24-1.58 3.7 0 1.46.567 2.58 1.58 3.7 1.02.898 2.14 1.35 3.73 1.35z" fill="#2a3172"/><path d="m27.1 344-3.05 4.14c.793.115 1.47.339 2.03 1.01.561.559 1.01 1.34 1.01 2.24 0 .789-.337 1.57-1.01 2.24-.561.558-1.36 1.01-2.26 1.01h-11.8v-10.4h2.26v4.14h6.99l3.05-4.14zm-12.8 8.18h9.59c.227 0 .453-.115.679-.226.226-.224.226-.339.226-.672 0-.224-.116-.448-.226-.674-.226-.224-.341-.224-.679-.224h-9.59z" fill="#2a3172"/><path d="m75.2 344-6.1 10.4h2.6l4.86-8.29 4.85 8.29h2.6l-6.09-10.4z" fill="#f6b21a"/><path d="m65.3 348h4.4v2.02h-4.4z" fill="#f6b21a"/></g></g></g></svg>
},
    {lang: "Bash", percent: "40%", icon: 
        <svg viewBox="0 0 128 128">
        <path d="m4.24 4.24h120v120h-120z" fill="none"/><path d="m109 28.6-37.7-22.4c-2.25-1.33-4.77-2-7.28-2s-5.03.67-7.28 2.01l-37.7 22.4c-4.5 2.67-7.28 7.61-7.28 13v44.8c0 5.35 2.77 10.3 7.28 13l37.7 22.4c2.25 1.34 4.76 2 7.28 2 2.51 0 5.03-.67 7.28-2l37.7-22.4c4.5-2.67 7.28-7.62 7.28-13v-44.8c0-5.34-2.77-10.3-7.28-13zm-29.2 70 .06 3.22c0 .39-.25.83-.55.99l-1.91 1.1c-.3.15-.56-.03-.56-.42l-.03-3.17c-1.63.68-3.29.84-4.34.42-.2-.08-.29-.37-.21-.71l.69-2.91c.06-.23.18-.46.34-.6.06-.06.12-.1.18-.13.11-.06.22-.07.31-.03 1.14.38 2.59.2 3.99-.5 1.78-.9 2.97-2.72 2.95-4.52-.02-1.64-.9-2.31-3.05-2.33-2.74.01-5.3-.53-5.34-4.57-.03-3.32 1.69-6.78 4.43-8.96l-.03-3.25c0-.4.24-.84.55-1l1.85-1.18c.3-.15.56.04.56.43l.03 3.25c1.36-.54 2.54-.69 3.61-.44.23.06.34.38.24.75l-.72 2.88c-.06.22-.18.44-.33.58a.77.77 0 01-.19.14c-.1.05-.19.06-.28.05-.49-.11-1.65-.36-3.48.56-1.92.97-2.59 2.64-2.58 3.88.02 1.48.77 1.93 3.39 1.97 3.49.06 4.99 1.58 5.03 5.09.05 3.44-1.79 7.15-4.61 9.41zm26.3-60.5-35.7 22c-4.45 2.6-7.73 5.52-7.74 10.9v44c0 3.21 1.3 5.29 3.29 5.9-.65.11-1.32.19-1.98.19-2.09 0-4.15-.57-5.96-1.64l-37.7-22.4c-3.69-2.19-5.98-6.28-5.98-10.7v-44.8c0-4.39 2.29-8.48 5.98-10.7l37.7-22.4c1.81-1.07 3.87-1.64 5.96-1.64s4.15.57 5.96 1.64l37.7 22.4c3.11 1.85 5.21 5.04 5.8 8.63-1.27-2.67-4.09-3.39-7.38-1.47z" fill="#293138"/><path d="m99.1 90.7-9.4 5.62c-.25.15-.43.31-.43.61v2.46c0 .3.2.43.45.28l9.54-5.8c.25-.15.29-.42.29-.72v-2.17c0-.3-.2-.42-.45-.28z" fill="#4FA847"/><path d="m61.2 121c-.743-.195-1.72-.542-2.17-.772-1.51-.77-38.4-22.7-39.6-23.5-1.59-1.12-2.77-2.52-3.66-4.32-1.51-3.06-1.41-1.04-1.41-28 0-27.1-.108-25 1.44-28.1 1.08-2.2 2.74-3.82 5.74-5.6 13.8-8.2 36.8-21.8 37.4-22.1 1.21-.614 3.5-1.15 4.94-1.15 1.43 0 3.73.532 4.94 1.15.45.227 9.57 5.6 20.3 11.9 18.3 10.8 19.5 11.6 20.8 12.9 1.01 1.01 1.54 1.75 2.12 2.94.425.871.829 1.84.897 2.15l.125.566-.545-.498c-.3-.274-.817-.635-1.15-.802-.828-.418-2.83-.398-3.98.0404-1.03.392-38.5 23.4-40.1 24.7-2.29 1.75-3.81 3.86-4.42 6.13-.413 1.55-.406 48.2.0071 49.6.335 1.13 1.25 2.45 1.9 2.75.256.117.466.284.466.371 0 .288-2.71.144-4.09-.216z" fill="#fff" stroke-width=".189"/><path d="m77 104c-.063-.164-.115-.971-.115-1.79 0-.822-.0212-1.49-.0472-1.49-.026.001-.464.129-.974.283-1.13.344-2.76.365-3.2.0415-.31-.227-.306-.331.065-1.92.216-.926.485-1.79.597-1.93.145-.175.491-.213 1.19-.131 1.15.135 2.78-.272 3.88-.966 1.87-1.18 2.87-3.56 2.25-5.34-.329-.944-.941-1.2-3.23-1.37-3.79-.28-4.87-1.33-4.87-4.73 0-2.73 1.52-6.11 3.58-7.97l.751-.679.108-3.87 1.2-.836c1.46-1.02 1.53-.953 1.54 1.34.0016.909.0241 1.65.0501 1.65.026-.0011.464-.129.974-.283 1.05-.317 2.15-.361 2.56-.101.238.151.217.419-.159 1.98-.239.993-.533 1.87-.653 1.94-.12.0768-.728.148-1.35.159-2.03.0347-3.89 1.12-4.7 2.75-.768 1.54-.599 3.08.388 3.53.253.115 1.39.291 2.52.39 2.32.204 3.29.579 4.02 1.56.667.893.934 1.9.933 3.53-.0018 2.83-1.2 5.72-3.35 8.08l-1.23 1.34v1.78c0 1.98.0088 1.97-1.53 2.85-1.02.585-1.04.589-1.19.2z" fill="#fff" stroke-width=".189"/>
        </svg>
    },
]


function SkillsBar () {
    const {ref:myRef, inView} = useInView({triggerOnce:true});

    // create a function to map through the skillList array and return a div for each skill
    const FirstFiveSkills = skillList.map((skill, index) => {

        if(index>4) return null;

        // set css property width and animation delay to the percent value of each skill
        const skillStyle = {
            width: skill.percent,
            animationDelay: `${index*0.1}s`
        }
        return (
            <motion.div className="row"
                initial={{opacity: 0, y: 50}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, delay: index*0.2}}
            >
                <div className="skill-icon">
                    {skill.icon}
                </div>
                <div key={index} className="skill-box">
                    <span className="title">
                        {skill.lang}
                    </span>
                    <div className="skill-bar">
                        <span className={inView?"skillInView":"skill"} style={skillStyle}>
                            <span className="tooltip">{skill.percent}</span>
                        </span>
                    </div>
                </div>
            </motion.div>
        )
    })

    
    const [showRest, setShowRest] = useState(false);

    const RestSkills = skillList.map((skill, index) => {

        

        if(index<5) return null;

        // set css property width and animation delay to the percent value of each skill
        const skillStyle = {
            width: skill.percent,
            animationDelay: `${index*0.1}s`
        }
        return (
            <View>
                <motion.div className="row"
                    initial={showRest ? {height: 0, visibility:"none", opacity: 0} : {height: "auto", visibility:"visible", opacity: 1}}
                    animate={showRest ? {height: "auto", visibility:"visible", opacity: 1} : {height: 0, visibility:"none", opacity: 0}}
                    transition={showRest ? {duration: 0.5, delay: (index-5)*0.4} : {duration: 0.5, delay: (index-skillList.length)*-0.2}}
                >
                    <div className="skill-icon">
                        {skill.icon}
                    </div>
                    <div key={index} className="skill-box">
                        <span className="title">
                            {skill.lang}
                        </span>
                        <div className="skill-bar">
                            <span className={inView?"skillInView":"skill"} style={skillStyle}>
                                <span className="tooltip">{skill.percent}</span>
                            </span>
                        </div>
                    </div>
                </motion.div>
            </View>
            
        )
    })


    return (
        
       <div ref={myRef} className={"container"}>
            {/* display FirstFiveSkills when inView is true */}
            {inView && FirstFiveSkills}
            {/* display RestSkills if showRest is true */}
            <motion.div className="restSkills"
                initial={showRest ? {height: "650px", } : {height: 0}}
                animate={showRest ? {height: "650px", } : {height: 0}}
                transition={showRest ? {duration: 0.5, delay: 0.5} : {duration: 0.5, delay: 0.5}}
            >
                {RestSkills}
            </motion.div>
            {/* create a button to display RestSkills */}
            <button className="showRest" 
                onClick={() => {
                    setShowRest(!showRest);
                }}
            >
                {showRest ? <ShowLessIcon/> : <ShowMoreIcon/>}
                {showRest ? "Show Less" : "Show More"}
            </button>
        </div>
   )
}

export default SkillsBar;