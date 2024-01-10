'use client'
import './project.css'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import SongList from '../../components/SongList'
import Video from '../../components/Video'
import useSWR from 'swr'
const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function Project({ album, albumIndex, featured }) {
  const [videoWidth, setVideoWidth] = useState(null)
  const [videoHeight, setVideoHeight] = useState(null)
  const musicContainer = useRef(null)

  // handling screen resizing
  useEffect(() => {
    const videoContainer = document.querySelector('.videos-container')
    const prev = document.querySelector('.video-prev')
    const next = document.querySelector('.video-next')

    function handleResize() {
      const windowWidth = window.innerWidth
      let newVideoWidth, newVideoHeight, newMargin, newStep

      if (windowWidth < 485) {
        newVideoWidth = 256
        newVideoHeight = 144
        newMargin = 10
        newStep = 266
      } else if (windowWidth >= 485 && windowWidth < 860) {
        newVideoWidth = 420
        newVideoHeight = 236
        newMargin = 10
        newStep = 430
      } else if (windowWidth >= 860) {
        newVideoWidth = 768
        newVideoHeight = 432
        newMargin = 20
        newStep = 788
      }

      setVideoWidth(newVideoWidth)
      setVideoHeight(newVideoHeight)
    }
    let resizeTimer
    function handleResizeThrottled() {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        handleResize()
      }, 100)
    }
    // Initial setup
    handleResizeThrottled()

    window.addEventListener('resize', handleResizeThrottled)
    return () => {
      window.removeEventListener('resize', handleResizeThrottled)
    }
  }, [])

  const [video, setVideo] = useState(null)
  const [musicFields, setMusicFields] = useState(null)
  useEffect(() => {
    if (album) {
      const videoDatas = {
        code: album.acf_data.video_code,
        poster: album.acf_data.video_poster,
      }
      setVideo(videoDatas)

      const musicDatas = Object.entries(album.acf_data)
        .filter(([key, value]) => key.startsWith('titre_') && value !== false)
        .reduce((result, [key, value]) => {
          result[key] = value
          return result
        }, {})
      setMusicFields(musicDatas)
    }
  }, [album])

  // album date Handling
  // decoding html entities
  const [albumTitle, setAlbumTitle] = useState('')
  useEffect(() => {
    if (album) {
      function decodeEntities(encodedString) {
        const textArea = document.createElement('textarea')
        textArea.innerHTML = encodedString
        return textArea.value
      }
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
  if (!data) return <></>
  return (
    <>
      <div
        id={`Project-${albumIndex}`}
        className="project-container"
        ref={musicContainer}
      >
        <div className="left-container">
          <div className="project-music-container">
            <div className="project-img-container">
              {data && data.source_url ? (
                <Image
                  className="project-img"
                  src={data.source_url}
                  alt={album.title.rendered}
                  width={270}
                  height={270}
                />
              ) : (
                ''
              )}
            </div>
            <SongList
              musicFields={musicFields}
              background={album ? album.acf_data.player_background : ''}
            />
          </div>
          <div className="right-content-2">
            <div className="project-datas">
              <p>
                <span className="pdata-align-right">Platform:</span>
                <span
                  className="pdata-align-left"
                  dangerouslySetInnerHTML={{
                    __html: album ? album.acf_data.platform : '',
                  }}
                />
              </p>
              <p>
                <span className="pdata-align-right">Genre:</span>
                <span
                  className="pdata-align-left"
                  dangerouslySetInnerHTML={{
                    __html: album ? album.acf_data.genre : '',
                  }}
                />
              </p>
              <p>
                <span className="pdata-align-right">Released:</span>
                <span
                  className="pdata-align-left"
                  dangerouslySetInnerHTML={{
                    __html: album ? album.acf_data.released : '',
                  }}
                />
              </p>
            </div>
            <div className="project-datas-download">
              {album && album.acf_data.game_download ? (
                <div className="dl-bloc">
                  <p>Game Download :</p>
                  <a href={album.acf_data.game_download_link} target="_blank">
                    <Image
                      className="company-logo"
                      src={album.acf_data.game_download}
                      width={140}
                      height={40}
                      alt={`Download on steam 1`}
                    />
                  </a>
                </div>
              ) : (
                ''
              )}
              {album && album.acf_data.game_download ? (
                <div className="dl-bloc">
                  <p>OST Download :</p>
                  <a href={album.acf_data.ost_download_link} target="_blank">
                    <Image
                      className="company-logo"
                      src={album.acf_data.ost_download}
                      width={140}
                      height={40}
                      alt={`Download on steam 1`}
                    />
                  </a>
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>

        <div className="center-wrapper">
          <div className="center-container">
            {' '}
            <div className="top-wrapper">
              {album &&
              album.acf_data.company_logo &&
              album.acf_data.company ? (
                <Image
                  className="company-logo"
                  src={album.acf_data.company_logo}
                  width={62}
                  height={62}
                  alt={`${album.acf_data.company} - logo`}
                />
              ) : (
                ''
              )}
              <div className="top-right">
                <h2
                  className="project-title"
                  dangerouslySetInnerHTML={{ __html: albumTitle }}
                />
                {album ? (
                  <p
                    className="company"
                    dangerouslySetInnerHTML={{
                      __html: album.acf_data.company,
                    }}
                  />
                ) : (
                  ''
                )}
              </div>
            </div>
            {album && video ? (
              <Video
                video={video}
                index={0}
                active={0}
                videoWidth={videoWidth}
                videoHeight={videoHeight}
                from={album.slug}
                albumIndex={albumIndex}
                ariaActive={true}
                projectVideo={true}
              />
            ) : (
              ''
            )}
          </div>
        </div>
        <div className="right-content">
          <div className="project-datas">
            {album ? (
              <p>
                <span className="pdata-align-right">Platform:</span>
                <span
                  className="pdata-align-left"
                  dangerouslySetInnerHTML={{
                    __html: album.acf_data.platform,
                  }}
                />
              </p>
            ) : (
              ''
            )}
            {album ? (
              <p>
                <span className="pdata-align-right">Genre:</span>
                <span
                  className="pdata-align-left"
                  dangerouslySetInnerHTML={{ __html: album.acf_data.genre }}
                />
              </p>
            ) : (
              ['']
            )}
            {album ? (
              <p>
                <span className="pdata-align-right">Released:</span>
                <span
                  className="pdata-align-left"
                  dangerouslySetInnerHTML={{
                    __html: album.acf_data.released,
                  }}
                />
              </p>
            ) : (
              ''
            )}
          </div>
          <div className="project-datas-download">
            {album &&
            album.acf_data.game_download_link &&
            album.acf_data.game_download ? (
              <div className="dl-bloc">
                <p>Game Download :</p>
                <a href={album.acf_data.game_download_link} target="_blank">
                  <Image
                    className="company-logo"
                    src={album.acf_data.game_download}
                    width={140}
                    height={40}
                    alt={`Download on steam 1`}
                  />
                </a>
              </div>
            ) : (
              ''
            )}
            {album &&
            album.acf_data.ost_download_link &&
            album.acf_data.ost_download ? (
              <div className="dl-bloc">
                <p>OST Download :</p>
                <a href={album.acf_data.ost_download_link} target="_blank">
                  <Image
                    className="company-logo"
                    src={album.acf_data.ost_download}
                    width={140}
                    height={40}
                    alt={`Download on steam 1`}
                  />
                </a>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </>
  )
}
