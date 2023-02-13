import React from 'react';
import {VerticalTimeline, VerticalTimelineElement} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import {ExperienceList} from "../UserData/ExperienceList";
import "../Styles/Experience.css";
import { Description } from '@material-ui/icons';

function Experience() {
  let experienceList = ExperienceList.map((exp) => (
    <VerticalTimelineElement 
      className={exp.nature}
      date={exp.date}
      dateClassName={"vertical-timeline-element--date"}
      contentStyle={{ 
        background: '#d8cd80', color: '#1c2135'
      }}
      contentArrowStyle={{ borderRight: '10px solid  #d8cd80' }}
      iconStyle={{ background: '#1c2135', color: '#eff' }}
      icon={exp.icon}
    >
      <div className="vertical-timeline-element--organization">
        <a href={exp.orgLink} target="_blank" rel="noopener noreferrer">
        <h3> {exp.orgName}</h3>
      </a>
      </div>
      <div className="vertical-timeline-element--position">
        <h4> {exp.position}</h4>
      </div>
      <div>
        {exp.descriptions.map((description) => {
          return ( <p> {description} </p> );
        })}
      </div>
    </VerticalTimelineElement>
  ));

  return (
      <div>
        <VerticalTimeline lineColor="#8794c0">
          {experienceList}
        </VerticalTimeline>
      </div>
  )
}

/*
function Experience() {
  return (
    <div>
      <VerticalTimeline lineColor="#3e497a">
        <VerticalTimelineElement 
          className="education"
          contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
          contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
          date="Sep 2020 - Jul 2024"
          iconStyle={{ background: '#3e497a', color: '#fff' }}
          icon={<SchoolIcon />}
        >
          <h3 className="title"> The Chinese University of Hong Kong</h3>
          <p> - Bachelor of Science in Computer Science</p>
        </VerticalTimelineElement>
        <VerticalTimelineElement 
          className="work"
          date="Jun 2021 - Aug 2021"
          iconStyle={{ background: '#3e497a', color: '#fff' }}
          icon={<WorkIcon />}
        >
          <h3 className="title"> Salon Media Lab limited</h3>
          <p> - Project Executive (Internship)</p>
        </VerticalTimelineElement>
        <VerticalTimelineElement 
          className="work"
          date="Jun 2022 - Aug 2022"
          iconStyle={{ background: '#3e497a', color: '#fff' }}
          icon={<WorkIcon />}
        >
          <h3 className="title"> Ampersand Limited (Virtrix)</h3>
          <p> - Game Developer Intern</p>
        </VerticalTimelineElement>
      </VerticalTimeline>
    </div>
  );
}
*/

export default Experience;