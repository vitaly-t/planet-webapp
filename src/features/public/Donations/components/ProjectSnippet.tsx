import React, { ReactElement } from 'react'
import styles from './../styles/Projects.module.scss'
import { getImageUrl } from '../../../../utils/getImageURL'
import Sugar from 'sugar'
import Link from 'next/link'

interface Props {
    project:any
}

export default function ProjectSnippet({project}: Props): ReactElement {
    const ImageSource = project.properties.image ? getImageUrl('project', 'large',project.properties.image) : '';
    const progressPercentage = (project.properties.countPlanted / project.properties.countTarget)*100+'%';

    const loadProject = ()=>{

    }
    return (
        <div className={styles.singleProject}>
            <Link prefetch={false} href="/donate/[id]" as={`/donate/${project.properties.id}`}>
                <a>
                    <div className={styles.projectImage}>
                        {project.properties.image ?
                            <div className={styles.projectImageFile} style={{backgroundImage:`linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.2), rgba(0,0,0,0), rgba(0,0,0,0)),url(${ImageSource})`}}></div>
                        : null }
                        {project.properties.classification ? 
                            <div className={styles.projectType}>
                                {project.properties.classification}
                            </div>:null
                        }
                        
                        <div className={styles.projectName}>
                        {Sugar.String.truncate(project.properties.name,34)}
                        </div>
                    </div>
                </a>
            </Link>
                    
                    <div className={styles.progressBar}>
                        <div className={styles.progressBarHighlight} style={{width:progressPercentage}} />
                    </div>
                    <div className={styles.projectInfo}>
                        <div className={styles.projectData}>
                            <div className={styles.targetLocation}>
                                <div className={styles.target}>
                                    
                                    {project.properties.countPlanted} planted •
                                </div>
                                <div className={styles.location}>
                                {project.properties.location}
                                </div>   
                            </div>
                            <div className={styles.projectTPOName}>
                                By {project.properties.tpoName}
                            </div>
                        </div>
                        <div className={styles.projectCost}>
                            {project.properties.treeCost ? (
                                <>
                                    <div className={styles.costButton}>
                                            {project.properties.currency === 'USD' ? '$' : project.properties.currency === 'EUR' ? '€' : project.properties.currency} {project.properties.treeCost.toFixed(2)}
                                    </div>
                                    <div className={styles.perTree}>
                                        per tree
                                    </div>
                                </>
                            ) : null}
                        </div>
                    </div>
                </div>
    )
}
