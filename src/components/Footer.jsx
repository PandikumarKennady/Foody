import { React, useEffect, useState } from 'react';
import { getResponse } from '../helper/index';
import '../styles/Footer.css'

export default function Footer() {

    const [footer, setFooter] = useState({});

    async function getFooterInfo() {
        await getResponse('foody_footer').then(res => {
            setFooter(res);
        }).catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        getFooterInfo();
    }, [])

    return (<footer>
        <h1>{footer?.title}</h1>
        <br />
        <section>
            {footer.fooder_classes?.map((item, index)=>{
                if(item.class !== undefined){
                    return (
                    <aside key={index}>
                        <h3>{item?.class?.class_title}</h3>
                        <ul>
                            {item?.class?.links.map((instance, index) =>{
                                return(
                                    <li key={index}><a href={instance?.href}>{instance?.title}</a></li>
                                )
                            })}
                        </ul>
                    </aside>
                    )
                }else{
                    return(
                    <aside key={index}>
                        <h3>Social Links</h3>
                        <ul className="social">
                            {
                                item?.social?.app.map((app, idx)=>{
                                    return(
                                    <li key={idx}>
                                      <a href={app?.app_profile_url?.href}> 
                                        <img src={app?.icon?.url} alt={app?.app_profile_url?.title} />
                                    </a> 
                                    </li>
                                    )
                                })
                            }
                        </ul>
                    </aside>);
                }

            })}
        </section>
        <hr />
        <p>{footer?.copyright_information}</p>

    </footer>);
}