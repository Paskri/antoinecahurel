'use client'
import './collection.css'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import SongListCollection from '../../components/SongListCollection'
import Handle from '../../components/Handle'
import Video from '../../components/Video'
import useSWR from 'swr'
const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function Collection({ album, albumIndex, featured }) {
  const musicContainer = useRef(null)

  // preparing special object for collection
  const [projects, setProjects] = useState(null)
  const [musicFields, setMusicFields] = useState(null)

  useEffect(() => {
    let ueProjects = {}
    let count = 0
    if (album) {
      for (let i = 1; i < 6; i++) {
        const pTitle = album.acf_data[`collection_album_titre_${i}`]
        const pImg = album.acf_data[`collection_album_img_${i}`]

        const customFields = Object.entries(album.acf_data)
          .filter(
            ([key, value]) => key.startsWith(`ca_${i}_song_`) && value !== false
          )
          .reduce((result, [key, value], j) => {
            const newIndex = `ca_${i}_song_${j + 1}`
            result[newIndex] = { ...value, index: count }
            count++
            return result
          }, {})

        const projet = { title: pTitle, img: pImg, songs: customFields }
        ueProjects[i - 1] = projet
      }
    }
    setProjects(ueProjects)
  }, [album])

  useEffect(() => {
    // preparing custom musicFields for collection
    let ueMusicFields = []
    if (projects) {
      const projectValues = Object.values(projects)

      if (projectValues.length > 0) {
        projectValues.forEach((project) => {
          const { title, songs } = project

          if (title !== '' && project.img) {
            const songsArray = Object.values(songs)
            ueMusicFields = ueMusicFields.concat(songsArray)
          }
        })

        setMusicFields(ueMusicFields)
      }
    }
  }, [projects])

  // album date Handling
  // decoding html entities
  const [albumTitle, setAlbumTitle] = useState('')
  useEffect(() => {
    function decodeEntities(encodedString) {
      const textArea = document.createElement('textarea')
      textArea.innerHTML = encodedString
      return textArea.value
    }
    if (album) {
      const ueYear = new Date(album.date).getFullYear()
      const ueAlbumTitle = `${decodeEntities(
        album.title.rendered
      ).toUpperCase()} <span style="font-size:1.6rem">(${ueYear})</span>`
      setAlbumTitle(ueAlbumTitle)
    }
  }, [album])

  // fetching featured img
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const { data, error } = useSWR(
    `${apiUrl}/wp-json/wp/v2/media/${featured}`,
    fetcher
  )
  //if (error) return <div>Failed to load</div>
  if (!data) return <></>

  return (
    <>
      <div
        id={`Project-${albumIndex}`}
        className="c-project-container"
        ref={musicContainer}
      >
        <div className="c-left-container">
          <div className="c-project-music-container">
            <div className="c-project-img-container">
              {data && data.source_url ? (
                <Image
                  className="c-project-img"
                  src={data.source_url}
                  alt={album ? album.title.rendered : ''}
                  width={268}
                  height={268}
                />
              ) : (
                ''
              )}
            </div>
            <div
              className="c-rendered-content"
              dangerouslySetInnerHTML={{
                __html: album ? album.content.rendered : '',
              }}
            />
          </div>
        </div>

        <div className="c-center-wrapper">
          <div className="c-center-container">
            {' '}
            <div className="c-top-wrapper">
              {album ? (
                <Image
                  className="c-company-logo"
                  src={album ? album.acf_data.company_logo : ''}
                  width={62}
                  height={62}
                  alt={`${album ? album.acf_data.company : ''} - logo`}
                />
              ) : (
                ''
              )}
              <div className="c-top-right">
                <h2
                  className="c-project-title"
                  dangerouslySetInnerHTML={{ __html: albumTitle }}
                />
                {album ? (
                  <p
                    className="c-company"
                    dangerouslySetInnerHTML={{
                      __html: album.acf_data.company,
                    }}
                  />
                ) : (
                  ''
                )}
              </div>
            </div>
            <div className="c-projects-wrapper">
              {projects
                ? Object.values(projects).map((project, index) =>
                    // checking validity
                    project.title &&
                    project.img &&
                    project.songs &&
                    musicFields ? (
                      <div
                        key={project.title}
                        className="c-project-music-container"
                      >
                        <div className="c-project-img-container">
                          <Image
                            className="c-project-img"
                            src={project.img}
                            alt={project.title}
                            width={268}
                            height={268}
                          />
                        </div>
                        <SongListCollection
                          customFields={project.songs}
                          musicFields={musicFields}
                          background={''}
                        />
                      </div>
                    ) : null
                  )
                : ''}
            </div>
          </div>
        </div>
      </div>
      <Handle musicFields={musicFields} albumIndex={albumIndex} />
    </>
  )
}
