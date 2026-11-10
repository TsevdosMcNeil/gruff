import React from 'react';
import HeaderLogo from '../../HeaderLogo';
import ViewIcons from './ViewIcons';

export default function SingleProjectList({clkClass,projectList,handleClick}){
    return (
        <div className="fullW">
            <div className={`screenfluid-left`} style={{color: projectList.list_view_color}}>
                <HeaderLogo whiteLogo={true} />
                <div className="projectInfo fullW">
                    <h6 className="title">{projectList.post_title}</h6>
                    <p className="titlelg"  dangerouslySetInnerHTML={{__html:projectList.sub_heading}} />
                    {handleClick &&
                        <a className="btn-rightarrow" onClick={handleClick} href="javascript:void(0)" data-url={`${process.env.PUBLIC_URL}/project/${projectList.post_name}`} >View Project</a>
                    }
                </div>
            </div>
            {/* <div className="screenfluid-right">
                <ViewIcons/>
                <img src={projectList.imgpath} title={projectList.projectName} alt={projectList.projectName}/>
            </div> */}
        </div>
    )
}