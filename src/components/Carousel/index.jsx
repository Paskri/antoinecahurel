'use client'
import './carousel.css'
import CarouselImg from '../CarouselImg'
import { useEffect, useState, useRef } from 'react'

export default function Carousel({ collection, audioState }) {
  const [carIndex, setCarIndex] = useState(0)
  const [step, setStep] = useState(4)
  const [yearsForImages, setYearsForImages] = useState([])
  const [stepWidth, setStepWidth] = useState(0)
  const [activeImgs, setActiveImgs] = useState([])

  // window fadein
  const carouselContainer = useRef(null)
  useEffect(() => {
    setTimeout(() => {
      if (carouselContainer.current) {
        const container = carouselContainer.current
        container.style = 'display: flex; transition: opacity 2s;'
        setTimeout(() => {
          container.style = 'display: flex; transition: opacity 2s; opacity: 1;'
        }, 1000)
      }
    }, 500)
  }, [carouselContainer])

  //hidding unactive images for keyboard navigation
  useEffect(() => {
    // indexes of active images
    let visibleImg = []
    for (let i = 0; i < step; i++) {
      visibleImg.push(carIndex + i)
    }
    setActiveImgs(visibleImg)
  }, [carIndex, step])

  //calculating initial index width window-size
  //run only one time
  useEffect(() => {
    const windowWidth = window.innerWidth
    let initialIndex = 0
    if (windowWidth < 610) {
      setStep(1)
      setStepWidth(230)
    } else if (windowWidth >= 610 && windowWidth < 1000) {
      setStep(1)
      setStepWidth(390)
    } else if (windowWidth >= 1000 && windowWidth < 1390) {
      setStep(2)
      setStepWidth(390)
    } else if (windowWidth >= 1390 && windowWidth < 1780) {
      setStep(3)
      setStepWidth(390)
    } else if (windowWidth >= 1780) {
      setStep(4)
      setStepWidth(390)
    }
    setCarIndex(0)
  }, [collection.length])

  useEffect(() => {
    const projectsContainer = document.querySelector('.projects-container')
    const prev = document.querySelector('.carousel-prev')
    const next = document.querySelector('.carousel-next')

    //Window resizing
    function handleResize(prev, next) {
      const windowWidth = window.innerWidth
      if (windowWidth < 610) {
        if (carIndex > collection.length - 1) {
          setCarIndex(collection.length - 1)
        }
        setStep(1)
        setStepWidth(230)
      } else if (windowWidth >= 610 && windowWidth < 1000) {
        setStep(1)
        setStepWidth(390)
        if (carIndex > collection.length - 1) {
          setCarIndex(collection.length - 1)
        }
      } else if (windowWidth >= 1000 && windowWidth < 1390) {
        setStep(2)
        setStepWidth(390)
        if (carIndex > collection.length - 2) {
          setCarIndex(collection.length - 2)
        }
      } else if (windowWidth >= 1390 && windowWidth < 1780) {
        setStep(3)
        setStepWidth(390)
        if (carIndex > collection.length - 3) {
          setCarIndex(collection.length - 3)
        }
      } else if (windowWidth >= 1780) {
        setStep(4)
        setStepWidth(390)
        if (carIndex > collection.length - 4) {
          setCarIndex(collection.length - 4)
        }
      }
      //handleControls(prev, next)
    }
    window.addEventListener('resize', () => {
      const resizeTimer = setTimeout(handleResize(prev, next), 1000)
      clearTimeout(resizeTimer)
    })

    //hides controls if necessary --> unactivated ...
    //functionnality removed but keeped in place if Antoine's changes is mind
    function handleControls(prev, next) {
      if (carIndex === collection.length - step) {
        next.style.display = 'none'
      } else {
        next.style.display = 'flex'
      }
      if (carIndex === 0) {
        prev.style.display = 'none'
      } else {
        prev.style.display = 'flex'
      }
    }

    handleResize(prev, next)
    projectsContainer.style.left = `-${carIndex * stepWidth}px`
  }, [carIndex, collection.length, step, stepWidth])

  useEffect(() => {
    setYearsForImages(
      collection.map((album) => new Date(album.date).getFullYear())
    )
  }, [collection])

  const handleCarouselClick = (e, value) => {
    e.preventDefault()
    const projectsContainer = document.querySelector('.projects-container')
    projectsContainer.style.transition = `1s`

    let nextIndex = 0

    if (value < 0) {
      nextIndex = carIndex + value < 0 ? 0 : carIndex + value
    } else if (value > 0) {
      nextIndex =
        carIndex + value > collection.length - step
          ? collection.length - step
          : carIndex + value
    }
    projectsContainer.style.left = `-${nextIndex * 390}px`
    setCarIndex(nextIndex)
  }

  return (
    <>
      <div
        className="carousel-container"
        ref={carouselContainer}
        aria-roledescription="carousel"
        aria-label="Project Carousel"
      >
        <a
          href="#"
          className="carousel-prev"
          aria-controls="projects-carousel"
          aria-label="Previous projects"
          onClick={(e) => handleCarouselClick(e, step * -1)}
        >
          <span className="carousel-controls">&lsaquo;</span>
        </a>
        <div id="projects-carousel" className="projects-container">
          {collection ? (
            collection.map((album, index) => {
              const currentYear = new Date(album.date).getFullYear()
              // Checking array for matching year and previous year
              // Indexes created width the same collection
              const yearMarker =
                yearsForImages.length > 0 &&
                (index === 0 ||
                  (index > 0 && currentYear !== yearsForImages[index - 1])) ? (
                  <>
                    <div className="angle"></div>
                    <div key={`year-marker-${index}`} className="year-marker">
                      {currentYear}
                    </div>
                  </>
                ) : (
                  ''
                )
              return (
                <div
                  href="#"
                  className={`project-card project-card-${index}`}
                  data-albumid={album.id}
                  data-album-date={album.date}
                  data-album-year={album.date}
                  key={`album-${index}`}
                  data-img-url={album.img_url}
                  role="group"
                  aria-roledescription="project"
                  aria-label={`${index + 1} of ${collection.length}`}
                >
                  {yearMarker}
                  <CarouselImg
                    album={album}
                    featured={album.featured_media}
                    albumIndex={index}
                    active={activeImgs.indexOf(index) >= 0 ? true : false}
                  />
                </div>
              )
            })
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <a
          href="#"
          className="carousel-next"
          aria-controls="projects-container"
          aria-label="Next projects"
          onClick={(e) => handleCarouselClick(e, step)}
        >
          <span className="carousel-controls">&rsaquo;</span>
        </a>
      </div>
      <div className="projects-portal"></div>
    </>
  )
}
