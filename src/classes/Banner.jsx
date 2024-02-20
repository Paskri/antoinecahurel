class Banner {
  constructor(album, array) {
    this.album = album
    this.projectBanners = []
    this.bannersArray = array
  }

  updateBannersWithAlbum() {
    this.projectBanners = Object.values(
      Object.entries(this.album.acf_data)
        .filter(
          ([key, value]) => key.startsWith('project_banner_') && value !== false
        )
        .reduce((result, [key, value]) => {
          result[key] = value

          return result
        }, {})
    )
    this.update()
  }

  updateBannersWithArray() {
    // getting srcs and push them in a array
    let newArray = []
    this.bannersArray.forEach((img, index) => {
      newArray[index] = img.getAttribute('src')
    })
    this.projectBanners = newArray
    this.update()
  }

  update() {
    // Removing previous banners
    const bannerWrapper = document.querySelector('.banners-wrapper')
    const bannerContainers = bannerWrapper.querySelectorAll('.img-container')

    bannerContainers.forEach((container, index) => {
      container.classList.remove('display')
      const banner = container.querySelector('.banner')
      banner.classList.remove('banner-show')

      setTimeout(() => {
        // Check if container is still a child of bannerWrapper
        if (container && container.parentNode === bannerWrapper) {
          banner.classList.remove('banner-display')
          setTimeout(() => {
            // Double check if container is still in bannerWrapper
            if (bannerWrapper.contains(container)) {
              bannerWrapper.removeChild(container)
              console.log('Container removed successfully.')
            } else {
              console.log('Container not found in bannerWrapper.')
            }
          }, 200)
        } else {
          console.log('Container not a child of bannerWrapper.')
        }
      }, 3000)
    })

    // Adding new banners
    this.projectBanners.reverse().forEach((banner, index) => {
      const imageElement = document.createElement('div')
      imageElement.classList.add('img-container')
      imageElement.classList.add(`index-${index}`)
      imageElement.innerHTML = `<img src="${banner}" alt="image-banner_${index}" priority width="2560" height="459" decoding="async" data-nimg="1" class="banner${
        index === this.projectBanners.length - 1 ? ' banner-display' : ''
      }" style="color: transparent;">`
      imageElement.classList.add('img-container')

      // Check if bannerWrapper is still available before appending
      if (bannerWrapper) {
        bannerWrapper.prepend(imageElement)

        if (index === this.projectBanners.length - 1) {
          imageElement.classList.add('display')
          setTimeout(() => {
            imageElement.querySelector('img').classList.add('banner-show')
          }, 200)
        }
      } else {
        console.log('Banner wrapper not found.')
      }
    })
  }
}

module.exports = Banner
