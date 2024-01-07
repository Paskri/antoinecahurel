'use client'
import Image from 'next/image'
import './about.css'
import useSWR from 'swr'
import { useEffect, useState, useRef } from 'react'
import Banner from '../../classes/Banner'
import Loader from '../../components/Loader'
const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function About() {
  const [currentComponent, setCurrentComponent] = useState(null)

  const titleArray = [
    'Home',
    'About',
    'Music',
    'SoundDesign',
    'TechReel',
    'Contact',
  ]

  // window fadein
  const aboutContainer = useRef(null)
  useEffect(() => {
    setTimeout(() => {
      if (aboutContainer.current) {
        const container = aboutContainer.current

        container.style = 'transition: opacity 2s;'
        setTimeout(() => {
          container.style = 'transition: opacity 2s; opacity: 1;'
        }, 1000)
      }
    }, 500)
  }, [aboutContainer])

  // fetching datas
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const { data, error } = useSWR(`${apiUrl}/wp-json/wp/v2/posts/1`, fetcher)
  //if (error) return <div>Failed to load</div>
  if (!data) return <></>

  //handling span links clics
  const handleClick = async (e) => {
    //hidding potential contents
    titleArray.forEach((t) => {
      const titleDiv = document.querySelector(`#${t}`)
      if (titleDiv) {
        titleDiv.style.display = 'none'
      }
    })
    //opening title page
    const page = document.querySelector(`#${e.target.dataset.title}`)
    if (page) {
      const carousel = page.querySelector('.carousel-container')
      if (carousel) {
        //console.log(carousel)
        carousel.style = 'display: flex; opacity: 1'
      }
      page.style = 'display: flex; transition: opacity 2s;'
      setTimeout(() => {
        page.style = 'display: flex; transition: opacity 2s; opacity: 1;'
      }, 200)
    }
  }

  return (
    <div id="About" className="about-container" ref={aboutContainer}>
      <div className="about-left">
        <AboutTitle title={data.title.rendered} />
        <div className="about-separator"></div>
        <div className="about-content">
          <div className="about-portrait-container">
            {data.acf_data.portrait ? (
              <Image
                className="about-portrait"
                src={data.acf_data.portrait}
                width={266}
                height={266}
                alt="Antoine Cahurel - Portrait"
              />
            ) : (
              ''
            )}
          </div>
          <div className="about-text">
            <p>
              I am a multi-instrumentalist musician, composer, producer and
              sound designer originally from Paris, France. I’m all about
              creating immersive audio experiences to help bring worlds to life.
              I work on video games, websites, YouTube or any other type of
              linear or interactive media.
            </p>
            <p>
              Benefiting from an experience as a full-time professional musician
              in various contexts, I not only developed the skill to compose
              <span
                className="white-link"
                data-title="Music"
                onClick={handleClick}
              >
                {' '}
                music
              </span>
              , but also the ability to manage the whole production process, in
              a wide range of styles such as Cinematic Orchestral, Rock, Jazz,
              Retro, Electro, Folk, Classically-influenced, Oriental-influenced,
              etc.
            </p>
            <p>
              I also have certified skills in{' '}
              <span
                className="white-link"
                data-title="SoundDesign"
                onClick={handleClick}
              >
                sound design
              </span>
              , which allows me to meet all the needs of most audio projects
              targeted by the industry.
            </p>
            <p>
              On this website you can find some examples of my work for{' '}
              <span
                className="white-link"
                data-title="Home"
                onClick={handleClick}
              >
                projects
              </span>{' '}
              where I put my skills at the service of the art direction given to
              me. But whatever the context, I will always aspire to achieve the
              most original, engaging and innovative audio experience I can.
            </p>
            <p>
              To discover other facets of my musical universe, you might also be
              interested in joining my{' '}
              <a
                className="white-link"
                href={data.acf_data.youtube_link}
                target="_blank"
              >
                YouTube
              </a>{' '}
              channel.
            </p>
            <p>
              To discuss a new project or commission work, feel free to{' '}
              <span
                className="white-link"
                data-title="Contact"
                onClick={handleClick}
              >
                contact me
              </span>
              .
            </p>
          </div>
        </div>
        <div className="about-separator"></div>
      </div>
      <div className="about-right">
        <AboutImage src={data.acf_data.image_1} alt={`about - image 1`} />
        <AboutImage src={data.acf_data.image_2} alt={`about - image 2`} />
        <AboutImage src={data.acf_data.image_3} alt={`about - image 3`} />
      </div>
    </div>
  )
}

const AboutTitle = ({ title }) => {
  return <h2 dangerouslySetInnerHTML={{ __html: title }} />
}

const AboutImage = ({ src, alt }) => {
  return (
    <>
      <div className="about-img-container">
        {src ? (
          <Image
            className="about-img"
            src={src}
            width={350}
            height={215}
            alt={alt}
          />
        ) : (
          ''
        )}
      </div>
    </>
  )
}
