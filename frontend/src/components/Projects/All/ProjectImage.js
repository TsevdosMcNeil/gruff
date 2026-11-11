import React from 'react';

export default function ProjectImage({project}){
    return (
        <img src={project.list_image.url} title={project.post_title} alt={project.post_title}/>
    )
}
