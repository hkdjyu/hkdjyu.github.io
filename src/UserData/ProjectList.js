import MyWeb from "../Assets/Project/MyWeb.png";
import Proj1Img from "../Assets/UnityImage.jpg";
import Proj2Img from "../Assets/UnrealImage.jpg";

export const ProjectList = [
    {
        name: "Portfolio Website",
        date: "2023 - present",
        image: MyWeb,
        description: "My portfolio website that is created using React",
        hasDetails: true,
        link: "https://github.com/hkdjyu/hkdjyu.github.io",
        details: "This is my current working portfolio website. My skills, experience and everything about me is listed here. I am currently working on this website to make it more interactive and more user-frendly. The website is responsive and can be viewed on any device. The website is still under development and will be updated regularly. In the future more features could be added",
    },
    {
        name: "Portfolio Website2",
        date: "2021",
        image: Proj2Img,
        description: "a unreal game that is created for testing",
        hasDetails: false,
    },
    {
        name: "Test Project",
        date: "2021",
        image: Proj2Img,
        description: "a unreal game that is playable",
        hasDetails: true,
        link: "https://www.google.com",
        details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis in tristique urna. Quisque posuere, lectus eu suscipit dictum, tellus nisl rhoncus eros, vel elementum enim massa at ligula. Curabitur pharetra mattis metus at ultricies. Praesent ultricies tortor turpis, vitae blandit sem faucibus id. Duis sollicitudin tellus a libero convallis luctus. Aliquam eu nibh ultrices, rutrum nisi non, ultricies mauris. Pellentesque auctor at lacus a fermentum. Duis mattis justo id sagittis pharetra. Vivamus malesuada vitae nibh porta fermentum. In dictum augue sit amet condimentum pharetra. Integer id porta sapien. Curabitur lobortis aliquam enim quis cursus. Donec porta turpis quis felis lobortis, sed vehicula lorem commodo. Sed sit amet pulvinar felis. ",
        markdown: '/Markdown/MyWeb.md',
        photos: [Proj2Img, Proj1Img, Proj1Img, Proj1Img, Proj2Img],

    }

]
