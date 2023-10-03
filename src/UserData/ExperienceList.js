import SchoolIcon from '@material-ui/icons/School';
import GamesIcon from '@material-ui/icons/Games';
import ComputerIcon from '@material-ui/icons/Computer';
import BookIcon from '@material-ui/icons/MenuBook';
import BuildIcon from '@material-ui/icons/Build';

export const ExperienceList = [
    {
        nature: "internship",
        icon: <BuildIcon />,
        orgName: "Bright Minds Academy",
        orgLink: "https://www.brightminds-edu.com/",
        position: "Technical Assistant",
        date: "Jul 2023 - Aug 2023",
        descriptions: ["- developed a web application for the company using WordPress",
                       "- designed and proposed an managemet system using React",
                       "- provided techncal support to staff and teachers",
                       "- assisted in AI-learning tools development and STEM course design",]
    },
    {
        nature: "internship",
        icon: <GamesIcon />,
        orgName: "Ampersand Limited (Virtrix)",
        orgLink: "https://www.virtrix.io/",
        date: "Jun 2022 - Aug 2022",
        position: "Game Developer Intern",
        descriptions: ["- developed AR mobile game using Unity and Vuforia",
                       "- developed 3D escape game using Decentraland SDK",]
    },
    {
        nature: "education",
        icon: <BookIcon />,
        orgName: "ME Education",
        orgLink: "https://www.meeducationhk.com/",
        date: "Apr 2022 - present",
        position: "Part-time Tutor",
        descriptions: ["- providing one-to-one tutoring for international school students",
                       "- teaching IGCSE Computer Science (0478)",]
    },
    {   nature: "internship",
        icon: <ComputerIcon />,
        orgName: "Salon Media Lab Limited",
        orgLink: "https://www.salonmedialab.com/",
        date: "Jun 2021 - Aug 2021",
        position: "Project Executive (Internship)",
        descriptions: ["- taught STEM courses about AI to high school students",
                       "- designed Projection Mapping courses using Lightform",
                       "- designed robotic courses using Dobot Magician Lite",]
    },
    {
        nature: "education",
        icon: <SchoolIcon />,
        orgName: "The Chinese University of Hong Kong",
        orgLink: "https://www.cuhk.edu.hk/",
        date: "Sep 2020 - Jul 2024",
        position: "Bachelor of Science in Computer Science",
        descriptions: ["- major in computer science (Rich Media Stream)",
                       "- minor in German",]
    },
        
]